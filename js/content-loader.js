/**
 * content-loader.js - وظائف تحميل المحتوى من ملفات JSON لموقع سطحة هيدروليك
 */

// متغيرات عامة
const servicesContainer = document.getElementById('services-container');
const contactInfoContainer = document.getElementById('contact-info');
const socialLinksContainer = document.getElementById('social-links');
const copyrightContainer = document.getElementById('copyright');

// دالة تهيئة تحميل المحتوى
function initializeContentLoader() {
    try {
        // تحميل بيانات الموقع
        loadSiteData();
        
        // تحميل الخدمات
        loadServices();
        
        // تحميل معلومات التذييل
        loadFooterData();
        
        // الأزرار العائمة الآن ثابتة في HTML - لا حاجة للتحميل الديناميكي
        console.log('✅ Floating buttons are now static in HTML');
    } catch (error) {
        handleError(error, 'content-loader-initialization');
    }
}

// دالة لتحميل بيانات الموقع
async function loadSiteData() {
    try {
        const response = await fetch('/data/site.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // تحديث عنوان الصفحة
        document.title = data.seo?.title || data.site?.title || 'سطحة هيدروليك';
        
        // تحديث وصف الصفحة
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = data.seo?.description || data.site?.description || '';
        }
        
        // تحديث الكلمات المفتاحية
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.content = data.seo?.keywords || data.site?.keywords || '';
        }
        
        // تحديث وسوم Open Graph
        updateMetaTag('og:title', data.seo?.ogTitle || data.seo?.title || data.site?.title);
        updateMetaTag('og:description', data.seo?.ogDescription || data.seo?.description || data.site?.description);
        updateMetaTag('og:image', data.seo?.ogImage || data.site?.ogImage);
        
        // تحديث وسوم Twitter Card
        updateMetaTag('twitter:title', data.seo?.twitterTitle || data.seo?.ogTitle || data.seo?.title || data.site?.title);
        updateMetaTag('twitter:description', data.seo?.twitterDescription || data.seo?.ogDescription || data.seo?.description || data.site?.description);
        updateMetaTag('twitter:image', data.seo?.twitterImage || data.seo?.ogImage || data.site?.ogImage);
        
        // تحديث لون الثيم
        updateMetaTag('theme-color', data.site?.themeColor || '#0056b3');
        
        // تحديث الشعار
        const logoImg = document.querySelector('.logo img');
        if (logoImg && data.site?.logo) {
            logoImg.src = data.site.logo;
            logoImg.alt = data.site?.title || 'شعار سطحة هيدروليك';
        }
        
        // تحديث نص الشعار
        const logoText = document.querySelector('.logo span');
        if (logoText) {
            logoText.textContent = data.site?.title || 'سطحة هيدروليك';
        }
        
        // تحديث عنوان القسم الرئيسي
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle) {
            heroTitle.textContent = data.site?.title || 'سطحة هيدروليك';
        }
        
        // تحديث وصف القسم الرئيسي
        const heroDescription = document.querySelector('.hero p');
        if (heroDescription) {
            heroDescription.textContent = data.site?.description || 'خدمات سطحة هيدروليك متميزة وسريعة على مدار الساعة';
        }
        
        console.log('Site data loaded successfully');
    } catch (error) {
        console.error('Error loading site data:', error);
        showNotification('حدث خطأ أثناء تحميل بيانات الموقع', 'error');
    }
}

// دالة لتحميل الخدمات
async function loadServices() {
    try {
        if (!servicesContainer) {
            console.warn('Services container not found');
            return;
        }
        
        const response = await fetch('/data/services.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // تحديث عنوان قسم الخدمات
        const servicesTitle = document.querySelector('.services-title h2');
        if (servicesTitle && data.serviceSettings?.title) {
            servicesTitle.textContent = data.serviceSettings.title;
        }
        
        // تحديث وصف قسم الخدمات
        const servicesDescription = document.querySelector('.services-title p');
        if (servicesDescription && data.serviceSettings?.subtitle) {
            servicesDescription.textContent = data.serviceSettings.subtitle;
        }
        
        // تحديث تخطيط قسم الخدمات
        if (data.serviceSettings?.layout && data.serviceSettings?.itemsPerRow) {
            servicesContainer.style.gridTemplateColumns = `repeat(${data.serviceSettings.itemsPerRow}, 1fr)`;
        }
        
        // مسح المحتوى الحالي
        servicesContainer.innerHTML = '';
        
        // ترتيب الخدمات حسب الترتيب
        const sortedServices = [...data.services].sort((a, b) => a.order - b.order);
        
        // إضافة الخدمات النشطة فقط
        sortedServices.filter(service => service.isActive).forEach(service => {
            const serviceCard = document.createElement('div');
            serviceCard.className = 'service-card';
            
            let serviceHTML = '';
            
            // إضافة صورة الخدمة إذا كانت متاحة ومفعلة
            if (service.image && data.serviceSettings?.showImages) {
                serviceHTML += `
                    <img src="${service.image}" alt="${service.title}" class="service-image">
                `;
            }
            
            serviceHTML += `
                <div class="service-content">
                    <h3 class="service-title">
            `;
            
            // إضافة أيقونة الخدمة إذا كانت متاحة ومفعلة
            if (service.icon && data.serviceSettings?.showIcons) {
                serviceHTML += `<span class="service-icon">${service.icon}</span> `;
            }
            
            serviceHTML += `
                        ${service.title}
                    </h3>
                    <p class="service-description">${service.description}</p>
                </div>
            `;
            
            serviceCard.innerHTML = serviceHTML;
            servicesContainer.appendChild(serviceCard);
        });
        
        console.log('Services loaded successfully');
    } catch (error) {
        console.error('Error loading services:', error);
        showNotification('حدث خطأ أثناء تحميل الخدمات', 'error');
        
        // إضافة محتوى بديل في حالة الخطأ
        if (servicesContainer) {
            servicesContainer.innerHTML = `
                <div class="service-card">
                    <div class="service-content">
                        <h3 class="service-title">سحب السيارات</h3>
                        <p class="service-description">خدمة سحب السيارات المعطلة أو المتضررة بسرعة وأمان إلى الوجهة المطلوبة</p>
                    </div>
                </div>
                <div class="service-card">
                    <div class="service-content">
                        <h3 class="service-title">نقل السيارات</h3>
                        <p class="service-description">خدمة نقل السيارات من مكان لآخر بكل احترافية وأمان تام</p>
                    </div>
                </div>
                <div class="service-card">
                    <div class="service-content">
                        <h3 class="service-title">المساعدة على الطريق</h3>
                        <p class="service-description">خدمات المساعدة على الطريق في حالات الطوارئ على مدار الساعة</p>
                    </div>
                </div>
            `;
        }
    }
}

// دالة لتحميل معلومات التذييل
async function loadFooterData() {
    try {
        const response = await fetch('/data/footer.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // تحميل معلومات الاتصال
        if (contactInfoContainer && data.contactInfo) {
            // مسح المحتوى الحالي
            contactInfoContainer.innerHTML = '';
            
            // ترتيب معلومات الاتصال حسب الترتيب
            const sortedContactInfo = [...data.contactInfo].sort((a, b) => a.order - b.order);
            
            // إضافة معلومات الاتصال النشطة فقط
            sortedContactInfo.filter(item => item.isActive).forEach(item => {
                const contactItem = document.createElement('li');
                
                // تحديد نوع الرابط حسب نوع معلومات الاتصال
                let href = '#';
                if (item.type === 'phone') {
                    href = `tel:${item.value}`;
                } else if (item.type === 'whatsapp') {
                    href = `https://wa.me/${item.value.replace(/\+/g, '')}`;
                } else if (item.type === 'email') {
                    href = `mailto:${item.value}`;
                }
                
                contactItem.innerHTML = `
                    <a href="${href}" target="_blank" rel="noopener">
                        <i class="${item.icon || item.type}"></i>
                        ${item.label}: ${item.value}
                    </a>
                `;
                
                contactInfoContainer.appendChild(contactItem);
            });
        }
        
        // تحميل روابط التواصل الاجتماعي
        if (socialLinksContainer && data.socialMedia) {
            // مسح المحتوى الحالي
            socialLinksContainer.innerHTML = '';
            
            // ترتيب روابط التواصل الاجتماعي حسب الترتيب
            const sortedSocialMedia = [...data.socialMedia].sort((a, b) => a.order - b.order);
            
            // إضافة روابط التواصل الاجتماعي النشطة فقط
            sortedSocialMedia.filter(item => item.isActive).forEach(item => {
                const socialLink = document.createElement('a');
                socialLink.href = item.url;
                socialLink.target = '_blank';
                socialLink.rel = 'noopener';
                socialLink.innerHTML = `<i class="${item.icon || item.platform}"></i>`;
                socialLink.setAttribute('aria-label', item.platform);
                
                socialLinksContainer.appendChild(socialLink);
            });
        }
        
        // تحميل حقوق النشر
        if (copyrightContainer && data.footer) {
            let copyrightText = '';
            
            if (data.footer.showCopyright) {
                copyrightText += data.footer.copyright || 'جميع الحقوق محفوظة';
            }
            
            if (data.footer.showYear) {
                const year = data.footer.year || new Date().getFullYear();
                copyrightText += ` © ${year} `;
            }
            
            copyrightText += data.footer.companyName || 'سطحة هيدروليك';
            
            copyrightContainer.textContent = copyrightText;
            
            // تطبيق ألوان التذييل
            const footer = document.querySelector('.footer');
            if (footer) {
                const isDarkMode = document.body.classList.contains('dark-mode');
                
                if (isDarkMode && data.footer.darkBackgroundColor) {
                    footer.style.backgroundColor = data.footer.darkBackgroundColor;
                } else if (!isDarkMode && data.footer.backgroundColor) {
                    footer.style.backgroundColor = data.footer.backgroundColor;
                }
                
                if (isDarkMode && data.footer.darkTextColor) {
                    footer.style.color = data.footer.darkTextColor;
                } else if (!isDarkMode && data.footer.textColor) {
                    footer.style.color = data.footer.textColor;
                }
            }
        }
        
        console.log('Footer data loaded successfully');
    } catch (error) {
        console.error('Error loading footer data:', error);
        
        // إضافة محتوى بديل في حالة الخطأ
        if (contactInfoContainer) {
            contactInfoContainer.innerHTML = `
                <li><i class="phone"></i> رقم الهاتف: +966500000000</li>
                <li><i class="whatsapp"></i> واتساب: +966500000000</li>
                <li><i class="email"></i> البريد الإلكتروني: info@hydraulic-tow-truck.com</li>
            `;
        }
        
        if (socialLinksContainer) {
            socialLinksContainer.innerHTML = `
                <a href="https://facebook.com/" target="_blank" rel="noopener"><i class="facebook"></i></a>
                <a href="https://twitter.com/" target="_blank" rel="noopener"><i class="twitter"></i></a>
                <a href="https://instagram.com/" target="_blank" rel="noopener"><i class="instagram"></i></a>
            `;
        }
        
        if (copyrightContainer) {
            copyrightContainer.textContent = `جميع الحقوق محفوظة © ${new Date().getFullYear()} سطحة هيدروليك`;
        }
    }
}

// دالة لتحميل الأزرار العائمة
async function loadFloatingButtons() {
    try {
        console.log('🔄 Starting to load floating buttons...');
        
        const floatingButtonsContainer = document.getElementById('floating-buttons');
        if (!floatingButtonsContainer) {
            console.error('❌ Floating buttons container not found');
            return;
        }
        
        console.log('✅ Floating buttons container found:', floatingButtonsContainer);
        
        const response = await fetch('/data/buttons.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Buttons data loaded:', data);
        
        // مسح المحتوى الحالي
        floatingButtonsContainer.innerHTML = '';
        
        // التحقق من وجود البيانات
        if (!data.floatingButtons || !Array.isArray(data.floatingButtons)) {
            throw new Error('Invalid buttons data structure');
        }
        
        // ترتيب الأزرار حسب الترتيب
        const sortedButtons = [...data.floatingButtons].sort((a, b) => a.order - b.order);
        console.log('📋 Sorted buttons:', sortedButtons);
        
        // إضافة الأزرار النشطة فقط
        const activeButtons = sortedButtons.filter(button => button.isActive);
        console.log('🎯 Active buttons:', activeButtons);
        
        if (activeButtons.length === 0) {
            console.warn('⚠️ No active buttons found');
            return;
        }
        
        activeButtons.forEach((button, index) => {
            console.log(`🔨 Creating button ${index + 1}:`, button);
            
            const buttonElement = document.createElement('a');
            buttonElement.href = button.action;
            buttonElement.className = `floating-button ${button.type} ${button.position}`;
            buttonElement.style.backgroundColor = button.color || '';
            buttonElement.style.position = 'fixed';
            buttonElement.style.zIndex = '1000';
            buttonElement.style.textDecoration = 'none';
            buttonElement.style.display = 'flex';
            buttonElement.style.alignItems = 'center';
            buttonElement.style.justifyContent = 'center';
            buttonElement.style.width = '60px';
            buttonElement.style.height = '60px';
            buttonElement.style.borderRadius = '50%';
            buttonElement.style.color = 'white';
            buttonElement.style.fontSize = '24px';
            buttonElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            buttonElement.style.transition = 'transform 0.3s ease';
            
            // إضافة الأيقونة إذا كانت مفعلة
            if (data.buttonSettings?.showIcon && button.icon) {
                buttonElement.innerHTML += button.icon;
            }
            
            // إضافة النص إذا كان مفعلاً (مخفي افتراضياً للأزرار الدائرية)
            if (data.buttonSettings?.showText && button.text) {
                buttonElement.innerHTML += ` <span class="button-text" style="display: none;">${button.text}</span>`;
            }
            
            // إضافة الموضع
            if (button.position === 'bottom-right') {
                buttonElement.style.bottom = '20px';
                buttonElement.style.right = '20px';
            } else if (button.position === 'bottom-left') {
                buttonElement.style.bottom = '20px';
                buttonElement.style.left = '20px';
            }
            
            // إضافة تأثير hover
            buttonElement.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
            });
            
            buttonElement.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
            
            // إضافة title للوصولية
            buttonElement.title = button.text || button.type;
            
            floatingButtonsContainer.appendChild(buttonElement);
            console.log(`✅ Button ${index + 1} added to container:`, buttonElement);
        });
        
        console.log('🎉 Floating buttons loaded successfully');
        console.log('📄 Container final content:', floatingButtonsContainer.innerHTML);
        
        // التحقق من أن الأزرار مرئية
        setTimeout(() => {
            const buttons = floatingButtonsContainer.querySelectorAll('.floating-button');
            console.log(`🔍 Found ${buttons.length} buttons in DOM`);
            buttons.forEach((btn, i) => {
                const rect = btn.getBoundingClientRect();
                console.log(`Button ${i + 1} position:`, {
                    visible: rect.width > 0 && rect.height > 0,
                    position: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
                });
            });
        }, 100);
        
    } catch (error) {
        console.error('❌ Error loading floating buttons:', error);
        
        // إضافة أزرار بديلة في حالة الخطأ
        const floatingButtonsContainer = document.getElementById('floating-buttons');
        if (floatingButtonsContainer) {
            console.log('🔧 Adding fallback buttons...');
            floatingButtonsContainer.innerHTML = `
                <a href="tel:+966500000000" 
                   class="floating-button call" 
                   style="position: fixed; bottom: 20px; right: 20px; background-color: #28a745; z-index: 1000; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; text-decoration: none; font-size: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"
                   title="اتصل بنا">📞</a>
                <a href="https://wa.me/966500000000" 
                   class="floating-button whatsapp" 
                   style="position: fixed; bottom: 20px; left: 20px; background-color: #25d366; z-index: 1000; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; text-decoration: none; font-size: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"
                   title="واتساب">💬</a>
            `;
            console.log('✅ Fallback buttons added');
        }
    }
}

// دالة لتحديث وسوم Meta
function updateMetaTag(name, content) {
    if (!content) return;
    
    let metaTag;
    
    // التحقق من نوع الوسم (property أو name)
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
        metaTag = document.querySelector(`meta[property="${name}"]`);
        
        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.setAttribute('property', name);
            document.head.appendChild(metaTag);
        }
    } else {
        metaTag = document.querySelector(`meta[name="${name}"]`);
        
        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.setAttribute('name', name);
            document.head.appendChild(metaTag);
        }
    }
    
    metaTag.setAttribute('content', content);
}

// تهيئة تحميل المحتوى عند تحميل المستند
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeContentLoader();
    } catch (error) {
        handleError(error, 'content-loader');
    }
});

