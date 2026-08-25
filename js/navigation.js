/**
 * Vara Farm Haven — Navigation & Header Controller
 * Handles header scrolled state, mobile menu toggle, and active section observer.
 */

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNavModal = document.querySelector('.mobile-nav-modal');
    const mobileLinks = document.querySelectorAll('.mobile-nav-modal a');
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    const stickyCta = document.querySelector('.mobile-sticky-cta');
    const heroSection = document.querySelector('.hero') || document.querySelector('#home');
    const enquirySection = document.querySelector('#enquiry');

    let isMenuOpen = false;
    let isHeroVisible = false;
    let isEnquiryVisible = false;
    let lastScrollY = window.scrollY;

    const checkHeroVisibility = () => {
        if (!heroSection) return false;
        const rect = heroSection.getBoundingClientRect();
        return rect.bottom > 50 && rect.top < window.innerHeight;
    };

    // 1. Header & Mobile Sticky CTA Scrolled State & Hide on Scroll Down
    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (navbar) {
            if (currentScrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide header when scrolling down, show when scrolling up
            if (currentScrollY > lastScrollY && currentScrollY > 80 && !isMenuOpen) {
                navbar.classList.add('nav-hidden');
            } else {
                navbar.classList.remove('nav-hidden');
            }
        }

        const heroInView = isHeroVisible || checkHeroVisibility();

        // Hide sticky CTA when at hero section, scrolling down, or when enquiry section is visible
        if (stickyCta) {
            if (heroInView || isEnquiryVisible || (currentScrollY > lastScrollY && currentScrollY > 80)) {
                stickyCta.classList.add('hidden');
            } else {
                stickyCta.classList.remove('hidden');
            }
        }

        lastScrollY = Math.max(0, currentScrollY);
    };

    if (stickyCta) {
        if (heroSection) {
            const heroObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    isHeroVisible = entry.isIntersecting;
                    handleScroll();
                });
            }, { threshold: 0.05 });
            heroObserver.observe(heroSection);
        }

        if (enquirySection) {
            const enquiryObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    isEnquiryVisible = entry.isIntersecting;
                    handleScroll();
                });
            }, { threshold: 0.1 });
            enquiryObserver.observe(enquirySection);
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // 2. Mobile Menu Toggle
    const toggleMobileMenu = () => {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileNavModal.classList.add('is-open');
            if (navbar) navbar.classList.add('mobile-open');
            document.body.style.overflow = 'hidden';
            if (mobileToggle) {
                mobileToggle.setAttribute('aria-expanded', 'true');
            }
        } else {
            mobileNavModal.classList.remove('is-open');
            if (navbar) navbar.classList.remove('mobile-open');
            document.body.style.overflow = '';
            if (mobileToggle) {
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        }
    };

    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMobileMenu();
        });
    });

    // Map each section ID to its top-level parent nav link target
    const sectionToParentMap = {
        'home': '#home',
        'idea': '#home',
        'land': '#land',
        'why-5guntas': '#land',
        'connectivity': '#land',
        'amenities': '#amenities',
        'a-day-here': '#amenities',
        'weekend-home': '#weekend-home',
        'master-plan': '#master-plan',
        'gallery': '#master-plan',
        'about': '#enquiry',
        'enquiry': '#enquiry'
    };

    // 3. Active Section IntersectionObserver
    const sections = document.querySelectorAll('section[id]');

    if (sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = entry.target.getAttribute('id');
                    const parentTarget = sectionToParentMap[activeId] || `#${activeId}`;

                    // Update Top Level Nav Links
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === parentTarget) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });

                    // Update Desktop Dropdown Items
                    dropdownItems.forEach(item => {
                        const href = item.getAttribute('href');
                        if (href === `#${activeId}`) {
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });

                    // Update Mobile Links
                    mobileLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === `#${activeId}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }
});
