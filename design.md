# VARA FARM HAVEN — DESIGN SYSTEM

> Design specification for a premium real-estate / farm-living website built using **HTML5, CSS3 and Vanilla JavaScript**.

---

# 01. Project Direction

## Brand

**VARA FARM HAVEN**

### Brand Statement

**A World Apart. Yours Forever.**

Vara Farm Haven is not positioned as a conventional plotted-development website.

The website should sell the **feeling of owning a place outside the city**:

* Open skies
* Green surroundings
* Slow weekends
* Family time
* Personal space
* A weekend home
* Long-term land ownership

The visual experience should therefore feel closer to a **premium architectural / lifestyle publication** than a traditional real-estate website.

---

# 02. Technology Rules

The website must use:

```text
HTML5
CSS3
Vanilla JavaScript
```

Do NOT introduce:

```text
React
Next.js
Vue
Angular
Tailwind CSS
Bootstrap
jQuery
GSAP
Framer Motion
```

unless specifically requested later.

External libraries should only be introduced when there is a clear requirement that cannot reasonably be achieved with native HTML/CSS/JS.

---

# 03. File Architecture

Recommended structure:

```text
vara-farm-haven/
│
├── index.html
│
├── css/
│   ├── style.css
│   ├── responsive.css
│   └── animations.css
│
├── js/
│   ├── main.js
│   ├── navigation.js
│   ├── interactions.js
│   ├── master-plan.js
│   └── gallery.js
│
├── assets/
│   ├── images/
│   ├── video/
│   ├── icons/
│   └── logo/
│
└── design.md
```

For a smaller implementation, the CSS and JS can remain:

```text
css/style.css
js/main.js
```

Do not unnecessarily split files.

---

# 04. Brand Colors

The palette is derived from the uploaded Vara logo.

## Primary Green

```css
--vara-green: #005837;
```

Primary brand color.

Use for:

* Primary buttons
* Navigation accents
* Headings
* Dark sections
* Icons
* Interactive elements
* Footer
* Master-plan interface

---

## Lime

```css
--vara-lime: #B0D236;
```

Use as a controlled accent.

Use for:

* Active indicators
* Small labels
* Map markers
* Highlighted numbers
* Decorative lines
* Hover states
* Availability indicators

Do NOT use lime as the dominant website background.

---

## Slate

```css
--vara-slate: #606A71;
```

Use for:

* Secondary text
* Descriptions
* Metadata
* Form labels
* Supporting information

---

## Supporting Colors

```css
--vara-ink: #111513;
--vara-white: #FFFFFF;
--vara-paper: #F6F7F2;
--vara-sand: #E8E5D8;
--vara-border: #D9DDD6;
--vara-muted: #8A918E;
```

---

# 05. Global CSS Variables

Add the following to `:root`.

```css
:root {
    /* Brand */
    --vara-green: #005837;
    --vara-lime: #B0D236;
    --vara-slate: #606A71;

    /* Neutrals */
    --vara-ink: #111513;
    --vara-white: #FFFFFF;
    --vara-paper: #F6F7F2;
    --vara-sand: #E8E5D8;
    --vara-border: #D9DDD6;
    --vara-muted: #8A918E;

    /* Typography */
    --font-primary: "Manrope", sans-serif;

    /* Layout */
    --container-width: 1440px;
    --page-padding: clamp(20px, 5vw, 80px);

    /* Radius */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 16px;

    /* Shadows */
    --shadow-soft: 0 10px 40px rgba(17, 21, 19, 0.08);

    /* Transitions */
    --transition-fast: 250ms ease;
    --transition-base: 500ms ease;
    --transition-slow: 800ms ease;
}
```

---

# 06. Typography

Use:

```text
Manrope
```

through Google Fonts or a locally hosted font.

Primary typography should be modern, clean and architectural.

Avoid decorative fonts.

---

## Hero Heading

Desktop:

```css
font-size: clamp(48px, 7vw, 96px);
font-weight: 600;
line-height: 0.95;
letter-spacing: -0.05em;
```

---

## Section Heading

```css
font-size: clamp(38px, 5vw, 64px);
font-weight: 600;
line-height: 1;
letter-spacing: -0.04em;
```

---

## Body

```css
font-size: 17px;
line-height: 1.7;
font-weight: 400;
```

---

# 07. Global Layout

Use a maximum-width container:

```css
.container {
    width: min(
        calc(100% - 2 * var(--page-padding)),
        var(--container-width)
    );

    margin-inline: auto;
}
```

Desktop layout should use a 12-column grid where appropriate.

```css
.grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 24px;
}
```

Do not force every section into the same grid.

The page should alternate between:

* Full-width photography
* Editorial layouts
* Asymmetrical grids
* Large typography
* Data layouts
* Interactive sections

---

# 08. Body

```css
body {
    margin: 0;
    background: var(--vara-paper);
    color: var(--vara-ink);
    font-family: var(--font-primary);
    overflow-x: hidden;
}
```

Use:

```css
box-sizing: border-box;
```

globally.

---

# 09. Navigation

## Desktop Structure

```text
LOGO

Home
The Land
Amenities
Weekend Home
Master Plan
Contact

Book a Visit
```

The navigation should initially overlay the hero.

### Initial State

```text
transparent background
white/light navigation depending on hero image
```

### Scrolled State

Add:

```text
solid background
subtle border
slight backdrop blur
```

Example:

```css
.navbar.scrolled {
    background: rgba(246, 247, 242, 0.94);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--vara-border);
}
```

---

# 10. Mobile Navigation

Use a simple mobile navigation.

Structure:

```text
VARA LOGO                         MENU
```

Opening the menu should reveal:

```text
Home
The Land
Amenities
Weekend Home
Master Plan
Contact

Book a Visit
Download Brochure
```

Menu animation should be smooth and minimal.

Do not create an oversized complex mobile navigation system.

---

# 11. Hero

## Layout

The hero should be visually dominant.

Use either:

### Option A

Full-screen background image.

### Option B

Large landscape image occupying approximately 65–70% of the viewport with typography integrated into the composition.

Preferred implementation:

```text
┌─────────────────────────────────────────────┐
│ NAVIGATION                                  │
│                                             │
│              LANDSCAPE IMAGE                │
│                                             │
│       VARA FARM HAVEN                       │
│       A World Apart.                        │
│       Yours Forever.                        │
│                                             │
│       5 Guntas · 605 Sq. Yards · ₹8.5L     │
│                                             │
│       BOOK A VISIT                          │
└─────────────────────────────────────────────┘
```

---

## Hero Content

Heading:

```text
A World Apart.
Yours Forever.
```

Description:

```text
70 km from Hyderabad, past the noise, past the traffic,
past the version of you that's always switched on —
a farm-living destination built for open skies,
unhurried weekends, and land you can finally call your own.
```

Property strip:

```text
5 Guntas Onwards
605 Sq. Yards Minimum
₹8.5 Lakhs / Gunta
```

Location:

```text
Balanagar, Gunded Road towards Neredlapally
```

CTAs:

```text
Book a Visit
Download Brochure
```

---

# 12. Hero Image Treatment

Images should be natural.

Avoid heavy color grading.

Use a subtle overlay only when required for text readability.

Example:

```css
.hero::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
        linear-gradient(
            90deg,
            rgba(17, 21, 19, 0.65),
            rgba(17, 21, 19, 0.05)
        );
}
```

Do not make the entire image dark.

---

# 13. Section Rhythm

Sections should not all look identical.

Recommended sequence:

```text
HERO
↓
THE IDEA
↓
LAND NUMBERS
↓
WHY 5 GUNTAS
↓
CONNECTIVITY
↓
AMENITIES
↓
A DAY HERE
↓
WEEKEND HOME
↓
MASTER PLAN
↓
GALLERY
↓
ABOUT VARA
↓
ENQUIRY
↓
FOOTER
```

Use contrasting visual treatments between sections.

---

# 14. The Idea

Heading:

```text
What You Own Is Land.
What You Create Is Life.
```

This should be an editorial section.

Do NOT use cards.

Recommended layout:

```text
Large image          Large heading
                     Supporting text
```

Use generous whitespace.

This section establishes the emotional positioning of Vara.

---

# 15. Land & Pricing

Heading:

```text
Your Space, By the Numbers
```

Create large numerical typography.

```text
5
GUNTAS ONWARDS
```

```text
605
SQ. YARDS MINIMUM
```

```text
₹8.5L
PER GUNTA
```

```text
4.5
ACRES TOTAL DEVELOPMENT
```

Numbers should be significantly larger than their descriptions.

Use Vara Green.

---

# 16. Why 5 Guntas

Tag:

```text
WHY 5 GUNTAS
```

Heading:

```text
605 Yards.
Endless Possibility.
```

Four Visual Stories:

```text
Your Weekend Home — Space enough for a 2BHK weekend home with room to spare
Your Private Garden — Grow your own patch of green, from flower beds to a mini orchard
Your Family Escape — A sit-out, an open yard, room for the kids to run
Your Long-Term Asset — Land that holds its value as the region grows around it
```

Layout Rules:

Do not make them four identical cards.

Use an asymmetric 12-column grid layout with mixed image aspect ratios (16:9, 4:3) and numbered badges (01–04).

Example:

```text
┌───────────────────────────┬──────────────────────┐
│                           │                      │
│ 01 YOUR WEEKEND HOME      │ 02 YOUR PRIVATE      │
│ (Aspect 16:9 - 7 Cols)    │    GARDEN            │
│                           │ (Aspect 4:3 - 5 Cols)│
├───────────────────────────┼──────────────────────┤
│ 03 YOUR FAMILY ESCAPE     │ 04 YOUR LONG-TERM    │
│ (Aspect 4:3 - 5 Cols)     │    ASSET             │
│                           │ (Aspect 16:9 - 7 Cols)│
└───────────────────────────┴──────────────────────┘
```

---

# 17. Connectivity

Tag:

```text
CONNECTIVITY
```

Heading:

```text
Close Enough to Reach.
Far Enough to Escape.
```

This section should visually represent geographic context.

Use a custom HTML/CSS map-style composition if a real map is not available.

Information:

```text
NH-44 — Direct access to the Hyderabad–Bengaluru highway corridor
Balanagar–Gunded Road — Straightforward approach to the project
Regional Ring Road — Proposed RRR alignment passes through Gunded, Balanagar Mandal
ORR — Connects onward to Hyderabad's Outer Ring Road
Rail — Nearby stations via Balanagar / Ranga Reddy Guda / Shadnagar
Airport — Direct road connectivity to Rajiv Gandhi International Airport
```

Use Vara Lime for the destination marker.

JavaScript may animate the route line when the section enters the viewport.

---

# 18. Amenities

Heading:

```text
Everything Comes Together Here
```

Amenities List:

```text
01. Compound Wall — A defined boundary, a clear sense of ownership
02. Solar Fencing — An added layer of perimeter security
03. Water Connection — Motor-line provision, ready for your plot's needs
04. Drip Irrigation — Planned connectivity to every plot for easy, efficient watering
05. 13-Feet Blacktop Roads — Smooth, planned internal access throughout
06. Avenue Plantation — Tree-lined internal roads for shade and greenery
07. Swimming Pool — A refreshing break, right on-site
08. Children's Play Zone — A dedicated space for kids to run and explore
09. Park & Pergola — A green space to walk, gather, and unwind under open shade
```

Use an editorial grid rather than conventional cards.

Each item:

```text
01
Amenity Name
Short description
```

Numbers can use Vara Lime.


---

# 19. A Day Here

This is a storytelling section.

Tag:

```text
A DAY HERE
```

Heading:

```text
What a Weekend at Vara Farm Haven Looks Like
```

Story Sequence & Copy:

```text
01. Morning — Wake up to open skies.
02. Walk — Walk under tree-lined avenues.
03. Children's Play — Let the kids loose in the play zone.
04. Family Lunch — Gather the family for lunch.
05. Swimming — Take a dip in the pool.
06. Pergola — Sit under the pergola as the evening slows down.
07. Weekend Home — And when you don't want the day to end — stay the night.
```

Layout Rules:

* On desktop, build it as an interactive horizontal timeline track with smooth scroll snap, step badges, and drag/arrow controls.
* On mobile, convert it into vertical storytelling.
* Do not force horizontal scrolling on small screens.

---

# 20. Weekend Home

This section must feel premium.

Heading:

```text
Your Weekend Has a New Address
```

Description:

```text
A thoughtfully planned 2BHK, built for the moments in between —
where the indoors meet the outdoors, and there's always a reason
to stay a little longer.
```

Specifications:

```text
2 Bedrooms
Kitchen
Dining Area
Sit-Out
```

Use one large architectural image.

The image should occupy at least 50% of the section.

CTA:

```text
Book a Visit →
```

---

# 21. Master Plan

Heading:

```text
See the Plan.
Find Your Space.
```

This should be one of the most interactive parts of the website.

The master plan should be rendered using:

```text
HTML
SVG
CSS
JavaScript
```

Prefer SVG for the actual interactive map.

---

## Plot Interaction

Each plot should be an SVG element.

Available:

```css
fill: var(--vara-green);
```

Hover:

```css
fill: var(--vara-lime);
```

Selected:

```css
fill: var(--vara-lime);
stroke: var(--vara-green);
```

Unavailable:

```css
opacity: 0.35;
```

---

## Plot Detail Panel

When clicking a plot:

```text
PLOT 024

605 SQ. YARDS

AVAILABLE

Nearby:
Swimming Pool
Park
Weekend Homes

BOOK THIS PLOT
```

Use JavaScript to dynamically populate the panel.

---

# 22. Gallery

Heading:

```text
See the Haven
```

Use an asymmetric masonry layout.

Images should have different proportions:

```text
16:9
4:5
1:1
3:4
16:10
```

Do not make every image identical.

---

## Gallery Interaction

Clicking an image should open a lightbox.

JavaScript functionality:

```text
Open
Close
Next
Previous
Keyboard Escape
Keyboard Arrow Navigation
```

Add:

```text
aria-label
```

to controls.

---

# 23. About Vara

Heading:

```text
Better Land Deserves Better Planning.
```

Background:

```css
background: var(--vara-green);
```

Text:

```css
color: var(--vara-white);
```

Accent:

```css
color: var(--vara-lime);
```

Content:

```text
Vara Real Estate & Developers Pvt. Ltd.

Better land deserves better planning.
That belief shapes everything we build —
land, infrastructure, and spaces designed
for people to actually live in, not just own.
```

Keep the section concise.

---

# 24. Enquiry

Heading:

```text
Let's Start the Conversation
```

Supporting text:

```text
Tell us what you're looking for,
and our team will help you take the next step.
```

Fields:

```text
Full Name
Mobile Number
WhatsApp Number
Preferred Date
Preferred Time
Message
```

Primary button:

```text
Book a Visit
```

Secondary:

```text
Contact Us
```

---

# 25. Form Design

Use simple editorial inputs.

Preferred:

```css
.form-input {
    width: 100%;
    border: 0;
    border-bottom: 1px solid var(--vara-border);
    background: transparent;
    padding: 16px 0;
    outline: none;
}
```

Focus:

```css
.form-input:focus {
    border-color: var(--vara-green);
}
```

Do not use large rounded input boxes.

---

# 26. CTA Design

## Primary CTA

```css
.btn-primary {
    background: var(--vara-green);
    color: var(--vara-white);
    border: 1px solid var(--vara-green);
}
```

Hover:

```css
.btn-primary:hover {
    background: #00452B;
}
```

---

## Secondary CTA

```css
.btn-secondary {
    background: transparent;
    color: var(--vara-green);
    border: 1px solid var(--vara-green);
}
```

Hover:

```css
.btn-secondary:hover {
    background: var(--vara-green);
    color: var(--vara-white);
}
```

---

## Button Style

Buttons should be:

```text
Height: 48–56px
Padding: 0 24–32px
Border radius: 6px
Font weight: 600
```

Avoid pill buttons.

---

# 27. Contact CTA

Use:

```text
Contact Us →
```

as a lightweight CTA.

The arrow should translate slightly on hover.

```css
.link-arrow:hover span {
    transform: translateX(5px);
}
```

---

# 28. Mobile Sticky CTA

On mobile, add a fixed bottom action:

```text
┌───────────────────────────────┐
│        BOOK A VISIT           │
└───────────────────────────────┘
```

Use Vara Green.

It should disappear when the enquiry form is visible to avoid redundancy.

JavaScript can use `IntersectionObserver` to toggle visibility.

---

# 29. Footer

Background:

```css
background: var(--vara-ink);
```

Footer content:

```text
VARA FARM HAVEN

Home
The Land
Amenities
Weekend Home
Master Plan
Contact

Book a Visit
Download Brochure
Contact Us
```

Company:

```text
Vara Real Estate & Developers Pvt. Ltd.
```

Use muted white/grey for secondary content.

---

# 30. Animation Philosophy

Animations must support the experience.

They should never distract from the property.

Use:

```text
fade
translate
clip-path reveal
image scale
number counter
line drawing
```

Avoid:

```text
bouncing
spinning
excessive parallax
large 3D effects
constant floating elements
```

---

# 31. Scroll Reveal

Use native `IntersectionObserver`.

Example behavior:

```text
Section enters viewport
↓
Heading fades in
↓
Image reveals
↓
Supporting content follows
```

Recommended:

```css
.reveal {
    opacity: 0;
    transform: translateY(30px);
    transition:
        opacity 700ms ease,
        transform 700ms ease;
}

.reveal.visible {
    opacity: 1;
    transform: translateY(0);
}
```

---

# 32. Image Reveal

Use CSS clipping.

```css
.image-reveal {
    clip-path: inset(0 100% 0 0);
    transition: clip-path 1s cubic-bezier(.77, 0, .18, 1);
}

.image-reveal.visible {
    clip-path: inset(0 0 0 0);
}
```

This creates an editorial image reveal without requiring an animation library.

---

# 33. Smooth Scrolling

Enable:

```css
html {
    scroll-behavior: smooth;
}
```

Navigation links should target section IDs:

```html
<a href="#land">The Land</a>
<a href="#amenities">Amenities</a>
<a href="#weekend-home">Weekend Home</a>
<a href="#master-plan">Master Plan</a>
```

Do not implement scroll hijacking.

---

# 34. Active Navigation

JavaScript should detect the section currently in view.

Use:

```text
IntersectionObserver
```

Active navigation should receive:

```text
Vara Lime underline / indicator
```

Example:

```css
.nav-link.active::after {
    width: 100%;
    background: var(--vara-lime);
}
```

---

# 35. Header Behavior

JavaScript states:

```text
TOP
↓
transparent header

SCROLL DOWN
↓
solid header

SCROLL UP
↓
header visible

MOBILE
↓
menu button
```

Do not make the header constantly animate.

---

# 36. Performance

The site must remain lightweight.

Prioritize:

```text
Optimized images
WebP / AVIF
Lazy loading
Compressed videos
Minimal JavaScript
No unnecessary libraries
No huge background assets
```

Images below the fold:

```html
loading="lazy"
```

Hero image:

```html
fetchpriority="high"
```

Do not lazy-load the hero.

---

# 37. Responsive Breakpoints

Use CSS breakpoints:

```css
/* Mobile */
@media (max-width: 767px) {}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {}

/* Desktop */
@media (min-width: 1024px) {}

/* Large Desktop */
@media (min-width: 1440px) {}
```

Do not design exclusively for 1920px screens.

---

# 38. Mobile Layout

Mobile should feel intentional.

Hero:

```text
Full viewport image
↓
Overlay
↓
Headline
↓
Property information
↓
CTA
```

Sections should use:

```text
20–24px horizontal padding
```

Avoid excessive horizontal scrolling.

---

# 39. Mobile Typography

Hero:

```css
font-size: clamp(44px, 13vw, 58px);
```

Section heading:

```css
font-size: clamp(34px, 9vw, 44px);
```

Body:

```css
font-size: 16px;
```

---

# 40. Accessibility

Every interactive element must be keyboard accessible.

Requirements:

```text
Semantic HTML
ARIA labels where needed
Visible focus states
Alt text
Proper form labels
Keyboard-accessible gallery
Keyboard-accessible master plan
Reduced-motion support
```

Add:

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

---

# 41. Semantic HTML

Use:

```html
<header>
<nav>
<main>
<section>
<article>
<figure>
<footer>
```

Each major section must have a meaningful ID.

Example:

```html
<section id="land">
```

```html
<section id="amenities">
```

```html
<section id="weekend-home">
```

```html
<section id="master-plan">
```

---

# 42. Section IDs

Use exactly:

```text
#home
#land
#amenities
#weekend-home
#master-plan
#contact
```

Additional internal sections:

```text
#idea
#pricing
#why-five-guntas
#connectivity
#day-here
#gallery
#about
#enquiry
```

---

# 43. JavaScript Responsibilities

Vanilla JS should handle:

```text
Navigation
Mobile menu
Scroll header
Active navigation
Scroll reveal
IntersectionObserver
Gallery lightbox
Gallery navigation
Master-plan interactions
Plot selection
Form validation
Sticky mobile CTA
Counters
```

Do not use JavaScript for layout that CSS can handle.

---

# 44. Master Plan Data

Keep plot information in JavaScript as structured data.

Example:

```javascript
const plots = {
    "plot-01": {
        number: "01",
        area: "605 Sq. Yards",
        status: "Available"
    },

    "plot-02": {
        number: "02",
        area: "720 Sq. Yards",
        status: "Available"
    }
};
```

This keeps the HTML clean and makes future backend integration easier.

---

# 45. Form Validation

Client-side validation should check:

```text
Name required
Mobile required
Valid mobile format
WhatsApp number optional/validated
Date valid
Time selected
Message optional
```

Do not expose sensitive form information in console logs.

The form should currently be frontend-ready.

Backend/API integration can be added later.

---

# 46. Visual Hierarchy

The user should experience the page in this order:

```text
1. LANDSCAPE
        ↓
2. BRAND
        ↓
3. IDEA
        ↓
4. LAND
        ↓
5. LIFESTYLE
        ↓
6. WEEKEND HOME
        ↓
7. MASTER PLAN
        ↓
8. TRUST
        ↓
9. VISIT
```

Do not let pricing dominate the first screen.

The website should establish desire before information.

---

# 47. Photography Ratio

Prioritize photography approximately as:

```text
60% Visual
20% Typography
10% Brand Color
10% UI / Information
```

The property itself should remain the visual hero.

---

# 48. What NOT To Do

Do not create:

```text
❌ Generic real-estate cards
❌ Excessive rounded containers
❌ Green gradients everywhere
❌ Lime backgrounds everywhere
❌ Gold luxury styling
❌ Stock-photo families
❌ Huge walls of text
❌ Excessive icons
❌ Carousel for every section
❌ Automatic image sliders everywhere
❌ Overly complicated animations
❌ Scroll hijacking
❌ Fake 3D effects
❌ Dashboard-style pricing
❌ Excessive shadows
```

---

# 49. Design Personality

The final website should feel:

```text
70% Premium lifestyle
15% Nature
10% Architecture
5% Real estate
```

It should **not** feel like:

```text
70% Real estate
20% Greenery
10% Website UI
```

---

# 50. Final Experience

The visitor should enter the website thinking:

> "This looks beautiful."

Then:

> "I can actually imagine spending weekends here."

Then:

> "The land makes sense."

Then:

> "The 2BHK makes this different."

Then:

> "I want to see where the plots are."

And finally:

> **"I should book a visit."**

That is the intended conversion journey.

---

# 51. Core Design Rule

## DO NOT DESIGN A REAL-ESTATE WEBSITE.

Design a **digital experience for a place people want to escape to**.

The land provides the value.

The weekend home provides the differentiation.

The amenities provide the convenience.

The master plan provides confidence.

The photography provides desire.

The Vara brand provides trust.

And **Book a Visit** provides the conversion.
