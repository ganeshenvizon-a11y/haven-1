/**
 * Vara Farm Haven — Lenis Smooth Scroll Controller
 * Seamlessly integrates Lenis smooth scrolling across all page sections without interfering
 * with reveal animations, IntersectionObservers, horizontal tracks, or modal overlays.
 */

(function () {
    // 1. Honor prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || typeof Lenis === 'undefined') {
        return;
    }

    // 2. Initialize Lenis instance with lightweight, responsive settings
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease-out
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        infinite: false,
    });

    // Make lenis globally accessible for other controllers
    window.lenis = lenis;

    // 3. RequestAnimationFrame Loop
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 4. Smooth Anchor Navigation Interception
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        const targetElement = document.querySelector(href);
        if (targetElement) {
            e.preventDefault();

            // Dynamic fixed navbar height calculation
            const navbar = document.querySelector('.navbar');
            const navHeight = navbar ? navbar.offsetHeight : 0;

            // Hero section target offset check
            const offset = (href === '#home' || href === '#top') ? 0 : -navHeight;

            lenis.scrollTo(targetElement, {
                offset: offset,
                duration: 1.2,
                immediate: false
            });
        }
    });

    // 5. Sync Scroll Observer Events for reveal animations and parallax
    lenis.on('scroll', () => {
        // Triggers native window scroll updates to ensure all IntersectionObservers & scroll listeners remain active
        window.dispatchEvent(new Event('scroll'));
    });

    // 6. Handle Mobile Nav Modal (stop lenis when open, start when closed)
    const mobileNavModal = document.querySelector('.mobile-nav-modal');
    if (mobileNavModal) {
        const mobileModalObserver = new MutationObserver(() => {
            if (mobileNavModal.classList.contains('is-open')) {
                lenis.stop();
            } else {
                lenis.start();
            }
        });
        mobileModalObserver.observe(mobileNavModal, { attributes: true, attributeFilter: ['class'] });
    }

    // 7. Handle Gallery Lightbox Modal (stop lenis when open, start when closed)
    const galleryLightbox = document.getElementById('gallery-lightbox');
    if (galleryLightbox) {
        const lightboxObserver = new MutationObserver(() => {
            if (galleryLightbox.classList.contains('is-active')) {
                lenis.stop();
            } else {
                lenis.start();
            }
        });
        lightboxObserver.observe(galleryLightbox, { attributes: true, attributeFilter: ['class'] });
    }
})();
