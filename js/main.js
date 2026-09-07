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
            const lineHtmls = innerHTML.split(/<br[^>]*>/i);

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

    // 4. Connectivity Section Controller (Roadmap Showcase & Modal)
    const connectivitySection = document.querySelector('#connectivity');
    if (connectivitySection) {
        const connectivityItems = connectivitySection.querySelectorAll('.connectivity-item');
        const roadmapModal = document.getElementById('roadmap-modal');
        const expandBtn = document.getElementById('connectivity-map-expand-btn');
        const modalCloseBtn = document.getElementById('roadmap-modal-close-btn');
        const modalBackdrop = document.getElementById('roadmap-modal-backdrop');

        // Corridor Cards Interactive Focus
        connectivityItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                connectivityItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });

            item.addEventListener('click', () => {
                connectivityItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Open Roadmap Fullscreen Lightbox Modal
        const openRoadmapModal = () => {
            if (roadmapModal) {
                roadmapModal.classList.add('active');
                roadmapModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        };

        const closeRoadmapModal = () => {
            if (roadmapModal) {
                roadmapModal.classList.remove('active');
                roadmapModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        };

        if (expandBtn) expandBtn.addEventListener('click', openRoadmapModal);
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeRoadmapModal);
        if (modalBackdrop) modalBackdrop.addEventListener('click', closeRoadmapModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && roadmapModal && roadmapModal.classList.contains('active')) {
                closeRoadmapModal();
            }
        });

        // In-Place Map Zoom & Pan Controller
        const mapWrapper = document.getElementById('connectivity-map-wrapper');
        const mapStage = document.getElementById('roadmap-stage');
        const zoomInBtn = document.getElementById('roadmap-zoom-in');
        const zoomOutBtn = document.getElementById('roadmap-zoom-out');
        const resetBtn = document.getElementById('roadmap-zoom-reset');
        const zoomBadge = document.getElementById('roadmap-zoom-badge');
        const hoverHint = document.getElementById('roadmap-hover-hint');

        if (mapWrapper && mapStage) {
            let zoomLevel = 1;
            const minZoom = 1;
            const maxZoom = 3.5;
            const zoomStep = 0.35;
            let panX = 0;
            let panY = 0;
            let isDragging = false;
            let startX = 0;
            let startY = 0;

            const updateMapTransform = (animate = true) => {
                mapStage.style.transition = (isDragging || !animate) ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1)';
                mapStage.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${zoomLevel})`;

                if (zoomBadge) {
                    zoomBadge.textContent = `${Math.round(zoomLevel * 100)}%`;
                }

                if (zoomInBtn) zoomInBtn.disabled = zoomLevel >= maxZoom;
                if (zoomOutBtn) zoomOutBtn.disabled = zoomLevel <= minZoom;

                if (zoomLevel > 1) {
                    mapWrapper.classList.add('is-zoomed');
                    if (hoverHint) hoverHint.innerHTML = '<i class="fa-solid fa-up-down-left-right"></i> Drag to explore &bull; Double-click to reset';
                } else {
                    mapWrapper.classList.remove('is-zoomed');
                    if (hoverHint) hoverHint.innerHTML = '<i class="fa-solid fa-magnifying-glass-plus"></i> Click +/- or Double-Click to Zoom';
                }
            };

            const clampPan = () => {
                if (zoomLevel <= 1) {
                    panX = 0;
                    panY = 0;
                    return;
                }
                const bounds = mapWrapper.getBoundingClientRect();
                const maxPanX = (bounds.width * (zoomLevel - 1)) / 2 + 60;
                const maxPanY = (bounds.height * (zoomLevel - 1)) / 2 + 60;
                panX = Math.max(-maxPanX, Math.min(maxPanX, panX));
                panY = Math.max(-maxPanY, Math.min(maxPanY, panY));
            };

            const setZoom = (newZoom, targetCenter = null) => {
                const clampedZoom = Math.max(minZoom, Math.min(maxZoom, parseFloat(newZoom.toFixed(2))));
                if (clampedZoom === zoomLevel) return;

                if (targetCenter && clampedZoom > 1) {
                    const rect = mapWrapper.getBoundingClientRect();
                    const mouseX = targetCenter.x - rect.left - rect.width / 2;
                    const mouseY = targetCenter.y - rect.top - rect.height / 2;
                    const zoomRatio = clampedZoom / zoomLevel;
                    panX = mouseX - (mouseX - panX) * zoomRatio;
                    panY = mouseY - (mouseY - panY) * zoomRatio;
                } else if (clampedZoom === 1) {
                    panX = 0;
                    panY = 0;
                }

                zoomLevel = clampedZoom;
                clampPan();
                updateMapTransform(true);
            };

            if (zoomInBtn) {
                zoomInBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    setZoom(zoomLevel + zoomStep);
                });
            }

            if (zoomOutBtn) {
                zoomOutBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    setZoom(zoomLevel - zoomStep);
                });
            }

            if (resetBtn) {
                resetBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    zoomLevel = 1;
                    panX = 0;
                    panY = 0;
                    updateMapTransform(true);
                });
            }

            // Double click to toggle zoom
            mapWrapper.addEventListener('dblclick', (e) => {
                if (e.target.closest('.roadmap-zoom-controls')) return;
                if (zoomLevel > 1) {
                    setZoom(1);
                } else {
                    setZoom(1.8, { x: e.clientX, y: e.clientY });
                }
            });

            // Mouse Drag to Pan
            const onMouseDown = (e) => {
                if (e.target.closest('.roadmap-zoom-controls') || e.target.closest('.btn-map-expand')) return;
                if (zoomLevel <= 1) return;
                isDragging = true;
                startX = e.clientX - panX;
                startY = e.clientY - panY;
                mapWrapper.classList.add('is-dragging');
                e.preventDefault();
            };

            const onMouseMove = (e) => {
                if (!isDragging) return;
                panX = e.clientX - startX;
                panY = e.clientY - startY;
                clampPan();
                updateMapTransform(false);
            };

            const onMouseUp = () => {
                if (!isDragging) return;
                isDragging = false;
                mapWrapper.classList.remove('is-dragging');
                updateMapTransform(true);
            };

            mapWrapper.addEventListener('mousedown', onMouseDown);
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);

            // Touch Drag & Pinch to Pan/Zoom
            let touchStartX = 0;
            let touchStartY = 0;
            let initialPinchDist = 0;
            let initialZoomOnPinch = 1;

            mapWrapper.addEventListener('touchstart', (e) => {
                if (e.target.closest('.roadmap-zoom-controls')) return;
                if (e.touches.length === 1 && zoomLevel > 1) {
                    isDragging = true;
                    touchStartX = e.touches[0].clientX - panX;
                    touchStartY = e.touches[0].clientY - panY;
                    mapWrapper.classList.add('is-dragging');
                } else if (e.touches.length === 2) {
                    isDragging = false;
                    initialPinchDist = Math.hypot(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                    );
                    initialZoomOnPinch = zoomLevel;
                }
            }, { passive: true });

            mapWrapper.addEventListener('touchmove', (e) => {
                if (e.touches.length === 1 && isDragging) {
                    panX = e.touches[0].clientX - touchStartX;
                    panY = e.touches[0].clientY - touchStartY;
                    clampPan();
                    updateMapTransform(false);
                } else if (e.touches.length === 2 && initialPinchDist > 0) {
                    const currentDist = Math.hypot(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                    );
                    const pinchScale = currentDist / initialPinchDist;
                    zoomLevel = Math.max(minZoom, Math.min(maxZoom, parseFloat((initialZoomOnPinch * pinchScale).toFixed(2))));
                    clampPan();
                    updateMapTransform(false);
                }
            }, { passive: true });

            mapWrapper.addEventListener('touchend', (e) => {
                if (e.touches.length === 0) {
                    isDragging = false;
                    initialPinchDist = 0;
                    mapWrapper.classList.remove('is-dragging');
                    updateMapTransform(true);
                }
            }, { passive: true });

            // Wheel zoom with Ctrl or direct scroll on the map
            mapWrapper.addEventListener('wheel', (e) => {
                if (e.ctrlKey) {
                    e.preventDefault();
                    const delta = e.deltaY < 0 ? 0.25 : -0.25;
                    setZoom(zoomLevel + delta, { x: e.clientX, y: e.clientY });
                }
            }, { passive: false });

            // Initial UI state
            updateMapTransform(false);
        }
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

            // Email Validation
            const emailInput = document.getElementById('email');
            const emailGroup = document.getElementById('group-email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
                emailGroup?.classList.add('is-invalid');
                isValid = false;
            } else {
                emailGroup?.classList.remove('is-invalid');
            }

            // Captcha Validation
            const captchaGroup = document.getElementById('group-captcha');
            const captchaResponse = typeof grecaptcha !== 'undefined' ? grecaptcha.getResponse() : '';
            if (!captchaResponse) {
                captchaGroup?.classList.add('is-invalid');
                isValid = false;
            } else {
                captchaGroup?.classList.remove('is-invalid');
            }

            if (!isValid) return;

            const submitBtn = enquiryForm.querySelector('.btn-submit');
            if (submitBtn) submitBtn.disabled = true;

            fetch('/api/contact_validate.php', {
                method: 'POST',
                body: new FormData(enquiryForm)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        enquiryForm.reset();
                        if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
                        window.location.href = 'thank-you.html';
                    } else {
                        alert(data.message || 'Something went wrong. Please try again.');
                        if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
                        if (submitBtn) submitBtn.disabled = false;
                    }
                })
                .catch(() => {
                    alert('Something went wrong. Please try again.');
                    if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
                    if (submitBtn) submitBtn.disabled = false;
                });
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

    // 7. Footer Polaroid Gallery Drag-to-Scroll Controller
    const initFooterGalleryDrag = () => {
        const gallery = document.querySelector('.footer-polaroid-gallery');
        if (!gallery) return;

        let isDown = false;
        let startX = 0;
        let scrollLeftPos = 0;
        let hasMoved = false;

        const handleStart = (e) => {
            isDown = true;
            hasMoved = false;
            gallery.classList.add('is-dragging');
            const pageX = e.pageX || (e.touches && e.touches[0].pageX);
            startX = pageX - gallery.offsetLeft;
            scrollLeftPos = gallery.scrollLeft;
        };

        const handleEnd = () => {
            if (!isDown) return;
            isDown = false;
            gallery.classList.remove('is-dragging');
        };

        const handleMove = (e) => {
            if (!isDown) return;
            const pageX = e.pageX || (e.touches && e.touches[0].pageX);
            if (pageX === undefined) return;

            const x = pageX - gallery.offsetLeft;
            const walk = (x - startX) * 1.5;
            if (Math.abs(walk) > 5) {
                hasMoved = true;
                if (e.cancelable) e.preventDefault();
            }
            gallery.scrollLeft = scrollLeftPos - walk;
        };

        // Mouse Drag Events
        gallery.addEventListener('mousedown', handleStart);
        gallery.addEventListener('mouseleave', handleEnd);
        gallery.addEventListener('mouseup', handleEnd);
        gallery.addEventListener('mousemove', handleMove);

        // Touch Drag Events
        gallery.addEventListener('touchstart', handleStart, { passive: true });
        gallery.addEventListener('touchend', handleEnd, { passive: true });
        gallery.addEventListener('touchmove', handleMove, { passive: false });

        // Prevent accidental card clicks during drag
        gallery.addEventListener('click', (e) => {
            if (hasMoved) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);
    };

    initFooterGalleryDrag();

    // 8. Back to Top Button with Circular Brand Scroll Progress Controller
    const initBackToTop = () => {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;

        const progressCircle = backToTopBtn.querySelector('.back-to-top-circle-progress');
        const circumference = 2 * Math.PI * 21; // ~131.95px

        if (progressCircle) {
            progressCircle.style.strokeDasharray = `${circumference}`;
            progressCircle.style.strokeDashoffset = `${circumference}`;
        }

        const updateScrollProgress = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

            if (scrollHeight > 0) {
                const progress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);
                if (progressCircle) {
                    const offset = circumference - (progress * circumference);
                    progressCircle.style.strokeDashoffset = `${offset}`;
                }
            }

            // Show button after scrolling down 300px
            if (scrollTop > 300) {
                backToTopBtn.classList.add('is-visible');
            } else {
                backToTopBtn.classList.remove('is-visible');
            }
        };

        // Scroll listeners (native scroll and Lenis smooth scroll)
        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        if (window.lenis) {
            window.lenis.on('scroll', updateScrollProgress);
        }

        // Initial progress calculation
        updateScrollProgress();

        // Smooth scroll to top on click
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.lenis) {
                window.lenis.scrollTo(0, { duration: 1.2 });
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    };

    initBackToTop();

    // 9. Floating Contact Widget (Social Media Quick Contact Stack Controller)
    const initFloatingContactWidget = () => {
        const widget = document.getElementById('floating-contact-widget');
        const toggleBtn = document.getElementById('floating-contact-widget-toggle');
        const hideBtn = document.getElementById('floating-contact-widget-hide');
        if (!widget || !toggleBtn) return;

        const links = widget.querySelectorAll('.floating-contact-widget__link');

        const openWidget = () => {
            widget.classList.add('is-open');
            toggleBtn.setAttribute('aria-expanded', 'true');
            toggleBtn.setAttribute('aria-label', 'Close contact options');
            links.forEach((link) => link.setAttribute('tabindex', '0'));
            if (hideBtn) hideBtn.setAttribute('tabindex', '0');
        };

        const closeWidget = () => {
            widget.classList.remove('is-open');
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.setAttribute('aria-label', 'Open contact options');
            links.forEach((link) => link.setAttribute('tabindex', '-1'));
            if (hideBtn) hideBtn.setAttribute('tabindex', '-1');
        };

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (widget.classList.contains('is-open')) {
                closeWidget();
            } else {
                openWidget();
            }
        });

        if (hideBtn) {
            hideBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeWidget();
                toggleBtn.focus();
            });
        }

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (widget.classList.contains('is-open') && !widget.contains(e.target)) {
                closeWidget();
            }
        });

        // Close on Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && widget.classList.contains('is-open')) {
                closeWidget();
                toggleBtn.focus();
            }
        });

        // Trigger pulse animation once after delay
        setTimeout(() => {
            toggleBtn.classList.add('floating-contact-widget__toggle--pulse');
        }, 1500);
    };

    initFloatingContactWidget();
});


