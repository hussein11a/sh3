// identity.js - ملف التحقق من الهوية لـ Netlify CMS

// تهيئة Netlify Identity
document.addEventListener('DOMContentLoaded', function() {
    // التأكد من تحميل Netlify Identity
    if (window.netlifyIdentity) {
        console.log('Netlify Identity loaded successfully');
        
        // تهيئة Identity
        window.netlifyIdentity.init({
            APIUrl: window.location.origin + '/.netlify/identity',
            logo: false,
            namePlaceholder: 'الاسم الكامل',
            locale: 'ar'
        });
        
        // معالجة أحداث تسجيل الدخول
        window.netlifyIdentity.on("init", user => {
            console.log('Identity initialized, user:', user);
            if (!user) {
                window.netlifyIdentity.on("login", () => {
                    console.log('User logged in, redirecting to admin');
                    document.location.href = "/admin/";
                });
            }
        });
        
        // معالجة تسجيل الخروج
        window.netlifyIdentity.on("logout", () => {
            console.log('User logged out, redirecting to home');
            document.location.href = "/";
        });
        
        // معالجة الأخطاء
        window.netlifyIdentity.on("error", err => {
            console.error('Netlify Identity error:', err);
        });
        
        // معالجة التسجيل
        window.netlifyIdentity.on("signup", user => {
            console.log('User signed up:', user);
        });
        
        // معالجة تأكيد البريد الإلكتروني
        window.netlifyIdentity.on("confirm", user => {
            console.log('User confirmed:', user);
        });
        
    } else {
        console.error('Netlify Identity not loaded');
        
        // محاولة تحميل Identity مرة أخرى
        setTimeout(() => {
            if (window.netlifyIdentity) {
                console.log('Netlify Identity loaded on retry');
                window.netlifyIdentity.init();
            } else {
                console.error('Failed to load Netlify Identity after retry');
            }
        }, 1000);
    }
});

// دالة لفتح نافذة تسجيل الدخول
function openLoginModal() {
    if (window.netlifyIdentity) {
        window.netlifyIdentity.open();
    } else {
        console.error('Netlify Identity not available');
        alert('خدمة تسجيل الدخول غير متاحة حالياً. يرجى المحاولة لاحقاً.');
    }
}

// دالة لتسجيل الخروج
function logout() {
    if (window.netlifyIdentity) {
        window.netlifyIdentity.logout();
    }
}

// دالة للحصول على المستخدم الحالي
function getCurrentUser() {
    if (window.netlifyIdentity) {
        return window.netlifyIdentity.currentUser();
    }
    return null;
}

// دالة للتحقق من حالة تسجيل الدخول
function isLoggedIn() {
    const user = getCurrentUser();
    return user !== null;
}

// إضافة معالج للنقر على رابط Admin
document.addEventListener('DOMContentLoaded', function() {
    const adminLinks = document.querySelectorAll('a[href*="/admin"]');
    adminLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!isLoggedIn()) {
                e.preventDefault();
                openLoginModal();
            }
        });
    });
});

// معالجة URL parameters للتأكيد والاستعادة
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    
    // معالجة تأكيد البريد الإلكتروني
    if (params.get('confirmation_token')) {
        if (window.netlifyIdentity) {
            window.netlifyIdentity.confirm(params.get('confirmation_token'));
        }
    }
    
    // معالجة استعادة كلمة المرور
    if (params.get('recovery_token')) {
        if (window.netlifyIdentity) {
            window.netlifyIdentity.recover(params.get('recovery_token'));
        }
    }
    
    // معالجة دعوة المستخدم
    if (params.get('invite_token')) {
        if (window.netlifyIdentity) {
            window.netlifyIdentity.acceptInvite(params.get('invite_token'));
        }
    }
});

// إضافة أنماط CSS مخصصة لـ Identity Widget
const identityStyles = `
    .netlify-identity-widget {
        font-family: 'Cairo', 'Tajawal', sans-serif !important;
        direction: rtl !important;
    }
    
    .netlify-identity-widget .netlify-identity-widget-container {
        direction: rtl !important;
        text-align: right !important;
    }
    
    .netlify-identity-widget input {
        text-align: right !important;
        direction: rtl !important;
    }
    
    .netlify-identity-widget button {
        font-family: 'Cairo', sans-serif !important;
    }
`;

// إضافة الأنماط إلى الصفحة
const styleSheet = document.createElement('style');
styleSheet.textContent = identityStyles;
document.head.appendChild(styleSheet);

