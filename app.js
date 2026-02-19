// لازم السطر ده
window.SAGE = window.SAGE || {};

// ✳️ ضع روابطك هنا
const GEE_URLS = {
  free: 'https://eelmadawy399.users.earthengine.app/view/sage-free',
  premium: 'https://eelmadawy399.users.earthengine.app/view/sage---egypt-smart-agricultural-geo-expert'
};

// ✳️ Demo: خليه فاضي دلوقتي (هنركبه بعدين)
const STRIPE_PAY_URL = 'PUT_YOUR_STRIPE_PAYMENT_LINK_HERE';

// ✳️ أكواد تفعيل (Demo للمسابقة)
const VALID_CODES = new Set(['SAGE-2026', 'TEST-PAID-123']);

// -------- Helpers --------
function $(id) {
  return document.getElementById(id);
}

function isMobile() {
  // موبايل/تابلت: افتح نفس التبويب. لابتوب: افتح تبويب جديد.
  return window.matchMedia('(max-width: 768px)').matches;
}

function openSmart(url) {
  if (isMobile()) {
    window.location.href = url; // موبايل: نفس التبويب
  } else {
    window.open(url, '_blank', 'noopener,noreferrer'); // لابتوب: تبويب جديد
  }
}

function setLastPlan(plan) {
  localStorage.setItem('sage_last_plan', plan);
}
function getLastPlan() {
  return localStorage.getItem('sage_last_plan');
}

// -------- Toast --------
SAGE.toast = function (message, duration) {
  const toast = $('toast');
  const msgEl = $('toast-message');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.remove('hidden');

  clearTimeout(SAGE._toastTimer);
  SAGE._toastTimer = setTimeout(() => toast.classList.add('hidden'), duration || 3000);
};

// -------- Router --------
function gotoPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = $(id);
  if (target) target.classList.add('active');
}

// -------- Boot --------
document.addEventListener('DOMContentLoaded', () => {
  // Splash → Home
  setTimeout(() => gotoPage('page-home'), 2500);

  // لو جاي من صفحة دفع Demo (اختياري)
  if (location.hash === '#subscription') {
    gotoPage('page-subscription');
  }

  // زر مجاني
  const btnFree = $('btn-free');
  if (btnFree) {
    btnFree.addEventListener('click', () => {
      setLastPlan('free');
      SAGE.toast('جاري فتح النسخة المجانية...');
      openSmart(GEE_URLS.free);
    });
  }

  // زر "دخول المدفوع" (لسه بيوديك لصفحة إدخال الكود)
  const btnPremium = $('btn-premium');
  if (btnPremium) {
    btnPremium.addEventListener('click', () => {
      gotoPage('page-subscription');
    });
  }

  // زر دفع (Demo)
  const btnPay = $('btn-pay');
  if (btnPay) {
    btnPay.addEventListener('click', () => {
      // لو عملت payment.html لاحقًا: افتحها
      // ده يخلي الديمو شكله احترافي بدل رسالة Stripe
      const hasDemoPayment = true;

      if (hasDemoPayment) {
        window.location.href = './payment.html';
        return;
      }

      // لو عايز Stripe لاحقًا:
      if (!STRIPE_PAY_URL || STRIPE_PAY_URL.includes('PUT_YOUR')) {
        SAGE.toast('الدفع غير مفعّل في الديمو الآن ✅', 3500);
        return;
      }
      window.open(STRIPE_PAY_URL, '_blank', 'noopener,noreferrer');
    });
  }

  // زر تفعيل
  const btnActivate = $('btn-activate');
  if (btnActivate) {
    btnActivate.addEventListener('click', () => {
      const input = $('activation-code');
      const code = ((input && input.value) || '').trim().toUpperCase();
      if (!code) return SAGE.toast('اكتب كود التفعيل أولاً');

      if (VALID_CODES.has(code)) {
        setLastPlan('premium');
        SAGE.toast('تم التفعيل ✅ جاري فتح النسخة المدفوعة...');
        openSmart(GEE_URLS.premium);
      } else {
        SAGE.toast('الكود غير صحيح ❌');
      }
    });
  }

  // زر رجوع
  const btnBack = $('btn-back');
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      gotoPage('page-home');
    });
  }

  // (اختياري) لو عايز تعرض آخر اختيار للمستخدم في التوست
  const last = getLastPlan();
  if (last === 'premium') {
    // لا تعمل redirect تلقائيًا—بس تلميح لطيف
    // SAGE.toast('آخر اختيار: Premium', 1800);
  }
});
