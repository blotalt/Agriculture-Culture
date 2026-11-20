// KhmerRice service worker: lets key pages open without a connection.
//
// - Pages: network first, falling back to the last cached copy (so prices seen
//   online are still readable offline), then to /offline.html.
// - Built assets (/build/...) and icons: cache first; their file names change on every build.
//   Icons and images keep their names, so bump VERSION whenever one of them changes.
// - Only GET requests from this site are handled. Forms and admin pages always use the network.

const VERSION = 'v2'; // v2: new logo
const PAGES = `khmerrice-pages-${VERSION}`;
const ASSETS = `khmerrice-assets-${VERSION}`;
const PRECACHE = ['/offline.html', '/pricemarket', '/calendar', '/icons/icon.svg', '/icons/logo-mark.svg', '/manifest.webmanifest'];
// Private pages (personal data) and auth flows are never stored on the device.
const NEVER_CACHE = [
    '/admin', '/login', '/logout', '/signup', '/register', '/locale',
    '/dashboard', '/alerts', '/manage-varieties', '/edit-post', '/edit-variety',
    '/search/suggest', '/variety/suggest',
    // Large file downloads
    '/pricemarket/data.csv', '/pricemarket/source-file',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(PAGES)
            .then((cache) => Promise.allSettled(PRECACHE.map((url) => cache.add(url))))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((key) => ![PAGES, ASSETS].includes(key)).map((key) => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (request.method !== 'GET' || url.origin !== self.location.origin) return;
    if (NEVER_CACHE.some((path) => url.pathname.startsWith(path))) return;

    if (url.pathname.startsWith('/build/') || url.pathname.startsWith('/icons/') || url.pathname.startsWith('/images/')) {
        event.respondWith(cacheFirst(request));
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith(networkFirst(request));
    }
});

async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (response.ok) {
        const cache = await caches.open(ASSETS);
        cache.put(request, response.clone());
    }
    return response;
}

async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response.ok && !response.headers.get('Cache-Control')?.includes('no-store')) {
            const cache = await caches.open(PAGES);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        return (await caches.match(request, { ignoreSearch: false }))
            || (await caches.match(new URL(request.url).pathname))
            || caches.match('/offline.html');
    }
}
