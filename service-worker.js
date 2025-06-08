/**
 * service-worker.js - خدمة العامل لدعم PWA والعمل بدون اتصال لموقع سطحة هيدروليك
 */

// إصدار التخزين المؤقت
const CACHE_VERSION = 'v1.0.0';

// أسماء التخزين المؤقت
const CACHE_NAMES = {
    static: `static-${CACHE_VERSION}`,
    dynamic: `dynamic-${CACHE_VERSION}`,
    images: `images-${CACHE_VERSION}`,
    fonts: `fonts-${CACHE_VERSION}`
};

// الموارد التي سيتم تخزينها مؤقتًا عند التثبيت
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/main.css',
    '/css/dark-mode.css',
    '/css/responsive.css',
    '/js/main.js',
    '/js/dark-mode.js',
    '/js/content-loader.js',
    '/js/protection.js',
    '/js/identity.js',
    '/manifest.json',
    '/data/site.json',
    '/data/services.json',
    '/data/buttons.json',
    '/data/footer.json',
    '/img/logo.png',
    '/img/og-image.jpg',
    '/icons/favicon.ico',
    '/icons/apple-touch-icon.png',
    '/offline.html'
];

// الموارد التي سيتم تخزينها مؤقتًا عند الطلب
const DYNAMIC_ASSET_PATTERNS = [
    /\.json$/,
    /\.js$/,
    /\.css$/,
    /\.html$/
];

// أنماط الموارد التي سيتم تخزينها في ذاكرة التخزين المؤقت للصور
const IMAGE_ASSET_PATTERNS = [
    /\.jpg$/,
    /\.jpeg$/,
    /\.png$/,
    /\.gif$/,
    /\.webp$/,
    /\.svg$/,
    /\.ico$/
];

// أنماط الموارد التي سيتم تخزينها في ذاكرة التخزين المؤقت للخطوط
const FONT_ASSET_PATTERNS = [
    /\.woff$/,
    /\.woff2$/,
    /\.ttf$/,
    /\.eot$/,
    /fonts\.googleapis\.com/,
    /fonts\.gstatic\.com/
];

// الموارد التي لن يتم تخزينها مؤقتًا
const EXCLUDED_ASSET_PATTERNS = [
    /\/admin\//,
    /netlify-identity-widget\.js$/,
    /netlify-cms/,
    /identity\.netlify\.com/,
    /api\//
];

// حدث التثبيت
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing Service Worker...', event);
    
    // تخطي فترة الانتظار
    self.skipWaiting();
    
    // تخزين الموارد الثابتة مؤقتًا
    event.waitUntil(
        caches.open(CACHE_NAMES.static)
            .then(cache => {
                console.log('[Service Worker] Precaching App Shell');
                return cache.addAll(STATIC_ASSETS);
            })
            .catch(error => {
                console.error('[Service Worker] Precaching failed:', error);
            })
    );
});

// حدث التنشيط
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating Service Worker...', event);
    
    // المطالبة بالسيطرة على العملاء فورًا
    self.clients.claim();
    
    // حذف ذاكرات التخزين المؤقت القديمة
    event.waitUntil(
        caches.keys()
            .then(keyList => {
                return Promise.all(keyList.map(key => {
                    // التحقق مما إذا كانت ذاكرة التخزين المؤقت قديمة
                    if (
                        key !== CACHE_NAMES.static &&
                        key !== CACHE_NAMES.dynamic &&
                        key !== CACHE_NAMES.images &&
                        key !== CACHE_NAMES.fonts &&
                        key.includes('-')
                    ) {
                        console.log('[Service Worker] Removing old cache:', key);
                        return caches.delete(key);
                    }
                }));
            })
            .catch(error => {
                console.error('[Service Worker] Cache cleanup failed:', error);
            })
    );
});

// حدث الطلب
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // تجاهل طلبات لوحة التحكم والـ API
    if (shouldExcludeRequest(event.request)) {
        return;
    }
    
    // استراتيجية التخزين المؤقت للموارد الثابتة
    if (STATIC_ASSETS.includes(url.pathname) || STATIC_ASSETS.includes(url.pathname + '/')) {
        event.respondWith(cacheFirst(event.request, CACHE_NAMES.static));
        return;
    }
    
    // استراتيجية التخزين المؤقت للصور
    if (isImageRequest(event.request)) {
        event.respondWith(staleWhileRevalidate(event.request, CACHE_NAMES.images));
        return;
    }
    
    // استراتيجية التخزين المؤقت للخطوط
    if (isFontRequest(event.request)) {
        event.respondWith(staleWhileRevalidate(event.request, CACHE_NAMES.fonts));
        return;
    }
    
    // استراتيجية التخزين المؤقت للموارد الديناميكية
    if (isDynamicRequest(event.request)) {
        event.respondWith(networkFirst(event.request, CACHE_NAMES.dynamic));
        return;
    }
    
    // استراتيجية الشبكة أولاً مع التخزين المؤقت كاحتياطي
    event.respondWith(networkFirst(event.request, CACHE_NAMES.dynamic));
});

// استراتيجية التخزين المؤقت أولاً
async function cacheFirst(request, cacheName) {
    try {
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        try {
            const networkResponse = await fetch(request);
            
            if (networkResponse && networkResponse.ok) {
                const cache = await caches.open(cacheName);
                cache.put(request, networkResponse.clone());
            }
            
            return networkResponse;
        } catch (error) {
            console.error('[Service Worker] Network request failed:', error);
            
            // إذا كان الطلب لصفحة HTML، قم بإرجاع صفحة عدم الاتصال
            if (request.headers.get('Accept').includes('text/html')) {
                return caches.match('/offline.html');
            }
            
            throw error;
        }
    } catch (error) {
        console.error('[Service Worker] Cache first strategy failed:', error);
        
        // إذا كان الطلب لصفحة HTML، قم بإرجاع صفحة عدم الاتصال
        if (request.headers.get('Accept').includes('text/html')) {
            return caches.match('/offline.html');
        }
        
        throw error;
    }
}

// استراتيجية الشبكة أولاً
async function networkFirst(request, cacheName) {
    try {
        try {
            const networkResponse = await fetch(request);
            
            if (networkResponse && networkResponse.ok) {
                const cache = await caches.open(cacheName);
                cache.put(request, networkResponse.clone());
            }
            
            return networkResponse;
        } catch (error) {
            console.log('[Service Worker] Network request failed, falling back to cache:', error);
            
            const cachedResponse = await caches.match(request);
            
            if (cachedResponse) {
                return cachedResponse;
            }
            
            // إذا كان الطلب لصفحة HTML، قم بإرجاع صفحة عدم الاتصال
            if (request.headers.get('Accept').includes('text/html')) {
                return caches.match('/offline.html');
            }
            
            throw error;
        }
    } catch (error) {
        console.error('[Service Worker] Network first strategy failed:', error);
        
        // إذا كان الطلب لصفحة HTML، قم بإرجاع صفحة عدم الاتصال
        if (request.headers.get('Accept').includes('text/html')) {
            return caches.match('/offline.html');
        }
        
        throw error;
    }
}

// استراتيجية التخزين المؤقت مع التحديث
async function staleWhileRevalidate(request, cacheName) {
    try {
        const cache = await caches.open(cacheName);
        
        // محاولة الحصول على الاستجابة من التخزين المؤقت
        const cachedResponse = await caches.match(request);
        
        // تحديث التخزين المؤقت في الخلفية
        const updateCache = fetch(request)
            .then(networkResponse => {
                if (networkResponse && networkResponse.ok) {
                    cache.put(request, networkResponse.clone());
                }
                return networkResponse;
            })
            .catch(error => {
                console.error('[Service Worker] Network request failed during cache update:', error);
            });
        
        // إرجاع الاستجابة المخزنة مؤقتًا إذا كانت موجودة، وإلا انتظار الشبكة
        return cachedResponse || updateCache;
    } catch (error) {
        console.error('[Service Worker] Stale while revalidate strategy failed:', error);
        
        try {
            // محاولة الحصول على الاستجابة من الشبكة كملاذ أخير
            return await fetch(request);
        } catch (fetchError) {
            console.error('[Service Worker] Fallback fetch failed:', fetchError);
            
            // إذا كان الطلب لصفحة HTML، قم بإرجاع صفحة عدم الاتصال
            if (request.headers.get('Accept').includes('text/html')) {
                return caches.match('/offline.html');
            }
            
            throw fetchError;
        }
    }
}

// التحقق مما إذا كان الطلب للصور
function isImageRequest(request) {
    return IMAGE_ASSET_PATTERNS.some(pattern => pattern.test(request.url));
}

// التحقق مما إذا كان الطلب للخطوط
function isFontRequest(request) {
    return FONT_ASSET_PATTERNS.some(pattern => pattern.test(request.url));
}

// التحقق مما إذا كان الطلب للموارد الديناميكية
function isDynamicRequest(request) {
    return DYNAMIC_ASSET_PATTERNS.some(pattern => pattern.test(request.url));
}

// التحقق مما إذا كان يجب استبعاد الطلب من التخزين المؤقت
function shouldExcludeRequest(request) {
    // استبعاد طلبات POST وغيرها من الطلبات غير GET
    if (request.method !== 'GET') {
        return true;
    }
    
    // استبعاد الطلبات التي تطابق أنماط الاستبعاد
    return EXCLUDED_ASSET_PATTERNS.some(pattern => pattern.test(request.url));
}

// حدث الرسائل
self.addEventListener('message', event => {
    console.log('[Service Worker] Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

