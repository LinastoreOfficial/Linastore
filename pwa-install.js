/**
 * Smart PWA Install Prompt Script - LINA STORE
 * التحديث النهائي لحل مشكلة عدم استجابة الزر الداخلي
 */
let deferredPrompt = null;
const installBanner = document.getElementById('install-banner');

// 1. تسجيل السيرفيس وركر بشكل صحيح ومؤكد
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('Service Worker Registered successfully!');
        // محاولة تحديث الملف بالخلفية فوراً للتزامن
        reg.update();
      })
      .catch(err => console.log('Service Worker Error:', err));
  });
}

// 2. إجبار المتصفح على حفظ حدث التثبيت فور جاهزيته
window.addEventListener('beforeinstallprompt', (e) => {
  // منع النافذة التلقائية العشوائية للمتصفح
  e.preventDefault();
  // تخزين الحدث في المتغير ليعمل عند الضغط
  deferredPrompt = e;
  console.log('PWA system is ready. Native prompt captured!');
});

// 3. معالجة الضغط على الزر الذهبي داخل الصفحة
if (installBanner) {
  installBanner.addEventListener('click', async () => {
    
    // الحالة الأولى: إذا التقط المتصفح الإشارة بنجاح (سيفتح التثبيت فوراً)
    if (deferredPrompt) {
      deferredPrompt.prompt(); // إظهار نافذة التثبيت الرسمية
      
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User installation choice: ${outcome}`);
      
      // إذا وافق المستخدم على التثبيت، نخفي الزر
      if (outcome === 'accepted') {
        installBanner.style.display = 'none';
      }
      deferredPrompt = null;
    } 
    // الحالة الثانية: هواتف الآيفون
    else if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      alert("📥 للتثبيت على الآيفون:\nاضغط على زر المشاركة (Share) في أسفل المتصفح ⎋ ثم اختر 'إضافة إلى الشاشة الرئيسية' ➕");
    } 
    // الحالة الثالثة الاحتياطية المحدثة: إذا كان المتصفح بطيء في التقاط الحدث
    else {
      alert("🚀 نظام التثبيت جاهز ومفعل بموقعك!\n\nبما أن المتصفح متمسك بالكاش؛ يرجى الضغط على زر (⋮) في أعلى اليمين ثم اختيار 'تثبيت التطبيق' لتثبيته في ثانيتين.");
    }
  });
}

// إخفاء الزر تلقائياً إذا تم التثبيت بنجاح بأي طريقة
window.addEventListener('appinstalled', () => {
  if (installBanner) {
    installBanner.style.display = 'none';
  }
  deferredPrompt = null;
  console.log('Lina Store App installed successfully!');
});
