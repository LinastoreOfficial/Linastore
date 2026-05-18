/**
 * Smart PWA Install Prompt Script - LINA STORE
 */
let deferredPrompt;
const installBanner = document.getElementById('install-banner');

// 1. تفعيل الـ Service Worker مع نقطة المجلد الرئيسي
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker Registered!', reg))
      .catch(err => console.log('Service Worker Error:', err));
  });
}

// 2. التقاط حدث التثبيت الرسمي للأندرويد
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('Chrome PWA prompt is ready to install!');
});

// 3. معالجة الضغط على الزر الذهبي
if (installBanner) {
  installBanner.addEventListener('click', async () => {
    
    // أولاً: إذا التقط المتصفح الإشارة بنجاح
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      deferredPrompt = null;
      installBanner.style.display = 'none';
    } 
    // ثانياً: إذا كان الزائر يستخدم آيفون (Safari)
    else if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      alert("📥 للتثبيت على الآيفون:\nاضغط على زر المشاركة (Share) في الأسفل ⎋ ثم اختر 'إضافة إلى الشاشة الرئيسية' ➕");
    } 
    // ثالثاً: في حال لم تكتمل دورت التحقق بالخلفية بعد أو التطبيق مثبت بالفعل
    else {
      alert("⏳ جاري تهيئة التثبيت السريع للـ PWA...\nإذا لم تظهر النافذة الرسمية خلال ثوانٍ، يمكنك التثبيت مباشرة بالضغط على (⋮) أعلى المتصفح ثم 'تثبيت التطبيق'.");
    }
  });
}

window.addEventListener('appinstalled', () => {
  if (installBanner) {
    installBanner.style.display = 'none';
  }
  deferredPrompt = null;
});
