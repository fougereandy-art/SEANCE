const C="seance-v6";const F=["./","./index.html","./config.js","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
function netFirst(r,key){return fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(key||r,cp));}return res;}).catch(()=>caches.match(key||r));}
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.hostname.endsWith("supabase.co"))return;
  if(r.mode==="navigate"){e.respondWith(netFirst(r,"./index.html"));return;}
  if(u.origin===location.origin&&u.pathname.endsWith("/config.js")){e.respondWith(netFirst(r,"./config.js"));return;}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque")){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}return res;})));});

/* notifications */
self.addEventListener("push",e=>{let d={};try{d=e.data?e.data.json():{};}catch(x){d={body:e.data?e.data.text():""};}
  e.waitUntil(self.registration.showNotification(d.title||"FIT KEEF",{body:d.body||"",icon:"./icon-192.png",badge:"./icon-192.png",tag:d.tag||undefined,renotify:!!d.tag,data:{url:d.url||"./"}}));});
self.addEventListener("notificationclick",e=>{e.notification.close();
  const url=new URL((e.notification.data&&e.notification.data.url)||"./",self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(cs=>{
    for(const c of cs){if(c.url.indexOf(self.registration.scope)===0){return c.focus().then(w=>(url.indexOf("#")>0&&w&&w.navigate)?w.navigate(url):w).catch(()=>{});}}
    return self.clients.openWindow(url);}));});
