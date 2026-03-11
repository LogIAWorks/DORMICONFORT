// ── DORMICONFORT Service Worker ──────────────────────────────────────────────
// Versión: incrementa para forzar actualización de caché en todos los clientes
const CACHE_VERSION = 'dormi-v1';

// Recursos a pre-cachear en la instalación (shell del sitio)
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/productos.html',
    '/producto.html',
    '/style.css',
    '/chat.js',
    '/favicon.png',
    '/assets/logo.png',
];

// ── Instalación: pre-cachear shell del sitio ──────────────────────────────────
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION).then((cache) => {
            // addAll ignora errores individuales para no bloquear la instalación
            return Promise.allSettled(
                PRECACHE_URLS.map(url => cache.add(url).catch(() => { }))
            );
        }).then(() => self.skipWaiting())
    );
});

// ── Activación: limpiar cachés antiguas ───────────────────────────────────────
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

// ── Fetch: estrategia por tipo de recurso ─────────────────────────────────────
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // 1. Llamadas a Supabase API → Network-First (datos siempre frescos)
    if (url.hostname.includes('supabase.co')) {
        event.respondWith(networkFirst(event.request));
        return;
    }

    // 2. Llamadas a Brevo API → solo red, sin caché
    if (url.hostname.includes('brevo.com')) {
        return; // deja que el navegador lo gestione normalmente
    }

    // 3. Todo lo demás (HTML, CSS, JS, fuentes, CDN) → Cache-First
    event.respondWith(cacheFirst(event.request));
});

// ── Estrategia Cache-First ────────────────────────────────────────────────────
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    try {
        const networkResponse = await fetch(request);
        // Solo cachear respuestas válidas y recursos de tipo básico/cors
        if (networkResponse.ok && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
            const cache = await caches.open(CACHE_VERSION);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch {
        // Offline y sin caché: devolver respuesta vacía
        return new Response('', { status: 503, statusText: 'Sin conexión' });
    }
}

// ── Estrategia Network-First ──────────────────────────────────────────────────
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_VERSION);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch {
        // Offline: usar caché si existe
        const cachedResponse = await caches.match(request);
        return cachedResponse || new Response('', { status: 503 });
    }
}
