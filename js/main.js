/**
 * CLB VÕ THUẬT ĐỨC TÂM MÔN - MAIN SCRIPT
 * Thuần JS, không dependencies, tối ưu hiệu năng và UX.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ------------------------------------------------------------------------
     1. STICKY HEADER & ACTIVE NAV ON SCROLL
     ------------------------------------------------------------------------ */
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('backToTopBtn');

  function handleScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header sticky styling
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Highlight current nav item
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  /* ------------------------------------------------------------------------
     2. MOBILE MENU HAMBURGER & BACKDROP
     ------------------------------------------------------------------------ */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu(forceClose = false) {
    if (!mobileDrawer || !hamburgerBtn || !mobileBackdrop) return;

    const isOpen = forceClose ? true : mobileDrawer.classList.contains('open');

    if (isOpen) {
      mobileDrawer.classList.remove('open');
      hamburgerBtn.classList.remove('active');
      mobileBackdrop.classList.remove('show');
      document.body.style.overflow = '';
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    } else {
      mobileDrawer.classList.add('open');
      hamburgerBtn.classList.add('active');
      mobileBackdrop.classList.add('show');
      document.body.style.overflow = 'hidden';
      hamburgerBtn.setAttribute('aria-expanded', 'true');
    }
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => toggleMobileMenu());
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', () => toggleMobileMenu(true));
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(true));
  });

  /* ------------------------------------------------------------------------
     3. SMOOTH SCROLL WITH OFFSET FOR ANCHOR LINKS
     ------------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ------------------------------------------------------------------------
     4. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('active'));
  }

  /* ------------------------------------------------------------------------
     5. LIGHTBOX GALLERY
     ------------------------------------------------------------------------ */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleryItems = document.querySelectorAll('.gallery-item');

  let currentImageIndex = 0;
  const galleryData = [];

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    const captionEl = item.querySelector('.gallery-caption-text');
    const src = img ? (img.getAttribute('data-full') || img.getAttribute('src')) : '';
    const caption = captionEl ? captionEl.textContent.trim() : (img ? img.getAttribute('alt') : '');

    galleryData.push({ src, caption });

    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    if (!lightboxModal || !lightboxImg || galleryData.length === 0) return;
    currentImageIndex = index;
    updateLightboxContent();
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const data = galleryData[currentImageIndex];
    if (data) {
      lightboxImg.src = data.src;
      lightboxImg.alt = data.caption || 'Hình ảnh CLB Võ thuật Đức Tâm Môn';
      if (lightboxCaption) {
        lightboxCaption.textContent = data.caption || '';
      }
    }
  }

  function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryData.length;
    updateLightboxContent();
  }

  function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  /* ------------------------------------------------------------------------
     6. FORM ĐĂNG KÝ HỌC THỬ & MỞ ZALO VỚI NỘI DUNG SOẠN SẴN
     ------------------------------------------------------------------------ */
  const trialForm = document.getElementById('trialForm');
  const regNotification = document.getElementById('regNotification');
  const regNotificationText = document.getElementById('regNotificationText');

  function showNotification(msg) {
    if (!regNotification) return;
    if (regNotificationText) regNotificationText.textContent = msg;
    regNotification.classList.add('show');
    setTimeout(() => {
      regNotification.classList.remove('show');
    }, 4500);
  }

  if (trialForm) {
    trialForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const nameInput = document.getElementById('regName');
      const phoneInput = document.getElementById('regPhone');
      const disciplineInput = document.getElementById('regDiscipline');
      const timeInput = document.getElementById('regTime');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const discipline = disciplineInput ? disciplineInput.value : 'Võ cổ truyền';
      const preferredTime = timeInput ? timeInput.value.trim() : 'Liên hệ tư vấn';

      if (!name) {
        alert('Vui lòng nhập họ và tên của bạn.');
        if (nameInput) nameInput.focus();
        return;
      }

      if (!phone || !/^(0|\+84)[0-9]{9,10}$/.test(phone.replace(/\s+/g, ''))) {
        alert('Vui lòng nhập số điện thoại hợp lệ (10 chữ số).');
        if (phoneInput) phoneInput.focus();
        return;
      }

      // Soạn nội dung tin nhắn gửi tới Zalo CLB Võ thuật Đức Tâm Môn
      const messageContent = 
`Xin chào CLB Võ thuật Đức Tâm Môn, tôi muốn đăng ký học thử miễn phí:
• Họ và tên: ${name}
• Số điện thoại: ${phone}
• Bộ môn quan tâm: ${discipline}
• Khung giờ mong muốn: ${preferredTime || 'Linh hoạt theo tư vấn'}`;

      // Sao chép nội dung vào bộ nhớ tạm (clipboard) để người dùng chỉ cần dán (Paste) vào Zalo
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(messageContent).then(() => {
          showNotification('Đã sao chép thông tin đăng ký! Đang mở Zalo Võ sư...');
        }).catch(() => {
          fallbackCopyText(messageContent);
        });
      } else {
        fallbackCopyText(messageContent);
      }

      // Mở Zalo trong tab mới sau 700ms để người dùng kịp đọc thông báo
      setTimeout(() => {
        window.open('https://zalo.me/0919793996', '_blank');
      }, 700);
    });
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showNotification('Đã sao chép thông tin đăng ký! Đang mở Zalo Võ sư...');
    } catch (err) {
      showNotification('Đang mở Zalo Võ sư Nguyễn Đình Luân...');
    }
    document.body.removeChild(textArea);
  }

  /* ------------------------------------------------------------------------
     7. IMAGE ERROR FALLBACK (TRÁNH VỠ GIAO DIỆN)
     ------------------------------------------------------------------------ */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      const altText = this.getAttribute('alt') || 'CLB Võ thuật Đức Tâm Môn';
      const parent = this.parentElement;
      if (parent && !parent.classList.contains('brand-logo-wrap')) {
        const placeholder = document.createElement('div');
        placeholder.className = 'img-fallback';
        placeholder.innerHTML = `<span>[ ${altText} ]</span>`;
        parent.replaceChild(placeholder, this);
      }
    });
  });
});
