var CACHE_STATIC_NAME = 'static-v4';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';

self.addEventListener('install', function(event) {
  console.log('install');
  try {
    console.log('typeof System in install', typeof System);
  } catch (e) {}

  console.log('caching');
  event.waitUntil(
    caches.open('first-app').then(function(cache) {
      console.log('caching - getting');
      return cache.addAll([
        './calc.html',
        './offline.html',
        './src/js/app.js',
        './currency_worker.js',
        'https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
        'https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js',
        'https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js',
        './manifest.json'
        ]);
    }).catch(function(error) {
      console.log('error', error)
    })
    );
});


self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
    .then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
          console.log('[Service Worker] Removing old cache.', key);
          return caches.delete(key);
        }
      }));
    })
    );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      if (response) {
        return response;
      } else {
        return fetch(event.request)
        .then(function(res) {
          return caches.open(CACHE_STATIC_NAME)
          .then(function(cache) {
            cache.put(event.request.url, res.clone());
            return res;
          })
        })
        .catch(function(err) {

        });
      }
    })
    );
});

// self.addEventListener('fetch', function(event) {
//  console.log(event.request.url);

//  event.respondWith(
//    caches.match(event.request).then(function(response) {
//      return response || fetch(event.request)
//    })
//    );
// });