var CACHE="mb-catalog-v1";
var FILES=["./catalog.html","./catalog-manifest.json","./catalog-icon-192.png","./catalog-icon-512.png"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  e.respondWith(
    fetch(e.request).then(function(r){
      var copy=r.clone();
      if(r.ok||r.type==="opaque")caches.open(CACHE).then(function(c){c.put(e.request,copy)});
      return r;
    }).catch(function(){return caches.match(e.request).then(function(m){return m||caches.match("./catalog.html")})})
  );
});
