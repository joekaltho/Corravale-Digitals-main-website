// --- CONTACT FORM CONFIGURATION ---
// Form submissions are handled securely by FormSubmit.
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/corravaledigital@gmail.com';

// --- UI AND ANIMATIONS ---
const nav = document.getElementById('nav');

window.addEventListener(
  'scroll',
  () => nav.classList.toggle('scrolled', window.scrollY > 12),
  { passive: true }
);

const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

function menu(open) {
  mobileMenu.classList.toggle('open', open);
  menuBtn.classList.toggle('active', open);
  menuBtn.setAttribute('aria-expanded', String(open));
}

menuBtn.addEventListener('click', () => {
  menu(!mobileMenu.classList.contains('open'));
});

mobileMenu.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => menu(false));
});

const theme = document.getElementById('themeToggle');
let saved = null;

try {
  saved = localStorage.getItem('corravale-theme');
} catch (error) {
  // ignore storage access errors
}

if (saved === 'dark' || (!saved && matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.body.classList.add('dark');
}

theme.addEventListener('click', () => {
  document.body.classList.toggle('dark');

  try {
    localStorage.setItem(
      'corravale-theme',
      document.body.classList.contains('dark') ? 'dark' : 'light'
    );
  } catch (error) {
    // ignore storage access errors
  }
});

const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  const question = item.querySelector('.faq-question');
  if (!question) return;

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    faqItems.forEach((faqItem) => faqItem.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
const hasGSAP = typeof gsap !== 'undefined';

if (hasGSAP && typeof ScrollTrigger !== 'undefined' && !reduceMotion) {
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('.reveal').forEach((el) => {
    el.style.transition = 'none';

    const delay = el.classList.contains('delay3')
      ? 0.24
      : el.classList.contains('delay2')
        ? 0.16
        : el.classList.contains('delay1')
          ? 0.08
          : 0;

    gsap.fromTo(
      el,
      { opacity: 0, y: 28, scale: 0.985 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      }
    );
  });
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

if (canHover && !reduceMotion) {
  document.body.classList.add('cursor-ready');

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx;
  let ry = my;

  window.addEventListener('mousemove', (event) => {
    mx = event.clientX;
    my = event.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
  });

  (function animateCursor() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(animateCursor);
  })();

  document.querySelectorAll('a, button, .capability, .member').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
}

if (canHover && !reduceMotion) {
  document.querySelectorAll('.btn, .theme-toggle').forEach((el) => {
    el.addEventListener('mousemove', (event) => {
      const rect = el.getBoundingClientRect();
      const relX = event.clientX - rect.left - rect.width / 2;
      const relY = event.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${relX * 0.28}px, ${relY * 0.35}px)`;
    });

    el.addEventListener('mouseleave', () => {
      if (hasGSAP) {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,.4)' });
      } else {
        el.style.transform = '';
      }
    });
  });
}

if (canHover && !reduceMotion) {
  document.querySelectorAll('.capability, .member').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${py * -6}deg) rotateY(${px * 8}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

const orb = document.querySelector('.orb');
const heroGrid = document.querySelector('.hero-grid');
const heroSection = document.querySelector('.hero');

if (canHover && !reduceMotion && orb && heroSection) {
  heroSection.addEventListener('mousemove', (event) => {
    const rect = heroSection.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    orb.style.transform = `translate3d(${px * -30}px, ${py * -30}px, 0)`;
    if (heroGrid) heroGrid.style.transform = `translate3d(${px * 12}px, ${py * 12}px, 0)`;
  });
}

if (hasGSAP && typeof ScrollTrigger !== 'undefined' && orb && !reduceMotion) {
  gsap.to(orb, {
    y: 120,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
}

const marqueeTrack = document.querySelector('.marquee-track');

if (hasGSAP && marqueeTrack && !reduceMotion) {
  marqueeTrack.style.animation = 'none';
  const width = marqueeTrack.scrollWidth / 2;
  const marqueeTween = gsap.to(marqueeTrack, { x: -width, duration: 22, ease: 'none', repeat: -1 });

  let lastY = window.scrollY;
  let lastT = Date.now();
  let settleTimer;

  window.addEventListener(
    'scroll',
    () => {
      const now = Date.now();
      const dy = Math.abs(window.scrollY - lastY);
      const dt = Math.max(now - lastT, 1);
      const speed = Math.min((dy / dt) * 8, 3);
      marqueeTween.timeScale(1 + speed);
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => marqueeTween.timeScale(1), 250);
      lastY = window.scrollY;
      lastT = now;
    },
    { passive: true }
  );

  marqueeTrack.parentElement.addEventListener('mouseenter', () => marqueeTween.pause());
  marqueeTrack.parentElement.addEventListener('mouseleave', () => marqueeTween.play());
}

// --- TOAST NOTIFICATION UTILITY ---
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
  toast.innerHTML = `<span class="toast-icon" aria-hidden="true">${type === 'success' ? '✓' : '!'}</span><span class="toast-message">${message}</span><span class="toast-progress" aria-hidden="true"></span>`;

  container.appendChild(toast);

  // Trigger animation frame
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// --- CONTACT FORM SUBMISSION & VALIDATION ---
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const honeypot = document.getElementById('website_hp')?.value;
    if (honeypot) {
      showToast('Thank you! Your message has been sent.', 'success');
      contactForm.reset();
      return;
    }

    const emailInput = document.getElementById('contactEmail');
    const messageInput = document.getElementById('contactMessage');
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    [emailInput, messageInput].forEach((input) => {
      input.classList.remove('field-error');
      input.removeAttribute('aria-invalid');
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      showToast('Please add your email address.', 'error');
      markInvalid(emailInput);
      emailInput.focus();
      return;
    }

    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      markInvalid(emailInput);
      emailInput.focus();
      return;
    }

    if (!message) {
      showToast('Tell us a little about your project first.', 'error');
      markInvalid(messageInput);
      messageInput.focus();
      return;
    }

    if (message.length < 10) {
      showToast('Please provide a slightly more detailed message (10+ characters).', 'error');
      markInvalid(messageInput);
      messageInput.focus();
      return;
    }

    if (submitBtn) {
      submitBtn.innerText = 'Sending...';
      submitBtn.disabled = true;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('message', message);
      formData.append('_subject', 'New Project Brief — Corravale Digital');
      formData.append('_template', 'table');
      formData.append('_captcha', 'false');
      formData.append('_honey', '');

      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      if (!response.ok) throw new Error('Form submission failed');

      showToast('Thank you! Your message has been sent to Corravale Digital.', 'success');
      contactForm.reset();
    } catch (error) {
      console.error('Contact form error:', error);
      showToast('Something went wrong. Please try again or email us directly.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.innerText = 'Start the conversation ↗';
        submitBtn.disabled = false;
      }
    }
  });
}

function markInvalid(input) {
  input.classList.add('field-error');
  input.setAttribute('aria-invalid', 'true');
  input.addEventListener('input', () => {
    input.classList.remove('field-error');
    input.removeAttribute('aria-invalid');
  }, { once: true });
}
