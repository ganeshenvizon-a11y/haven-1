/**
 * Vara Farm Haven — /gallery Page Controller
 * Data-driven masonry gallery: category filters, image lightbox (reuses the
 * site's existing .gallery-lightbox styles), video cards + video modal.
 *
 * TO REPLACE PLACEHOLDER VIDEOS: update the `videoUrl` field on any entry in
 * `galleryVideos` below (and `heroVideoUrl`) with the final hosted video URL.
 */

document.addEventListener('DOMContentLoaded', () => {
    const gallerySection = document.getElementById('gp-gallery-section');
    if (!gallerySection) return;

    // ==========================================
    // 0. Data — Images, Videos & Category Labels
    // ==========================================
    const PLACEHOLDER_VIDEO_URL = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

    const categoryLabels = {
        aerial: 'Aerial & Site',
        infrastructure: 'Infrastructure',
        greenery: 'Greenery',
        villa: 'Villa & Stay',
        amenities: 'Amenities'
    };

    // Reused verbatim from the Home page gallery's image assets (assets/images/)
    const galleryImages = [
        {
            id: 'img-aerial-view',
            type: 'image',
            category: 'aerial',
            size: 'standard',
            src: 'assets/images/Bird View2_V2_HDExt.webp',
            alt: "Panoramic 3D Bird's Eye View of Vara Farm Haven layout",
            title: 'Aerial View',
            caption: 'Panoramic Farmland & Horizon'
        },
        {
            id: 'img-vara-farm-haven',
            type: 'image',
            category: 'aerial',
            size: 'wide',
            src: 'assets/images/Cover Option1.webp',
            alt: 'Vara Farm Haven Scenic Vista',
            title: 'Vara Farm Haven',
            caption: 'Spacious Plots & Scenic Vista'
        },
        {
            id: 'img-grand-entrance',
            type: 'image',
            category: 'infrastructure',
            size: 'standard',
            src: 'assets/images/Entrance_3_Front-view 2.webp',
            alt: 'Grand Entrance Arch and Gated Security Front View',
            title: 'Grand Entrance',
            caption: 'Secured Front Elevation & Archway'
        },
        {
            id: 'img-tree-lined-roads',
            type: 'image',
            category: 'infrastructure',
            size: 'standard',
            src: 'assets/images/Inside Entrance Gate.webp',
            alt: 'Inside Entrance Gate and internal tree-lined roads',
            title: 'Tree-Lined Roads',
            caption: 'Internal Entry Boulevard'
        },
        {
            id: 'img-highway-connectivity',
            type: 'image',
            category: 'infrastructure',
            size: 'standard',
            src: 'assets/images/NH 44 Highway.webp',
            alt: 'NH 44 Highway approach road',
            title: 'Highway Connectivity',
            caption: 'NH-44 Express Access'
        },
        {
            id: 'img-green-landscapes',
            type: 'image',
            category: 'greenery',
            size: 'wide',
            src: 'assets/images/Pergola VIew1A.webp',
            alt: 'Pergola View and Garden Walkway',
            title: 'Green Landscapes',
            caption: 'Pergola & Garden Walkway'
        },
        {
            id: 'img-lifestyle-community',
            type: 'image',
            category: 'greenery',
            size: 'standard',
            src: 'assets/images/Pargola Park Sitting Woman.webp',
            alt: 'Pergola Park Sitting area',
            title: 'Lifestyle & Community',
            caption: 'Pergola Sitting Park'
        },
        {
            id: 'img-nature-all-around',
            type: 'image',
            category: 'greenery',
            size: 'standard',
            src: 'assets/images/Tree_Fruits.webp',
            alt: 'Organic Fruit Trees',
            title: 'Nature All Around',
            caption: 'Organic Fruit Plantation'
        },
        {
            id: 'img-weekend-home',
            type: 'image',
            category: 'villa',
            size: 'standard',
            src: 'assets/images/Mandala House_Day Mode_Ext.webp',
            alt: 'Mandala House Day Mode Exterior',
            title: 'Weekend Home',
            caption: 'Mandala Farm Villa'
        },
        {
            id: 'img-timber-villa-design',
            type: 'image',
            category: 'villa',
            size: 'standard',
            src: 'assets/images/Mandala House_1.webp',
            alt: 'Mandala House Timber Architecture',
            title: 'Timber Villa Design',
            caption: 'Sustainable Eco Architecture'
        },
        {
            id: 'img-eco-veranda-deck',
            type: 'image',
            category: 'villa',
            size: 'standard',
            src: 'assets/images/Mandala House_2.webp',
            alt: 'Mandala House Veranda and Deck',
            title: 'Eco Veranda & Deck',
            caption: 'Spacious Outdoor Lounging'
        },
        {
            id: 'img-evening-views',
            type: 'image',
            category: 'villa',
            size: 'wide',
            src: 'assets/images/Balcony with Family.webp',
            alt: 'Family Balcony Leisure at Vara Farm Haven',
            title: 'Evening Views',
            caption: 'Balcony Family Moments'
        },
        {
            id: 'img-timber-living-room',
            type: 'image',
            category: 'villa',
            size: 'standard',
            src: 'assets/images/photorealistic-timber-house-interior-with-wooden-decor-furnishings.webp',
            alt: 'Timber House Interior with Wooden Decor',
            title: 'Timber Villa Living Room',
            caption: 'Warm Wooden Décor & Finishes'
        },
        {
            id: 'img-wooden-house-dining',
            type: 'image',
            category: 'villa',
            size: 'standard',
            src: 'assets/images/photorealistic-wooden-house-interior-with-timber-decor-furnishings.webp',
            alt: 'Wooden House Interior Lounge',
            title: 'Wooden House Dining',
            caption: 'Eco-Luxury Furnishings'
        },
        {
            id: 'img-resort-amenities',
            type: 'image',
            category: 'amenities',
            size: 'hero',
            src: 'assets/images/Swimming Pool.webp',
            alt: 'Resort Swimming Pool at Vara Farm Haven',
            title: 'Resort-Style Amenities',
            caption: 'Crystal Swimming Pool & Sun Deck'
        },
        {
            id: 'img-clubhouse-amenities',
            type: 'image',
            category: 'amenities',
            size: 'standard',
            src: 'assets/images/Swimming Pool and House1 (1).webp',
            alt: 'Swimming Pool and Villa Sanctuary',
            title: 'Clubhouse & Amenities',
            caption: 'Poolside Villa Sanctuary'
        },
        {
            id: 'img-childrens-play-zone',
            type: 'image',
            category: 'amenities',
            size: 'standard',
            src: 'assets/images/Play and Pargola Master.webp',
            alt: 'Play and Pergola Master Area',
            title: "Children's Play Zone",
            caption: 'Play & Pergola Master Area'
        },
        {
            id: 'img-adventure-playground',
            type: 'image',
            category: 'amenities',
            size: 'standard',
            src: 'assets/images/Playground_3D_Front View.webp',
            alt: 'Playground 3D Front View',
            title: 'Adventure Playground',
            caption: 'Safe & Fun Kids Play Park'
        }
    ];

    // Placeholder videos — swap `videoUrl` per item once final assets are ready.
    const galleryVideos = [
        {
            id: 'vid-aerial-tour',
            type: 'video',
            category: 'aerial',
            size: 'hero',
            thumbnail: 'assets/images/Bird View2_V2_HDExt.webp',
            title: 'Aerial Tour of Vara Farm Haven',
            duration: '02:18',
            videoUrl: PLACEHOLDER_VIDEO_URL
        },
        {
            id: 'vid-weekend-home-experience',
            type: 'video',
            category: 'villa',
            size: 'wide',
            thumbnail: 'assets/images/Mandala House_Day Mode_Ext.webp',
            title: 'Weekend Home Experience',
            duration: '01:45',
            videoUrl: PLACEHOLDER_VIDEO_URL
        },
        {
            id: 'vid-a-day-at-vfh',
            type: 'video',
            category: 'greenery',
            size: 'wide',
            thumbnail: 'assets/images/Pargola Park Sitting Woman.webp',
            title: 'A Day at Vara Farm Haven',
            duration: '01:32',
            videoUrl: PLACEHOLDER_VIDEO_URL
        },
        {
            id: 'vid-complete-walkthrough',
            type: 'video',
            category: 'aerial',
            size: 'standard',
            thumbnail: 'assets/images/Cover Option1.webp',
            title: 'Complete Project Walkthrough',
            duration: '03:26',
            videoUrl: PLACEHOLDER_VIDEO_URL
        },
        {
            id: 'vid-amenities-tour',
            type: 'video',
            category: 'amenities',
            size: 'standard',
            thumbnail: 'assets/images/Swimming Pool.webp',
            title: 'Amenities Tour',
            duration: '02:14',
            videoUrl: PLACEHOLDER_VIDEO_URL
        },
        {
            id: 'vid-nature-lifestyle',
            type: 'video',
            category: 'greenery',
            size: 'wide',
            thumbnail: 'assets/images/Pergola VIew1A.webp',
            title: 'Nature & Lifestyle',
            duration: '01:58',
            videoUrl: PLACEHOLDER_VIDEO_URL
        }
    ];

    // Display order for the main grid (interleaves images & videos)
    const gridOrder = [
        'vid-aerial-tour', 'img-aerial-view', 'img-grand-entrance', 'img-tree-lined-roads',
        'img-green-landscapes', 'img-clubhouse-amenities', 'vid-weekend-home-experience',
        'img-vara-farm-haven', 'vid-a-day-at-vfh', 'img-lifestyle-community',
        'img-resort-amenities', 'img-nature-all-around', 'img-evening-views',
        'img-highway-connectivity', 'img-weekend-home', 'img-timber-villa-design',
        'vid-nature-lifestyle', 'img-eco-veranda-deck', 'img-timber-living-room',
        'img-wooden-house-dining', 'img-childrens-play-zone', 'img-adventure-playground',
        'vid-complete-walkthrough', 'vid-amenities-tour'
    ];

    // Featured Videos section pulls from the same galleryVideos data — single source of truth.
    const featuredVideoIds = ['vid-complete-walkthrough', 'vid-amenities-tour', 'vid-nature-lifestyle'];

    const allItemsById = {};
    galleryImages.forEach(item => { allItemsById[item.id] = item; });
    galleryVideos.forEach(item => { allItemsById[item.id] = item; });

    const orderedItems = gridOrder.map(id => allItemsById[id]).filter(Boolean);

    // ==========================================
    // 1. Icons (inline, reused across cards)
    // ==========================================
    const zoomIconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        <line x1="11" y1="8" x2="11" y2="14"></line>
        <line x1="8" y1="11" x2="14" y2="11"></line>
    </svg>`;

    const playIconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>`;
    const videoBadgeSvg = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>`;

    // ==========================================
    // 2. Render Grid Cards
    // ==========================================
    const gridEl = document.getElementById('gp-grid');
    const emptyStateEl = document.getElementById('gp-empty-state');

    const sizeClass = (size) => {
        if (size === 'hero') return 'gp-card--hero';
        if (size === 'wide') return 'gp-card--wide';
        return '';
    };

    const buildCard = (item) => {
        const card = document.createElement('article');
        card.className = `gp-card ${sizeClass(item.size)}`.trim();
        card.setAttribute('data-category', item.category);
        card.setAttribute('data-type', item.type);
        card.setAttribute('data-id', item.id);
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');

        const badgeLabel = categoryLabels[item.category] || 'Gallery';
        const thumb = item.type === 'video' ? item.thumbnail : item.src;

        if (item.type === 'video') {
            card.setAttribute('aria-label', `Play video: ${item.title}`);
            card.innerHTML = `
                <div class="gp-card-media image-reveal">
                    <img src="${thumb}" alt="${item.title} — video thumbnail" loading="lazy" width="800" height="600">
                </div>
                <span class="gp-video-indicator">${videoBadgeSvg}Video</span>
                <span class="gp-video-duration">${item.duration}</span>
                <div class="gp-play-btn" aria-hidden="true">${playIconSvg}</div>
                <div class="gp-card-overlay">
                    <span class="gp-card-badge">${badgeLabel}</span>
                    <h3 class="gp-card-title">${item.title}</h3>
                </div>
            `;
        } else {
            card.setAttribute('aria-label', `View image: ${item.title}`);
            card.innerHTML = `
                <div class="gp-card-media image-reveal">
                    <img src="${item.src}" alt="${item.alt}" loading="lazy" width="800" height="600">
                </div>
                <div class="gp-card-zoom-icon" aria-hidden="true">${zoomIconSvg}</div>
                <div class="gp-card-overlay">
                    <span class="gp-card-badge">${badgeLabel}</span>
                    <h3 class="gp-card-title">${item.title}</h3>
                    <p class="gp-card-caption">${item.caption}</p>
                </div>
            `;
        }

        card.addEventListener('click', () => handleCardActivate(item));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardActivate(item);
            }
        });

        return card;
    };

    if (gridEl) {
        orderedItems.forEach(item => gridEl.appendChild(buildCard(item)));
    }

    // ==========================================
    // 3. Category Filtering
    // ==========================================
    const filterBtns = document.querySelectorAll('.gp-filter-btn');
    let currentFilter = 'all';
    let visibleImageItems = [];
    let currentImageIndex = 0;

    const applyFilter = () => {
        if (!gridEl) return;
        const cards = Array.from(gridEl.querySelectorAll('.gp-card'));
        let visibleCount = 0;

        cards.forEach(card => {
            const category = card.getAttribute('data-category');
            const type = card.getAttribute('data-type');
            let matches;

            if (currentFilter === 'all') {
                matches = true;
            } else if (currentFilter === 'videos') {
                matches = type === 'video';
            } else {
                matches = category === currentFilter;
            }

            card.style.display = matches ? '' : 'none';
            if (matches) visibleCount++;
        });

        if (emptyStateEl) {
            emptyStateEl.classList.toggle('is-visible', visibleCount === 0);
        }

        updateVisibleImageItems();
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.getAttribute('data-filter');
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            applyFilter();
        });
    });

    applyFilter();

    // ==========================================
    // 4. Image Lightbox (reuses site-wide .gallery-lightbox styles)
    // ==========================================
    const lightbox = document.getElementById('gp-lightbox');
    const lightboxImg = document.getElementById('gp-lightbox-img');
    const lightboxBadge = document.getElementById('gp-lightbox-badge');
    const lightboxTitle = document.getElementById('gp-lightbox-title');
    const lightboxDesc = document.getElementById('gp-lightbox-desc');
    const lightboxCounter = document.getElementById('gp-lightbox-counter');
    const lightboxClose = document.getElementById('gp-lightbox-close');
    const lightboxPrev = document.getElementById('gp-lightbox-prev');
    const lightboxNext = document.getElementById('gp-lightbox-next');
    const lightboxOverlay = lightbox ? lightbox.querySelector('.lightbox-overlay') : null;

    function updateVisibleImageItems() {
        if (!gridEl) return;
        visibleImageItems = Array.from(gridEl.querySelectorAll('.gp-card[data-type="image"]'))
            .filter(card => card.style.display !== 'none')
            .map(card => allItemsById[card.getAttribute('data-id')]);
    }

    const updateLightboxContent = (index) => {
        if (visibleImageItems.length === 0) return;

        if (index < 0) {
            currentImageIndex = visibleImageItems.length - 1;
        } else if (index >= visibleImageItems.length) {
            currentImageIndex = 0;
        } else {
            currentImageIndex = index;
        }

        const item = visibleImageItems[currentImageIndex];
        if (lightboxImg) {
            lightboxImg.src = item.src;
            lightboxImg.alt = item.alt || item.title;
        }
        if (lightboxBadge) lightboxBadge.textContent = categoryLabels[item.category] || 'Gallery';
        if (lightboxTitle) lightboxTitle.textContent = item.title;
        if (lightboxDesc) lightboxDesc.textContent = item.caption;
        if (lightboxCounter) lightboxCounter.textContent = `${currentImageIndex + 1} / ${visibleImageItems.length}`;
    };

    const openLightbox = (item) => {
        updateVisibleImageItems();
        const idx = visibleImageItems.findIndex(i => i.id === item.id);
        updateLightboxContent(idx === -1 ? 0 : idx);
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

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => updateLightboxContent(currentImageIndex - 1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => updateLightboxContent(currentImageIndex + 1));

    // Touch Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;
    if (lightbox) {
        lightbox.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const dist = touchEndX - touchStartX;
            if (Math.abs(dist) > 40) {
                updateLightboxContent(currentImageIndex + (dist < 0 ? 1 : -1));
            }
        }, { passive: true });
    }

    // ==========================================
    // 5. Video Modal
    // ==========================================
    const videoModal = document.getElementById('gp-video-modal');
    const videoModalTitle = document.getElementById('gp-video-modal-title');
    const videoModalPlayer = document.getElementById('gp-video-modal-player');
    const videoModalClose = document.getElementById('gp-video-modal-close');
    const videoModalBackdrop = videoModal ? videoModal.querySelector('.modal-backdrop') : null;

    const openVideoModal = (title, url) => {
        if (!videoModal || !videoModalPlayer) return;
        if (videoModalTitle) videoModalTitle.textContent = title;
        videoModalPlayer.src = url;
        videoModal.classList.add('is-active');
        videoModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        videoModalPlayer.play().catch(() => {});
    };

    const closeVideoModal = () => {
        if (!videoModal || !videoModalPlayer) return;
        videoModal.classList.remove('is-active');
        videoModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        videoModalPlayer.pause();
        videoModalPlayer.removeAttribute('src');
        videoModalPlayer.load();
    };

    if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
    if (videoModalBackdrop) videoModalBackdrop.addEventListener('click', closeVideoModal);

    // ==========================================
    // 6. Card Activation Router (image → lightbox, video → modal)
    // ==========================================
    function handleCardActivate(item) {
        if (item.type === 'video') {
            openVideoModal(item.title, item.videoUrl);
        } else {
            openLightbox(item);
        }
    }

    // ==========================================
    // 8. Featured Videos Section
    // ==========================================
    const featuredTrack = document.getElementById('gp-featured-track');
    if (featuredTrack) {
        featuredVideoIds.forEach(id => {
            const video = allItemsById[id];
            if (!video) return;
            const card = document.createElement('div');
            card.className = 'gp-featured-card image-reveal';
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Play video: ${video.title}`);
            card.innerHTML = `
                <img src="${video.thumbnail}" alt="${video.title} — video thumbnail" loading="lazy" width="600" height="450">
                <span class="gp-video-duration">${video.duration}</span>
                <div class="gp-play-btn" aria-hidden="true">${playIconSvg}</div>
                <div class="gp-featured-card-overlay">
                    <h3 class="gp-featured-card-title">${video.title}</h3>
                </div>
            `;
            card.addEventListener('click', () => openVideoModal(video.title, video.videoUrl));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openVideoModal(video.title, video.videoUrl);
                }
            });
            featuredTrack.appendChild(card);
        });
    }

    const featuredPrevBtn = document.getElementById('gp-featured-prev');
    const featuredNextBtn = document.getElementById('gp-featured-next');
    if (featuredTrack && featuredPrevBtn && featuredNextBtn) {
        const scrollByCard = (dir) => {
            const card = featuredTrack.querySelector('.gp-featured-card');
            const amount = card ? card.getBoundingClientRect().width + 24 : 300;
            featuredTrack.scrollBy({ left: dir * amount, behavior: 'smooth' });
        };
        featuredPrevBtn.addEventListener('click', () => scrollByCard(-1));
        featuredNextBtn.addEventListener('click', () => scrollByCard(1));
    }

    // ==========================================
    // 9. Shared Keyboard Shortcuts (Escape + Arrow Keys)
    // ==========================================
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('is-active')) {
            if (e.key === 'Escape') closeLightbox();
            else if (e.key === 'ArrowLeft') updateLightboxContent(currentImageIndex - 1);
            else if (e.key === 'ArrowRight') updateLightboxContent(currentImageIndex + 1);
        }
        if (videoModal && videoModal.classList.contains('is-active')) {
            if (e.key === 'Escape') closeVideoModal();
        }
    });
});
