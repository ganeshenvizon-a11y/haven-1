/**
 * Vara Farm Haven — Gallery & Lightbox Controller (Section 22)
 * Handles asymmetric masonry filtering and fully accessible lightbox modal.
 */

document.addEventListener('DOMContentLoaded', () => {
    const gallerySection = document.getElementById('gallery');
    if (!gallerySection) return;

    const filterBtns = gallerySection.querySelectorAll('.gallery-filter-btn');
    const galleryItems = Array.from(gallerySection.querySelectorAll('.gallery-item'));
    
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxBadge = document.getElementById('lightbox-badge');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxOverlay = lightbox ? lightbox.querySelector('.lightbox-overlay') : null;

    let visibleItems = [...galleryItems];
    let currentIndex = 0;

    // ==========================================
    // 1. Gallery Category Filtering
    // ==========================================
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Update active tab button state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter items with smooth transition
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('is-hidden');
                    item.style.display = '';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 20);
                } else {
                    item.classList.add('is-hidden');
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });

            // Update visible items array for Lightbox navigation
            visibleItems = galleryItems.filter(item => {
                const cat = item.getAttribute('data-category');
                return filterValue === 'all' || cat === filterValue;
            });
        });
    });

    // ==========================================
    // 2. Lightbox Modal Functions
    // ==========================================
    const updateLightboxContent = (index) => {
        if (visibleItems.length === 0) return;
        
        // Loop index around bounds
        if (index < 0) {
            currentIndex = visibleItems.length - 1;
        } else if (index >= visibleItems.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        const currentItem = visibleItems[currentIndex];
        const img = currentItem.querySelector('img');
        const categoryCode = currentItem.getAttribute('data-category');
        const categoryNames = {
            'aerial': 'Aerial Views',
            'sitedev': 'Site Development',
            'roads': 'Roads',
            'greenery': 'Greenery',
            'weekend': 'Weekend Home',
            'amenities': 'Amenities',
            'masterplan': 'Master Plan',
            'sitevisits': 'Site Visits'
        };
        const badgeText = currentItem.querySelector('.gallery-item-badge')?.textContent || categoryNames[categoryCode] || 'Gallery';
        const titleText = currentItem.querySelector('.gallery-item-title')?.textContent || '';
        const descText = currentItem.querySelector('.gallery-item-sub')?.textContent || '';

        if (lightboxImg && img) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || titleText;
        }

        if (lightboxBadge) lightboxBadge.textContent = badgeText;
        if (lightboxTitle) lightboxTitle.textContent = titleText;
        if (lightboxDesc) lightboxDesc.textContent = descText;
        if (lightboxCounter) lightboxCounter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
    };

    const openLightbox = (itemIndex) => {
        updateLightboxContent(itemIndex);
        if (lightbox) {
            lightbox.classList.add('is-active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            lightboxClose?.focus();
        }
    };

    const closeLightbox = () => {
        if (lightbox) {
            lightbox.classList.remove('is-active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    };

    const showPrev = () => updateLightboxContent(currentIndex - 1);
    const showNext = () => updateLightboxContent(currentIndex + 1);

    // Attach click events to gallery items
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const indexInVisible = visibleItems.indexOf(item);
            if (indexInVisible !== -1) {
                openLightbox(indexInVisible);
            }
        });

        // Keyboard trigger (Enter or Space)
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const indexInVisible = visibleItems.indexOf(item);
                if (indexInVisible !== -1) {
                    openLightbox(indexInVisible);
                }
            }
        });
    });

    // Lightbox Controls Events
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
    if (lightboxNext) lightboxNext.addEventListener('click', showNext);

    // Keyboard Shortcuts for Lightbox Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('is-active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrev();
        } else if (e.key === 'ArrowRight') {
            showNext();
        }
    });

    // Touch Swipe Support for Mobile Lightbox
    let touchStartX = 0;
    let touchEndX = 0;

    if (lightbox) {
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    const handleSwipe = () => {
        const swipeDistance = touchEndX - touchStartX;
        if (Math.abs(swipeDistance) > 40) {
            if (swipeDistance < 0) {
                showNext(); // Swipe left -> Next
            } else {
                showPrev(); // Swipe right -> Prev
            }
        }
    };
});
