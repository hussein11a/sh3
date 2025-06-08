// identity.js - ملف التحقق من الهوية لـ Netlify CMS

// استدعاء مكتبة Netlify Identity
if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
        if (!user) {
            window.netlifyIdentity.on("login", () => {
                document.location.href = "/admin/";
            });
        }
    });
}

// إعادة توجيه المستخدم بعد تسجيل الخروج
if (window.netlifyIdentity) {
    window.netlifyIdentity.on("logout", () => {
        document.location.href = "/";
    });
}

// تعديل رسائل تسجيل الدخول للغة العربية
if (window.netlifyIdentity && window.netlifyIdentity.store) {
    // تعديل رسائل الخطأ
    window.netlifyIdentity.store.messages = {
        ...window.netlifyIdentity.store.messages,
        errors: {
            ...window.netlifyIdentity.store.messages.errors,
            'identity--unauthorized': 'خطأ في اسم المستخدم أو كلمة المرور',
            'identity--email-not-confirmed': 'يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول',
            'identity--network-error': 'خطأ في الاتصال بالشبكة. يرجى المحاولة مرة أخرى',
            'identity--missing-password': 'يرجى إدخال كلمة المرور',
            'identity--missing-email': 'يرجى إدخال البريد الإلكتروني',
            'identity--invalid-token': 'رمز التحقق غير صالح',
            'identity--confirmation-email-sent': 'تم إرسال رسالة تأكيد إلى بريدك الإلكتروني',
            'identity--request-password-recovery': 'تم إرسال رسالة استعادة كلمة المرور إلى بريدك الإلكتروني',
            'identity--password-recovery-sent': 'تم إرسال رسالة استعادة كلمة المرور إلى بريدك الإلكتروني'
        },
        success: {
            ...window.netlifyIdentity.store.messages.success,
            'identity--logged-in': 'تم تسجيل الدخول بنجاح',
            'identity--logged-out': 'تم تسجيل الخروج بنجاح',
            'identity--confirmed': 'تم تأكيد حسابك بنجاح',
            'identity--password-recovered': 'تم استعادة كلمة المرور بنجاح',
            'identity--password-changed': 'تم تغيير كلمة المرور بنجاح',
            'identity--user-updated': 'تم تحديث معلومات المستخدم بنجاح',
            'identity--user-deleted': 'تم حذف الحساب بنجاح'
        },
        info: {
            ...window.netlifyIdentity.store.messages.info,
            'identity--email-confirmed': 'تم تأكيد بريدك الإلكتروني بنجاح',
            'identity--password-changed': 'تم تغيير كلمة المرور بنجاح',
            'identity--user-updated': 'تم تحديث معلومات المستخدم بنجاح',
            'identity--user-deleted': 'تم حذف الحساب بنجاح',
            'identity--logged-in': 'تم تسجيل الدخول بنجاح',
            'identity--logged-out': 'تم تسجيل الخروج بنجاح'
        }
    };
    
    // تعديل نصوص واجهة المستخدم
    window.netlifyIdentity.store.settings = {
        ...window.netlifyIdentity.store.settings,
        locale: {
            ...window.netlifyIdentity.store.settings.locale,
            login: {
                ...window.netlifyIdentity.store.settings.locale.login,
                button: 'تسجيل الدخول',
                email: 'البريد الإلكتروني',
                password: 'كلمة المرور',
                loading: 'جاري تسجيل الدخول...',
                loggedIn: 'تم تسجيل الدخول',
                loggedOut: 'تم تسجيل الخروج',
                error: 'خطأ في تسجيل الدخول',
                forgotPassword: 'نسيت كلمة المرور؟',
                noAccount: 'ليس لديك حساب؟',
                signUp: 'إنشاء حساب'
            },
            signup: {
                ...window.netlifyIdentity.store.settings.locale.signup,
                button: 'إنشاء حساب',
                email: 'البريد الإلكتروني',
                password: 'كلمة المرور',
                name: 'الاسم',
                loading: 'جاري إنشاء الحساب...',
                error: 'خطأ في إنشاء الحساب',
                success: 'تم إنشاء الحساب بنجاح',
                haveAccount: 'لديك حساب بالفعل؟',
                login: 'تسجيل الدخول'
            },
            forgotPassword: {
                ...window.netlifyIdentity.store.settings.locale.forgotPassword,
                button: 'استعادة كلمة المرور',
                email: 'البريد الإلكتروني',
                loading: 'جاري إرسال رسالة استعادة كلمة المرور...',
                error: 'خطأ في استعادة كلمة المرور',
                success: 'تم إرسال رسالة استعادة كلمة المرور',
                back: 'العودة إلى تسجيل الدخول'
            },
            resetPassword: {
                ...window.netlifyIdentity.store.settings.locale.resetPassword,
                button: 'تعيين كلمة المرور',
                password: 'كلمة المرور الجديدة',
                loading: 'جاري تعيين كلمة المرور...',
                error: 'خطأ في تعيين كلمة المرور',
                success: 'تم تعيين كلمة المرور بنجاح'
            },
            user: {
                ...window.netlifyIdentity.store.settings.locale.user,
                name: 'الاسم',
                email: 'البريد الإلكتروني',
                password: 'كلمة المرور',
                updateButton: 'تحديث المعلومات',
                logoutButton: 'تسجيل الخروج',
                loading: 'جاري تحديث المعلومات...',
                error: 'خطأ في تحديث المعلومات',
                success: 'تم تحديث المعلومات بنجاح'
            }
        }
    };
}

