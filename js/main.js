/**
 * Vara Farm Haven — Main JavaScript File
 * Handles scroll reveal animations, sticky mobile CTA behavior, and interactive initializations.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 0. Hero Section Parallax Motion Controller
    const initParallaxMotion = () => {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;

        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        let ticking = false;

        const updateHeroParallax = () => {
            const scrolled = window.scrollY;
            const heroHeight = heroSection.offsetHeight;
            if (scrolled <= heroHeight + 100) {
                const translateY = scrolled * 0.3;
                heroSection.style.setProperty('--hero-parallax-y', `${translateY}px`);
            }
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeroParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        if (window.lenis) {
            window.lenis.on('scroll', onScroll);
        }
        updateHeroParallax();
    };

    initParallaxMotion();

    // 0.5. GSAP ScrollTrigger Heading Text Reveal Animations
    const initGsapHeadingReveals = () => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;

        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Sync GSAP ScrollTrigger with Lenis smooth scroll if present
        if (window.lenis) {
            window.lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                window.lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }

        // Query all section headings across the entire website
        const headings = document.querySelectorAll(
            '.hero-heading, .section-heading, .idea-heading, .land-heading, ' +
            '.why-guntas-heading, .connectivity-heading, .amenities-heading, ' +
            '.day-here-heading, .weekend-home-heading, .master-plan-heading, ' +
            '.gallery-heading, .about-heading, .enquiry-heading, .footer-invite-title'
        );

        headings.forEach((heading) => {
            if (heading.getAttribute('data-gsap-initialized')) return;
            heading.setAttribute('data-gsap-initialized', 'true');

            // Preserve inner HTML structure while splitting text nodes into word reveal elements
            const innerHTML = heading.innerHTML;
            const lineHtmls = innerHTML.split(/<br\s*\/?>/i);

            let newContent = '';
            lineHtmls.forEach((lineHtml, lineIdx) => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = lineHtml.trim();

                const processNode = (node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        const words = node.textContent.split(/\s+/).filter(w => w.length > 0);
                        return words.map(w => `<span class="gsap-heading-wrap"><span class="gsap-word-reveal">${w}</span></span>`).join(' ');
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        const tagName = node.tagName.toLowerCase();
                        const attrs = Array.from(node.attributes).map(a => `${a.name}="${a.value}"`).join(' ');
                        const inner = Array.from(node.childNodes).map(processNode).join(' ');
                        return `<${tagName} ${attrs}>${inner}</${tagName}>`;
                    }
                    return '';
                };

                const processedLine = Array.from(tempDiv.childNodes).map(processNode).join(' ');
                newContent += processedLine;
                if (lineIdx < lineHtmls.length - 1) {
                    newContent += '<br>';
                }
            });

            heading.innerHTML = newContent;

            const words = heading.querySelectorAll('.gsap-word-reveal');
            if (words.length === 0) return;

            // Hide words below overflow boundary
            gsap.set(words, {
                y: '115%',
                rotate: 4,
                opacity: 0
            });

            // Animate up as heading scrolls into viewport
            gsap.to(words, {
                y: '0%',
                rotate: 0,
                opacity: 1,
                duration: 1.15,
                ease: 'power3.out',
                stagger: 0.045,
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                }
            });
        });
    };

    initGsapHeadingReveals();


    // 1. Scroll Reveal Observer (Section 31 & 32)
    const revealElements = document.querySelectorAll('.reveal, .image-reveal');

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    const childReveals = entry.target.querySelectorAll('.image-reveal, .reveal');
                    childReveals.forEach(child => child.classList.add('visible'));
                    // Unobserve after animating once for optimal performance
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '150px 0px 100px 0px',
            threshold: 0.01
        });

        revealElements.forEach(el => revealObserver.observe(el));

        // Immediate check for elements already visible or near top of viewport
        const triggerInitialCheck = () => {
            revealElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight + 200 && rect.bottom > -100) {
                    el.classList.add('visible');
                    const childReveals = el.querySelectorAll('.image-reveal, .reveal');
                    childReveals.forEach(child => child.classList.add('visible'));
                }
            });
        };

        triggerInitialCheck();
        setTimeout(triggerInitialCheck, 100);
        setTimeout(triggerInitialCheck, 500);
    }

    // 2. Mobile Sticky CTA handling is managed in js/navigation.js (hides on scroll down & near enquiry section)

    // 3. Stat Number Counter Animation for Land & Pricing (Section 15)
    const statsGrid = document.querySelector('.land-stats-grid');
    if (statsGrid) {
        const animateCounters = (container) => {
            const numbers = container.querySelectorAll('.stat-number');
            numbers.forEach(numEl => {
                if (numEl.getAttribute('data-animated')) return;
                numEl.setAttribute('data-animated', 'true');

                const target = parseFloat(numEl.getAttribute('data-target'));
                const decimals = parseInt(numEl.getAttribute('data-decimals') || '0', 10);
                const duration = 1400;
                const startTime = performance.now();

                const updateCount = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    const currentVal = (target * easeProgress).toFixed(decimals);
                    numEl.textContent = currentVal;

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        numEl.textContent = decimals > 0 ? target.toFixed(decimals) : target.toString();
                    }
                };

                requestAnimationFrame(updateCount);
            });
        };

        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        statsObserver.observe(statsGrid);
    }

    // 4. Connectivity Map Interactive Hover Effects (Section 17)
    const connectivitySection = document.querySelector('#connectivity');
    if (connectivitySection) {
        const connectivityItems = connectivitySection.querySelectorAll('.connectivity-item');

        connectivityItems.forEach(item => {
            const nodeTargetId = item.getAttribute('data-node');

            item.addEventListener('mouseenter', () => {
                connectivityItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                if (nodeTargetId) {
                    const targetNode = connectivitySection.querySelector(`#node-${nodeTargetId}`);
                    const targetInteractiveNode = connectivitySection.querySelector(`#node-${nodeTargetId}-node`);
                    if (targetNode) {
                        targetNode.style.filter = 'drop-shadow(0 0 10px #B0D236)';
                        targetNode.style.transition = 'filter 0.3s ease';
                    }
                    if (targetInteractiveNode) {
                        targetInteractiveNode.style.transform = 'scale(1.25)';
                        targetInteractiveNode.style.transition = 'transform 0.3s ease';
                    }
                }
            });

            item.addEventListener('mouseleave', () => {
                item.classList.remove('active');
                if (nodeTargetId) {
                    const targetNode = connectivitySection.querySelector(`#node-${nodeTargetId}`);
                    const targetInteractiveNode = connectivitySection.querySelector(`#node-${nodeTargetId}-node`);
                    if (targetNode) targetNode.style.filter = '';
                    if (targetInteractiveNode) targetInteractiveNode.style.transform = '';
                }
            });
        });
    }

    // 5. Section 19: A Day Here Horizontal Track Controls
    const dayTrack = document.getElementById('day-here-track');
    const dayPrevBtn = document.getElementById('day-prev');
    const dayNextBtn = document.getElementById('day-next');
    const dayProgressBar = document.getElementById('day-here-progress-bar');

    if (dayTrack) {
        const updateTrackProgress = () => {
            const scrollLeft = dayTrack.scrollLeft;
            const maxScroll = dayTrack.scrollWidth - dayTrack.clientWidth;
            const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
            if (dayProgressBar) {
                const barWidth = Math.max(15, Math.min(100, progress));
                dayProgressBar.style.width = `${barWidth}%`;
            }
        };

        dayTrack.addEventListener('scroll', updateTrackProgress, { passive: true });
        window.addEventListener('resize', updateTrackProgress, { passive: true });
        updateTrackProgress();

        if (dayPrevBtn) {
            dayPrevBtn.addEventListener('click', () => {
                const card = dayTrack.querySelector('.day-card');
                const cardWidth = card ? card.offsetWidth : 360;
                const trackStyle = window.getComputedStyle(dayTrack);
                const gap = parseInt(trackStyle.gap) || 28;
                dayTrack.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
            });
        }

        if (dayNextBtn) {
            dayNextBtn.addEventListener('click', () => {
                const card = dayTrack.querySelector('.day-card');
                const cardWidth = card ? card.offsetWidth : 360;
                const trackStyle = window.getComputedStyle(dayTrack);
                const gap = parseInt(trackStyle.gap) || 28;
                dayTrack.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
            });
        }

        // Drag to scroll implementation for desktop mouse interaction
        let isDown = false;
        let startX;
        let scrollLeftPos;

        dayTrack.addEventListener('mousedown', (e) => {
            isDown = true;
            dayTrack.style.cursor = 'grabbing';
            startX = e.pageX - dayTrack.offsetLeft;
            scrollLeftPos = dayTrack.scrollLeft;
        });

        dayTrack.addEventListener('mouseleave', () => {
            isDown = false;
            dayTrack.style.cursor = 'default';
        });

        dayTrack.addEventListener('mouseup', () => {
            isDown = false;
            dayTrack.style.cursor = 'default';
        });

        dayTrack.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - dayTrack.offsetLeft;
            const walk = (x - startX) * 1.5;
            dayTrack.scrollLeft = scrollLeftPos - walk;
        });
    }

    // 6. Enquiry Form Validation & Submission (Section 45)
    const enquiryForm = document.getElementById('enquiry-form');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // Full Name Validation
            const fullNameInput = document.getElementById('full-name');
            const fullNameGroup = document.getElementById('group-full-name');
            if (!fullNameInput || !fullNameInput.value.trim()) {
                fullNameGroup?.classList.add('is-invalid');
                isValid = false;
            } else {
                fullNameGroup?.classList.remove('is-invalid');
            }

            // Mobile Number Validation (10-digit Indian format check)
            const mobileInput = document.getElementById('mobile-number');
            const mobileGroup = document.getElementById('group-mobile-number');
            const mobileRegex = /^[6-9]\d{9}$/;
            if (!mobileInput || !mobileRegex.test(mobileInput.value.trim())) {
                mobileGroup?.classList.add('is-invalid');
                isValid = false;
            } else {
                mobileGroup?.classList.remove('is-invalid');
            }

            // WhatsApp Number Validation (Optional field, but validate format if entered)
            const whatsappInput = document.getElementById('whatsapp-number');
            const whatsappGroup = document.getElementById('group-whatsapp-number');
            if (whatsappInput && whatsappInput.value.trim().length > 0) {
                if (!mobileRegex.test(whatsappInput.value.trim())) {
                    whatsappGroup?.classList.add('is-invalid');
                    isValid = false;
                } else {
                    whatsappGroup?.classList.remove('is-invalid');
                }
            } else {
                whatsappGroup?.classList.remove('is-invalid');
            }

            if (isValid) {
                const successMsg = document.getElementById('form-success-msg');
                if (successMsg) {
                    successMsg.classList.add('is-visible');
                    enquiryForm.reset();
                    // Smoothly bring success notification into view
                    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        });

        // Clear invalid state on field input change
        const formInputs = enquiryForm.querySelectorAll('.form-input');
        formInputs.forEach(input => {
            input.addEventListener('input', () => {
                const group = input.closest('.form-group');
                if (group) group.classList.remove('is-invalid');
            });
        });
    }
});
