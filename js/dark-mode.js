/**
 * dark-mode.js - وظائف الوضع الليلي والتخصيص الذكي لموقع سطحة هيدروليك
 */

// متغيرات عامة
const DARK_MODE_KEY = 'dark-mode-enabled';
const AUTO_DARK_MODE_KEY = 'auto-dark-mode-enabled';

// دالة تهيئة الوضع الليلي
function initializeDarkMode() {
    try {
        // التحقق من إعدادات الموقع
        fetchSiteSettings().then(settings => {
            const enableDarkMode = settings?.site?.enableDarkMode ?? true;
            const enableAutoDarkMode = settings?.site?.enableAutoDarkMode ?? true;
            
            if (!enableDarkMode) {
                // إذا كان الوضع الليلي غير مفعل في الإعدادات، قم بإخفاء زر التبديل
                themeToggle.style.display = 'none';
                return;
            }
            
            // تحديث حالة الوضع الليلي من التخزين المحلي
            const isDarkMode = getLocalStorageItem(DARK_MODE_KEY, false);
            const isAutoDarkMode = getLocalStorageItem(AUTO_DARK_MODE_KEY, enableAutoDarkMode);
            
            // تطبيق الوضع الليلي إذا كان مفعلاً
            if (isDarkMode) {
                enableDarkMode();
            } else if (isAutoDarkMode) {
                // التحقق من تفضيلات النظام
                checkSystemPreference();
            }
            
            // إضافة مستمع حدث لزر تبديل الوضع
            themeToggle.addEventListener('click', toggleDarkMode);
            
            // إضافة مستمع لتغييرات تفضيلات النظام
            if (isAutoDarkMode) {
                const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                darkModeMediaQuery.addEventListener('change', e => {
                    if (getLocalStorageItem(AUTO_DARK_MODE_KEY, true)) {
                        if (e.matches) {
                            enableDarkMode(false);
                        } else {
                            disableDarkMode(false);
                        }
                    }
                });
            }
        }).catch(error => {
            console.error('Error fetching site settings:', error);
            
            // استخدام القيم الافتراضية في حالة حدوث خطأ
            const isDarkMode = getLocalStorageItem(DARK_MODE_KEY, false);
            const isAutoDarkMode = getLocalStorageItem(AUTO_DARK_MODE_KEY, true);
            
            if (isDarkMode) {
                enableDarkMode();
            } else if (isAutoDarkMode) {
                checkSystemPreference();
            }
            
            themeToggle.addEventListener('click', toggleDarkMode);
        });
    } catch (error) {
        handleError(error, 'dark-mode-initialization');
    }
}

// دالة لتفعيل الوضع الليلي
function enableDarkMode(savePreference = true) {
    body.classList.add('dark-mode');
    themeToggle.innerHTML = '🌙';
    themeToggle.setAttribute('aria-label', 'تبديل إلى الوضع النهاري');
    
    // حفظ التفضيل في التخزين المحلي
    if (savePreference) {
        setLocalStorageItem(DARK_MODE_KEY, true);
    }
    
    // تحديث لون الثيم للمتصفح
    updateThemeColor(true);
}

// دالة لتعطيل الوضع الليلي
function disableDarkMode(savePreference = true) {
    body.classList.remove('dark-mode');
    themeToggle.innerHTML = '☀️';
    themeToggle.setAttribute('aria-label', 'تبديل إلى الوضع الليلي');
    
    // حفظ التفضيل في التخزين المحلي
    if (savePreference) {
        setLocalStorageItem(DARK_MODE_KEY, false);
    }
    
    // تحديث لون الثيم للمتصفح
    updateThemeColor(false);
}

// دالة لتبديل الوضع الليلي
function toggleDarkMode() {
    const isDarkMode = body.classList.contains('dark-mode');
    
    if (isDarkMode) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
    
    // تعطيل الوضع التلقائي عند التبديل اليدوي
    setLocalStorageItem(AUTO_DARK_MODE_KEY, false);
}

// دالة للتحقق من تفضيلات النظام
function checkSystemPreference() {
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDarkMode) {
        enableDarkMode(false);
    } else {
        disableDarkMode(false);
    }
}

// دالة لتحديث لون الثيم للمتصفح
function updateThemeColor(isDarkMode) {
    // الحصول على الألوان من ملف الإعدادات أو استخدام القيم الافتراضية
    fetchSiteSettings().then(settings => {
        const themeColor = isDarkMode 
            ? settings?.site?.darkThemeColor ?? '#2196f3'
            : settings?.site?.themeColor ?? '#0056b3';
        
        // تحديث وسم meta للون الثيم
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', themeColor);
        } else {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            metaThemeColor.content = themeColor;
            document.head.appendChild(metaThemeColor);
        }
    }).catch(error => {
        console.error('Error updating theme color:', error);
        
        // استخدام القيم الافتراضية في حالة حدوث خطأ
        const defaultThemeColor = isDarkMode ? '#2196f3' : '#0056b3';
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', defaultThemeColor);
        }
    });
}

// دالة تهيئة التخصيص الذكي حسب الوقت
function initializeTimeBasedTheme() {
    try {
        // التحقق من إعدادات الموقع
        fetchSiteSettings().then(settings => {
            const enableAutoDarkMode = settings?.site?.enableAutoDarkMode ?? true;
            
            if (!enableAutoDarkMode) {
                return;
            }
            
            // التحقق من حالة الوضع التلقائي
            const isAutoDarkMode = getLocalStorageItem(AUTO_DARK_MODE_KEY, enableAutoDarkMode);
            
            if (isAutoDarkMode) {
                // تطبيق الوضع المناسب حسب الوقت
                applyTimeBasedTheme();
                
                // تحديث الوضع كل ساعة
                setInterval(applyTimeBasedTheme, 60 * 60 * 1000);
            }
        }).catch(error => {
            console.error('Error initializing time-based theme:', error);
        });
    } catch (error) {
        handleError(error, 'time-based-theme');
    }
}

// دالة لتطبيق الوضع المناسب حسب الوقت
function applyTimeBasedTheme() {
    // الحصول على الوقت الحالي
    const currentHour = new Date().getHours();
    
    // تحديد ما إذا كان الوقت ليلاً (من 6 مساءً إلى 6 صباحًا)
    const isNightTime = currentHour < 6 || currentHour >= 18;
    
    // تطبيق الوضع المناسب
    if (isNightTime) {
        enableDarkMode(false);
    } else {
        disableDarkMode(false);
    }
}

// دالة تهيئة وضع توفير البطارية
function initializeBatterySaver() {
    try {
        // التحقق من إعدادات الموقع
        fetchSiteSettings().then(settings => {
            const enableBatterySaver = settings?.site?.enableBatterySaver ?? true;
            
            if (!enableBatterySaver || !('getBattery' in navigator)) {
                return;
            }
            
            // الحصول على حالة البطارية
            navigator.getBattery().then(battery => {
                // تطبيق الوضع الليلي عندما تكون البطارية منخفضة
                if (battery.level <= 0.2 && !battery.charging) {
                    enableDarkMode(false);
                    console.log('Battery saver mode activated');
                }
                
                // إضافة مستمع لتغييرات مستوى البطارية
                battery.addEventListener('levelchange', () => {
                    if (battery.level <= 0.2 && !battery.charging) {
                        enableDarkMode(false);
                        console.log('Battery saver mode activated');
                    }
                });
                
                // إضافة مستمع لتغييرات حالة الشحن
                battery.addEventListener('chargingchange', () => {
                    if (!battery.charging && battery.level <= 0.2) {
                        enableDarkMode(false);
                        console.log('Battery saver mode activated');
                    }
                });
            }).catch(error => {
                console.error('Battery API error:', error);
            });
        }).catch(error => {
            console.error('Error initializing battery saver:', error);
        });
    } catch (error) {
        handleError(error, 'battery-saver');
    }
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
        console.error('Error fetching site settings:', error);
        return null;
    }
}

