/**
 * main.js - الملف الرئيسي لوظائف JavaScript لموقع سطحة هيدروليك
 */

// متغيرات عامة
const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const loader = document.querySelector('.loader');

// دالة تهيئة الموقع
function initializeSite() {
    // إخفاء شاشة التحميل بعد اكتمال تحميل الصفحة
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 500);
    });

    // تهيئة الوضع الليلي
    initializeDarkMode();

    // تهيئة وضع توفير البطارية
    initializeBatterySaver();

    // تهيئة التخصيص الذكي حسب الوقت
    initializeTimeBasedTheme();
}

// دالة للتحقق من وجود قيمة في التخزين المحلي
function getLocalStorageItem(key, defaultValue) {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
}

// دالة لتعيين قيمة في التخزين المحلي
function setLocalStorageItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// دالة للتحقق من دعم المتصفح للميزات المختلفة
function checkBrowserSupport() {
    const features = {
        localStorage: typeof Storage !== 'undefined',
        serviceWorker: 'serviceWorker' in navigator,
        batteryAPI: 'getBattery' in navigator,
        darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    };

    console.log('Browser support:', features);
    return features;
}

// دالة للتعامل مع الأخطاء
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    
    // إظهار رسالة خطأ للمستخدم إذا كان الخطأ مهمًا
    if (context === 'critical') {
        showNotification('حدث خطأ. يرجى تحديث الصفحة أو المحاولة لاحقًا.', 'error');
    }
}

// دالة لإظهار إشعار للمستخدم
function showNotification(message, type = 'info') {
    // التحقق من وجود عنصر الإشعارات
    let notificationsContainer = document.getElementById('notifications');
    
    // إنشاء عنصر الإشعارات إذا لم يكن موجودًا
    if (!notificationsContainer) {
        notificationsContainer = document.createElement('div');
        notificationsContainer.id = 'notifications';
        notificationsContainer.className = 'notifications';
        document.body.appendChild(notificationsContainer);
    }
    
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // إضافة الإشعار إلى الحاوية
    notificationsContainer.appendChild(notification);
    
    // إزالة الإشعار بعد 5 ثوانٍ
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// تهيئة الموقع عند تحميل المستند
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeSite();
    } catch (error) {
        handleError(error, 'critical');
    }
});

