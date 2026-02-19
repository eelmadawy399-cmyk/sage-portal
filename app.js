// لازم السطر ده
window.SAGE = window.SAGE || {};

// ✳️ ضع روابطك هنا
const GEE_URLS = {
  free: 'https://eelmadawy399.users.earthengine.app/view/sage-free',
  premium: 'https://eelmadawy399.users.earthengine.app/view/sage---egypt-smart-agricultural-geo-expert'
};

// ✳️ ضع رابط Stripe Payment Link هنا (اشتراك شهري)
const STRIPE_PAY_URL = 'PUT_YOUR_STRIPE_PAYMENT_LINK_HERE';

// ✳️ أكواد تفعيل (حل Demo للمسابقة)
// لاحقًا نخليها تحقق حقيقي من سيرفر/Firebase
const VALID_CODES = new Set([
  'SAGE-2026',
  'TEST-PAID-123'
]);

SAGE.toast = function (message, duration) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-message');
  msgEl.textContent = message; // ✅ كان عندك خطأ هنا
  toast.classList.remove('hidden');

  clearTimeout(SAGE._toastTimer);
  SAGE._toastTimer = setTimeout(() => toast.classList.add('hidden'), duration || 3000);
};

function gotoPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// تشغيل بعد التحميل
document.addEventListener('DOMContentLoaded', () => {
  // Splash → Home
  setTimeout(() => gotoPage('page-home'), 2500);

  // زر مجاني
  document.getElementById('btn-free').addEventListener('click', () => {
    SAGE.toast('جاري فتح النسخة المجانية...');
    window.location.href = GEE_URLS.free; // ✅ فتح مباشر لتجنب مشاكل iframe
  });

  // زر مدفوع
  document.getElementById('btn-premium').addEventListener('click', () => {
    gotoPage('page-subscription');
  });

  // زر دفع
  document.getElementById('btn-pay').addEventListener('click', () => {
    if (!STRIPE_PAY_URL || STRIPE_PAY_URL.includes('PUT_YOUR')) {
      SAGE.toast('حط رابط Stripe في STRIPE_PAY_URL داخل app.js', 4500);
      return;
    }
    window.open(STRIPE_PAY_URL, '_blank');
  });

  // زر تفعيل
  document.getElementById('btn-activate').addEventListener('click', () => {
    const code = (document.getElementById('activation-code').value || '').trim().toUpperCase();
    if (!code) return SAGE.toast('اكتب كود التفعيل أولاً');

    if (VALID_CODES.has(code)) {
      SAGE.toast('تم التفعيل ✅ جاري فتح المدفوع...');
      window.location.href = GEE_URLS.premium;
    } else {
      SAGE.toast('الكود غير صحيح ❌');
    }
  });

  // رجوع
  document.getElementById('btn-back').addEventListener('click', () => {
    gotoPage('page-home');
  });
});
