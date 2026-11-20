<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>KhmerRice Market Platform</title>
    <meta name="description" content="Cambodian rice market prices, varieties, planting calendar and news.">
    <meta name="theme-color" content="#2b7049">
    <script>
        // Pick light or dark before anything draws, so dark mode never flashes white.
        // A saved choice wins; otherwise follow the device setting. The nav's theme button changes it.
        (function () {
            var saved = null;
            try { saved = localStorage.getItem('theme'); } catch (e) {}
            var dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.dataset.theme = dark ? 'dark' : 'light';
            document.documentElement.dataset.bsTheme = dark ? 'dark' : 'light';
        })();
    </script>
    <link rel="manifest" href="/manifest.webmanifest">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/icons/icon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Noto+Serif+Khmer:wght@400;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous">
    </script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
    :root {
        /* Site palette: lighter green, gold, white and light blue. Every page and component uses these. */
        --green: #2b7049;
        --green-dark: #1f5638;
        --green-soft: #e6f3eb;
        --green-rgb: 43, 112, 73;
        --gold: #e8bd45;
        --gold-light: #f6d572;
        --gold-dark: #7d5f0f;
        --gold-soft: #fcf3d6;
        --gold-rgb: 232, 189, 69;
        --blue: #5b9fd6;
        --blue-soft: #eaf4fc;
        --bg: #f6fafd;
        --surface: #ffffff;
        --white: #ffffff;
        --border: #d6e6f3;
        --text: #1d2b36;
        --text-muted: #5a6b78;
        --text-faint: #93a3b0;
        --green-ink: #2b7049;      /* green used for text: headings, links, numbers */
        --on-gold: #1f3d2c;        /* text on gold buttons, the same in both themes */
        --danger: #b42318;
        --danger-soft: #fff1f0;
        --danger-border: #f7c8c1;
        --success: #107c41;
        --success-soft: #e6f9f0;
        color-scheme: light;

        /* Older names, kept so existing rules keep working. */
        --primary-green: var(--green);
        --accent-gold: var(--gold);
        --bg-cream: var(--bg);
        --text-dark: var(--text);
        --pill-inactive: var(--blue-soft);
        --pill-active: var(--green);
        --bg-card-cream: var(--blue-soft);

        /* Site fonts: every page and component uses these two. */
        --font-heading: "Playfair Display", Georgia, "Times New Roman", serif;
        --font-body: "Source Serif 4", Georgia, "Times New Roman", serif;
    }

    /* Dark mode: the same palette, night version. Set by the script at the top of <head>. */
    :root[data-theme="dark"] {
        --green: #24603f;
        --green-dark: #1c4d33;
        --green-soft: #1a3326;
        --green-rgb: 36, 96, 63;
        --green-ink: #6cc497;
        --danger: #ff8a80;
        --danger-soft: #3a1f1f;
        --danger-border: #6b2c2c;
        --success: #5fd08f;
        --success-soft: #16352a;
        --gold: #e8bd45;
        --gold-light: #f6d572;
        --gold-dark: #f0cd6a;
        --gold-soft: #3a3116;
        --gold-rgb: 232, 189, 69;
        --blue: #7bb6e6;
        --blue-soft: #1c2a38;
        --bg: #0f1720;
        --surface: #16212c;
        --border: #2a3a4a;
        --text: #e5ecf2;
        --text-muted: #a5b3bf;
        --text-faint: #6f8090;
        color-scheme: dark;
    }

    /* Smooth switch when the button is pressed (not on page load). */
    :root.theme-switching,
    :root.theme-switching * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
    }

    body {
        background-color: var(--bg-cream);
        color: var(--text-dark);
        font-family: var(--font-body);
        /* Playfair defaults to old-style numbers that dip below the line; prices read better level. */
        font-variant-numeric: lining-nums;
    }

    button,
    input,
    textarea,
    select {
        font-family: inherit;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    .rice-name,
    .navbar-brand span {
        font-family: var(--font-heading);
    }

    /* Header / Navbar section */
    .bg-header-green {
        background-color: var(--primary-green) !important;
    }

    .nav-link-custom {
        color: rgba(255, 255, 255, 0.8) !important;
        font-weight: 500;
    }

    .nav-link-custom.active {
        color: #fff !important;
        border-bottom: 2px solid var(--accent-gold);
    }

    .btn-gold {
        background-color: var(--accent-gold);
        color: #fff;
        font-weight: 600;
        border: none;
        border-radius: 6px;
        padding: 6px 20px;
    }

    .btn-gold:hover {
        background-color: var(--gold);
        color: #fff;
    }

    .search-nav-input {
        background-color: rgba(255, 255, 255, 0.15);
        border: none;
        color: #fff;
        border-radius: 6px;
    }

    .search-nav-input::placeholder {
        color: rgba(255, 255, 255, 0.5);
    }

    /* Stats Counter Area */
    .stat-divider {
        border-right: 1px solid rgba(255, 255, 255, 0.2);
    }

    /* Filter Section */
    .search-filter-input {
        background-color: var(--blue-soft);
        border: none;
        border-radius: 30px;
        padding-left: 40px;
    }

    .pill-filter {
        background-color: var(--pill-inactive);
        color: var(--text-muted);
        border: none;
        border-radius: 20px;
        padding: 6px 16px;
        font-size: 0.9rem;
        font-weight: 500;
        white-space: nowrap;
    }

    .pill-filter.active {
        background-color: var(--pill-active);
        color: #fff;
    }

    .dropdown-sort {
        background-color: var(--blue-soft);
        border: none;
        border-radius: 8px;
        padding: 8px 16px;
        font-size: 0.9rem;
    }

    .navbar {
    position: relative;
    z-index: 99999 !important;
}

    /* Cards Setup */
    .rice-card {
        border: none;
        border-radius: 16px;
        overflow: hidden;
        background-color: var(--surface);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    }

    .card-img-wrapper {
        position: relative;
        height: 200px;
        overflow: hidden;
    }

    .card-img-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .badge-type {
        position: absolute;
        top: 12px;
        left: 12px;
        background-color: var(--primary-green);
        color: white;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: bold;
    }

    .badge-trend {
        position: absolute;
        top: 12px;
        right: 12px;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: bold;
    }

    .trend-up {
        background-color: var(--success-soft);
        color: var(--success);
    }

    .trend-down {
        background-color: var(--danger-soft);
        color: var(--danger);
    }

    .demand-badge {
        border-radius: 20px;
        padding: 4px 12px;
        font-size: 0.75rem;
        font-weight: bold;
        display: inline-block;
    }

    .demand-very-high {
        background-color: var(--success-soft);
        color: var(--success);
    }

    .demand-high {
        background-color: #e8f0fe;
        color: #1a73e8;
    }

    .home-carousel {
        position: relative;
    }

    .carousel-item {
        position: relative;
    }

    .carousel-item::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.55));
        z-index: 1;
    }

    .carousel-img {
        height: 620px;
        object-fit: cover;
    }

    .hero-content {
        z-index: 2;
        bottom: 80px;
        left: 8%;
        right: auto;
        max-width: 720px;
    }

    .hero-badge {
        display: inline-block;
        background: var(--accent-gold);
        color: var(--primary-green);
        font-weight: 700;
        padding: 6px 18px;
        border-radius: 20px;
        margin-bottom: 18px;
    }

    .hero-content h1 {
        font-size: 4rem;
        font-weight: 800;
    }

    .hero-content p {
        font-size: 1.2rem;
    }

    .stats-bar {
        background: var(--primary-green);
        color: white;
        padding: 28px 0;
    }

    .stat-item h3 {
        color: var(--accent-gold);
        font-weight: 800;
        margin-bottom: 4px;
    }

    .stat-item p {
        margin-bottom: 0;
        color: rgba(255, 255, 255, 0.75);
    }

    .featured-story {
        background: var(--bg-card-cream);
    }

    .section-label {
        color: var(--accent-gold);
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .featured-story h2,
    .about-preview h2 {
        color: var(--text-dark);
        font-weight: 800;
        font-size: 2.4rem;
    }

    .featured-story p,
    .about-preview p {
        color: var(--text-muted);
        line-height: 1.7;
    }

    .video-card {
        border-radius: 8px;
        overflow: hidden;
    }

    .play-button {
        position: absolute;
        inset: 50% auto auto 50%;
        transform: translate(-50%, -50%);
        width: 88px;
        height: 88px;
        border: none;
        border-radius: 50%;
        background: var(--accent-gold);
        color: var(--primary-green);
        font-size: 2rem;
    }

    .about-preview {
        background: var(--bg);
    }

    .mini-stat {
        background: var(--blue-soft);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 22px;
    }

    .mini-stat h3 {
        color: var(--accent-gold);
        font-weight: 800;
    }

    .about-image {
        width: 100%;
        border-radius: 8px;
        object-fit: cover;
    }

    /* Global Reusable Footer */
    .khmer-footer {
        background-color: var(--primary-green);
        color: var(--bg-cream);
    }

    .khmer-footer h4,
    .khmer-footer h5 {
        color: var(--accent-gold);
        font-weight: bold;
    }

   .khmer-footer a {
        display: block;
        color: var(--bg-cream);
        text-decoration: none;
        margin-bottom: 10px;
    }

    .khmer-footer a:hover {
        color: var(--accent-gold);
    }

    .khmer-footer p {
        color: var(--bg-cream);
        margin-bottom: 10px;
    }

    .khmer-footer hr {
        border-color: rgba(255, 255, 255, 0.2);
    }

    .social-icons {
    display: flex;
    align-items: center;
}

    .social-icon {
    color: var(--accent-gold);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s ease;
    text-decoration: none;
}

    .social-icon:hover {
    color: #fff;
    transform: translateY(-2px);
}

.social-icon:hover {
    color: #fff;
    transform: translateY(-2px);
}

    /* ===== Green Pagination ===== */
    .pagination {
        --bs-pagination-color: var(--green);
        --bs-pagination-hover-color: var(--green);
        --bs-pagination-active-bg: var(--green);
        --bs-pagination-active-border-color: var(--green);
        --bs-pagination-hover-bg: #e9f3ec;
    }
    .pagination .page-item.active .page-link {
        background-color: var(--green) !important;
        border-color: var(--green) !important;
        color: #fff !important;
    }
    .pagination .page-link {
        color: var(--green-ink) !important;
    }
    .pagination .page-link:hover {
        background-color: var(--green-soft) !important;
        color: var(--green-ink) !important;
    }
    .pagination .page-link:focus {
        box-shadow: 0 0 0 0.25rem rgba(var(--green-rgb), 0.25) !important;
        color: var(--green-ink) !important;
    }
    .pill-filter {
    text-decoration: none;
    color: var(--text);
}
.pill-filter.active {
    color: #fff;
}

.dropdown-sort {
    color: var(--green-ink) !important;
    text-decoration: none;
}

.dropdown-sort:hover {
    color: var(--green-ink) !important;
}

.dropdown-sort.active {
    color: #fff !important;
    background-color: var(--green);
}

/* Khmer text (the whole page in Khmer, or Khmer names marked lang="km") uses a Khmer font
   everywhere, overriding the fonts the page components set. */
:lang(km) {
    font-family: "Noto Serif Khmer", var(--font-body) !important;
}
html[lang="km"] body {
    line-height: 1.6;
}

.flash-toast {
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 100000;
    max-width: min(420px, calc(100vw - 40px));
    background: var(--green);
    color: #fff;
    padding: 12px 18px;
    border-radius: 10px;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
    font-weight: 600;
    cursor: pointer;
    animation: flash-out 0.4s ease 6s forwards;
}
.flash-toast.flash-error { background: var(--danger); }
@keyframes flash-out { to { opacity: 0; visibility: hidden; } }

/* Loading: full-page loader until React has drawn the page, plus a top bar for navigation. */
.page-loader {
    position: fixed;
    inset: 0;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    background: var(--bg-cream);
    /* Stays invisible for the first half second, so fast page loads never flash it. */
    opacity: 0;
    animation: loader-in 0.25s ease 0.5s forwards;
}
.page-loader.is-done { display: none; }
@keyframes loader-in { to { opacity: 1; } }
.page-loader-text {
    color: var(--primary-green);
    font-weight: 600;
    letter-spacing: 0.04em;
}
.rice-spinner {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    border: 4px solid rgba(var(--green-rgb), 0.15);
    border-top-color: var(--primary-green);
    border-right-color: var(--accent-gold);
    animation: rice-spin 0.8s linear infinite;
}
.rice-spinner.is-small { width: 30px; height: 30px; border-width: 3px; }
@keyframes rice-spin { to { transform: rotate(360deg); } }

.nav-progress {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2001;
    height: 3px;
    width: 0;
    background: var(--accent-gold);
    box-shadow: 0 0 8px rgba(var(--gold-rgb), 0.7);
    opacity: 0;
    transition: width 0.4s ease, opacity 0.2s ease;
}
.nav-progress.is-active { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
    .rice-spinner { animation-duration: 2.4s; }
    .nav-progress { transition: none; }
}

/* Scrollbars: the page's vertical one and every box that scrolls up/down or sideways
   (price table, calendar, comparison), in the site colours for light and dark mode.
   Standard properties for Chrome, Edge and Firefox; ::-webkit-scrollbar for Safari. */
html {
    scrollbar-color: color-mix(in srgb, var(--green-ink) 70%, transparent) var(--green-soft);
}
::-webkit-scrollbar { width: 12px; height: 12px; }
::-webkit-scrollbar-track { background: var(--green-soft); }
::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--green-ink) 70%, transparent);
    border-radius: 999px;
    border: 3px solid var(--green-soft);
}
::-webkit-scrollbar-thumb:hover { background: var(--green-ink); }
::-webkit-scrollbar-corner { background: var(--green-soft); }

</style>
    
</head>

<body
    data-is-authenticated="{{ auth()->check() ? 'true' : 'false' }}"
    data-user-name="{{ auth()->check() ? e(auth()->user()->name) : '' }}"
    data-is-admin="{{ auth()->user()?->is_admin ? 'true' : 'false' }}"
    data-locale="{{ app()->getLocale() }}"
    data-provinces-km="{{ json_encode(array_column(config('provinces'), 'km', 'name')) }}"
    data-csrf="{{ csrf_token() }}"
>
    <noscript><style>.page-loader { display: none; }</style></noscript>
    <div class="page-loader" id="pageLoader" role="status" aria-live="polite">
        <div class="rice-spinner"></div>
        <div class="page-loader-text">KhmerRice</div>
    </div>
    <div class="nav-progress" id="navProgress" aria-hidden="true"></div>
    @if (session('success') || $errors->any())
        <div class="flash-toast {{ $errors->any() ? 'flash-error' : '' }}" role="status" onclick="this.remove()">
            {{ session('success') ?? $errors->first() }}
        </div>
    @endif
    @yield('hero')
    <main>
        @yield('content')
    </main>
    <script>
        (function () {
            // Hide the page loader once React has drawn something into #react-app.
            // Always hide on window load or after 8s, so an error can never trap the page behind it.
            const loader = document.getElementById('pageLoader');
            const app = document.getElementById('react-app');
            const hideLoader = () => loader.classList.add('is-done');

            if (!app || app.childElementCount) {
                hideLoader();
            } else {
                new MutationObserver((_, observer) => {
                    if (app.childElementCount) {
                        observer.disconnect();
                        requestAnimationFrame(hideLoader);
                    }
                }).observe(app, { childList: true });
                window.addEventListener('load', () => setTimeout(hideLoader, 300));
                setTimeout(hideLoader, 8000);
            }

            // Scroll reveal: each .animate-fade-in-up waits until it scrolls into view, and items
            // appearing together fade in one after another. Paired with the CSS in resources/css/app.css.
            if ('IntersectionObserver' in window) {
                document.documentElement.classList.add('js-reveal');

                const revealer = new IntersectionObserver((entries) => {
                    entries
                        .filter((entry) => entry.isIntersecting)
                        .sort((a, b) => (a.boundingClientRect.top - b.boundingClientRect.top) || (a.boundingClientRect.left - b.boundingClientRect.left))
                        .forEach((entry, index) => {
                            const el = entry.target;
                            if (!el.style.animationDelay) el.style.animationDelay = Math.min(index, 7) * 90 + 'ms';
                            el.dataset.revealed = '';
                            revealer.unobserve(el);
                        });
                }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });

                // React draws the page (and later lists, modals, filters) after this runs, so keep watching.
                let queued = false;
                const scan = () => {
                    queued = false;
                    document.querySelectorAll('.animate-fade-in-up:not([data-revealed])').forEach((el) => revealer.observe(el));
                };
                new MutationObserver(() => {
                    if (!queued) {
                        queued = true;
                        requestAnimationFrame(scan);
                    }
                }).observe(document.body, { childList: true, subtree: true });
                scan();
            }

            // Top progress bar while the next page loads after a link click or form submit.
            const bar = document.getElementById('navProgress');
            let trickle;
            let showTimer;
            const startBar = () => {
                clearInterval(trickle);
                clearTimeout(showTimer);
                // Only appears if the next page takes a moment, so quick clicks don't flash it.
                showTimer = setTimeout(() => {
                    bar.classList.add('is-active');
                    bar.style.width = '15%';
                    trickle = setInterval(() => {
                        const width = parseFloat(bar.style.width);
                        if (width < 85) bar.style.width = (width + (90 - width) * 0.12) + '%';
                    }, 300);
                }, 250);
            };
            const resetBar = () => {
                clearTimeout(showTimer);
                clearInterval(trickle);
                bar.classList.remove('is-active');
                bar.style.width = '0';
            };

            document.addEventListener('click', (event) => {
                const link = event.target.closest('a[href]');
                if (!link || event.defaultPrevented || event.button !== 0) return;
                if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                if (link.target && link.target !== '_self') return;
                if (link.hasAttribute('download') || link.dataset.bsToggle) return;

                const url = new URL(link.href, location.href);
                if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
                if (url.pathname === location.pathname && url.search === location.search && url.hash) return;

                startBar();
            });

            document.addEventListener('submit', (event) => {
                if (!event.defaultPrevented) startBar();
            });

            // Coming back with the browser's Back button can restore a page with the bar still showing.
            window.addEventListener('pageshow', (event) => {
                if (event.persisted) {
                    resetBar();
                    hideLoader();
                }
            });
        })();

        // Offline support: cache pages and prices so they still open without a connection.
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
        }
    </script>
</body>

</html>