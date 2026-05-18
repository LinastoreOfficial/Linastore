/**
 * Lina Store - Standard PWA Installer
 */
let deferredPrompt = null;
const installBanner = document.getElementById('install-banner');

// 1. تسجيل السيرفيس وركر
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => console.log(err));
  });
}

// 2. الاستماع لحدث الجاهزية من المتصفح
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('App is ready for direct installation!');
});

// 3. معالجة الضغط على الزر الذهبي
if (installBanner) {
  installBanner.addEventListener('click', async () => {
    
    // إذا كان المتصفح جاهزاً وأطلق الحدث بالخلفية
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        installBanner.style.display = 'none';
      }
      deferredPrompt = null;
    } 
    // إذا لم يطلق الحدث بعد أو كنا على نظام iOS (آيفون)
    else {
      showSmartModal();
    }
  });
}

// نافذة الدعم الإرشادية الفاخرة
function showSmartModal() {
  if (document.getElementById('pwa-smart-modal')) return;
  const isIOS = navigator.userAgent.match(/iPhone|iPad|iPod/i);
  const modal = document.createElement('div');
  modal.id = 'pwa-smart-modal';
  modal.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); display: flex; justify-content: center; align-items: center; z-index: 99999; font-family: 'Segoe UI', sans-serif; opacity: 0; transition: opacity 0.3s ease; direction: rtl;";
  modal.innerHTML = `
    <div style="background: #111; border: 2px solid #D4AF37; width: 85%; max-width: 380px; padding: 25px; border-radius: 16px; text-align: center; box-shadow: 0 10px 30px rgba(212,175,55,0.2);">
      <h3 style="color: #D4AF37; margin-top: 0; font-size: 1.2rem;">📲 تثبيت تطبيق Lina Store</h3>
      <p style="color: #ccc; font-size: 0.9rem; line-height: 1.6; margin: 15px 0;">
        ${isIOS ? 
          'لإضافة التطبيق على جهاز الآيفون الخاص بك:<br><br>1️⃣ اضغط على زر <b>المشاركة (Share)</b> في الأسفل ⎋<br>2️⃣ اختر <b>إضافة إلى الشاشة الرئيسية</b> ➕' : 
          'لتحميل التطبيق سريعاً على الأندرويد:<br><br>1️⃣ اضغط على زر <b>النقاط الثلاث (⋮)</b> أعلى المتصفح.<br>2️⃣ اختر <b>تثبيت التطبيق (Install App)</b> أو إضافة للشاشة الرئيسية.'}
      </p>
      <button id="close-pwa-modal" style="background: #D4AF37; color: #0A0A0A; border: none; padding: 10px 25px; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 10px; width: 100%;">موافق، فهمت</button>
    </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => modal.style.opacity = '1', 50);
  document.getElementById('close-pwa-modal').addEventListener('click', () => {
    modal.style.opacity = '0';
    setTimeout(() => modal.remove(), 300);
  });
}

window.addEventListener('appinstalled', () => {
  if (installBanner) installBanner.style.display = 'none';
  deferredPrompt = null;
});
