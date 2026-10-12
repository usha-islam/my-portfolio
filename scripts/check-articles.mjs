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
 await call('Page.enable'); await call('Runtime.enable'); await call('Page.navigate',{url:'http://127.0.0.1:5173/#/articles'}); await pause(1000);
 const originalSource=await readFile('C:/Users/DFIT/Downloads/QA_Portfolio_Articles.md','utf8');
 const data=await evaluate("import('/src/articles.js').then(m => ({articles:m.articles,intro:m.articleIntroduction}))");
 assert.equal(data.articles.length,6);
 const expectedTitles=['Unclear Requirements: What Should a QA Engineer Do Next?','What Should We Test First? A Practical Guide to Risk-Based Testing','The API Returned 200 OK. Is It Really Working?','Small Change, Wider Impact: Choosing the Right Regression Tests','What Should You Not Automate—and Why?','Would You Block the Release for This Bug?'];
 assert.deepEqual(data.articles.map(a=>a.title),expectedTitles);
 const oldSlugs=[...originalSource.matchAll(/^# \d+\. (.+)$/gm)].map(m=>m[1].toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-'));
 assert.deepEqual(data.articles.map(a=>a.slug),oldSlugs);
 const parts=originalSource.replace(/\r\n/g,'\n').split(/^# \d+\. /m).slice(1);
 for(let i=0;i<6;i++) { const body=parts[i].slice(parts[i].indexOf('\n')).replace(/^\*\*(Excerpt|Tags):\*\* .*\n/gm,'').replace(/\n+---\s*$/,'').trim(); assert.equal(data.articles[i].content,body); }
 await call('Page.reload'); await pause(500);
 assert(await evaluate("document.querySelector('.article-listing h1').textContent === 'QA Insights' && !document.getElementById('home') && document.querySelector('.desktop-nav a[aria-current]').textContent === 'Articles'"));
 const links=await evaluate("[...document.querySelectorAll('.article-read-link')].map(a=>a.getAttribute('href'))"); assert.equal(links.length,6);
 for (const width of [1440,960,768,390,320]) {
  await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
  for(const theme of ['light','dark']) {
   await evaluate("document.documentElement.dataset.theme="+JSON.stringify(theme));
   await evaluate("location.hash='/articles'"); await pause(600);
   const grid=await evaluate("({width:document.documentElement.scrollWidth,columns:getComputedStyle(document.querySelector('.article-grid')).gridTemplateColumns.split(' ').length})");
   if(width===1440 || width===390) await screenshot('articles-'+width+'-'+theme);
   assert(grid.width<=width,'Grid overflow '+width); assert.equal(grid.columns,width>640?2:1);
   for(let i=0;i<6;i++) {
    await evaluate("document.querySelectorAll('.article-read-link')["+i+"].click()"); await pause(100);
    assert.equal(await evaluate("document.querySelector('.article-header h1').textContent"),data.articles[i].title);
    assert(await evaluate("document.documentElement.scrollWidth<=innerWidth"),'Reader overflow '+width);
    const plain=data.articles[i].content.split('\n').filter(line=>line.trim()).at(-1).replaceAll('**','').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1');
    assert((await evaluate("document.querySelector('.article-body').innerText")).includes(plain),'Final paragraph missing');
    assert.equal(await evaluate("document.querySelector('.article-author').textContent"),'By Fatema Akter Usha');
    await evaluate("document.querySelector('.article-reader > a').click()"); await pause(600);
    assert(await evaluate("location.hash === '#/articles' && window.scrollY === 0 && !document.getElementById('home')"),'Return position');
   }
  }
 }
 await evaluate("document.querySelector('.article-read-link').click()");await pause(150);await call('Page.reload');await pause(750);
 assert.equal(await evaluate("document.querySelector('.article-header h1').textContent"),data.articles[0].title);
 await evaluate("document.querySelector('.article-next').click()");await pause(100);
 await evaluate("history.back()");await pause(150);assert.equal(await evaluate("document.querySelector('.article-header h1').textContent"),data.articles[0].title);
 await evaluate("history.forward()");await pause(150);assert.equal(await evaluate("document.querySelector('.article-header h1').textContent"),data.articles[1].title);
 await evaluate("document.getElementById('menu-toggle').click();document.querySelector('#mobile-navigation a[href=\"#projects\"]').click()");await pause(650);assert(await evaluate("!!document.getElementById('projects') && !document.getElementById('articles')"));
 await evaluate("history.back()");await pause(150);assert(await evaluate("!!document.querySelector('.article-reader')"));
 await evaluate("history.forward()");await pause(150);assert(await evaluate("!!document.getElementById('projects') && !document.getElementById('articles')"));
 assert(await evaluate("[...document.querySelectorAll('a[download]')].every(a=>a.getAttribute('href')==='/Usha_SQA_Resume.pdf')"));
 assert.equal(errors.length,0,errors.join('; '));
 console.log('PASS: article body preservation; six cards/readers; 5 viewport widths; both themes; no overflow; return scroll; direct refresh; Back/Forward; section navigation; resume links; no runtime errors');
} finally {socket.close()}
