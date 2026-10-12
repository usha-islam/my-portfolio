// Local browser verification with Node.js and a headless browser on port 9223.
// No test packages are required. Screenshots go to the system temporary folder.
import { writeFile, readFile } from 'node:fs/promises'
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


try {
 await call('Page.enable');await call('Runtime.enable');await call('Emulation.setPageScaleFactor',{pageScaleFactor:1});
 for(const width of [1440,1100,960,768,390,320]) {
  await call('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
  for(const theme of ['light','dark']) {
   await call('Page.navigate',{url:'http://127.0.0.1:5173/#home'});await pause(150);
   await evaluate('document.documentElement.dataset.theme='+JSON.stringify(theme));
   assert.equal(await evaluate("document.querySelector('.hero-introduction').textContent"),'Hello, I'+String.fromCharCode(8217)+'m Fatema Akter Usha, a Software QA Engineer with a curious mind and a keen eye for detail.');
   assert(await evaluate("[...document.querySelectorAll('a[download]')].every(a=>a.textContent==='Download Resume' && a.getAttribute('href')==='/Usha_SQA_Resume.pdf')"));
   assert.equal(await evaluate("document.querySelector('#contact a[href^=mailto]').getAttribute('href')"),'mailto:ushaislam2022@gmail.com');
   assert.equal(await evaluate("document.querySelector('#contact a[href*=wa]').getAttribute('href')"),'https://wa.me/8801946674350');
   assert.equal(await evaluate("document.querySelector('.hero-connect').getAttribute('href')"),'https://www.linkedin.com/in/ushaislam/');
   assert(await evaluate('document.documentElement.scrollWidth<=innerWidth'));
   if(width===1440||width===390) {await pause(600);await screenshot('polish-hero-'+width+'-'+theme)}
   await evaluate("document.getElementById('projects').scrollIntoView({behavior:'instant'})");await pause(650);
   assert(await evaluate("[...document.querySelectorAll('.stlc-stage-content, .workflow-stage, .defect-outcome')].every(e=>e.scrollWidth<=e.clientWidth+1 && e.scrollHeight<=e.clientHeight+1)"),'Diagram overflow '+width);
   if(width===1440||width===390)await screenshot('polish-projects-'+width+'-'+theme);
   await evaluate("document.querySelector('.desktop-nav a[href=\"#/articles\"]').click()");await pause(900);
   const cards=await evaluate("[...document.querySelectorAll('.article-card')].map(c=>({top:c.offsetTop,action:c.querySelector('.article-read-link').getBoundingClientRect().bottom,height:c.offsetHeight}))");
   assert.equal(cards.length,6);
   if(width>640){for(let i=0;i<6;i+=2){assert.equal(cards[i].top,cards[i+1].top);assert(Math.abs(cards[i].action-cards[i+1].action)<1)}}
   assert(await evaluate('document.documentElement.scrollWidth<=innerWidth'));
  }
 }
 const response=await fetch('http://127.0.0.1:5173/Usha_SQA_Resume.pdf');assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'application/pdf');const bytes=Buffer.from(await response.arrayBuffer());assert.equal(bytes.subarray(0,5).toString(),'%PDF-');assert.deepEqual(bytes,await readFile('public/Usha_SQA_Resume.pdf'));
 assert.equal(errors.length,0);console.log('PASS: 100% page scale; 6 viewport widths and both themes; exact hero wording; two-column article action alignment; no page/diagram overflow; consistent resume labels and exact PDF response; LinkedIn/email/WhatsApp destinations; screenshots captured');
}finally{socket.close()}
