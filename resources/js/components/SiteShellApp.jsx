import React, { useMemo, useState } from 'react';

const suggestionCatalog = [
    { label: 'Phka Rumduol', meta: 'Jasmine' },
    { label: 'Sen Kra Ob', meta: 'Variety' },
    { label: 'Neab Dam', meta: 'Local' },
    { label: 'Angkor Damnaeb', meta: 'Premium' },
    { label: 'Rice market prices', meta: 'Latest' },
    { label: 'Cambodia farmers', meta: 'News' },
];

export default function SiteShellApp({
    userName = '',
    isGuest = true,
    currentPath = '/',
    children = null,
    csrfToken = '',
}) {
    const navItems = [
        { label: 'Home', href: '/home' },
        { label: 'Varieties', href: '/variety' },
        { label: 'Prices', href: '/pricemarket' },
        { label: 'News', href: '/news' },
        { label: 'About', href: '/about' },
        { label: 'Dashboard', href: '/dashboard' },
    ];

    const isActive = (href) => {
        if (href === '/home') {
            return currentPath === '/' || currentPath === '/home';
        }

        if (href === '/variety') {
            return currentPath.startsWith('/variety') || currentPath.startsWith('/manage-varieties');
        }

        if (href === '/pricemarket') {
            return currentPath.startsWith('/pricemarket') || currentPath.startsWith('/admin/market-prices');
        }

        if (href === '/news') {
            return currentPath.startsWith('/news');
        }

        if (href === '/about') {
            return currentPath === '/about';
        }

        if (href === '/dashboard') {
            return currentPath === '/dashboard';
        }

        return false;
    };

    const [query, setQuery] = useState('');

    const suggestionResults = useMemo(() => {
        const term = query.trim().toLowerCase();
        if (!term) return [];

        return suggestionCatalog.filter((item) => {
            const text = `${item.label} ${item.meta}`.toLowerCase();
            return text.includes(term);
        }).slice(0, 5);
    }, [query]);

    return (
        <>
            <style>{`
                .site-shell-react {
                    color: #202020;
                    font-family: system-ui, -apple-system, Segoe UI, sans-serif;
                }
                .site-shell-react .bg-header-green {
                    background-color: #1b4d22 !important;
                }
                .site-shell-react .site-nav {
                    background: #1b4d22;
                    color: white;
                    width: 100%;
                }
                .site-shell-react .site-nav-inner {
                    max-width: 1180px;
                    margin: 0 auto;
                    padding: 18px 20px 12px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                }
                .site-shell-react .brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: white;
                    text-decoration: none;
                }
                .site-shell-react .brand-mark {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #f4c84f;
                    display: grid;
                    place-items: center;
                    font-size: 1.2rem;
                }
                .site-shell-react .brand-name {
                    display: block;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 1.2rem;
                    font-weight: 700;
                    line-height: 1.1;
                }
                .site-shell-react .brand-sub {
                    display: block;
                    font-size: 0.65rem;
                    letter-spacing: 0.08em;
                    opacity: 0.7;
                    text-transform: uppercase;
                }
                .site-shell-react .nav-links {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 18px;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    flex-wrap: wrap;
                }
                .site-shell-react .nav-link-item a {
                    color: rgba(255,255,255,0.8);
                    text-decoration: none;
                    font-weight: 500;
                    padding-bottom: 6px;
                    border-bottom: 2px solid transparent;
                    transition: all 0.2s ease;
                }
                .site-shell-react .nav-link-item a.active,
                .site-shell-react .nav-link-item a:hover {
                    color: white;
                    border-color: #cca01d;
                }
                .site-shell-react .nav-actions {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex-wrap: wrap;
                }
                .site-shell-react .nav-search {
                    min-width: 220px;
                    position: relative;
                }
                .site-shell-react .nav-search input {
                    width: 100%;
                    background: rgba(255,255,255,0.12);
                    border: 1px solid rgba(255,255,255,0.14);
                    border-radius: 6px;
                    color: white;
                    padding: 8px 12px;
                    font-size: 0.9rem;
                }
                .site-shell-react .nav-search input::placeholder {
                    color: rgba(255,255,255,0.55);
                }
                .site-shell-react .search-suggest {
                    position: absolute;
                    top: 38px;
                    left: 0;
                    right: 0;
                    z-index: 20;
                    background: white;
                    border: 1px solid rgba(27,77,34,0.1);
                    border-radius: 8px;
                    box-shadow: 0 14px 28px rgba(0,0,0,0.08);
                    overflow: hidden;
                }
                .site-shell-react .suggestion-item {
                    width: 100%;
                    border: none;
                    background: white;
                    padding: 10px 12px;
                    text-align: left;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                    color: #202020;
                    cursor: pointer;
                }
                .site-shell-react .suggestion-item:hover {
                    background: #f4efe6;
                }
                .site-shell-react .suggestion-meta {
                    color: #6f6845;
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                }
                .site-shell-react .nav-button {
                    text-decoration: none;
                    border-radius: 6px;
                    padding: 7px 16px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                .site-shell-react .nav-button.gold {
                    background: #cca01d;
                    color: white;
                }
                .site-shell-react .nav-button.light {
                    color: white;
                    text-decoration: none;
                }
                .site-shell-react .welcome-text {
                    color: rgba(255,255,255,0.9);
                    font-size: 0.85rem;
                }
                .site-shell-react .logout-form button {
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.5);
                    color: white;
                    border-radius: 6px;
                    padding: 6px 12px;
                    font-size: 0.8rem;
                    cursor: pointer;
                }
                .site-shell-react .site-footer {
                    background: #1b4d22;
                    color: #fff;
                    padding: 42px 0 18px;
                    margin-top: 32px;
                }
                .site-shell-react .site-footer-inner {
                    max-width: 1180px;
                    margin: 0 auto;
                    padding: 0 20px;
                }
                .site-shell-react .footer-grid {
                    display: grid;
                    grid-template-columns: 1.2fr 1fr 1fr 1.2fr;
                    gap: 28px;
                }
                .site-shell-react .footer-brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 12px;
                }
                .site-shell-react .footer-brand-mark {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #f4c84f;
                    display: grid;
                    place-items: center;
                    font-size: 1.2rem;
                }
                .site-shell-react .footer-title {
                    color: #f4c84f;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    font-size: 0.78rem;
                    font-weight: 800;
                    margin: 0 0 14px;
                }
                .site-shell-react .footer-links,
                .site-shell-react .footer-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: grid;
                    gap: 8px;
                    color: rgba(255,255,255,0.72);
                }
                .site-shell-react .footer-links a,
                .site-shell-react .footer-list li,
                .site-shell-react .footer-meta {
                    color: rgba(255,255,255,0.72);
                    text-decoration: none;
                    font-size: 0.95rem;
                }
                .site-shell-react .socials {
                    display: flex;
                    gap: 14px;
                    margin-top: 18px;
                    color: #f4c84f;
                }
                .site-shell-react .socials a {
                    color: #f4c84f;
                    text-decoration: none;
                    font-size: 1.1rem;
                }
                .site-shell-react .footer-divider {
                    border: none;
                    border-top: 1px solid rgba(255,255,255,0.2);
                    margin: 22px 0 14px;
                }
                .site-shell-react .footer-bottom {
                    display: flex;
                    justify-content: space-between;
                    gap: 18px;
                    flex-wrap: wrap;
                    color: rgba(255,255,255,0.7);
                    font-size: 0.85rem;
                }
                @media (max-width: 900px) {
                    .site-shell-react .site-nav-inner {
                        flex-wrap: wrap;
                        justify-content: center;
                    }
                    .site-shell-react .footer-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                }
                @media (max-width: 640px) {
                    .site-shell-react .site-nav-inner {
                        padding-top: 14px;
                    }
                    .site-shell-react .nav-links {
                        justify-content: center;
                    }
                    .site-shell-react .nav-actions {
                        width: 100%;
                        justify-content: center;
                    }
                    .site-shell-react .footer-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            <header className="site-shell-react">
                <div className="site-nav">
                    <div className="site-nav-inner">
                        <a className="brand" href="/home">
                            <div className="brand-mark">🌾</div>
                            <div>
                                <span className="brand-name">KhmerRice</span>
                                <small className="brand-sub">Cambodia Market</small>
                            </div>
                        </a>

                        <ul className="nav-links">
                            {navItems.map((item) => (
                                <li key={item.label} className="nav-link-item">
                                    <a href={item.href} className={isActive(item.href) ? 'active' : ''}>{item.label}</a>
                                </li>
                            ))}
                        </ul>

                        <div className="nav-actions">
                            <div className="nav-search">
                                <form action="/search" method="GET" role="search">
                                    <input
                                        type="text"
                                        name="q"
                                        placeholder="Search rice..."
                                        autoComplete="off"
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                    />

                                    {suggestionResults.length > 0 ? (
                                        <div className="search-suggest">
                                            {suggestionResults.map((item) => (
                                                <button
                                                    key={item.label}
                                                    type="button"
                                                    className="suggestion-item"
                                                    onClick={(event) => {
                                                        setQuery(item.label);
                                                        const form = event.currentTarget.closest('form');
                                                        if (form) form.submit();
                                                    }}
                                                >
                                                    <span>{item.label}</span>
                                                    <span className="suggestion-meta">{item.meta}</span>
                                                </button>
                                            ))}
                                        </div>
                                    ) : null}
                                </form>
                            </div>

                            {isGuest ? (
                                <>
                                    <a href="/signup" className="nav-button light">Sign Up</a>
                                    <a href="/login" className="nav-button gold">Login</a>
                                </>
                            ) : (
                                <>
                                    <span className="welcome-text">Welcome, {userName}</span>
                                    <form action="/logout" method="POST" className="logout-form">
                                        <input type="hidden" name="_token" value={csrfToken} />
                                        <button type="submit">Logout</button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main>{children}</main>

            <footer className="site-shell-react">
                <div className="site-footer">
                    <div className="site-footer-inner">
                        <div className="footer-grid">
                            <div>
                                <div className="footer-brand">
                                    <div className="footer-brand-mark">🌾</div>
                                    <h5 style={{ margin: 0, fontSize: '1.3rem', fontFamily: 'Georgia, "Times New Roman", serif' }}>KhmerRice</h5>
                                </div>
                                <p className="footer-meta" style={{ lineHeight: 1.7, margin: 0 }}>
                                    Cambodia&apos;s premier platform for rice market data, variety information, and agricultural insights.
                                </p>
                            </div>

                            <div>
                                <h6 className="footer-title">Navigation</h6>
                                <ul className="footer-links">
                                    <li><a href="/home">Home</a></li>
                                    <li><a href="/variety">Varieties</a></li>
                                    <li><a href="/pricemarket">Prices</a></li>
                                    <li><a href="/news">News</a></li>
                                    <li><a href="/about">About</a></li>
                                    <li><a href="/dashboard">Dashboard</a></li>
                                </ul>
                            </div>

                            <div>
                                <h6 className="footer-title">Rice Varieties</h6>
                                <ul className="footer-list">
                                    <li>Phka Rumduol</li>
                                    <li>Sen Kra Ob</li>
                                    <li>Neab Dam</li>
                                    <li>Phka Rumdeng</li>
                                    <li>Angkor Damnaeb</li>
                                </ul>
                            </div>

                            <div>
                                <h6 className="footer-title">Contact</h6>
                                <ul className="footer-list">
                                    <li>📍 Phnom Penh, Cambodia</li>
                                    <li>✉️ info@khmerrice.kh</li>
                                    <li>📞 +855 23 456 789</li>
                                </ul>
                                <div className="socials">
                                    <a href="https://facebook.com" target="_blank" rel="noreferrer">f</a>
                                    <a href="https://x.com" target="_blank" rel="noreferrer">x</a>
                                    <a href="https://linkedin.com" target="_blank" rel="noreferrer">in</a>
                                    <a href="mailto:info@khmerrice.kh">✉</a>
                                </div>
                            </div>
                        </div>

                        <hr className="footer-divider" />

                        <div className="footer-bottom">
                            <span>© 2026 KhmerRice Market. All rights reserved.</span>
                            <span>Ministry of Agriculture, Forestry &amp; Fisheries — Cambodia</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
