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



const configurations=[[320,640],[375,667],[390,844],[768,1024],[1024,768],[1440,1000],[667,375],[844,390],[320,240]];
const destinations=['home','experience','projects','skills','certificates','/articles','contact'];
async function route(hash) {await evaluate('location.hash='+JSON.stringify(hash));await pause(100)}
async function key(key,code=key) {await call('Input.dispatchKeyEvent',{type:'keyDown',key,code});await call('Input.dispatchKeyEvent',{type:'keyUp',key,code})}
try {
 await call('Page.enable');await call('Runtime.enable');await call('Page.navigate',{url:'http://127.0.0.1:5173/#home'});await pause(500);
 await call('Emulation.setPageScaleFactor',{pageScaleFactor:1});
 await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 assert.equal(await evaluate("document.querySelector('meta[name=viewport]').content"),'width=device-width, initial-scale=1.0');
 const articles=await evaluate("import('/src/articles.js').then(m=>m.articles)");
 for(const [width,height] of configurations) {
  await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<900});
  for(const theme of ['light','dark']) {
   await route('home');await evaluate('document.documentElement.dataset.theme='+JSON.stringify(theme));
   assert(await evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth'),'Homepage overflow '+width);
   assert(await evaluate("[...document.querySelectorAll('.project-copy,.timeline-item,.skill-group,.credential-row,.workflow-stage,.stlc-stage-content,.defect-outcome')].every(e=>e.scrollWidth<=e.clientWidth+1 && e.scrollHeight<=e.clientHeight+1)"),'Component cropping '+width);
   assert(await evaluate("[...document.querySelectorAll('.workflow-step-arrow,.stlc-arrow,.stlc-feedback,.workflow-feedback,.defect-fork-mobile')].filter(e=>getComputedStyle(e).display!=='none').every(e=>{const p=e.closest('.workflow-frame').getBoundingClientRect(),r=e.getBoundingClientRect();return r.left>=p.left && r.right<=p.right && r.top>=p.top && r.bottom<=p.bottom})"),'Diagram connector outside panel '+width);
   assert.equal(await evaluate("getComputedStyle(document.querySelector('.certificate-list')).gridTemplateColumns.split(' ').length"),width>1050?3:width>640?2:1);
   const nav=width<=900?'mobile-navigation':'more-navigation';const toggle=width<=900?'menu-toggle':'more-toggle';
   await evaluate('document.getElementById('+JSON.stringify(toggle)+').click()');await pause(50);
   assert(await evaluate('document.activeElement.closest("#'+nav+'")!==null'),'Menu focus');
   await key('Tab');assert(await evaluate('document.activeElement.closest("#'+nav+'")!==null'),'Keyboard tab');
   const menu=await evaluate('(()=>{const e=document.getElementById('+JSON.stringify(nav)+'),r=e.getBoundingClientRect();return {bottom:r.bottom,height:innerHeight}})()');assert(menu.bottom<=menu.height,'Short menu overflow');
   await key('Escape');assert.equal(await evaluate('document.getElementById('+JSON.stringify(toggle)+').getAttribute("aria-expanded")'),'false');assert.equal(await evaluate('document.activeElement.id'),toggle);
   if(width<=900) for(const destination of destinations) {
    await evaluate("document.getElementById('menu-toggle').click()");await pause(30);
    await evaluate('document.querySelector('+JSON.stringify('#mobile-navigation a[href="#'+destination+'"]')+').focus()');await key('Enter');await pause(100);
    assert.equal(await evaluate("document.getElementById('menu-toggle').getAttribute('aria-expanded')"),'false');
    assert.equal(await evaluate('location.hash'),'#'+destination);
    if(destination!=='/articles') assert(await evaluate('document.getElementById('+JSON.stringify(destination)+').querySelector("h1,h2").getBoundingClientRect().top>=document.querySelector(".site-header").getBoundingClientRect().bottom-1'),'Header covers section '+destination);
   }
   await route('/articles');assert.equal(await evaluate("document.querySelectorAll('.article-card').length"),6);
   assert.equal(await evaluate("getComputedStyle(document.querySelector('.article-grid')).gridTemplateColumns.split(' ').length"),width>640?2:1);
   for(const article of articles) {
    await route('/articles/'+article.slug);
    assert.equal(await evaluate("document.querySelector('.article-header h1').textContent"),article.title);
    assert(await evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth'),'Reader overflow '+width);
    assert(await evaluate("[...document.querySelectorAll('.article-table-scroll, .article-body pre')].every(e=>e.getBoundingClientRect().right<=document.documentElement.clientWidth && e.tabIndex===0)"),'Reader local scroll containers');
    assert(await evaluate("[...document.querySelectorAll('.article-reader a')].every(e=>e.getBoundingClientRect().right<=document.documentElement.clientWidth+1)"),'Reader link overflow');
    await evaluate("document.querySelector('.article-reader > a').click()");await pause(60);assert.equal(await evaluate('location.hash'),'#/articles');
   }
   await route('home');
   if(width===390||width===1440) {await screenshot('responsive-hero-'+width+'-'+theme);await evaluate("document.getElementById('projects').scrollIntoView({behavior:'instant'})");await screenshot('responsive-projects-'+width+'-'+theme)}
  }
  console.log('PASS layouts '+width+'x'+height+' both themes, homepage/listing/all six readers and menu');
 }
 await call('Emulation.setDeviceMetricsOverride',{width:375,height:667,deviceScaleFactor:1,mobile:true});
 for(const article of articles){await route('/articles/'+article.slug);await call('Page.reload');await pause(250);assert.equal(await evaluate("document.querySelector('.article-header h1').textContent"),article.title)}
 await route('home');await evaluate("document.getElementById('skills').scrollIntoView({behavior:'instant'})");
 assert.equal(await evaluate("getComputedStyle(document.querySelector('.tool-strip-track')).animationName"),'none');assert(await evaluate("!document.querySelector('.tool-strip button')"));
 await call('Emulation.setEmulatedMedia',{features:[]});await pause(50);
 await evaluate("document.getElementById('tool-logo-strip').focus()");assert.equal(await evaluate("getComputedStyle(document.querySelector('.tool-strip-track')).animationPlayState"),'paused');await evaluate('document.activeElement.blur()');
 for(const section of ['experience','projects','skills','certificates','contact']) {await evaluate('document.getElementById('+JSON.stringify(section)+').scrollIntoView({behavior:"instant"})');await pause(600);assert(await evaluate('getComputedStyle(document.getElementById('+JSON.stringify(section)+')).opacity==="1"'))}
 assert(await evaluate("[...document.querySelectorAll('a[download]')].every(a=>a.getAttribute('href')==='/Usha_SQA_Resume.pdf')"));
 assert.equal(await evaluate("document.querySelector('#contact a[href^=mailto]').getAttribute('href')"),'mailto:ushaislam2022@gmail.com');assert.equal(await evaluate("document.querySelector('#contact a[href*=wa]').getAttribute('href')"),'https://wa.me/8801946674350');
 const external=await evaluate("[...document.querySelectorAll('.project-link')].map(a=>a.href)");assert.deepEqual(external,['https://github.com/usha-islam/Automation_with_playwright','https://github.com/usha-islam/dmoney-assignment','https://github.com/usha-islam/Performance-Testing-Assignment']);
 const response=await fetch('http://127.0.0.1:5173/Usha_SQA_Resume.pdf');assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'application/pdf');assert.deepEqual(Buffer.from(await response.arrayBuffer()),await readFile('public/Usha_SQA_Resume.pdf'));
 assert.deepEqual(errors,[]);console.log('PASS: keyboard menu/Tab/Enter/Escape; section clearance; all route refreshes; hover/focus logo pause; no logo button; reduced motion; reveal visibility; PDF bytes and contact/repository destinations; viewport zoom enabled. Browser emulation only.');
}finally{socket.close()}
