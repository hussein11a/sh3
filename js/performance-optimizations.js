/**
 * performance-optimizations.js - تحسينات الأداء لموقع سطحة هيدروليك
 */

// تحسين تحميل الصور باستخدام التحميل الكسول
function lazyLoadImages() {
    // التحقق من دعم المتصفح للتحميل الكسول
    if ('loading' in HTMLImageElement.prototype) {
        // استخدام التحميل الكسول المدمج في المتصفح
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.loading = 'lazy';
            img.removeAttribute('data-src');
        });
    } else {
        // استخدام تنفيذ بديل للتحميل الكسول
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.removeAttribute('data-src');
                        imageObserver.unobserve(lazyImage);
                    }
                });
            });
            
            lazyImages.forEach(image => {
                imageObserver.observe(image);
            });
        } else {
            // التنفيذ البديل للمتصفحات القديمة
            let lazyLoadThrottleTimeout;
            
            function lazyLoad() {
                if (lazyLoadThrottleTimeout) {
                    clearTimeout(lazyLoadThrottleTimeout);
                }
                
                lazyLoadThrottleTimeout = setTimeout(() => {
                    const scrollTop = window.pageYOffset;
                    lazyImages.forEach(lazyImage => {
                        if (lazyImage.offsetTop < (window.innerHeight + scrollTop)) {
                            lazyImage.src = lazyImage.dataset.src;
                            lazyImage.removeAttribute('data-src');
                        }
                    });
                    
                    if (lazyImages.length === 0) {
                        document.removeEventListener('scroll', lazyLoad);
                        window.removeEventListener('resize', lazyLoad);
                        window.removeEventListener('orientationChange', lazyLoad);
                    }
                }, 20);
            }
            
            document.addEventListener('scroll', lazyLoad);
            window.addEventListener('resize', lazyLoad);
            window.addEventListener('orientationChange', lazyLoad);
        }
    }
}

// تحسين تحميل الخطوط
function optimizeFontLoading() {
    // إضافة preconnect للخطوط
    const fontPreconnect = document.createElement('link');
    fontPreconnect.rel = 'preconnect';
    fontPreconnect.href = 'https://fonts.gstatic.com';
    fontPreconnect.crossOrigin = 'anonymous';
    document.head.appendChild(fontPreconnect);
    
    // إضافة preload للخطوط الأساسية
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap';
    fontPreload.as = 'style';
    document.head.appendChild(fontPreload);
}

// تحسين تحميل السكربتات
function optimizeScriptLoading() {
    // تأجيل تحميل السكربتات غير الضرورية
    const nonCriticalScripts = [
        '/js/protection.js',
        '/js/identity.js'
    ];
    
    // انتظار تحميل الصفحة قبل تحميل السكربتات غير الضرورية
    window.addEventListener('load', () => {
        nonCriticalScripts.forEach(scriptSrc => {
            const script = document.createElement('script');
            script.src = scriptSrc;
            script.defer = true;
            document.body.appendChild(script);
        });
    });
}

// تحسين تحميل CSS
function optimizeCSSLoading() {
    // تحميل CSS غير الحرج بشكل غير حاجب
    const nonCriticalStyles = [
        '/css/dark-mode.css'
    ];
    
    nonCriticalStyles.forEach(styleSrc => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = styleSrc;
        link.media = 'print';
        link.onload = () => {
            link.media = 'all';
        };
        document.head.appendChild(link);
    });
}

// تحسين التخزين المؤقت للمتصفح
function optimizeBrowserCaching() {
    // إضافة رؤوس التخزين المؤقت للموارد الثابتة
    // ملاحظة: يتم تكوين هذا عادة على الخادم أو في ملف netlify.toml
}

// تحسين تحميل الصفحة
function optimizePageLoading() {
    // إضافة preconnect للموارد الخارجية
    const preconnectDomains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://identity.netlify.com'
    ];
    
    preconnectDomains.forEach(domain => {
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = domain;
        preconnect.crossOrigin = 'anonymous';
        document.head.appendChild(preconnect);
    });
    
    // إضافة prefetch للصفحات المحتملة
    const prefetchPages = [
        '/offline.html'
    ];
    
    prefetchPages.forEach(page => {
        const prefetch = document.createElement('link');
        prefetch.rel = 'prefetch';
        prefetch.href = page;
        document.head.appendChild(prefetch);
    });
}

// تحسين أداء JavaScript
function optimizeJavaScriptPerformance() {
    // استخدام تقنيات تحسين الأداء
    
    // 1. استخدام throttle للأحداث المتكررة
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // 2. استخدام debounce للأحداث المتكررة
    function debounce(func, delay) {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    }
    
    // تطبيق throttle على حدث التمرير
    window.addEventListener('scroll', throttle(() => {
        // رمز التمرير هنا
    }, 100));
    
    // تطبيق debounce على حدث تغيير حجم النافذة
    window.addEventListener('resize', debounce(() => {
        // رمز تغيير الحجم هنا
    }, 250));
}

// تحسين أداء الموقع على الأجهزة المحمولة
function optimizeMobilePerformance() {
    // التحقق مما إذا كان الجهاز محمولاً
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // تعطيل بعض التأثيرات على الأجهزة المحمولة
        document.body.classList.add('mobile-device');
        
        // تفعيل وضع توفير البطارية إذا كان مستوى البطارية منخفضًا
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                if (battery.level < 0.2) {
                    document.body.classList.add('battery-saver');
                }
                
                battery.addEventListener('levelchange', () => {
                    if (battery.level < 0.2) {
                        document.body.classList.add('battery-saver');
                    } else {
                        document.body.classList.remove('battery-saver');
                    }
                });
            });
        }
    }
}

// تنفيذ تحسينات الأداء عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تحسين تحميل الصور
    lazyLoadImages();
    
    // تحسين تحميل الخطوط
    optimizeFontLoading();
    
    // تحسين تحميل CSS
    optimizeCSSLoading();
    
    // تحسين تحميل الصفحة
    optimizePageLoading();
    
    // تحسين أداء JavaScript
    optimizeJavaScriptPerformance();
    
    // تحسين أداء الموقع على الأجهزة المحمولة
    optimizeMobilePerformance();
});

// تحسين تحميل السكربتات
optimizeScriptLoading();

