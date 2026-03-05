// About Page Interactive Navigation & Slideshow
document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // NAVIGATION SYSTEM
    // ========================================
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Hide all sections initially except the first one
    contentSections.forEach((section, index) => {
        if (index !== 0) {
            section.style.display = 'none';
        }
    });
    
    // Add click event listeners to navigation buttons
    navButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all content sections
            contentSections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show the corresponding content section
            if (contentSections[index]) {
                contentSections[index].style.display = 'block';
                contentSections[index].scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }
        });
    });
    
    // Set the first button as active by default
    if (navButtons.length > 0) {
        navButtons[0].classList.add('active');
    }

    // ========================================
    // SLIDESHOW FUNCTIONALITY
    // ========================================
    const slideshows = document.querySelectorAll('.slideshow-container');
    
    slideshows.forEach(slideshow => {
        const wrapper = slideshow.querySelector('.slideshow-wrapper');
        const images = slideshow.querySelectorAll('.slideshow-wrapper img');
        const dotsContainer = slideshow.querySelector('.slideshow-dots');
        
        if (!wrapper || images.length === 0) return;
        
        let currentSlide = 0;
        let slideInterval;
        let isPlaying = true;
        
        // Create navigation dots
        function createDots() {
            if (!dotsContainer) return;
            
            dotsContainer.innerHTML = '';
            images.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = 'dot';
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.setAttribute('data-slide', index);
                
                if (index === 0) {
                    dot.classList.add('active');
                }
                
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
        }
        
        // Update slideshow display
        function updateSlideshow() {
            const offset = -currentSlide * 100;
            wrapper.style.transform = `translateX(${offset}%)`;
            
            // Update active dot
            const dots = slideshow.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
                dot.setAttribute('aria-pressed', index === currentSlide ? 'true' : 'false');
            });
            
            // Update screen reader announcement
            announceSlide();
        }
        
        // Go to specific slide
        function goToSlide(slideIndex) {
            if (slideIndex >= 0 && slideIndex < images.length) {
                currentSlide = slideIndex;
                updateSlideshow();
                resetInterval();
            }
        }
        
        // Next slide
        function nextSlide() {
            currentSlide = (currentSlide + 1) % images.length;
            updateSlideshow();
        }
        
        // Previous slide
        function prevSlide() {
            currentSlide = (currentSlide - 1 + images.length) % images.length;
            updateSlideshow();
        }
        
        // Auto-play functionality
        function startSlideshow() {
            if (images.length > 1) {
                slideInterval = setInterval(nextSlide, 4000); // 4 seconds
                isPlaying = true;
            }
        }
        
        function stopSlideshow() {
            if (slideInterval) {
                clearInterval(slideInterval);
                slideInterval = null;
                isPlaying = false;
            }
        }
        
        function resetInterval() {
            stopSlideshow();
            startSlideshow();
        }
        
        // Screen reader announcement
        function announceSlide() {
            const currentImage = images[currentSlide];
            if (currentImage) {
                const altText = currentImage.alt || `Image ${currentSlide + 1} of ${images.length}`;
                // Create live region for screen readers
                let liveRegion = slideshow.querySelector('.slideshow-live-region');
                if (!liveRegion) {
                    liveRegion = document.createElement('div');
                    liveRegion.className = 'slideshow-live-region sr-only';
                    liveRegion.setAttribute('aria-live', 'polite');
                    liveRegion.setAttribute('aria-atomic', 'true');
                    slideshow.appendChild(liveRegion);
                }
                liveRegion.textContent = `${altText}. Slide ${currentSlide + 1} of ${images.length}`;
            }
        }
        
        // Touch/Swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        function handleTouchStart(e) {
            touchStartX = e.changedTouches[0].screenX;
        }
        
        function handleTouchEnd(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide(); // Swipe left - next slide
                } else {
                    prevSlide(); // Swipe right - previous slide
                }
                resetInterval();
            }
        }
        
        // Keyboard navigation
        function handleKeydown(e) {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    prevSlide();
                    resetInterval();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextSlide();
                    resetInterval();
                    break;
                case ' ': // Spacebar
                case 'Enter':
                    e.preventDefault();
                    if (isPlaying) {
                        stopSlideshow();
                    } else {
                        startSlideshow();
                    }
                    break;
                case 'Home':
                    e.preventDefault();
                    goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    goToSlide(images.length - 1);
                    break;
            }
        }
        
        // Pause on hover/focus
        function pauseSlideshow() {
            stopSlideshow();
        }
        
        function resumeSlideshow() {
            if (images.length > 1) {
                startSlideshow();
            }
        }
        
        // Image loading optimization
        function optimizeImageLoading() {
            images.forEach((img, index) => {
                // Add loading attribute for better performance
                if (index === 0) {
                    img.loading = 'eager';
                } else {
                    img.loading = 'lazy';
                }
                
                // Handle image load events
                img.addEventListener('load', function() {
                    this.classList.add('loaded');
                });
                
                // Handle image error events
                img.addEventListener('error', function() {
                    this.alt = 'Image failed to load';
                    console.warn('Slideshow image failed to load:', this.src);
                });
            });
        }
        
        // Intersection Observer for performance
        function setupIntersectionObserver() {
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            if (!isPlaying && images.length > 1) {
                                startSlideshow();
                            }
                        } else {
                            stopSlideshow();
                        }
                    });
                }, {
                    threshold: 0.5
                });
                
                observer.observe(slideshow);
            }
        }
        
        // Initialize slideshow
        function initSlideshow() {
            // Only initialize if there are multiple images
            if (images.length <= 1) {
                if (dotsContainer) dotsContainer.style.display = 'none';
                return;
            }
            
            // Set up image grid for smooth transitions
            wrapper.style.display = 'flex';
            images.forEach(img => {
                img.style.flexShrink = '0';
                img.style.width = '100%';
            });
            
            // Create dots and set up functionality
            createDots();
            optimizeImageLoading();
            setupIntersectionObserver();
            
            // Add event listeners
            slideshow.addEventListener('mouseenter', pauseSlideshow);
            slideshow.addEventListener('mouseleave', resumeSlideshow);
            slideshow.addEventListener('focusin', pauseSlideshow);
            slideshow.addEventListener('focusout', resumeSlideshow);
            slideshow.addEventListener('keydown', handleKeydown);
            
            // Touch events for mobile
            slideshow.addEventListener('touchstart', handleTouchStart, { passive: true });
            slideshow.addEventListener('touchend', handleTouchEnd, { passive: true });
            
            // Set initial state
            wrapper.style.transform = 'translateX(0%)';
            updateSlideshow();
            
            // Start auto-play
            startSlideshow();
            
            // Add ARIA attributes for accessibility
            slideshow.setAttribute('role', 'region');
            slideshow.setAttribute('aria-label', 'Image slideshow');
            wrapper.setAttribute('aria-live', 'polite');
        }
        
        // Initialize this slideshow
        initSlideshow();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            updateSlideshow();
        });
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            stopSlideshow();
        });
    });
    
    // ========================================
    // GLOBAL SLIDESHOW CONTROLS (Optional)
    // ========================================
    
    // Pause all slideshows when user prefers reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const allSlideshows = document.querySelectorAll('.slideshow-container');
        allSlideshows.forEach(slideshow => {
            const wrapper = slideshow.querySelector('.slideshow-wrapper');
            if (wrapper) {
                wrapper.style.transition = 'none';
            }
        });
    }
    
    // Page Visibility API - pause when tab is not visible
    document.addEventListener('visibilitychange', function() {
        const allSlideshows = document.querySelectorAll('.slideshow-container');
        allSlideshows.forEach(slideshow => {
            const images = slideshow.querySelectorAll('.slideshow-wrapper img');
            if (images.length > 1) {
                if (document.hidden) {
                    // Page is hidden, pause slideshows
                    slideshow.dispatchEvent(new Event('mouseenter'));
                } else {
                    // Page is visible, resume slideshows
                    slideshow.dispatchEvent(new Event('mouseleave'));
                }
            }
        });
    });
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Function to manually control slideshow (can be called from HTML)
window.controlSlideshow = function(slideshowId, action, slideIndex) {
    const slideshow = document.getElementById(slideshowId);
    if (!slideshow) return;
    
    const event = new CustomEvent('slideshowControl', {
        detail: { action, slideIndex }
    });
    slideshow.dispatchEvent(event);
};

// Function to get slideshow status
window.getSlideshowStatus = function(slideshowId) {
    const slideshow = document.getElementById(slideshowId);
    if (!slideshow) return null;
    
    const images = slideshow.querySelectorAll('.slideshow-wrapper img');
    const activeDot = slideshow.querySelector('.dot.active');
    const currentIndex = activeDot ? parseInt(activeDot.getAttribute('data-slide')) : 0;
    
    return {
        totalSlides: images.length,
        currentSlide: currentIndex + 1,
        isPlaying: slideshow.classList.contains('playing')
    };
};
