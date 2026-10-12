// Local browser verification with Node.js and a headless browser on port 9223.
// No test packages are required. Screenshots go to the system temporary folder.
import { writeFile, readFile, mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import assert from 'node:assert/strict'

const tabs = await (await fetch('http://127.0.0.1:9223/json')).json()
const tab = tabs.find(item => item.type === 'page' && item.url.includes('127.0.0.1:5173'))
assert(tab, 'Open the local portfolio in the debugging browser first.')
const socket = new WebSocket(tab.webSocketDebuggerUrl)
await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }))
let nextId = 0
const pending = new Map()
const errors = []
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data)
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text)
  const request = pending.get(message.id)
  if (request) {
    pending.delete(message.id)
    clearTimeout(request.timer)
    if (message.error) request.reject(new Error(message.error.message))
    else request.resolve(message.result)
  }
})
function call(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timed out: ${method}`)) }, 15000)
    pending.set(id, { resolve, reject, timer })
    socket.send(JSON.stringify({ id, method, params }))
  })
}
async function evaluate(expression) {
  const result = await call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
  assert(!result.exceptionDetails, result.exceptionDetails?.text)
  return result.result.value
}
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
async function screenshot(name) {
  const shot = await call('Page.captureScreenshot', { format: 'png' })
  const path = join(tmpdir(), `usha-${name}.png`)
  await writeFile(path, Buffer.from(shot.data, 'base64'))
  return path
}
const reports = []
try {
  await call('Page.enable')
  await call('Runtime.enable')
  await call('Page.navigate', { url: 'http://127.0.0.1:5173/#home' })
  await pause(500)
  await call('Browser.grantPermissions', { origin: 'http://127.0.0.1:5173', permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'] })
  for (const width of [1440, 768, 390]) {
    const height = width === 1440 ? 1000 : width === 768 ? 1024 : 844
    await call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
    for (const theme of ['dark', 'light']) {
      await evaluate(`localStorage.setItem('usha-theme', '${theme}')`)
      await call('Page.reload')
      await pause(800)
      await evaluate("Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 2000))])")
      for (let attempt = 0; attempt < 20; attempt++) {
        if (await evaluate("document.querySelectorAll('a[download]').length === 2")) break
        await pause(250)
      }
      await evaluate("window.scrollTo({top: 0, behavior: 'instant'})")
      await pause(150)
      const layout = await evaluate(`({theme: document.documentElement.dataset.theme, width: innerWidth, scrollWidth: document.documentElement.scrollWidth, cv: [...document.querySelectorAll('a[download]')].map(a => a.getAttribute('href')), heading: document.querySelector('h1').innerText})`)
      assert.equal(layout.theme, theme)
      assert(layout.scrollWidth <= width, `Horizontal overflow at ${width}px, ${theme}`)
      assert.equal(layout.cv.length, 2, 'Both resume actions should be available.')
      assert(layout.cv.every(url => url === '/Usha_SQA_Resume.pdf'))
      const path = await screenshot(`${width}-${theme}`)
      await evaluate("document.getElementById('projects').scrollIntoView({behavior: 'instant'})")
      await pause(450)
      assert.equal(await evaluate("document.querySelector('[aria-current=location]')?.textContent"), 'Projects')
      assert(await evaluate("document.documentElement.scrollWidth <= innerWidth"))
      if (theme === 'dark') await screenshot(`${width}-projects-dark`)
      if (width < 900) {
        await evaluate("document.getElementById('menu-toggle').click()")
        assert.equal(await evaluate("document.getElementById('menu-toggle').getAttribute('aria-expanded')"), 'true')
        assert.equal(await evaluate("getComputedStyle(document.getElementById('mobile-navigation')).display"), 'grid')
        await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' })
        await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' })
        assert.equal(await evaluate("document.getElementById('menu-toggle').getAttribute('aria-expanded')"), 'false')
      } else {
        await evaluate("document.getElementById('more-toggle').click()")
        assert.equal(await evaluate("document.getElementById('more-navigation').hidden"), false)
        await evaluate("document.querySelector('#more-navigation a[href=\"#skills\"]').click()")
        await pause(500)
        assert.equal(await evaluate("document.getElementById('more-navigation').hidden"), true)
      }
      reports.push({ width, theme, overflow: false, cvActions: layout.cv.length, screenshot: path })
    }
  }
  await evaluate("document.querySelector('.header-tools .icon-button').click()")
  const selected = await evaluate('document.documentElement.dataset.theme')
  await call('Page.reload')
  await pause(600)
  assert.equal(await evaluate('document.documentElement.dataset.theme'), selected)
  await evaluate("document.getElementById('contact').scrollIntoView({behavior: 'instant'})")
  await pause(200)
  await evaluate("[...document.querySelectorAll('#contact button')].find(button => button.textContent.includes('Copy Email')).click()")
  await pause(200)
  assert.equal(await evaluate('navigator.clipboard.readText()'), 'ushaislam2022@gmail.com')
  assert.equal(await evaluate("document.querySelector('#contact [role=status]').textContent"), 'Email copied to clipboard.')
  assert.equal(await evaluate("document.querySelector('#contact a[href^=mailto]').getAttribute('href')"), 'mailto:ushaislam2022@gmail.com')
  assert(await evaluate("[...document.querySelectorAll('a[target=_blank]')].every(a => a.rel.includes('noopener') && a.rel.includes('noreferrer'))"))
  const response = await fetch('http://127.0.0.1:5173/Usha_SQA_Resume.pdf')
  const bytes = Buffer.from(await response.arrayBuffer())
  assert.equal(response.headers.get('content-type'), 'application/pdf')
  assert.equal(bytes.subarray(0, 5).toString(), '%PDF-')
  assert.deepEqual(bytes, await readFile(new URL('../public/Usha_SQA_Resume.pdf', import.meta.url)))
  const downloadPath = await mkdtemp(join(tmpdir(), 'usha-cv-download-'))
  await call('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath })
  const downloadButton = await evaluate("(() => { const a = document.querySelector('#contact a[download]'); a.scrollIntoView({behavior:'instant',block:'center'}); const rect = a.getBoundingClientRect(); return {x:rect.x+rect.width/2,y:rect.y+rect.height/2} })()")
  await call('Input.dispatchMouseEvent', { type: 'mousePressed', ...downloadButton, button: 'left', clickCount: 1 })
  await call('Input.dispatchMouseEvent', { type: 'mouseReleased', ...downloadButton, button: 'left', clickCount: 1 })
  let downloaded
  for (let attempt = 0; attempt < 40; attempt++) {
    try { downloaded = await readFile(join(downloadPath, 'Fatema_Akter_Usha_SQA_Resume.pdf')); break } catch { await pause(150) }
  }
  if (downloaded) assert.deepEqual(downloaded, bytes, 'Browser download should match the original PDF.')
  await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  assert.equal(await evaluate("getComputedStyle(document.documentElement).scrollBehavior"), 'auto')
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.section-heading')).animationName"), 'none')
  assert.deepEqual(errors, [], 'No uncaught browser exceptions')
  console.log(JSON.stringify({ passed: true, layouts: reports, browserDownloadVerified: Boolean(downloaded), limitations: downloaded ? [] : ['Headless Edge did not save the PDF. Download links and the exact PDF response are verified; browser file saving remains unverified.'], checks: ['active navigation', 'mobile menu and Escape', 'More menu', 'theme persistence', 'clipboard and feedback', 'email', 'safe external links', 'CV links and PDF bytes unchanged', 'reduced motion', 'no browser exceptions'] }, null, 2))
} finally { socket.close() }
