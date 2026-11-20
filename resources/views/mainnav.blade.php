<header class="bg-header-green text-white pb-5">
    <nav class="navbar navbar-expand-lg navbar-dark bg-header-green pt-3">
        <div class="container">
            <!-- Logo -->
            <a class="navbar-brand d-flex align-items-center" href="/home">
                <div class="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center me-2"
                    style="width: 32px; height: 32px;">
                    🌾
                </div>
                <div>
                    <span class="fw-bold d-block lh-1" style="font-size: 1.2rem; letter-spacing: 0.5px;">
                        KhmerRice
                    </span>
                    <small class="text-white-50" style="font-size: 0.65rem;">
                        CAMBODIA MARKET
                    </small>
                </div>
            </a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Navigation -->
            <div class="collapse navbar-collapse" id="navbarNav">

                <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-3">

                    <li class="nav-item">
                        <a class="nav-link nav-link-custom {{ request()->is('home') ? 'active' : '' }}"
                            href="/home">Home</a>
                    </li>

                    <li class="nav-item dropdown">
                    <a class="nav-link nav-link-custom dropdown-toggle {{ request()->is('variety*') ? 'active' : '' }}"
   href="#"
   role="button"
   data-bs-toggle="dropdown"
   aria-expanded="false">
    Varieties
</a>
    <ul class="dropdown-menu bg-header-green border-white p-0 overflow-hidden shadow-sm">
        <li>
            <a class="dropdown-item bg-header-green text-white" href="/variety">View Varieties</a>
        </li>
        <li>
            <a class="dropdown-item bg-header-green text-white" href="/manage-varieties">Manage Varieties</a>
        </li>
    </ul>
</li>

                            <li class="nav-item dropdown">
                        <a class="nav-link nav-link-custom dropdown-toggle {{ request()->is('pricemarket') ? 'active' : '' }}"
                        href="#" role="button" data-bs-toggle="dropdown">
                            Prices
                        </a>

                        <ul class="dropdown-menu bg-header-green border-white p-0 overflow-hidden">
                            <li>
                                <a class="dropdown-item bg-header-green text-white" href="{{ route('pricemarket') }}">
                                    View Market Prices
                                </a>
                            </li>

                            @can('admin')
                            <li>
                                <a class="dropdown-item bg-header-green text-white" href="{{ route('admin.market-prices.index') }}">
                                    Manage Prices
                                </a>
                            </li>

                            <li>
                                <a class="dropdown-item bg-header-green text-white" href="{{ route('admin.market-prices.create') }}">
                                    Add New Price
                                </a>
                            </li>
                            @endcan
                        </ul>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link nav-link-custom {{ request()->is('news') ? 'active' : '' }}"
                            href="/news">News</a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link nav-link-custom {{ request()->is('about') ? 'active' : '' }}"
                            href="/about">About</a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link nav-link-custom {{ request()->is('dashboard') ? 'active' : '' }}"
                            href="/dashboard">Dashboard</a>
                    </li>

                </ul>

                <div class="d-flex align-items-center gap-3">

                    <!-- Search -->
                    {{-- <div class="position-relative">
                        <input class="form-control form-control-sm search-nav-input ps-5" type="search"
                            placeholder="Search rice...">
                        <span class="position-absolute top-50 start-0 translate-middle-y ms-3 text-black-50 d-flex align-items-center"
                            style="pointer-events: none;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor"
                                class="bi bi-search" viewBox="0 0 16 16">
                                <path
                                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                            </svg>
                        </span>
                    </div> --}}

                    {{-- <div class="d-flex align-items-center flex-grow-1 flex-md-grow-0" style="min-width: 260px;">
    <form action="/search" method="GET" class="position-relative w-100" role="search">
        <input
            type="text"
            name="q"
            value="{{ request('q') }}"
            class="form-control search-filter-input ps-5"
            placeholder="Search rice...">

        <span class="position-absolute top-50 start-3 translate-middle-y text-muted">🔍</span>
    </form>
</div> --}}

<div class="position-relative" style="min-width: 220px;">
    <form action="/search" method="GET" role="search">
        <input
            type="text"
            id="navSearch"
            name="q"
            value="{{ request('q') }}"
            class="form-control form-control-sm search-nav-input ps-4"
            placeholder="Search rice..."
            autocomplete="off">
    </form>

    <div id="navSuggest"
         class="position-absolute bg-white border rounded shadow-sm"
         style="display:none; z-index:99999; top:38px; left:0; right:0; overflow:hidden;"></div>
</div>

<script>
(function () {
    const input = document.getElementById('navSearch');
    const box = document.getElementById('navSuggest');
    let timer;

    input.addEventListener('input', function () {
        clearTimeout(timer);
        const q = input.value.trim();
        if (!q) { box.style.display = 'none'; return; }

        timer = setTimeout(() => {
            fetch(`/search/suggest?q=${encodeURIComponent(q)}`)
                .then(res => res.json())
                .then(items => {
                    if (!items.length) { box.style.display = 'none'; return; }
                    box.innerHTML = items.map(it => `
                        <div class="suggestion px-3 py-2 d-flex justify-content-between align-items-center"
                             data-label="${it.label}" style="cursor:pointer; color:#202020;">
                            <span style="font-size:14px;">${it.label}</span>
                            <span style="font-size:11px; color:#888;">${it.meta}</span>
                        </div>
                    `).join('');
                    box.style.display = 'block';

                    box.querySelectorAll('.suggestion').forEach(el => {
                        el.addEventListener('click', () => {
                            input.value = el.dataset.label;
                            box.style.display = 'none';
                            input.form.submit();
                        });
                        el.addEventListener('mouseenter', () => el.style.background = '#f3ece0');
                        el.addEventListener('mouseleave', () => el.style.background = 'transparent');
                    });
                })
                .catch(() => { box.style.display = 'none'; });
        }, 250);
    });

    // Hide dropdown when clicking elsewhere
    document.addEventListener('click', function (e) {
        if (!input.contains(e.target) && !box.contains(e.target)) {
            box.style.display = 'none';
        }
    });
})();
</script>

                    @guest
                        <a href="/signup" class="text-white text-decoration-none small fw-semibold">
                            Sign Up
                        </a>
                        <a href="/login" class="btn btn-gold btn-sm">
                            Login
                        </a>
                    @endguest

                    @auth
                        <span class="text-white small">
                            Welcome, {{ auth()->user()->name }}
                        </span>
                        <form action="/logout" method="POST" class="d-inline">
                            @csrf
                            <button type="submit" class="btn btn-outline-light btn-sm">
                                Logout
                            </button>
                        </form>
                    @endauth

                </div>

            </div>

        </div>
    </nav>
</header>