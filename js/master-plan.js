/**
 * Vara Farm Haven — Official Master Plan Controller
 * Handles interactive blueprint hotspot selection, detailed plot inspector,
 * Gunta-wise filtering (5, 5+, 10/10+ Guntas), zoom/pan controls, quick-select chips, and fullscreen HD lightbox.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Official Plot Dataset matching FarmHaven_Master Plan_Web.jpg
    const plotsData = {
        "plot-1": {
            number: "01",
            name: "Plot 01",
            areaSqYds: "1,276.5",
            guntas: "10.55",
            status: "Available",
            tier: "10plus",
            facing: "North-West Facing",
            price: "₹89.67 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: true,
            dimensions: "134'-4\" x 87'-4\" / 122' x 83'-11\"",
            roadAccess: "25 FT Wide Road & North Perimeter",
            nearby: ["Grand Estate Corner", "25 FT Wide Road", "Temple Zone Nearby", "Avenue Plantation"],
            description: "Flagship 10.55 Gunta corner farm estate on the North-West sector, offering expansive private grounds for a luxury weekend villa, private orchard, and lawn."
        },
        "plot-2": {
            number: "02",
            name: "Plot 02",
            areaSqYds: "1,210",
            guntas: "10.00",
            status: "Available",
            tier: "10plus",
            facing: "West Facing",
            price: "₹85.00 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            dimensions: "122'-1\" x 81'-1\" / 68'-5\"",
            roadAccess: "25 FT Wide Road Frontage",
            nearby: ["Grand Estate", "25 FT Wide Road", "Avenue Plantation", "Deep Boundary"],
            description: "Substantial 10 Gunta private farm plot with direct frontage on the 25-ft wide internal avenue, ideal for customized farmhouse construction."
        },
        "plot-3": {
            number: "03",
            name: "Plot 03",
            areaSqYds: "1,210",
            guntas: "10.00",
            status: "Available",
            tier: "10plus",
            facing: "South-West Facing",
            price: "₹85.00 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: true,
            dimensions: "122'-1\" x 80'-7\" / 134'-9\" x 68'-1\"",
            roadAccess: "25 FT Wide Road & South Avenue",
            nearby: ["Corner Estate", "25 FT Wide Road", "Perimeter Greenery", "Uninterrupted Horizons"],
            description: "10 Gunta South-West corner estate enjoying uninterrupted horizon views, perimeter tree lines, and peaceful seclusion."
        },
        "plot-4": {
            number: "04",
            name: "Plot 04",
            areaSqYds: "605",
            guntas: "5.00",
            status: "Available",
            tier: "5",
            facing: "West Facing",
            price: "₹42.50 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            dimensions: "67'-3\" x 80'-3\"",
            roadAccess: "25 FT Wide Road",
            nearby: ["25 FT Wide Road", "Near 40 FT Main Road", "Avenue Plantation", "Drip Provision"],
            description: "Perfect 5 Gunta square plot with direct access to internal 25-ft road, ready for weekend cottage, gazebo, and organic gardening."
        },
        "plot-5": {
            number: "05",
            name: "Plot 05",
            areaSqYds: "554.2",
            guntas: "4.58",
            status: "Available",
            tier: "5",
            facing: "East Facing",
            price: "₹38.93 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: true,
            dimensions: "51'-2\" / 60'-6\" x 67'-11\"",
            roadAccess: "40 FT Main BT Road & 25 FT Road",
            nearby: ["40 FT Main BT Road", "25 FT Road", "Quick Main Gate Access", "Morning Sunlight"],
            description: "East-facing corner plot directly accessible from the 40-ft main blacktop avenue, offering unbeatable convenience and morning sunlight."
        },
        "plot-6": {
            number: "06",
            name: "Plot 06",
            areaSqYds: "952.3",
            guntas: "7.87",
            status: "Available",
            tier: "5plus",
            facing: "North-East Facing",
            price: "₹66.89 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: true,
            dimensions: "25'-10\" x 55\" (Custom Curve)",
            roadAccess: "25 FT Wide Road",
            nearby: ["Temple Green Zone", "25 FT Wide Road", "40 FT Road Nearby", "Serene Garden View"],
            description: "Unique 7.87 Gunta garden-view estate nestled next to the peaceful Temple zone and surrounded by manicured avenue trees."
        },
        "plot-7": {
            number: "07",
            name: "Plot 07",
            areaSqYds: "605",
            guntas: "5.00",
            status: "Available",
            tier: "5",
            facing: "North-West Facing",
            price: "₹42.50 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            dimensions: "34'-5\" x 25'-5\" / 58'-6\"",
            roadAccess: "25 FT Wide Road Frontage",
            nearby: ["Temple Adjacent", "25 FT Wide Road", "Shaded Avenue", "Peaceful Location"],
            description: "Prime 5 Gunta plot situated right beside the peaceful community Temple zone, offering easy access to the 25-ft avenue road."
        },
        "temple-zone": {
            number: "Temple",
            name: "Temple & Meditation Greens",
            areaSqYds: "Community Zone",
            guntas: "Sacred Greens",
            status: "Amenity",
            tier: "amenity",
            facing: "East Facing (40 FT BT Road)",
            price: "Community Amenity",
            ratePerGunta: "All-Inclusive",
            isCorner: true,
            dimensions: "36'-1\" x 36'-1\" Temple Area",
            roadAccess: "40 FT Main BT Road & 25 FT Road",
            nearby: ["Community Temple", "Meditation Garden", "40 FT Main BT Road", "Avenue Trees"],
            description: "Dedicated sacred temple and tranquil meditation garden providing a serene spiritual sanctuary and morning gathering point for all residents."
        },
        "plot-8": {
            number: "08",
            name: "Plot 08",
            areaSqYds: "987.4",
            guntas: "8.16",
            status: "Available",
            tier: "5plus",
            facing: "North-West Corner",
            price: "₹69.36 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: true,
            dimensions: "82' x 108'-6\"",
            roadAccess: "40 FT Main BT Road & North Avenue",
            nearby: ["40 FT Main BT Road", "North Corner", "Avenue Trees", "82-Ft Frontage"],
            description: "Grand 8.16 Gunta North-facing corner plot on the 40-ft main blacktop boulevard with expansive 82-foot frontage and exceptional visibility."
        },
        "plot-9": {
            number: "09",
            name: "Plot 09",
            areaSqYds: "605",
            guntas: "5.00",
            status: "Available",
            tier: "5",
            facing: "West Facing",
            price: "₹42.50 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            dimensions: "82' x 66'-6\"",
            roadAccess: "40 FT Main BT Road",
            nearby: ["40 FT Main BT Road", "Avenue Trees", "Drip Irrigation Line", "Level Ground"],
            description: "Prime 5 Gunta plot facing the 40-ft wide blacktop avenue with deep 82-ft frontage and ready underground irrigation line."
        },
        "plot-10": {
            number: "10",
            name: "Plot 10",
            areaSqYds: "605",
            guntas: "5.00",
            status: "Available",
            tier: "5",
            facing: "West Facing",
            price: "₹42.50 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            dimensions: "82' x 66'-6\"",
            roadAccess: "40 FT Main BT Road",
            nearby: ["40 FT Main BT Road", "Central Location", "Avenue Trees"],
            description: "Centrally positioned 5 Gunta farm plot on the 40-ft boulevard, optimal level ground ready for immediate plantation and weekend home."
        },
        "plot-11": {
            number: "11",
            name: "Plot 11",
            areaSqYds: "605",
            guntas: "5.00",
            status: "Available",
            tier: "5",
            facing: "West Facing",
            price: "₹42.50 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            dimensions: "82' x 66'-6\"",
            roadAccess: "40 FT Main BT Road",
            nearby: ["40 FT Main BT Road", "Avenue Plantation", "Drip Line"],
            description: "Level 5 Gunta farm plot on 40-ft main avenue with high soil quality and immediate road frontage."
        },
        "plot-12": {
            number: "12",
            name: "Plot 12",
            areaSqYds: "605",
            guntas: "5.00",
            status: "Available",
            tier: "5",
            facing: "West Facing",
            price: "₹42.50 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            dimensions: "82' x 66'-6\"",
            roadAccess: "40 FT Main BT Road",
            nearby: ["40 FT Main BT Road", "Near Entrance Boulevard", "Avenue Greenery"],
            description: "5 Gunta farm plot situated near the main entrance boulevard, offering swift ingress, egress, and lush tree-lined frontage."
        },
        "plot-13": {
            number: "13",
            name: "Plot 13",
            areaSqYds: "605",
            guntas: "5.00",
            status: "Available",
            tier: "5",
            facing: "South-West Corner",
            price: "₹42.50 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: true,
            dimensions: "82' x 66'-6\"",
            roadAccess: "40 FT Main BT Road (Dual Side Access)",
            nearby: ["Grand Entrance Boulevard", "40 FT Main BT Road", "Perimeter Security"],
            description: "South-West corner 5 Gunta plot directly touching the 40-ft BT entrance avenue, ideal for a showcase farmhouse entrance and manicured gardens."
        },
        "plot-14": {
            number: "14",
            name: "Plot 14",
            areaSqYds: "605",
            guntas: "5.00",
            status: "Available",
            tier: "5",
            facing: "South-East Corner",
            price: "₹42.50 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: true,
            dimensions: "82' x 66'-6\"",
            roadAccess: "33 FT Proposed Road & 40 FT BT Road",
            nearby: ["Amenities Zone Adjacent", "Weekend Home & Pool Walk", "33 FT Road"],
            description: "Premium 5 Gunta corner plot located directly opposite the luxury Amenities Sector (Pool, Pergola, Weekend Home)."
        },
        "plot-15": {
            number: "15",
            name: "Plot 15",
            areaSqYds: "605",
            guntas: "5.00",
            status: "Available",
            tier: "5",
            facing: "East Facing",
            price: "₹42.50 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            dimensions: "82' x 66'-6\"",
            roadAccess: "33 FT Proposed Road",
            nearby: ["33 FT Road", "Near Amenities Zone", "Avenue Trees", "East Light"],
            description: "East-facing 5 Gunta plot with peaceful morning sunshine, minutes from the kids play zone and swimming pool."
        },
        "plot-16": {
            number: "16",
            name: "Plot 16",
            areaSqYds: "605",
            guntas: "5.00",
            status: "Available",
            tier: "5",
            facing: "East Facing",
            price: "₹42.50 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            dimensions: "82' x 66'-6\"",
            roadAccess: "33 FT Proposed Road",
            nearby: ["33 FT Road", "East Orientation", "Drip Provision", "Tree Line"],
            description: "Serene 5 Gunta East-facing plot with 82-ft depth, perfect for fruit orchards, lawn, and weekend retreat."
        },
        "plot-17": {
            number: "17",
            name: "Plot 17",
            areaSqYds: "605",
            guntas: "5.00",
            status: "Available",
            tier: "5",
            facing: "East Facing",
            price: "₹42.50 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            dimensions: "82' x 66'-6\"",
            roadAccess: "33 FT Proposed Road",
            nearby: ["33 FT Road", "Morning Sunlight", "Avenue Plantation"],
            description: "Prime 5 Gunta East-facing plot enjoying gentle morning light and direct access to 33-ft road."
        },
        "plot-18": {
            number: "18",
            name: "Plot 18",
            areaSqYds: "605",
            guntas: "5.00",
            status: "Available",
            tier: "5",
            facing: "East Facing",
            price: "₹42.50 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            dimensions: "82' x 66'-6\"",
            roadAccess: "33 FT Proposed Road",
            nearby: ["33 FT Road", "Avenue Plantation", "East Sunshine", "Open Horizons"],
            description: "Prime East-facing 5 Gunta plot enjoying pure morning light and gentle breezes, ready for immediate planting."
        },
        "plot-19": {
            number: "19",
            name: "Plot 19",
            areaSqYds: "987.4",
            guntas: "8.16",
            status: "Available",
            tier: "5plus",
            facing: "North-East Corner",
            price: "₹69.36 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: true,
            dimensions: "82' x 108'-6\"",
            roadAccess: "33 FT Proposed Road & North Perimeter",
            nearby: ["North-East Corner", "33 FT Road", "Avenue Trees", "Deep Boundary"],
            description: "Prestigious 8.16 Gunta North-East corner estate with dual road exposure and deep 108'-6\" boundary for a sprawling country manor."
        },
        "plot-21": {
            number: "21",
            name: "Plot 21",
            areaSqYds: "960.7",
            guntas: "7.94",
            status: "Available",
            tier: "5plus",
            facing: "West Facing",
            price: "₹67.49 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: true,
            dimensions: "125' / 130' x 66'-6\"",
            roadAccess: "33 FT Proposed Road",
            nearby: ["Swimming Pool", "Kids Play Zone", "Pergola", "Weekend Home"],
            description: "Exclusive 7.94 Gunta estate immediately adjacent to the Clubhouse, Swimming Pool, Pergola, and Kids Play Zone."
        },
        "plot-22": {
            number: "22",
            name: "Plot 22",
            areaSqYds: "923.2",
            guntas: "7.63",
            status: "Available",
            tier: "5plus",
            facing: "West Facing",
            price: "₹64.86 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            dimensions: "120' / 125' x 66'-6\"",
            roadAccess: "33 FT Proposed Road",
            nearby: ["33 FT Road", "Quick Pool Access", "Perimeter Trees"],
            description: "Generous 7.63 Gunta plot offering 120-ft depth and easy strolling distance to all community leisure facilities."
        },
        "plot-23": {
            number: "23",
            name: "Plot 23",
            areaSqYds: "886.9",
            guntas: "7.33",
            status: "Available",
            tier: "5plus",
            facing: "West Facing",
            price: "₹62.31 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            dimensions: "107'-5\" / 120' x 66'-6\"",
            roadAccess: "33 FT Proposed Road",
            nearby: ["33 FT Road", "Avenue Plantation", "East Boundary", "Wide Frontage"],
            description: "Expansive 7.33 Gunta plot featuring 107+ foot depth, ideal for a private luxury farmhouse with swimming pool or lawn."
        },
        "plot-24": {
            number: "24",
            name: "Plot 24",
            areaSqYds: "793.8",
            guntas: "6.56",
            status: "Available",
            tier: "5plus",
            facing: "West Facing",
            price: "₹55.76 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: false,
            dimensions: "95'-7\" / 107'-5\" x 66'-6\"",
            roadAccess: "33 FT Proposed Road",
            nearby: ["33 FT Road", "Avenue Trees", "Close to Amenities"],
            description: "Spacious 6.56 Gunta farm plot with western orientation and quick walk to community recreation facilities."
        },
        "plot-25": {
            number: "25",
            name: "Plot 25",
            areaSqYds: "1,028.5",
            guntas: "8.50",
            status: "Available",
            tier: "5plus",
            facing: "North-East Corner",
            price: "₹72.25 Lakhs",
            ratePerGunta: "₹8.5L / Gunta",
            isCorner: true,
            dimensions: "74'-9\" / 95'-7\" x 108'-6\"",
            roadAccess: "33 FT Proposed Road & North Avenue",
            nearby: ["Grand Estate", "North-East Corner", "33 FT Road", "Avenue Trees"],
            description: "Spectacular 8.50 Gunta North-East estate enjoying exceptional privacy, dual road frontage, and superior Vastu orientation."
        },
        "amenities-hub": {
            number: "Amenities",
            name: "Amenities Sector",
            areaSqYds: "Dedicated Facility",
            guntas: "Recreation Hub",
            status: "Amenity",
            tier: "amenity",
            facing: "South-East Sector",
            price: "Community Hub",
            ratePerGunta: "All-Inclusive",
            isCorner: true,
            dimensions: "Pool, Pergola, Kids Play & Weekend Home",
            roadAccess: "33 FT Road & 40 FT BT Road",
            nearby: ["Swimming Pool", "Garden Pergola", "Kids Play Area", "Model Weekend Home"],
            description: "The heart of recreation and relaxation at Vara Farm Haven — featuring an open-air swimming pool, shaded garden pergola, safe children's open play zone, and model weekend home."
        }
    };

    // DOM Elements
    const plotPins = document.querySelectorAll('.plot-pin');
    const plotChips = document.querySelectorAll('.plot-chip-btn');
    const detailPanel = document.getElementById('plot-detail-card');
    const filterBtns = document.querySelectorAll('.plot-filter-btn');
    const zoomInBtn = document.getElementById('map-zoom-in');
    const zoomOutBtn = document.getElementById('map-zoom-out');
    const resetZoomBtn = document.getElementById('map-zoom-reset');
    const zoomContainer = document.getElementById('blueprint-zoom-container');
    const fullscreenOpenBtn = document.getElementById('map-fullscreen-btn');
    const fullscreenModal = document.getElementById('master-plan-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    let selectedPlotId = "plot-1";
    let currentZoom = 1;
    let panX = 0;
    let panY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    // 1. Render Plot Details Panel
    const renderPlotDetails = (plotId) => {
        const data = plotsData[plotId];
        if (!data || !detailPanel) return;

        // Update active pin
        plotPins.forEach(pin => {
            if (pin.getAttribute('data-plot-id') === plotId) {
                pin.classList.add('selected');
            } else {
                pin.classList.remove('selected');
            }
        });

        // Update active chip
        plotChips.forEach(chip => {
            if (chip.getAttribute('data-plot-id') === plotId) {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });

        const isAmenity = data.status === "Amenity";
        const statusClass = isAmenity ? "badge-amenity" : "badge-available";
        const statusText = isAmenity ? "COMMUNITY AMENITY" : "AVAILABLE";

        const nearbyChipsHTML = data.nearby.map(item => `<span class="nearby-chip"><i class="fa-solid fa-circle-check"></i> ${item}</span>`).join('');

        detailPanel.innerHTML = `
            <div class="panel-header">
                <div class="panel-title-wrapper">
                    <span class="panel-plot-badge">${data.name.toUpperCase()}</span>
                    <span class="panel-status-pill ${statusClass}">${statusText}</span>
                </div>
                ${data.isCorner ? '<span class="corner-label"><i class="fa-solid fa-compass"></i> Corner Estate</span>' : ''}
            </div>

            <div class="panel-metrics">
                <div class="metric-box">
                    <span class="metric-val">${data.guntas}</span>
                    <span class="metric-unit">GUNTAS</span>
                </div>
                <div class="metric-box">
                    <span class="metric-val">${data.areaSqYds}</span>
                    <span class="metric-unit">SQ. YARDS</span>
                </div>
                <div class="metric-box">
                    <span class="metric-val">${data.facing}</span>
                    <span class="metric-unit">ORIENTATION</span>
                </div>
            </div>

            <div class="panel-pricing-row">
                <div class="price-main">
                    <span class="price-amount">${data.price}</span>
                    <span class="price-rate">${data.ratePerGunta !== 'Included' && data.ratePerGunta !== 'All-Inclusive' ? `(${data.ratePerGunta})` : ''}</span>
                </div>
                <div class="dimensions-tag">
                    <i class="fa-solid fa-ruler-combined"></i>
                    <span>Dim: <strong>${data.dimensions}</strong></span>
                </div>
            </div>

            <div class="panel-road-access">
                <i class="fa-solid fa-road"></i>
                <span>Road Frontage: <strong>${data.roadAccess}</strong></span>
            </div>

            <p class="panel-description">${data.description}</p>

            <div class="panel-nearby-section">
                <h4 class="nearby-heading">Plot Highlights &amp; Surroundings:</h4>
                <div class="nearby-chips-grid">
                    ${nearbyChipsHTML}
                </div>
            </div>

            <div class="panel-actions">
                ${!isAmenity ? `
                    <a href="#enquiry" class="btn btn-primary panel-book-btn" data-plot="${data.number}">
                        <span>Enquire About ${data.name}</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    </a>
                ` : `
                    <a href="#amenities" class="btn btn-primary panel-book-btn">
                        <span>Explore All Amenities</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    </a>
                `}
                <button type="button" class="btn btn-secondary-outline modal-trigger-btn" id="open-full-plan-btn">
                    <i class="fa-solid fa-up-right-and-down-left-from-center"></i> View Full HD Plan
                </button>
            </div>
        `;

        // Pre-fill enquiry form upon clicking Book/Enquire
        const bookBtn = detailPanel.querySelector('.panel-book-btn');
        if (bookBtn && !isAmenity) {
            bookBtn.addEventListener('click', () => {
                const messageInput = document.querySelector('#enquiry textarea[name="message"]');
                if (messageInput) {
                    messageInput.value = `Hello, I am interested in Plot ${data.number} (${data.guntas} Guntas / ${data.areaSqYds} Sq. Yards, Dimensions: ${data.dimensions}, ${data.facing}). Please share the latest availability and booking details.`;
                }
            });
        }

        // Attach modal trigger inside detail panel
        const modalTrigger = detailPanel.querySelector('#open-full-plan-btn');
        if (modalTrigger && fullscreenModal) {
            modalTrigger.addEventListener('click', () => openFullscreenModal());
        }
    };

    // 2. Click Handler for Pins and Quick-select Chips
    const selectPlotHandler = (plotId, smoothScrollMobile = false) => {
        if (!plotsData[plotId]) return;
        selectedPlotId = plotId;
        renderPlotDetails(plotId);

        if (smoothScrollMobile && window.innerWidth < 992 && detailPanel) {
            const cardTop = detailPanel.getBoundingClientRect().top + window.pageYOffset - 90;
            window.scrollTo({ top: cardTop, behavior: 'smooth' });
        }
    };

    plotPins.forEach(pin => {
        const plotId = pin.getAttribute('data-plot-id');
        pin.addEventListener('click', () => selectPlotHandler(plotId, true));
        pin.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectPlotHandler(plotId, true);
            }
        });
    });

    plotChips.forEach(chip => {
        const plotId = chip.getAttribute('data-plot-id');
        chip.addEventListener('click', () => selectPlotHandler(plotId, true));
    });

    // 3. Gunta-wise Filter Buttons Handler (5, 5+, 10 or 10+)
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            plotPins.forEach(pin => {
                const plotId = pin.getAttribute('data-plot-id');
                const data = plotsData[plotId];
                if (!data) return;

                let matches = false;

                if (filterValue === 'all') {
                    matches = true;
                } else if (filterValue === '5') {
                    matches = data.tier === '5';
                } else if (filterValue === '5plus') {
                    matches = data.tier === '5plus';
                } else if (filterValue === '10plus') {
                    matches = data.tier === '10plus';
                }

                if (matches) {
                    pin.classList.remove('filter-dimmed');
                } else {
                    pin.classList.add('filter-dimmed');
                }
            });

            plotChips.forEach(chip => {
                const plotId = chip.getAttribute('data-plot-id');
                const data = plotsData[plotId];
                if (!data) return;

                let matches = false;
                if (filterValue === 'all') {
                    matches = true;
                } else if (filterValue === '5') {
                    matches = data.tier === '5';
                } else if (filterValue === '5plus') {
                    matches = data.tier === '5plus';
                } else if (filterValue === '10plus') {
                    matches = data.tier === '10plus';
                }

                chip.style.display = matches ? 'inline-flex' : 'none';
            });
        });
    });

    // 4. Zoom & Pan Engine for Blueprint Stage
    const mapWrapper = document.querySelector('.master-plan-canvas-wrapper');
    const minZoom = 1;
    const maxZoom = 3.5;
    const zoomStep = 0.35;

    const clampPan = () => {
        if (currentZoom <= 1) {
            panX = 0;
            panY = 0;
            return;
        }
        if (mapWrapper) {
            const bounds = mapWrapper.getBoundingClientRect();
            const maxPanX = (bounds.width * (currentZoom - 1)) / 2 + 80;
            const maxPanY = (bounds.height * (currentZoom - 1)) / 2 + 80;
            panX = Math.max(-maxPanX, Math.min(maxPanX, panX));
            panY = Math.max(-maxPanY, Math.min(maxPanY, panY));
        }
    };

    const applyTransform = (animate = true) => {
        if (zoomContainer) {
            zoomContainer.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${currentZoom})`;
            zoomContainer.style.transformOrigin = 'center center';
            zoomContainer.style.transition = (isDragging || !animate) ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1)';
        }
        if (mapWrapper) {
            if (currentZoom > 1) {
                mapWrapper.classList.add('is-zoomed');
            } else {
                mapWrapper.classList.remove('is-zoomed');
            }
        }
        if (zoomInBtn) zoomInBtn.disabled = currentZoom >= maxZoom;
        if (zoomOutBtn) zoomOutBtn.disabled = currentZoom <= minZoom;
    };

    const applyZoom = (newZoom, targetCenter = null) => {
        const clamped = Math.max(minZoom, Math.min(maxZoom, parseFloat(newZoom.toFixed(2))));
        if (clamped === currentZoom && !targetCenter) return;

        if (targetCenter && clamped > 1 && mapWrapper) {
            const rect = mapWrapper.getBoundingClientRect();
            const mouseX = targetCenter.x - rect.left - rect.width / 2;
            const mouseY = targetCenter.y - rect.top - rect.height / 2;
            const zoomRatio = clamped / currentZoom;
            panX = mouseX - (mouseX - panX) * zoomRatio;
            panY = mouseY - (mouseY - panY) * zoomRatio;
        } else if (clamped === 1) {
            panX = 0;
            panY = 0;
        }

        currentZoom = clamped;
        clampPan();
        applyTransform(true);
    };

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            applyZoom(currentZoom + zoomStep);
        });
    }
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            applyZoom(currentZoom - zoomStep);
        });
    }
    if (resetZoomBtn) {
        resetZoomBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentZoom = 1;
            panX = 0;
            panY = 0;
            applyTransform(true);
        });
    }

    // Pan Dragging
    if (mapWrapper) {
        // Double click to toggle zoom
        mapWrapper.addEventListener('dblclick', (e) => {
            if (e.target.closest('.plot-pin') || e.target.closest('.map-controls')) return;
            if (currentZoom > 1) {
                applyZoom(1);
            } else {
                applyZoom(1.8, { x: e.clientX, y: e.clientY });
            }
        });

        // Mouse Drag to Pan
        const onMouseDown = (e) => {
            if (e.target.closest('.plot-pin') || e.target.closest('.map-controls')) return;
            if (currentZoom <= 1) return;
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
            applyTransform(false);
        };

        const onMouseUp = () => {
            if (!isDragging) return;
            isDragging = false;
            mapWrapper.classList.remove('is-dragging');
            applyTransform(true);
        };

        mapWrapper.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        // Touch Drag & Pinch to Zoom
        let touchStartX = 0;
        let touchStartY = 0;
        let initialPinchDist = 0;
        let initialZoomOnPinch = 1;

        mapWrapper.addEventListener('touchstart', (e) => {
            if (e.target.closest('.plot-pin') || e.target.closest('.map-controls')) return;
            if (e.touches.length === 1 && currentZoom > 1) {
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
                initialZoomOnPinch = currentZoom;
            }
        }, { passive: true });

        mapWrapper.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && isDragging) {
                panX = e.touches[0].clientX - touchStartX;
                panY = e.touches[0].clientY - touchStartY;
                clampPan();
                applyTransform(false);
            } else if (e.touches.length === 2 && initialPinchDist > 0) {
                const currentDist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                const pinchScale = currentDist / initialPinchDist;
                currentZoom = Math.max(minZoom, Math.min(maxZoom, parseFloat((initialZoomOnPinch * pinchScale).toFixed(2))));
                clampPan();
                applyTransform(false);
            }
        }, { passive: true });

        mapWrapper.addEventListener('touchend', (e) => {
            if (e.touches.length === 0) {
                isDragging = false;
                initialPinchDist = 0;
                mapWrapper.classList.remove('is-dragging');
                applyTransform(true);
            }
        }, { passive: true });

        // Wheel Zoom Support (Ctrl+Wheel or wheel)
        mapWrapper.addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                const delta = e.deltaY < 0 ? 0.25 : -0.25;
                applyZoom(currentZoom + delta, { x: e.clientX, y: e.clientY });
            }
        }, { passive: false });

        applyTransform(false);
    }

    // 5. Fullscreen Lightbox Modal
    const openFullscreenModal = () => {
        if (fullscreenModal) {
            fullscreenModal.classList.add('active');
            fullscreenModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeFullscreenModal = () => {
        if (fullscreenModal) {
            fullscreenModal.classList.remove('active');
            fullscreenModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    };

    if (fullscreenOpenBtn) {
        fullscreenOpenBtn.addEventListener('click', openFullscreenModal);
    }
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeFullscreenModal);
    }
    if (fullscreenModal) {
        fullscreenModal.addEventListener('click', (e) => {
            if (e.target === fullscreenModal || e.target.classList.contains('modal-backdrop')) {
                closeFullscreenModal();
            }
        });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && fullscreenModal.classList.contains('active')) {
                closeFullscreenModal();
            }
        });
    }

    // Initial render
    renderPlotDetails(selectedPlotId);
});
