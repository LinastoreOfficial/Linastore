/**
 * Smart PWA Install Prompt Script - LINA STORE
 */
let deferredPrompt;
const installBanner = document.getElementById('install-banner');

// 1. تفعيل الـ Service Worker الرسمي للموقع
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker Registered!', reg))
      .catch(err => console.log('Service Worker Error:', err));
  });
}

// 2. التقاط حدث التثبيت التلقائي ومنعه لإظهار الزر المخصص بدلاً منه
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // إظهار الزر الذهبي للزوار لأن المتصفح جاهز للتثبيت
  if (installBanner) {
    installBanner.style.display = 'block';
  }
});

// 3. تشغيل نافذة التثبيت الرسمية عند الضغط على الزر الذهبي
if (installBanner) {
  installBanner.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      deferredPrompt = null;
      // إخفاء الزر بعد تلبية الطلب
      installBanner.style.display = 'none';
    }
  });
}

// 4. إخفاء الزر نهائياً وبشكل تلقائي في حال كان التطبيق مثبتاً بالفعل لدى الزائر
window.addEventListener('appinstalled', () => {
  if (installBanner) {
    installBanner.style.display = 'none';
  }
  deferredPrompt = null;
});
