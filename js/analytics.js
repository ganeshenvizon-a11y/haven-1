/**
 * Vara Farm Haven — Analytics Bootstrap
 * Google tag (GA4 + Google Ads on a single gtag.js load), Meta Pixel and Microsoft Clarity.
 * Loaded async from <head>; each vendor library is itself injected async.
 */

(function () {
    // 1. Google tag — one gtag.js serves both the GA4 property and the Google Ads account
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', 'G-KVH76EB04T');
    gtag('config', 'AW-18537685733');

    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-KVH76EB04T';
    document.head.appendChild(gtagScript);

    // 2. Meta Pixel
    !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
            n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
        n.queue = []; t = b.createElement(e); t.async = !0;
        t.src = v; s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s)
    }(window, document, 'script',
        'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '2233074987476377');
    fbq('track', 'PageView');

    // 3. Microsoft Clarity
    (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
        t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", "yjo198yxe4");
})();
