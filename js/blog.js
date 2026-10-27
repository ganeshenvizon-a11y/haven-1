/**
 * Vara Farm Haven — Blog Page JavaScript
 * Handles reading progress, sticky TOC scrollspy, accessible FAQ accordion,
 * contact form handling & validation, and share tools.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 0. Ensure Blog Navigation Link stays active on Blog Page
    const blogNavLinks = document.querySelectorAll('.nav-link[href*="farmland-for-sale-near-hyderabad"], .nav-link[href*="5-guntas-plot-near-hyderabad-weekend-home"], .nav-link[href*="farm-plot-buying-checklist-7-things-to-verify"], .nav-link[href*="farmland-near-nh-44-location-benefits-connectivity"], .nav-link.blog-nav-active');
    blogNavLinks.forEach(link => link.classList.add('active'));

    // Prevent index.html scrollspy from marking Contact active on blog page
    const contactNavLinks = document.querySelectorAll('.nav-link[href="#enquiry"], .nav-link[href="index.html#enquiry"]');
    const updateActiveNav = () => {
        contactNavLinks.forEach(link => link.classList.remove('active'));
        blogNavLinks.forEach(link => link.classList.add('active'));
    };
    setTimeout(updateActiveNav, 100);
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // 1. Reading Progress Bar
    const progressBar = document.getElementById('blogProgressBar');
    const updateReadingProgress = () => {
        if (!progressBar) return;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight <= 0) return;
        const scrolled = window.scrollY;
        const progress = Math.min(100, Math.max(0, (scrolled / totalHeight) * 100));
        progressBar.style.width = `${progress}%`;
    };

    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    if (window.lenis) {
        window.lenis.on('scroll', updateReadingProgress);
    }
    updateReadingProgress();

    // 2. Interactive FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
        const toggleBtn = item.querySelector('.faq-toggle-btn');
        const collapseBody = item.querySelector('.faq-collapse-body');

        if (!toggleBtn || !collapseBody) return;

        toggleBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close other items (single expand pattern)
            faqItems.forEach((other) => {
                if (other !== item && other.classList.contains('active')) {
                    other.classList.remove('active');
                    const otherBtn = other.querySelector('.faq-toggle-btn');
                    const otherBody = other.querySelector('.faq-collapse-body');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    if (otherBody) otherBody.style.maxHeight = null;
                }
            });

            if (isActive) {
                item.classList.remove('active');
                toggleBtn.setAttribute('aria-expanded', 'false');
                collapseBody.style.maxHeight = null;
            } else {
                item.classList.add('active');
                toggleBtn.setAttribute('aria-expanded', 'true');
                collapseBody.style.maxHeight = collapseBody.scrollHeight + 'px';
            }
        });
    });

    // 3. Table of Contents ScrollSpy
    const tocLinks = document.querySelectorAll('.toc-link');
    const sections = [];

    tocLinks.forEach((link) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                sections.push({ id: targetId, element: targetEl, link: link });
            }
        }
    });

    const updateTocScrollspy = () => {
        if (!sections.length) return;
        const scrollPosition = window.scrollY + 160;

        let activeSection = null;
        for (let i = 0; i < sections.length; i++) {
            const rect = sections[i].element.getBoundingClientRect();
            const top = rect.top + window.scrollY;
            if (scrollPosition >= top) {
                activeSection = sections[i];
            }
        }

        tocLinks.forEach((link) => link.classList.remove('active'));
        if (activeSection) {
            activeSection.link.classList.add('active');
        } else if (sections.length > 0) {
            sections[0].link.classList.add('active');
        }
    };

    window.addEventListener('scroll', updateTocScrollspy, { passive: true });
    if (window.lenis) {
        window.lenis.on('scroll', updateTocScrollspy);
    }
    updateTocScrollspy();

    // 4. Social Sharing & Copy Link
    const copyBtn = document.getElementById('copyArticleLink');
    const toast = document.getElementById('blogToast');

    if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const urlToCopy = window.location.href;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(urlToCopy).then(() => {
                    showToast('Article link copied to clipboard!');
                }).catch(() => {
                    fallbackCopyText(urlToCopy);
                });
            } else {
                fallbackCopyText(urlToCopy);
            }
        });
    }

    const fallbackCopyText = (text) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showToast('Article link copied to clipboard!');
        } catch (err) {
            showToast('Press Ctrl+C to copy URL');
        }
        document.body.removeChild(textArea);
    };

    const showToast = (message) => {
        if (!toast) return;
        const msgSpan = toast.querySelector('.toast-msg');
        if (msgSpan) msgSpan.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    };

    // Social share links auto-populate
    const currentUrl = encodeURIComponent(window.location.href);
    const articleTitle = encodeURIComponent(document.title || 'Farmland for Sale Near Hyderabad: Best Locations to Invest');

    document.querySelectorAll('.btn-share-whatsapp').forEach((btn) => {
        btn.setAttribute('href', `https://api.whatsapp.com/send?text=${articleTitle}%20${currentUrl}`);
    });

    document.querySelectorAll('.btn-share-facebook').forEach((btn) => {
        btn.setAttribute('href', `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`);
    });

    document.querySelectorAll('.btn-share-linkedin').forEach((btn) => {
        btn.setAttribute('href', `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`);
    });

    document.querySelectorAll('.btn-share-twitter').forEach((btn) => {
        btn.setAttribute('href', `https://twitter.com/intent/tweet?text=${articleTitle}&url=${currentUrl}`);
    });

    // 5. Contact / Enquiry Form Field UX
    const enquiryForm = document.getElementById('enquiry-form');
    if (enquiryForm) {
        // Clear invalid states on input
        const formInputs = enquiryForm.querySelectorAll('.form-input');
        formInputs.forEach(input => {
            input.addEventListener('input', () => {
                const group = input.closest('.form-group');
                if (group) group.classList.remove('is-invalid');
            });
            input.addEventListener('change', () => {
                const group = input.closest('.form-group');
                if (group) group.classList.remove('is-invalid');
            });
        });
    }
});
