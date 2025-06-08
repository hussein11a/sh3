/**
 * protection.js - وظائف حماية المحتوى لموقع سطحة هيدروليك
 */

// دالة تهيئة حماية المحتوى
function initializeProtection() {
    try {
        // التحقق من إعدادات الموقع
        fetchSiteSettings().then(settings => {
            const enableProtection = settings?.site?.enableProtection ?? true;
            
            if (!enableProtection) {
                return;
            }
            
            // تفعيل الحماية
            enableContentProtection();
        }).catch(error => {
            console.error('Error fetching site settings for protection:', error);
            
            // تفعيل الحماية بشكل افتراضي في حالة حدوث خطأ
            enableContentProtection();
        });
    } catch (error) {
        handleError(error, 'protection-initialization');
    }
}

// دالة لتفعيل حماية المحتوى
function enableContentProtection() {
    // منع الزر الأيمن
    disableRightClick();
    
    // منع تحديد النص
    disableTextSelection();
    
    // منع اختصارات النسخ والطباعة
    disableKeyboardShortcuts();
    
    // منع سحب الصور
    disableImageDragging();
    
    // إضافة حماية JavaScript مخصصة
    addCustomJavaScriptProtection();
    
    console.log('Content protection enabled');
}

// دالة لمنع الزر الأيمن
function disableRightClick() {
    document.addEventListener('contextmenu', event => {
        event.preventDefault();
        showProtectionMessage('منع الزر الأيمن للحفاظ على المحتوى');
        return false;
    });
}

// دالة لمنع تحديد النص
function disableTextSelection() {
    // إضافة أنماط CSS لمنع تحديد النص
    const style = document.createElement('style');
    style.textContent = `
        body {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        
        /* السماح بتحديد النص في حقول الإدخال والمناطق النصية */
        input, textarea {
            -webkit-user-select: auto;
            -moz-user-select: auto;
            -ms-user-select: auto;
            user-select: auto;
        }
    `;
    document.head.appendChild(style);
    
    // منع حدث تحديد النص
    document.addEventListener('selectstart', event => {
        // السماح بتحديد النص في حقول الإدخال والمناطق النصية
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return true;
        }
        
        event.preventDefault();
        return false;
    });
}

// دالة لمنع اختصارات النسخ والطباعة
function disableKeyboardShortcuts() {
    document.addEventListener('keydown', event => {
        // منع Ctrl+C (النسخ)
        if (event.ctrlKey && event.key === 'c') {
            event.preventDefault();
            showProtectionMessage('منع النسخ للحفاظ على المحتوى');
            return false;
        }
        
        // منع Ctrl+U (عرض المصدر)
        if (event.ctrlKey && event.key === 'u') {
            event.preventDefault();
            showProtectionMessage('منع عرض المصدر للحفاظ على المحتوى');
            return false;
        }
        
        // منع Ctrl+S (الحفظ)
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            showProtectionMessage('منع الحفظ للحفاظ على المحتوى');
            return false;
        }
        
        // منع Ctrl+P (الطباعة)
        if (event.ctrlKey && event.key === 'p') {
            event.preventDefault();
            showProtectionMessage('منع الطباعة للحفاظ على المحتوى');
            return false;
        }
        
        // منع F12 (أدوات المطور)
        if (event.key === 'F12') {
            event.preventDefault();
            showProtectionMessage('منع أدوات المطور للحفاظ على المحتوى');
            return false;
        }
        
        // منع Alt+F4 (إغلاق النافذة)
        if (event.altKey && event.key === 'F4') {
            event.preventDefault();
            showProtectionMessage('منع إغلاق النافذة بهذه الطريقة');
            return false;
        }
        
        return true;
    });
}

// دالة لمنع سحب الصور
function disableImageDragging() {
    document.addEventListener('dragstart', event => {
        if (event.target.tagName === 'IMG') {
            event.preventDefault();
            showProtectionMessage('منع سحب الصور للحفاظ على المحتوى');
            return false;
        }
    });
}

// دالة لإضافة حماية JavaScript مخصصة
function addCustomJavaScriptProtection() {
    // منع DevTools
    preventDevTools();
    
    // تشويش الكود
    obfuscateCode();
    
    // منع التحميل في إطار
    preventFraming();
    
    // إضافة علامة مائية غير مرئية
    addInvisibleWatermark();
}

// دالة لمنع استخدام أدوات المطور
function preventDevTools() {
    // مراقبة حجم النافذة للكشف عن فتح أدوات المطور
    let devToolsDetected = false;
    
    const detectDevTools = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        
        if (widthThreshold || heightThreshold) {
            if (!devToolsDetected) {
                devToolsDetected = true;
                showProtectionMessage('تم اكتشاف أدوات المطور. يرجى إغلاقها للاستمرار.');
            }
        } else {
            devToolsDetected = false;
        }
    };
    
    setInterval(detectDevTools, 1000);
    
    // منع console.log وأساليب التصحيح الأخرى
    const disableConsole = () => {
        try {
            // حفظ الدوال الأصلية
            const originalConsole = {
                log: console.log,
                warn: console.warn,
                error: console.error,
                info: console.info,
                debug: console.debug
            };
            
            // استبدال الدوال بدوال فارغة
            console.log = console.warn = console.error = console.info = console.debug = () => {
                showProtectionMessage('تم منع استخدام وحدة التحكم للحفاظ على المحتوى');
                return false;
            };
            
            // السماح بتسجيل الأخطاء الداخلية
            window.onerror = (message, source, lineno, colno, error) => {
                originalConsole.error('Error:', message, source, lineno, colno, error);
                return true;
            };
        } catch (e) {
            // تجاهل الأخطاء
        }
    };
    
    // تعليق هذه الدالة لتسهيل التطوير والاختبار
    // disableConsole();
}

// دالة لتشويش الكود
function obfuscateCode() {
    // إضافة متغيرات وهمية لتشويش الكود
    const _0x1a2b3c = true;
    const _0x4d5e6f = 'protected';
    const _0x7g8h9i = () => {
        return Math.random().toString(36).substring(2, 15);
    };
    
    // إضافة دوال وهمية
    window._0x1a2b3c = _0x1a2b3c;
    window._0x4d5e6f = _0x4d5e6f;
    window._0x7g8h9i = _0x7g8h9i;
}

// دالة لمنع التحميل في إطار
function preventFraming() {
    // منع التحميل في إطار
    if (window.self !== window.top) {
        window.top.location.href = window.self.location.href;
    }
    
    // إضافة وسوم HTTP للحماية
    const securityHeaders = document.createElement('meta');
    securityHeaders.httpEquiv = 'Content-Security-Policy';
    securityHeaders.content = "frame-ancestors 'self'";
    document.head.appendChild(securityHeaders);
}

// دالة لإضافة علامة مائية غير مرئية
function addInvisibleWatermark() {
    // إضافة علامة مائية غير مرئية في التعليقات
    const watermark = document.createComment(` 
        Protected content - سطحة هيدروليك
        Copyright © ${new Date().getFullYear()}
        All rights reserved
    `);
    document.documentElement.appendChild(watermark);
    
    // إضافة بيانات مخفية في الصفحة
    const hiddenData = document.createElement('div');
    hiddenData.style.display = 'none';
    hiddenData.setAttribute('data-protection', 'enabled');
    hiddenData.setAttribute('data-site', 'سطحة هيدروليك');
    hiddenData.setAttribute('data-timestamp', Date.now().toString());
    document.body.appendChild(hiddenData);
}

// دالة لإظهار رسالة حماية
function showProtectionMessage(message) {
    // التحقق من وجود عنصر رسائل الحماية
    let protectionMessages = document.getElementById('protection-messages');
    
    // إنشاء عنصر رسائل الحماية إذا لم يكن موجودًا
    if (!protectionMessages) {
        protectionMessages = document.createElement('div');
        protectionMessages.id = 'protection-messages';
        protectionMessages.className = 'protection-messages';
        document.body.appendChild(protectionMessages);
        
        // إضافة أنماط CSS لرسائل الحماية
        const style = document.createElement('style');
        style.textContent = `
            .protection-messages {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                direction: rtl;
            }
            
            .protection-message {
                background-color: rgba(220, 53, 69, 0.9);
                color: white;
                padding: 10px 15px;
                border-radius: 4px;
                margin-top: 10px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                font-size: 14px;
                max-width: 300px;
                opacity: 1;
                transition: opacity 0.3s;
            }
            
            .protection-message.hide {
                opacity: 0;
            }
            
            @media (max-width: 576px) {
                .protection-messages {
                    bottom: 10px;
                    right: 10px;
                    left: 10px;
                }
                
                .protection-message {
                    max-width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // إنشاء عنصر رسالة الحماية
    const protectionMessage = document.createElement('div');
    protectionMessage.className = 'protection-message';
    protectionMessage.textContent = message;
    
    // إضافة رسالة الحماية إلى الحاوية
    protectionMessages.appendChild(protectionMessage);
    
    // إزالة رسالة الحماية بعد 3 ثوانٍ
    setTimeout(() => {
        protectionMessage.classList.add('hide');
        setTimeout(() => {
            protectionMessage.remove();
        }, 300);
    }, 3000);
}

// دالة للحصول على إعدادات الموقع
async function fetchSiteSettings() {
    try {
        const response = await fetch('/data/site.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching site settings for protection:', error);
        return null;
    }
}

// تهيئة حماية المحتوى عند تحميل المستند
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeProtection();
    } catch (error) {
        handleError(error, 'protection');
    }
});

