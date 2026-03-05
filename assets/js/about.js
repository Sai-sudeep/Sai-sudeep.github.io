// ============================================================
// ABOUT PAGE — Interactive Navigation & Slideshow
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ----------------------------------------------------------
  // CONFIG
  // ----------------------------------------------------------
  var TOTAL_IMAGES     = 29;
  var IMAGE_PATH       = '/images/';
  var AUTO_INTERVAL_MS = 5000;  // 5 s auto-advance
  var PAUSE_AFTER_MS   = 8000;  // 8 s pause after user action

  // ----------------------------------------------------------
  // SLIDESHOW — inject images into a wrapper
  // ----------------------------------------------------------
  function injectImages(wrapper) {
    if (wrapper.querySelectorAll('img').length > 0) return; // already done
    wrapper.innerHTML = '';
    for (var i = 1; i <= TOTAL_IMAGES; i++) {
      var img     = document.createElement('img');
      img.src     = IMAGE_PATH + i + '.jpg';
      img.alt     = 'Musical performance and artistic expression ' + i;
      img.loading = i === 1 ? 'eager' : 'lazy';
      img.addEventListener('load',  function () { this.classList.add('loaded'); });
      img.addEventListener('error', function () {
        console.warn('Slideshow: failed to load ' + this.src);
      });
      wrapper.appendChild(img);
    }
  }

  // ----------------------------------------------------------
  // SLIDESHOW — build all interactivity for one container.
  //             Must be called AFTER the section is visible
  //             so the wrapper has a real pixel width.
  // ----------------------------------------------------------
  function buildSlideshow(slideshowEl) {
    // Guard: only build once
    if (slideshowEl._slideshowBuilt) {
      // Already built — just reset to slide 0 and restart auto-play
      slideshowEl._slideshowReveal();
      return;
    }

    var wrapper       = slideshowEl.querySelector('.slideshow-wrapper');
    var dotsContainer = slideshowEl.querySelector('.slideshow-dots');
    if (!wrapper) return;

    // 1. Inject images (now that section is visible, widths are real)
    injectImages(wrapper);

    var images = wrapper.querySelectorAll('img');
    if (images.length === 0) return;

    var currentSlide  = 0;
    var slideInterval = null;
    var isPlaying     = false;
    var reducedMotion = window.matchMedia &&
                        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---- Layout ----
    wrapper.style.display    = 'flex';
    wrapper.style.transition = reducedMotion ? 'none'
      : 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    images.forEach(function (img) {
      img.style.flexShrink = '0';
      img.style.width      = '100%';
      img.style.objectFit  = 'cover';
    });

    // ---- Dots ----
    function createDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      images.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.className = i === 0 ? 'dot active' : 'dot';
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.setAttribute('data-slide', i);
        dot.addEventListener('click', function () { goToSlide(i); resetInterval(); });
        dotsContainer.appendChild(dot);
      });
    }

    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.querySelectorAll('.dot').forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentSlide);
        dot.setAttribute('aria-pressed', i === currentSlide ? 'true' : 'false');
      });
    }

    // ---- Navigation ----
    function goToSlide(idx) {
      if (idx < 0 || idx >= images.length) return;
      currentSlide = idx;
      wrapper.style.transform = 'translateX(' + (-currentSlide * 100) + '%)';
      updateDots();
      announceSlide();
    }

    function nextSlide() { goToSlide((currentSlide + 1) % images.length); }
    function prevSlide()  { goToSlide((currentSlide - 1 + images.length) % images.length); }

    // ---- Auto-play ----
    function startAuto() {
      if (images.length <= 1 || slideInterval) return;
      slideInterval = setInterval(nextSlide, AUTO_INTERVAL_MS);
      isPlaying = true;
      slideshowEl.classList.add('playing');
    }

    function stopAuto() {
      clearInterval(slideInterval);
      slideInterval = null;
      isPlaying = false;
      slideshowEl.classList.remove('playing');
    }

    function resetInterval() {
      stopAuto();
      setTimeout(startAuto, PAUSE_AFTER_MS);
    }

    // ---- Live region (screen readers) ----
    function announceSlide() {
      var lr = slideshowEl.querySelector('.slideshow-live-region');
      if (!lr) {
        lr = document.createElement('div');
        lr.className = 'slideshow-live-region';
        lr.setAttribute('aria-live', 'polite');
        lr.setAttribute('aria-atomic', 'true');
        Object.assign(lr.style, {
          position: 'absolute', width: '1px', height: '1px',
          padding: '0', margin: '-1px', overflow: 'hidden',
          clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: '0'
        });
        slideshowEl.appendChild(lr);
      }
      var img = images[currentSlide];
      lr.textContent = (img ? img.alt : '') +
        '. Slide ' + (currentSlide + 1) + ' of ' + images.length;
    }

    // ---- Touch / swipe ----
    var touchStartX = 0;
    slideshowEl.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    slideshowEl.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? nextSlide() : prevSlide();
        resetInterval();
      }
    }, { passive: true });

    // ---- Keyboard ----
    slideshowEl.addEventListener('keydown', function (e) {
      switch (e.key) {
        case 'ArrowLeft':  e.preventDefault(); prevSlide(); resetInterval(); break;
        case 'ArrowRight': e.preventDefault(); nextSlide(); resetInterval(); break;
        case 'Home':       e.preventDefault(); goToSlide(0); resetInterval(); break;
        case 'End':        e.preventDefault(); goToSlide(images.length - 1); resetInterval(); break;
        case ' ':
        case 'Enter':
          e.preventDefault();
          isPlaying ? stopAuto() : startAuto();
          break;
      }
    });

    // ---- Hover pause/resume ----
    slideshowEl.addEventListener('mouseenter', stopAuto);
    slideshowEl.addEventListener('mouseleave', startAuto);
    slideshowEl.addEventListener('focusin',    stopAuto);
    slideshowEl.addEventListener('focusout',   startAuto);

    // ---- Page visibility ----
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stopAuto() : startAuto();
    });

    // ---- Resize — keep transform correct ----
    window.addEventListener('resize', function () {
      wrapper.style.transition = 'none';
      wrapper.style.transform  = 'translateX(' + (-currentSlide * 100) + '%)';
      setTimeout(function () {
        if (!reducedMotion) {
          wrapper.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
      }, 50);
    });

    // ---- ARIA ----
    slideshowEl.setAttribute('role',     'region');
    slideshowEl.setAttribute('tabindex', '0');

    // ---- Hook called every time the section is revealed ----
    slideshowEl._slideshowReveal = function () {
      goToSlide(currentSlide); // re-apply transform now that width is real
      stopAuto();
      startAuto();
    };

    // ---- Hook called when section is hidden ----
    slideshowEl._slideshowHide = stopAuto;

    // ---- Mark as built so we don't rebuild on re-open ----
    slideshowEl._slideshowBuilt = true;

    // ---- First-time init ----
    createDots();
    goToSlide(0);
    startAuto();
  }

  // ----------------------------------------------------------
  // NAVIGATION — buttons toggle content sections.
  //              ALL sections start hidden; none is active
  //              by default until the user clicks a button.
  // ----------------------------------------------------------
  function initNavigation() {
    var navButtons      = document.querySelectorAll('.nav-btn');
    var contentSections = document.querySelectorAll('.content-section');

    if (navButtons.length === 0) return;

    // Hide every section initially — collapsed by default
    contentSections.forEach(function (section) {
      section.style.display = 'none';
    });

    // No button is active until clicked
    navButtons.forEach(function (btn, idx) {
      btn.addEventListener('click', function () {

        // If this button is already active, toggle it off (collapse)
        var alreadyActive = btn.classList.contains('active');

        // Deactivate all buttons and hide all sections
        navButtons.forEach(function (b) { b.classList.remove('active'); });
        contentSections.forEach(function (section) {
          // Stop any slideshow in a section being hidden
          var sw = section.querySelector('.slideshow-container');
          if (sw && typeof sw._slideshowHide === 'function') sw._slideshowHide();
          section.style.display = 'none';
        });

        if (!alreadyActive) {
          // Activate clicked button and show its section
          btn.classList.add('active');
          var target = contentSections[idx];
          if (target) {
            target.style.display = 'block';
            target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // If this section has a slideshow, build (first time) or reveal it
            var slideshowEl = target.querySelector('.slideshow-container');
            if (slideshowEl) {
              // Use a small timeout so the browser has painted display:block
              // and the wrapper has a real pixel width before we set transforms
              setTimeout(function () {
                buildSlideshow(slideshowEl);
              }, 50);
            }
          }
        }
        // If alreadyActive === true, we just collapsed — nothing more to do
      });
    });
  }

  // ----------------------------------------------------------
  // BOOT
  // ----------------------------------------------------------
  initNavigation();

  // ----------------------------------------------------------
  // Public API stubs (backwards compatibility)
  // ----------------------------------------------------------
  window.controlSlideshow = function (slideshowId, action) {
    var el = document.getElementById(slideshowId);
    if (!el) return;
    if (action === 'resume' && el._slideshowReveal) el._slideshowReveal();
    if (action === 'stop'   && el._slideshowHide)   el._slideshowHide();
  };

  window.configureSlideshowSettings = function (settings) {
    console.log('Slideshow settings:', settings);
  };

  window.configureSlideshowSettings({
    autoSlideInterval:     AUTO_INTERVAL_MS,
    pauseAfterInteraction: PAUSE_AFTER_MS
  });

});
