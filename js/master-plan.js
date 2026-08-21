/**
 * Vara Farm Haven — Master Plan Controller
 * Handles interactive SVG plot selection, details panel rendering, plot filtering, and map zoom controls.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Structured Plot Dataset
    const plotsData = {
        "plot-001": {
            number: "001",
            areaSqYds: "605",
            guntas: "5.0",
            status: "Available",
            facing: "East Facing",
            price: "₹42.5 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: true,
            nearby: ["Entrance Arch", "Avenue Plantation", "13-ft Blacktop Road"],
            dimensions: "55' x 99'",
            description: "Prime corner plot near the grand entrance arch with dual road access and lush tree-lined frontage."
        },
        "plot-002": {
            number: "002",
            areaSqYds: "605",
            guntas: "5.0",
            status: "Available",
            facing: "East Facing",
            price: "₹42.5 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            nearby: ["Avenue Plantation", "Drip Irrigation Provision"],
            dimensions: "55' x 99'",
            description: "Standard 5 Gunta farm plot with direct eastern sunlight and immediate access to blacktop internal road."
        },
        "plot-003": {
            number: "003",
            areaSqYds: "726",
            guntas: "6.0",
            status: "Available",
            facing: "East Facing",
            price: "₹51.0 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            nearby: ["Park & Pergola", "Avenue Plantation"],
            dimensions: "60' x 109'",
            description: "Spacious 6 Gunta plot positioned right adjacent to the central green Park & Pergola area."
        },
        "plot-004": {
            number: "004",
            areaSqYds: "605",
            guntas: "5.0",
            status: "Booked",
            facing: "East Facing",
            price: "₹42.5 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            nearby: ["Park & Pergola"],
            dimensions: "55' x 99'",
            description: "This plot has been reserved by another buyer."
        },
        "plot-005": {
            number: "005",
            areaSqYds: "605",
            guntas: "5.0",
            status: "Available",
            facing: "North-East Facing",
            price: "₹42.5 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: true,
            nearby: ["Park & Pergola", "Children's Play Zone"],
            dimensions: "55' x 99'",
            description: "Highly sought-after North-East corner plot directly facing the children's play park and green zone."
        },
        "plot-006": {
            number: "006",
            areaSqYds: "847",
            guntas: "7.0",
            status: "Available",
            facing: "North Facing",
            price: "₹59.5 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: true,
            nearby: ["Swimming Pool", "Park & Pergola"],
            dimensions: "70' x 109'",
            description: "Premium 7 Gunta estate plot walking distance from the luxury on-site swimming pool."
        },
        "plot-007": {
            number: "007",
            areaSqYds: "605",
            guntas: "5.0",
            status: "Available",
            facing: "North Facing",
            price: "₹42.5 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            nearby: ["Swimming Pool", "Solar Fencing"],
            dimensions: "55' x 99'",
            description: "Tranquil plot with northern orientation and quick access to pool and perimeter solar security."
        },
        "plot-008": {
            number: "008",
            areaSqYds: "605",
            guntas: "5.0",
            status: "Booked",
            facing: "North Facing",
            price: "₹42.5 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            nearby: ["Swimming Pool"],
            dimensions: "55' x 99'",
            description: "This plot has been reserved by another buyer."
        },
        "plot-009": {
            number: "009",
            areaSqYds: "605",
            guntas: "5.0",
            status: "Available",
            facing: "West Facing",
            price: "₹42.5 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            nearby: ["Weekend Homes Cluster", "Avenue Plantation"],
            dimensions: "55' x 99'",
            description: "Ideal layout plot near planned 2BHK weekend homes, perfect for immediate home construction."
        },
        "plot-010": {
            number: "010",
            areaSqYds: "726",
            guntas: "6.0",
            status: "Available",
            facing: "West Facing",
            price: "₹51.0 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            nearby: ["Weekend Homes Cluster", "Tree-Lined Road"],
            dimensions: "60' x 109'",
            description: "Generous 6 Gunta western-facing plot surrounded by lush avenue plantations."
        },
        "plot-011": {
            number: "011",
            areaSqYds: "605",
            guntas: "5.0",
            status: "Available",
            facing: "West Facing",
            price: "₹42.5 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            nearby: ["Compound Wall", "Solar Fencing"],
            dimensions: "55' x 99'",
            description: "Quiet perimeter plot offering high privacy and secure compound wall fencing."
        },
        "plot-012": {
            number: "012",
            areaSqYds: "605",
            guntas: "5.0",
            status: "Booked",
            facing: "South-West Facing",
            price: "₹42.5 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: true,
            nearby: ["Solar Fencing", "Compound Wall"],
            dimensions: "55' x 99'",
            description: "This plot has been reserved by another buyer."
        },
        "plot-013": {
            number: "013",
            areaSqYds: "605",
            guntas: "5.0",
            status: "Available",
            facing: "South Facing",
            price: "₹42.5 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            nearby: ["Water Connection", "Drip Irrigation"],
            dimensions: "55' x 99'",
            description: "Plot equipped with motor-line water provision and ready drip-irrigation connectivity."
        },
        "plot-014": {
            number: "014",
            areaSqYds: "605",
            guntas: "5.0",
            status: "Available",
            facing: "South Facing",
            price: "₹42.5 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            nearby: ["Drip Irrigation", "Avenue Plantation"],
            dimensions: "55' x 99'",
            description: "Level agricultural plot primed for organic gardens, orchards, and sit-out areas."
        },
        "plot-015": {
            number: "015",
            areaSqYds: "726",
            guntas: "6.0",
            status: "Available",
            facing: "South Facing",
            price: "₹51.0 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            nearby: ["Water Connection", "Solar Fencing"],
            dimensions: "60' x 109'",
            description: "Expanded 6 Gunta southern plot with high soil quality and open horizon views."
        },
        "plot-016": {
            number: "016",
            areaSqYds: "605",
            guntas: "5.0",
            status: "Booked",
            facing: "South-East Facing",
            price: "₹42.5 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: true,
            nearby: ["Entrance Arch"],
            dimensions: "55' x 99'",
            description: "This plot has been reserved by another buyer."
        },
        "plot-017": {
            number: "017",
            areaSqYds: "605",
            guntas: "5.0",
            status: "Available",
            facing: "West Facing",
            price: "₹42.5 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            nearby: ["13-ft Blacktop Road", "Park & Pergola"],
            dimensions: "55' x 99'",
            description: "Centrally located plot with smooth blacktop road access and close walk to park."
        },
        "plot-018": {
            number: "018",
            areaSqYds: "605",
            guntas: "5.0",
            status: "Available",
            facing: "West Facing",
            price: "₹42.5 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            nearby: ["13-ft Blacktop Road", "Avenue Plantation"],
            dimensions: "55' x 99'",
            description: "Excellent square-proportioned plot ideal for private lawn, gazebo, and villa."
        },
        "plot-019": {
            number: "019",
            areaSqYds: "605",
            guntas: "5.0",
            status: "Available",
            facing: "East Facing",
            price: "₹42.5 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            nearby: ["Park & Pergola", "Avenue Plantation"],
            dimensions: "55' x 99'",
            description: "East-facing plot catching morning light, situated near community pergola."
        },
        "plot-020": {
            number: "020",
            areaSqYds: "847",
            guntas: "7.0",
            status: "Available",
            facing: "North-East Facing",
            price: "₹59.5 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: true,
            nearby: ["Swimming Pool", "Park & Pergola"],
            dimensions: "70' x 109'",
            description: "Flagship 7 Gunta North-East corner estate plot facing pool and central greenery."
        }
    };

    // DOM Elements
    const plotElements = document.querySelectorAll('.master-plot-group');
    const detailPanel = document.getElementById('plot-detail-card');
    const filterBtns = document.querySelectorAll('.plot-filter-btn');
    const zoomInBtn = document.getElementById('map-zoom-in');
    const zoomOutBtn = document.getElementById('map-zoom-out');
    const resetZoomBtn = document.getElementById('map-zoom-reset');
    const svgMapContainer = document.getElementById('master-map-svg');

    let selectedPlotId = "plot-001"; // Default selected plot
    let currentZoom = 1;

    // 1. Function to Update Detail Panel Content
    const renderPlotDetails = (plotId) => {
        const data = plotsData[plotId];
        if (!data || !detailPanel) return;

        // Highlight selected SVG element
        plotElements.forEach(el => {
            if (el.getAttribute('data-plot-id') === plotId) {
                el.classList.add('selected');
            } else {
                el.classList.remove('selected');
            }
        });

        // Detail Panel HTML Construction
        const isAvailable = data.status === "Available";
        const statusBadgeClass = isAvailable ? "badge-available" : "badge-booked";

        const nearbyChipsHTML = data.nearby.map(item => `<span class="nearby-chip">${item}</span>`).join('');

        detailPanel.innerHTML = `
            <div class="panel-header">
                <div class="panel-title-wrapper">
                    <span class="panel-plot-badge">PLOT ${data.number}</span>
                    <span class="panel-status-pill ${statusBadgeClass}">${data.status.toUpperCase()}</span>
                </div>
                ${data.isCorner ? '<span class="corner-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> Corner Plot</span>' : ''}
            </div>

            <div class="panel-metrics">
                <div class="metric-box">
                    <span class="metric-val">${data.areaSqYds}</span>
                    <span class="metric-unit">SQ. YARDS</span>
                </div>
                <div class="metric-box">
                    <span class="metric-val">${data.guntas}</span>
                    <span class="metric-unit">GUNTAS</span>
                </div>
                <div class="metric-box">
                    <span class="metric-val">${data.facing}</span>
                    <span class="metric-unit">FACING</span>
                </div>
            </div>

            <div class="panel-pricing-row">
                <div class="price-main">
                    <span class="price-amount">${data.price}</span>
                    <span class="price-rate">(${data.ratePerGunta})</span>
                </div>
                <div class="dimensions-tag">
                    <span>Dim: ${data.dimensions}</span>
                </div>
            </div>

            <p class="panel-description">${data.description}</p>

            <div class="panel-nearby-section">
                <h4 class="nearby-heading">Nearby Highlights &amp; Amenities:</h4>
                <div class="nearby-chips-grid">
                    ${nearbyChipsHTML}
                </div>
            </div>

            <div class="panel-actions">
                ${isAvailable ? `
                    <a href="#enquiry" class="btn btn-primary panel-book-btn" data-plot="${data.number}">
                        BOOK PLOT ${data.number}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </a>
                ` : `
                    <button class="btn btn-disabled" disabled>PLOT RESERVED</button>
                `}
            </div>
        `;

        // Attach event listener to panel book button to pre-fill plot number in enquiry form
        const bookBtn = detailPanel.querySelector('.panel-book-btn');
        if (bookBtn) {
            bookBtn.addEventListener('click', (e) => {
                const messageInput = document.querySelector('#enquiry textarea[name="message"]');
                if (messageInput) {
                    messageInput.value = `I am interested in booking Plot ${data.number} (${data.areaSqYds} Sq. Yards / ${data.guntas} Guntas, ${data.facing}). Please contact me with details.`;
                }
            });
        }
    };

    // 2. Attach Click & Hover Events to SVG Plots
    plotElements.forEach(group => {
        const plotId = group.getAttribute('data-plot-id');

        const selectPlot = () => {
            selectedPlotId = plotId;
            renderPlotDetails(plotId);
            // On smaller viewports (mobile/tablet), scroll smoothly to plot detail panel
            if (window.innerWidth < 992 && detailPanel) {
                const cardTop = detailPanel.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: cardTop, behavior: 'smooth' });
            }
        };

        group.addEventListener('click', selectPlot);

        group.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectPlot();
            }
        });
    });

    // 3. Filter Buttons Handler
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            plotElements.forEach(group => {
                const plotId = group.getAttribute('data-plot-id');
                const data = plotsData[plotId];
                if (!data) return;

                let matches = false;

                if (filterValue === 'all') {
                    matches = true;
                } else if (filterValue === 'available') {
                    matches = data.status === 'Available';
                } else if (filterValue === 'booked') {
                    matches = data.status === 'Booked';
                } else if (filterValue === 'corner') {
                    matches = data.isCorner;
                } else if (filterValue === 'near-amenities') {
                    matches = data.nearby.some(n => n.includes('Pool') || n.includes('Park') || n.includes('Arch'));
                }

                if (matches) {
                    group.classList.remove('filter-dimmed');
                } else {
                    group.classList.add('filter-dimmed');
                }
            });
        });
    });

    // 4. Zoom & Touch/Mouse Pan Controls Logic
    if (svgMapContainer) {
        let panX = 0;
        let panY = 0;
        let isDragging = false;
        let startX = 0;
        let startY = 0;

        const applyTransform = () => {
            const innerG = svgMapContainer.querySelector('.map-viewport-group');
            if (innerG) {
                innerG.style.transform = `translate(${panX}px, ${panY}px) scale(${currentZoom})`;
                innerG.style.transformOrigin = 'center center';
                innerG.style.transition = isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
            }
        };

        const applyZoom = (zoomLevel) => {
            currentZoom = Math.max(0.9, Math.min(1.8, zoomLevel));
            if (currentZoom === 1) {
                panX = 0;
                panY = 0;
            }
            applyTransform();
        };

        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => applyZoom(currentZoom + 0.2));
        }
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => applyZoom(currentZoom - 0.2));
        }
        if (resetZoomBtn) {
            resetZoomBtn.addEventListener('click', () => applyZoom(1));
        }

        // Drag to Pan when zoomed
        const wrapper = svgMapContainer.closest('.master-map-wrapper');
        if (wrapper) {
            const startPan = (clientX, clientY) => {
                if (currentZoom <= 1) return;
                isDragging = true;
                startX = clientX - panX;
                startY = clientY - panY;
                wrapper.style.cursor = 'grabbing';
            };

            const movePan = (clientX, clientY) => {
                if (!isDragging) return;
                panX = clientX - startX;
                panY = clientY - startY;
                const maxPan = (currentZoom - 1) * 250;
                panX = Math.max(-maxPan, Math.min(maxPan, panX));
                panY = Math.max(-maxPan, Math.min(maxPan, panY));
                applyTransform();
            };

            const endPan = () => {
                if (!isDragging) return;
                isDragging = false;
                wrapper.style.cursor = 'grab';
                applyTransform();
            };

            wrapper.addEventListener('mousedown', (e) => startPan(e.clientX, e.clientY));
            window.addEventListener('mousemove', (e) => movePan(e.clientX, e.clientY));
            window.addEventListener('mouseup', endPan);

            wrapper.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    startPan(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: true });
            window.addEventListener('touchmove', (e) => {
                if (isDragging && e.touches.length === 1) {
                    movePan(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: true });
            window.addEventListener('touchend', endPan);
        }
    }

    // Initial render of default plot (Plot 001)
    renderPlotDetails(selectedPlotId);
});
