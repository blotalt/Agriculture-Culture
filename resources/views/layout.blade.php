<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KhmerRice Market Platform</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous">
    </script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
    :root {
        /* Unified Color Swatches */
        --primary-green: #1b4d22;
        --accent-gold: #cca01d;
        --bg-cream: #faf6ee;
        --text-dark: #202020;
        --text-muted: #6f6845;
        --pill-inactive: #f0e6d2;
        --pill-active: #1b4d22;
        --bg-card-cream: #f5f1e3;
    }

    body {
        background-color: var(--bg-cream);
        color: var(--text-dark);
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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
        font-family: Georgia, "Times New Roman", serif;
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
        background-color: #b38b19;
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
        background-color: #f3ece0;
        border: none;
        border-radius: 30px;
        padding-left: 40px;
    }

    .pill-filter {
        background-color: var(--pill-inactive);
        color: #555;
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
        background-color: #f3ece0;
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
        background-color: #ffffff;
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
        background-color: #e2f7ed;
        color: #107c41;
    }

    .trend-down {
        background-color: #fde7e9;
        color: #a80000;
    }

    .demand-badge {
        border-radius: 20px;
        padding: 4px 12px;
        font-size: 0.75rem;
        font-weight: bold;
        display: inline-block;
    }

    .demand-very-high {
        background-color: #e6f9f0;
        color: #0fa958;
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
        background: #faf7ea;
    }

    .mini-stat {
        background: #eee8d6;
        border: 1px solid #d8d0b6;
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
        --bs-pagination-color: #1b4d22;
        --bs-pagination-hover-color: #1b4d22;
        --bs-pagination-active-bg: #1b4d22;
        --bs-pagination-active-border-color: #1b4d22;
        --bs-pagination-hover-bg: #e9f3ec;
    }
    .pagination .page-item.active .page-link {
        background-color: #1b4d22 !important;
        border-color: #1b4d22 !important;
        color: #fff !important;
    }
    .pagination .page-link {
        color: #1b4d22 !important;
    }
    .pagination .page-link:hover {
        background-color: #e9f3ec !important;
        color: #1b4d22 !important;
    }
    .pagination .page-link:focus {
        box-shadow: 0 0 0 0.25rem rgba(27, 77, 34, 0.25) !important;
        color: #1b4d22 !important;
    }
    .pill-filter {
    text-decoration: none;
    color: #202020;
}
.pill-filter.active {
    color: #fff;
}

.dropdown-sort {
    color: #1b4d22 !important;
    text-decoration: none;
}

.dropdown-sort:hover {
    color: #1b4d22 !important;
}

.dropdown-sort.active {
    color: #fff !important;
    background-color: #1b4d22;
}


</style>
    
</head>

<body
    data-is-authenticated="{{ auth()->check() ? 'true' : 'false' }}"
    data-user-name="{{ auth()->check() ? e(auth()->user()->name) : '' }}"
>
    @yield('hero')
    <main>
        @yield('content')
    </main>
</body>

</html>