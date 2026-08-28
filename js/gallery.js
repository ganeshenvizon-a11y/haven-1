/**
 * Vara Farm Haven — Gallery & Lightbox Controller (Section 22)
 * Handles asymmetric bento filtering, View More expander, and fully accessible lightbox modal.
 */

document.addEventListener('DOMContentLoaded', () => {
    const gallerySection = document.getElementById('gallery');
    if (!gallerySection) return;

    const filterBtns = gallerySection.querySelectorAll('.gallery-filter-btn');
    const galleryItems = Array.from(gallerySection.querySelectorAll('.gallery-item'));
    const loadMoreBtn = document.getElementById('gallery-load-more-btn');
    const loadMoreWrapper = document.getElementById('gallery-load-more-wrapper');

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

    const INITIAL_LIMIT = 8;
    let currentFilter = 'all';
    let isExpanded = false;
    let visibleItems = [...galleryItems];
    let currentIndex = 0;

    // ==========================================
    // 1. Layout State Manager (Filter + Limit)
    // ==========================================
    const applyLayoutState = () => {
        const matchingItems = galleryItems.filter(item => {
            const category = item.getAttribute('data-category');
            return currentFilter === 'all' || category === currentFilter;
        });

        galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const matchesFilter = currentFilter === 'all' || category === currentFilter;

            if (!matchesFilter) {
                item.classList.add('is-hidden');
                item.classList.remove('is-collapsed');
                item.style.display = 'none';
                item.style.opacity = '0';
            }
        });

        if (currentFilter === 'all') {
            if (!isExpanded && matchingItems.length > INITIAL_LIMIT) {
                matchingItems.forEach((item, idx) => {
                    if (idx < INITIAL_LIMIT) {
                        item.classList.remove('is-hidden', 'is-collapsed');
                        item.style.display = '';
                        item.style.opacity = '1';
                    } else {
                        item.classList.add('is-collapsed');
                        item.classList.remove('is-hidden');
                        item.style.display = 'none';
                        item.style.opacity = '0';
                    }
                });

                if (loadMoreWrapper) loadMoreWrapper.style.display = 'flex';
                if (loadMoreBtn) {
                    const span = loadMoreBtn.querySelector('span');
                    const svg = loadMoreBtn.querySelector('svg');
                    if (span) span.textContent = 'View More Gallery';
                    if (svg) svg.style.transform = 'rotate(0deg)';
                }
            } else {
                matchingItems.forEach(item => {
                    item.classList.remove('is-hidden', 'is-collapsed');
                    item.style.display = '';
                    item.style.opacity = '1';
                });

                if (loadMoreWrapper) {
                    if (matchingItems.length > INITIAL_LIMIT) {
                        loadMoreWrapper.style.display = 'flex';
                        if (loadMoreBtn) {
                            const span = loadMoreBtn.querySelector('span');
                            const svg = loadMoreBtn.querySelector('svg');
                            if (span) span.textContent = 'Show Less';
                            if (svg) svg.style.transform = 'rotate(180deg)';
                        }
                    } else {
                        loadMoreWrapper.style.display = 'none';
                    }
                }
            }
        } else {
            // Category filter selected: show all matching items directly
            matchingItems.forEach(item => {
                item.classList.remove('is-hidden', 'is-collapsed');
                item.style.display = '';
                item.style.opacity = '1';
            });
            if (loadMoreWrapper) loadMoreWrapper.style.display = 'none';
        }

        // Update active visible items list for Lightbox navigation
        visibleItems = galleryItems.filter(item => {
            const matchesFilter = currentFilter === 'all' || item.getAttribute('data-category') === currentFilter;
            const isNotCollapsed = !item.classList.contains('is-collapsed');
            return matchesFilter && isNotCollapsed;
        });
    };

    // Category Filter tab click handler
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.getAttribute('data-filter');
            isExpanded = false;

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            applyLayoutState();
        });
    });

    // Load More toggle handler
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            applyLayoutState();

            if (!isExpanded) {
                gallerySection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Initialize layout on load
    applyLayoutState();

    // ==========================================
    // 2. Lightbox Modal Controller
    // ==========================================
    const updateLightboxContent = (index) => {
        if (visibleItems.length === 0) return;
        
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
            'roads': 'Infrastructure',
            'greenery': 'Greenery',
            'weekend': 'Villa & Stay',
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

    // Keyboard Shortcuts
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
                showNext();
            } else {
                showPrev();
            }
        }
    };
});

