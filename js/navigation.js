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

    // 1. Header Scrolled State
    const handleScroll = () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // 2. Mobile Menu Toggle
    let isMenuOpen = false;

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
