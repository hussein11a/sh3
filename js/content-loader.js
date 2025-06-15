/**
 * content-loader.js - وظائف تحميل المحتوى من ملفات JSON لموقع سطحة هيدروليك
 */

// متغيرات عامة
const servicesContainer = document.getElementById("services-container");
const contactInfoContainer = document.getElementById("contact-info");
const socialLinksContainer = document.getElementById("social-links");
const copyrightContainer = document.getElementById("copyright");

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
        handleError(error, "content-loader-initialization");
    }
}

// دالة لتحميل بيانات الموقع
async function loadSiteData() {
    try {
        const response = await fetch("/data/site.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // تحديث عنوان الصفحة
        document.title = data.seo?.title || data.site?.title || "سطحة هيدروليك";
        
        // تحديث وصف الصفحة
        const metaDescription = document.querySelector("meta[name=\"description\"]");
        if (metaDescription) {
            metaDescription.content = data.seo?.description || data.site?.description || "";
        }
        
        // تحديث الكلمات المفتاحية
        const metaKeywords = document.querySelector("meta[name=\"keywords\"]");
        if (metaKeywords) {
            metaKeywords.content = data.seo?.keywords || data.site?.keywords || "";
        }
        
        // تحديث وسوم Open Graph
        updateMetaTag("og:title", data.seo?.ogTitle || data.seo?.title || data.site?.title);
        updateMetaTag("og:description", data.seo?.ogDescription || data.seo?.description || data.site?.description);
        updateMetaTag("og:image", data.seo?.ogImage || data.site?.ogImage);
        
        // تحديث وسوم Twitter Card
        updateMetaTag("twitter:title", data.seo?.twitterTitle || data.seo?.ogTitle || data.seo?.title || data.site?.title);
        updateMetaTag("twitter:description", data.seo?.twitterDescription || data.seo?.ogDescription || data.seo?.description || data.site?.description);
        updateMetaTag("twitter:image", data.seo?.twitterImage || data.seo?.ogImage || data.site?.ogImage);
        
        // تحديث لون الثيم
        updateMetaTag("theme-color", data.site?.themeColor || "#0056b3");
        
        // تحديث الشعار
        const logoImg = document.querySelector(".logo img");
        if (logoImg && data.site?.logo) {
            logoImg.src = data.site.logo;
            logoImg.alt = data.site?.title || "شعار سطحة هيدروليك";
        }
        
        // تحديث نص الشعار
        const logoText = document.querySelector(".logo span");
        if (logoText) {
            logoText.textContent = data.site?.title || "سطحة هيدروليك";
        }
        
        // تحديث عنوان القسم الرئيسي
        const heroTitle = document.querySelector(".hero h1");
        if (heroTitle) {
            heroTitle.textContent = data.site?.title || "سطحة هيدروليك";
        }
        
        // تحديث وصف القسم الرئيسي
        const heroDescription = document.querySelector(".hero p");
        if (heroDescription) {
            heroDescription.textContent = data.site?.description || "خدمات سطحة هيدروليك متميزة وسريعة على مدار الساعة";
        }
        
        console.log("Site data loaded successfully");
    } catch (error) {
        console.error("Error loading site data:", error);
        showNotification("حدث خطأ أثناء تحميل بيانات الموقع", "error");
    }
}

// دالة لتحميل الخدمات
async function loadServices() {
    try {
        if (!servicesContainer) {
            console.warn("Services container not found");
            return;
        }
        
        const response = await fetch("/data/services.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // تحديث عنوان قسم الخدمات
        const servicesTitle = document.querySelector(".services-title h2");
        if (servicesTitle && data.serviceSettings?.title) {
            servicesTitle.textContent = data.serviceSettings.title;
        }
        
        // تحديث وصف قسم الخدمات
        const servicesDescription = document.querySelector(".services-title p");
        if (servicesDescription && data.serviceSettings?.subtitle) {
            servicesDescription.textContent = data.serviceSettings.subtitle;
        }
        
        // تحديث تخطيط قسم الخدمات
        if (data.serviceSettings?.layout && data.serviceSettings?.itemsPerRow) {
            servicesContainer.style.gridTemplateColumns = `repeat(${data.serviceSettings.itemsPerRow}, 1fr)`;
        }
        
        // مسح المحتوى الحالي
        servicesContainer.innerHTML = "";
        
        // ترتيب الخدمات حسب الترتيب
        const sortedServices = [...data.services].sort((a, b) => a.order - b.order);
        
        // إضافة الخدمات النشطة فقط
        sortedServices.filter(service => service.isActive).forEach(service => {
            const serviceCard = document.createElement("div");
            serviceCard.className = "service-card";
            
            let serviceHTML = "";
            
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
                // التحقق مما إذا كانت الأيقونة SVG (تنتهي بـ .svg)
                if (service.icon.endsWith(".svg")) {
                    serviceHTML += `<img src="${service.icon}" alt="${service.title} icon" class="service-icon-svg">`;
                } else {
                    serviceHTML += `<span class="service-icon">${service.icon}</span> `;
                }
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
        
        console.log("Services loaded successfully");
    } catch (error) {
        console.error("Error loading services:", error);
        showNotification("حدث خطأ أثناء تحميل الخدمات", "error");
        
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
        const response = await fetch("/data/footer.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // تحميل معلومات الاتصال
        if (contactInfoContainer && data.contactInfo) {
            // مسح المحتوى الحالي
            contactInfoContainer.innerHTML = "";
            
            // ترتيب معلومات الاتصال حسب الترتيب
            const sortedContactInfo = [...data.contactInfo].sort((a, b) => a.order - b.order);
            
            // إضافة معلومات الاتصال النشطة فقط
            sortedContactInfo.filter(item => item.isActive).forEach(item => {
                const contactItem = document.createElement("li");
                
                // تحديد نوع الرابط حسب نوع معلومات الاتصال
                let href = "#";
                if (item.type === "phone") {
                    href = `tel:${item.value}`;
                } else if (item.type === "whatsapp") {
                    href = `https://wa.me/${item.value.replace(/\+/g, "")}`;
                } else if (item.type === "email") {
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
            socialLinksContainer.innerHTML = "";
            
            // ترتيب روابط التواصل الاجتماعي حسب الترتيب
            const sortedSocialMedia = [...data.socialMedia].sort((a, b) => a.order - b.order);
            
            // إضافة روابط التواصل الاجتماعي النشطة فقط
            sortedSocialMedia.filter(item => item.isActive).forEach(item => {
                const socialLink = document.createElement("a");
                socialLink.href = item.url;
                socialLink.target = "_blank";
                socialLink.rel = "noopener";
                socialLink.innerHTML = `<i class="${item.icon || item.platform}"></i>`;
                socialLink.setAttribute("aria-label", item.platform);
                
                socialLinksContainer.appendChild(socialLink);
            });
        }
        
        // تحميل حقوق النشر
        if (copyrightContainer && data.footer) {
            let copyrightText = "";
            
            if (data.footer.showCopyright) {
                copyrightText += data.footer.copyright || "جميع الحقوق محفوظة";
            }
            
            if (data.footer.showYear) {
                const year = data.footer.year || new Date().getFullYear();
                copyrightText += ` © ${year} `;
            }
            
            copyrightText += data.footer.companyName || "سطحة هيدروليك";
            
            copyrightContainer.textContent = copyrightText;
            
            // تطبيق ألوان التذييل
            const footer = document.querySelector(".footer");
            if (footer) {
                const isDarkMode = document.body.classList.contains("dark-mode");
                
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
        
        console.log("Footer data loaded successfully");
    } catch (error) {
        console.error("Error loading footer data:", error);
        
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
        console.log("🔄 Starting to load floating buttons...");
        
        const floatingButtonsContainer = document.getElementById("floating-buttons");
        if (!floatingButtonsContainer) {
            console.error("❌ Floating buttons container not found");
            return;
        }
        
        console.log("✅ Floating buttons container found:", floatingButtonsContainer);
        
        const response = await fetch("/data/buttons.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("✅ Buttons data loaded:", data);
        
        // مسح المحتوى الحالي
        floatingButtonsContainer.innerHTML = "";
        
        // التحقق من وجود البيانات
        if (!data.floatingButtons || !Array.isArray(data.floatingButtons)) {
            throw new Error("Invalid buttons data structure");
        }
        
        // ترتيب الأزرار حسب الترتيب
        const sortedButtons = [...data.floatingButtons].sort((a, b) => a.order - b.order);
        console.log("📋 Sorted buttons:", sortedButtons);
        
        // إضافة الأزرار النشطة فقط
        const activeButtons = sortedButtons.filter(button => button.isActive);
        console.log("🎯 Active buttons:", activeButtons);
        
        if (activeButtons.length === 0) {
            console.warn("⚠️ No active buttons found");
            return;
        }
        
        activeButtons.forEach((button, index) => {
            console.log(`🔨 Creating button ${index + 1}:`, button);
            
            const buttonElement = document.createElement("a");
            buttonElement.href = button.action;
            buttonElement.className = `floating-button ${button.type} ${button.position}`;
            buttonElement.style.backgroundColor = button.color || "";
            buttonElement.style.position = "fixed";
            buttonElement.style.zIndex = "1000";
            buttonElement.style.textDecoration = "none";
            buttonElement.style.display = "flex";
            buttonElement.style.alignItems = "center";
            buttonElement.style.justifyContent = "center";
            buttonElement.style.width = "60px";
            buttonElement.style.height = "60px";
            buttonElement.style.borderRadius = "50%";
            buttonElement.style.color = "white";
            buttonElement.style.fontSize = "24px";
            buttonElement.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
            buttonElement.style.transition = "transform 0.3s ease";
            
            // إضافة الأيقونة إذا كانت مفعلة
            if (data.buttonSettings?.showIcon && button.icon) {
                // التحقق مما إذا كانت الأيقونة SVG (تنتهي بـ .svg)
                if (button.icon.endsWith(".svg")) {
                    buttonElement.innerHTML = `<img src="${button.icon}" alt="${button.text} icon" style="width: 60%; height: 60%;">`;
                } else {
                    buttonElement.innerHTML = `<i>${button.icon}</i>`;
                }
            }
            
            // إضافة النص إذا كان مفعلًا
            if (data.buttonSettings?.showText && button.text) {
                const textSpan = document.createElement("span");
                textSpan.textContent = button.text;
                textSpan.style.marginLeft = button.icon ? "10px" : "0";
                buttonElement.appendChild(textSpan);
            }
            
            floatingButtonsContainer.appendChild(buttonElement);
        });
        
        console.log("✅ Floating buttons loaded successfully");
    } catch (error) {
        console.error("❌ Error loading floating buttons:", error);
        showNotification("حدث خطأ أثناء تحميل الأزرار العائمة", "error");
    }
}

// دالة مساعدة لتحديث وسوم meta
function updateMetaTag(property, content) {
    let tag = document.querySelector(`meta[property=\"${property}\"]`) || document.querySelector(`meta[name=\"${property}\"]`);
    if (!tag && content) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
    }
    if (tag) {
        tag.content = content || "";
    }
}

// دالة مساعدة لعرض الإشعارات
function showNotification(message, type) {
    // يمكن إضافة منطق لعرض إشعارات للمستخدم هنا
    console.log(`Notification (${type}): ${message}`);
}

// دالة مساعدة لمعالجة الأخطاء
function handleError(error, context) {
    console.error(`An error occurred in ${context}:`, error);
    showNotification(`حدث خطأ غير متوقع: ${error.message}`, "error");
}

// تهيئة تحميل المحتوى عند تحميل DOM بالكامل
document.addEventListener("DOMContentLoaded", initializeContentLoader);


