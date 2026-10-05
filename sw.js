const C="seance-v20",CI="fk-img-v1";const F=["./","./index.html","./imgs.js?v=3","./config.js","./manifest.webmanifest","./icon-192.png?v=3","./icon-512.png?v=3","./apple-touch-icon.png?v=3"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(F.map(u=>c.add(u).catch(()=>{})))));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!==CI).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
function warmImgs(){return caches.open(CI).then(c=>fetch("./img/list.json",{cache:"no-store"}).then(r=>r.json()).then(L=>{let i=0;const next=()=>{if(i>=L.length)return Promise.resolve();const u="./"+L[i++];return c.match(u).then(m=>m||c.add(u).catch(()=>{})).then(next);};return Promise.all([next(),next(),next(),next()]);})).catch(()=>{});}
function swr(e,r,key,notify){return caches.match(key).then(m=>{
  const net=fetch(typeof r==="string"?r:r.url,{cache:"no-store",credentials:"same-origin"}).then(res=>{if(res&&res.ok){const cp=res.clone();const a=m&&(m.headers.get("etag")||m.headers.get("last-modified")),b=res.headers.get("etag")||res.headers.get("last-modified");
    e.waitUntil(caches.open(C).then(c=>c.put(key,cp)).then(()=>{if(notify&&m&&a&&b&&a!==b)return caches.open(C).then(c=>c.put("./__upd",new Response("1"))).then(()=>self.clients.matchAll({type:"window"})).then(cs=>cs.forEach(c=>c.postMessage({t:"upd"})));}));}return res;});
  if(m){e.waitUntil(net.catch(()=>{}));return m;}return net.catch(()=>caches.match(key));});}
function netFirst(r,key){return fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(key||r,cp));}return res;}).catch(()=>caches.match(key||r));}
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.hostname.endsWith("supabase.co")||u.hostname.endsWith("basemaps.cartocdn.com"))return;
  if(r.mode==="navigate"){const sp=new URL(self.registration.scope).pathname;if(u.origin===location.origin&&(u.pathname===sp||u.pathname===sp+"index.html"))e.respondWith(swr(e,r,"./index.html",true));return;}
  if(u.origin===location.origin&&u.pathname.endsWith("/config.js")){e.respondWith(swr(e,r.url,"./config.js",false));return;}
  if(u.origin===location.origin&&u.pathname.indexOf("/img/")>=0&&!u.pathname.endsWith(".json")){e.respondWith(caches.open(CI).then(c=>c.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(res=>{if(res&&res.ok)c.put(r,res.clone());return res;}))));return;}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque")){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}return res;})));});

/* notifications */
self.addEventListener("push",e=>{let d={};try{d=e.data?e.data.json():{};}catch(x){d={body:e.data?e.data.text():""};}
  e.waitUntil(self.registration.showNotification(d.title||"FIT KEEF",{body:d.body||"",icon:"./icon-192.png?v=3",badge:"./icon-192.png?v=3",tag:d.tag||undefined,renotify:!!d.tag,data:{url:d.url||"./"}}));});
self.addEventListener("notificationclick",e=>{e.notification.close();
  const url=new URL((e.notification.data&&e.notification.data.url)||"./",self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(cs=>{
    for(const c of cs){if(c.url.indexOf(self.registration.scope)===0){return c.focus().then(w=>(url.indexOf("#")>0&&w&&w.navigate)?w.navigate(url):w).catch(()=>{});}}
    return self.clients.openWindow(url);}));});
