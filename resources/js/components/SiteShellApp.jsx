import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Bell, CalendarDays, CircleUser, Coins, Flag, GraduationCap, House, Info, MoonStar, Newspaper, Sprout, Sun, Wheat } from 'lucide-react';
import MobileHeader from './MobileHeader.jsx';
import useIsMobile from '../hooks/useIsMobile.js';
import { t, getLocale } from '../i18n.js';
// Phone-only styles for the whole site (the mobile header, tap targets, spacing).
import '../../css/mobile.css';

export default function SiteShellApp({
    userName = '',
    isGuest = true,
    currentPath = '/',
    children = null,
    csrfToken = '',
}) {
    const navItems = [
        { label: t('nav.home'), href: '/home' },
        { label: t('nav.varieties'), href: '/variety' },
        { label: t('nav.prices'), href: '/pricemarket' },
        { label: t('nav.news'), href: '/news' },
        { label: t('nav.learn'), href: '/learn' },
        { label: t('nav.about'), href: '/about' },
    ];
    const locale = getLocale();
    const isAdmin = document.body.dataset.isAdmin === 'true';
    const isMobile = useIsMobile();

    // The phone menu has room for the pages the desktop bar only links from the footer.
    const mobileLinks = [
        { ...navItems[0], Icon: House },
        { ...navItems[1], Icon: Wheat },
        { ...navItems[2], Icon: Coins },
        { label: t('nav.calendar'), href: '/calendar', Icon: CalendarDays },
        { label: t('nav.recommend'), href: '/variety/recommend', Icon: Sprout },
        { ...navItems[3], Icon: Newspaper },
        { ...navItems[4], Icon: GraduationCap },
        { ...navItems[5], Icon: Info },
        { label: t('nav.alerts'), href: '/alerts', Icon: Bell },
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

        if (href === '/calendar') {
            return currentPath.startsWith('/calendar');
        }

        if (href === '/variety/recommend') {
            return currentPath.startsWith('/variety/recommend');
        }

        if (href === '/alerts') {
            return currentPath.startsWith('/alerts');
        }

        if (href === '/learn') {
            return currentPath.startsWith('/learn');
        }

        if (href === '/about') {
            return currentPath === '/about';
        }

        return false;
    };

    // Light / dark theme. The layout's <head> script already applied the saved or device choice.
    const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        const root = document.documentElement;
        root.classList.add('theme-switching');
        root.dataset.theme = next;
        root.dataset.bsTheme = next;
        try { localStorage.setItem('theme', next); } catch (e) { /* private mode: still switches for this page */ }
        setTimeout(() => root.classList.remove('theme-switching'), 350);
        setTheme(next);
    };

    const [query, setQuery] = useState('');
    const [suggestionResults, setSuggestionResults] = useState([]);

    // Live suggestions from the server, fetched shortly after the user stops typing.
    useEffect(() => {
        const term = query.trim();
        if (!term) {
            setSuggestionResults([]);
            return undefined;
        }

        const controller = new AbortController();
        const timer = setTimeout(() => {
            fetch(`/search/suggest?q=${encodeURIComponent(term)}`, { signal: controller.signal, headers: { Accept: 'application/json' } })
                .then((response) => (response.ok ? response.json() : []))
                .then((items) => setSuggestionResults(items.slice(0, 8)))
                .catch(() => {});
        }, 200);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [query]);

    // The nav is position: fixed. The space it covers from the top of the window (the gap above it plus
    // its height, which grows when it wraps onto more rows on narrow screens) is kept in
    // --site-nav-height, so the header holds that space in the page and anchor jumps land below the nav.
    // navRef points at whichever header is showing (desktop nav or phone bar), so this re-runs on a swap.
    const navRef = useRef(null);
    useLayoutEffect(() => {
        const nav = navRef.current;
        if (!nav) return undefined;
        const setHeight = () => {
            const top = parseFloat(getComputedStyle(nav).top) || 0;
            document.documentElement.style.setProperty('--site-nav-height', `${nav.offsetHeight + top}px`);
        };
        setHeight();
        const observer = new ResizeObserver(setHeight);
        observer.observe(nav);
        return () => observer.disconnect();
    }, [isMobile]);

    // Shadow once the page scrolls under the nav. On phones the nav is several rows tall, so it
    // slides away while scrolling down and comes back when scrolling up.
    const [scrolled, setScrolled] = useState(false);
    const [navHidden, setNavHidden] = useState(false);
    useEffect(() => {
        let lastY = window.scrollY;
        const onScroll = () => {
            const y = window.scrollY;
            setScrolled(y > 0);
            if (Math.abs(y - lastY) < 8) return;
            const nav = navRef.current;
            if (!nav) return;
            setNavHidden(y > lastY && y > nav.offsetHeight && !nav.contains(document.activeElement));
            lastY = y;
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <style>{`
                .site-shell-react {
                    color: var(--text);
                    font-family: var(--font-body);
                }
                .site-shell-react .bg-header-green {
                    background-color: var(--green) !important;
                }
                html {
                    scroll-padding-top: calc(var(--site-nav-height, 0px) + 16px);
                }
                /* The nav floats: it sits --site-nav-gap below the top of the window and takes 90% of the width. */
                .site-shell-react.site-header {
                    --site-nav-gap: 14px;
                    height: calc(var(--site-nav-height, 88px) + var(--site-nav-gap));
                    background: transparent;
                }
                .site-shell-react .site-nav {
                    position: fixed;
                    top: var(--site-nav-gap);
                    left: 5%;
                    right: 5%;
                    /* Above page content (z-index up to 10), below the z-index 20 modal backdrops. */
                    z-index: 15;
                    background: var(--green);
                    color: white;
                    transition: box-shadow 0.25s ease, transform 0.3s ease;
                }
                .site-shell-react .site-nav.is-scrolled {
                    box-shadow: 0 8px 24px rgba(0,0,0,0.14);
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
                    width: 44px;
                    height: 44px;
                    display: block;
                    flex-shrink: 0;
                }
                .site-shell-react .brand-name {
                    display: block;
                    font-family: var(--font-heading);
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
                    white-space: nowrap;
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
                    white-space: nowrap;
                    text-decoration: none;
                    font-weight: 500;
                    padding-bottom: 6px;
                    border-bottom: 2px solid transparent;
                    transition: all 0.2s ease;
                }
                .site-shell-react .nav-link-item a.active,
                .site-shell-react .nav-link-item a:hover {
                    color: white;
                    border-color: var(--gold);
                }
                .site-shell-react .nav-actions {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex-wrap: wrap;
                }
                .site-shell-react .nav-search {
                    min-width: 200px;
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
                    background: var(--surface);
                    border: 1px solid rgba(var(--green-rgb), 0.1);
                    border-radius: 8px;
                    box-shadow: 0 14px 28px rgba(0,0,0,0.08);
                    overflow: hidden;
                }
                .site-shell-react .suggestion-item {
                    width: 100%;
                    border: none;
                    background: var(--surface);
                    padding: 10px 12px;
                    text-align: left;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                    color: var(--text);
                    cursor: pointer;
                }
                .site-shell-react .suggestion-item:hover {
                    background: var(--blue-soft);
                }
                .site-shell-react .suggestion-meta {
                    color: var(--text-muted);
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
                    background: var(--gold);
                    color: white;
                }
                .site-shell-react .nav-button.light {
                    color: white;
                    text-decoration: none;
                }
                .site-shell-react .nav-button.icon {
                    padding: 6px 6px;
                    font-size: 1rem;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                .site-shell-react .lang-switch {
                    border: 1px solid rgba(255,255,255,0.35);
                    padding: 5px 10px;
                }
                .site-shell-react .theme-switch {
                    border: 1px solid rgba(255,255,255,0.35);
                    background: transparent;
                    color: var(--gold-light);
                    width: 34px;
                    height: 34px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }
                .site-shell-react .welcome-text {
                    color: rgba(255,255,255,0.9);
                    font-size: 0.85rem;
                    white-space: nowrap;
                }
                .site-shell-react .user-chip {
                    display: none;
                    align-items: center;
                    color: rgba(255,255,255,0.9);
                }
                .site-shell-react .logout-form button {
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.5);
                    color: white;
                    border-radius: 6px;
                    padding: 6px 12px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    white-space: nowrap;
                }
                /* Desktop: the bar's content is capped at 1180px, and a signed-in bar has more buttons than a guest's,
                   so at every desktop width the welcome text becomes an icon and the gaps tighten, to keep one row. */
                @media (min-width: 901px) {
                    .site-shell-react .site-nav-inner { gap: 12px; }
                    .site-shell-react .nav-links { gap: 14px; }
                    .site-shell-react .nav-actions { gap: 8px; }
                    .site-shell-react .nav-search { min-width: 0; width: 180px; }
                    .site-shell-react .welcome-text { display: none; }
                    .site-shell-react .user-chip { display: inline-flex; }
                }
                .site-shell-react .site-footer {
                    background: var(--green);
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
                    width: 46px;
                    height: 46px;
                    display: block;
                    flex-shrink: 0;
                }
                .site-shell-react .footer-title {
                    color: var(--gold-light);
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
                    color: var(--gold-light);
                }
                .site-shell-react .socials a {
                    color: var(--gold-light);
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
                    .site-shell-react .site-nav.is-hidden:not(:focus-within) {
                        /* Also clear the gap above it and its shadow, so no sliver stays on screen. */
                        transform: translateY(calc(-100% - var(--site-nav-gap) - 32px));
                    }
                    .site-shell-react .footer-grid {
                        grid-template-columns: 1fr;
                    }
                }
                @media (prefers-reduced-motion: reduce) {
                    .site-shell-react .site-nav { transition: none; }
                }
                @media print {
                    .site-shell-react.site-header { height: auto; }
                    .site-shell-react .site-nav { position: static; box-shadow: none; }
                }
            `}</style>

            <header className={`site-shell-react site-header${isMobile ? ' is-mobile' : ''}`}>
                {isMobile ? (
                    <MobileHeader
                        ref={navRef}
                        links={mobileLinks}
                        isActive={isActive}
                        locale={locale}
                        theme={theme}
                        onToggleTheme={toggleTheme}
                        isGuest={isGuest}
                        isAdmin={isAdmin}
                        userName={userName}
                        csrfToken={csrfToken}
                        scrolled={scrolled}
                    />
                ) : (
                <div ref={navRef} className={`site-nav${scrolled ? ' is-scrolled' : ''}${navHidden ? ' is-hidden' : ''}`}>
                    <div className="site-nav-inner">
                        <a className="brand" href="/home">
                            <img className="brand-mark" src="/icons/logo-mark.svg" alt="" width="44" height="44" />
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
                                        placeholder={t('nav.searchShort')}
                                        aria-label={t('nav.search')}
                                        autoComplete="off"
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                    />

                                    {suggestionResults.length > 0 ? (
                                        <div className="search-suggest">
                                            {suggestionResults.map((item) => (
                                                <button
                                                    key={`${item.kind}-${item.label}`}
                                                    type="button"
                                                    className="suggestion-item"
                                                    onClick={(event) => {
                                                        setQuery(item.label);
                                                        const form = event.currentTarget.closest('form');
                                                        if (form) form.submit();
                                                    }}
                                                >
                                                    <span>{item.label}</span>
                                                    <span className="suggestion-meta">{item.kind === 'news' ? t('nav.news') : item.meta}</span>
                                                </button>
                                            ))}
                                        </div>
                                    ) : null}
                                </form>
                            </div>

                            <a
                                href={`/locale/${locale === 'km' ? 'en' : 'km'}`}
                                className="nav-button light lang-switch"
                                lang={locale === 'km' ? 'en' : 'km'}
                                title={locale === 'km' ? 'Switch to English' : 'ប្ដូរទៅភាសាខ្មែរ'}
                            >
                                {locale === 'km' ? 'EN' : 'ខ្មែរ'}
                            </a>

                            <button
                                type="button"
                                className="nav-button light icon theme-switch"
                                onClick={toggleTheme}
                                aria-pressed={theme === 'dark'}
                                title={theme === 'dark'
                                    ? (locale === 'km' ? 'ប្ដូរទៅរបៀបភ្លឺ' : 'Switch to light mode')
                                    : (locale === 'km' ? 'ប្ដូរទៅរបៀបងងឹត' : 'Switch to dark mode')}
                                aria-label={locale === 'km' ? 'របៀបងងឹត' : 'Dark mode'}
                            >
                                {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <MoonStar size={16} aria-hidden="true" />}
                            </button>

                            {isGuest ? (
                                <>
                                    <a href="/signup" className="nav-button light">{t('nav.signup')}</a>
                                    <a href="/login" className="nav-button gold">{t('nav.login')}</a>
                                </>
                            ) : (
                                <>
                                    <a href="/alerts" className="nav-button light icon" title={t('nav.alerts')} aria-label={t('nav.alerts')}><Bell size={16} aria-hidden="true" /></a>
                                    {isAdmin ? <a href="/admin/reports" className="nav-button light icon" title={t('reports.title')} aria-label={t('reports.title')}><Flag size={16} aria-hidden="true" /></a> : null}
                                    <span className="welcome-text">{t('nav.welcome', { name: userName })}</span>
                                    {/* Stands in for the welcome text on desktop, where the bar is short of room; the phone menu shows the text. */}
                                    <span className="user-chip" role="img" title={t('nav.welcome', { name: userName })} aria-label={t('nav.welcome', { name: userName })}>
                                        <CircleUser size={20} aria-hidden="true" />
                                    </span>
                                    <form action="/logout" method="POST" className="logout-form">
                                        <input type="hidden" name="_token" value={csrfToken || document.body.dataset.csrf} />
                                        <button type="submit">{t('nav.logout')}</button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                )}
            </header>

            <main>{children}</main>

            <footer className="site-shell-react">
                <div className="site-footer">
                    <div className="site-footer-inner">
                        <div className="footer-grid">
                            <div>
                                <div className="footer-brand">
                                    <img className="footer-brand-mark" src="/icons/logo-mark.svg" alt="" width="46" height="46" />
                                    <h5 style={{ margin: 0, fontSize: '1.3rem', fontFamily: 'var(--font-heading)' }}>KhmerRice</h5>
                                </div>
                                <p className="footer-meta" style={{ lineHeight: 1.7, margin: 0 }}>
                                    {t('footer.about')}
                                </p>
                            </div>

                            <div>
                                <h6 className="footer-title">{t('footer.navigation')}</h6>
                                <ul className="footer-links">
                                    {navItems.map((item) => <li key={item.href}><a href={item.href}>{item.label}</a></li>)}
                                    <li><a href="/calendar">{t('nav.calendar')}</a></li>
                                    <li><a href="/variety/recommend">{t('nav.recommend')}</a></li>
                                    <li><a href="/alerts">{t('nav.alerts')}</a></li>
                                </ul>
                            </div>

                            <div>
                                <h6 className="footer-title">{t('variety.title')}</h6>
                                <ul className="footer-list">
                                    <li>Phka Rumduol</li>
                                    <li>Sen Kra Ob</li>
                                    <li>Neab Dam</li>
                                    <li>Phka Rumdeng</li>
                                    <li>Angkor Damnaeb</li>
                                </ul>
                            </div>

                            <div>
                                <h6 className="footer-title">{t('footer.contact')}</h6>
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
                            <span>{t('footer.rights')}</span>
                            <span>{t('footer.ministry')}</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
