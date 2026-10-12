import React, { useEffect, useRef, useState } from 'react';
import { Flag, Globe, Menu, MoonStar, Search, Sun, X } from 'lucide-react';
import { t } from '../i18n.js';

// Phone header: a slim fixed bar (logo, search, menu) and a slide-in menu with everything
// the desktop nav shows. Styles are in resources/css/mobile.css.
export default function MobileHeader({
    ref,
    links = [],
    isActive,
    locale,
    theme,
    onToggleTheme,
    isGuest,
    isAdmin,
    userName,
    csrfToken,
    scrolled,
}) {
    const [open, setOpen] = useState(false);
    const menuButtonRef = useRef(null);
    const closeButtonRef = useRef(null);
    const drawerRef = useRef(null);

    const close = () => {
        setOpen(false);
        menuButtonRef.current?.focus();
    };

    // While the menu is open: no page scrolling behind it, Escape closes it, and Tab stays inside it.
    useEffect(() => {
        if (!open) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeButtonRef.current?.focus();

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                close();
                return;
            }
            if (event.key !== 'Tab') return;

            const focusable = [...drawerRef.current.querySelectorAll('a, button, input, select, textarea')]
                .filter((el) => !el.disabled && el.offsetParent !== null);
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);

    return (
        <>
            <div ref={ref} className={`m-bar${scrolled ? ' is-scrolled' : ''}`}>
                <a className="m-brand" href="/home">
                    <img src="/icons/logo-mark.svg" alt="" width="34" height="34" />
                    <span>KhmerRice</span>
                </a>
                <div className="m-bar-actions">
                    <a className="m-icon" href="/search" aria-label={t('search.button')} title={t('search.button')}>
                        <Search size={22} aria-hidden="true" />
                    </a>
                    <button
                        ref={menuButtonRef}
                        type="button"
                        className="m-icon"
                        aria-label={t('nav.menu')}
                        aria-expanded={open}
                        aria-controls="m-menu"
                        onClick={() => setOpen(true)}
                    >
                        <Menu size={24} aria-hidden="true" />
                    </button>
                </div>
            </div>

            {open ? (
                <div className="m-overlay" onClick={close}>
                    <nav
                        id="m-menu"
                        ref={drawerRef}
                        className="m-drawer"
                        role="dialog"
                        aria-modal="true"
                        aria-label={t('nav.menu')}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="m-drawer-head">
                            <span>{t('nav.menu')}</span>
                            <button ref={closeButtonRef} type="button" className="m-icon" onClick={close} aria-label={t('nav.close')}>
                                <X size={24} aria-hidden="true" />
                            </button>
                        </div>

                        <form action="/search" method="GET" role="search" className="m-search">
                            <Search size={18} aria-hidden="true" />
                            <input type="search" name="q" placeholder={t('nav.search')} aria-label={t('nav.search')} autoComplete="off" />
                        </form>

                        <ul className="m-links">
                            {links.map((link) => (
                                <li key={link.href}>
                                    <a href={link.href} className={isActive(link.href) ? 'is-active' : ''} aria-current={isActive(link.href) ? 'page' : undefined}>
                                        {/* link.Icon is a lucide-react icon component. */}
                                        {link.Icon ? <link.Icon className="m-link-icon" size={22} strokeWidth={1.9} aria-hidden="true" /> : null}
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        <div className="m-row">
                            <a
                                href={`/locale/${locale === 'km' ? 'en' : 'km'}`}
                                className="m-chip"
                                lang={locale === 'km' ? 'en' : 'km'}
                            >
                                <Globe size={18} aria-hidden="true" />
                                {' '}{locale === 'km' ? 'English' : 'ភាសាខ្មែរ'}
                            </a>
                            <button type="button" className="m-chip" onClick={onToggleTheme} aria-pressed={theme === 'dark'}>
                                {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <MoonStar size={18} aria-hidden="true" />}
                                {' '}{theme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
                            </button>
                        </div>

                        <div className="m-auth">
                            {isGuest ? (
                                <>
                                    <a href="/login" className="m-button gold">{t('nav.login')}</a>
                                    <a href="/signup" className="m-button outline">{t('nav.signup')}</a>
                                </>
                            ) : (
                                <>
                                    <p className="m-welcome">{t('nav.welcome', { name: userName })}</p>
                                    {isAdmin ? <a href="/admin/reports" className="m-button outline"><Flag size={18} aria-hidden="true" /> {t('reports.title')}</a> : null}
                                    <form action="/logout" method="POST">
                                        <input type="hidden" name="_token" value={csrfToken || document.body.dataset.csrf} />
                                        <button type="submit" className="m-button outline">{t('nav.logout')}</button>
                                    </form>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            ) : null}
        </>
    );
}
