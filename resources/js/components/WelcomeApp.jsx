import React, { useEffect, useRef } from 'react';
import CountUp from './CountUp.jsx';

const overviewCards = [
    { label: 'Live prices', value: '24', detail: 'Updated today' },
    { label: 'Rice varieties', value: '18', detail: 'Across regions' },
    { label: 'Market trends', value: '7%', detail: 'Positive this week' },
    { label: 'Local reports', value: '12', detail: 'Fresh insights' },
];

const quickLinks = [
    { title: 'Market overview', href: '/pricemarket', description: 'Compare rice prices by market and date.' },
    { title: 'Variety explorer', href: '/variety', description: 'Browse rice types and high-demand selections.' },
    { title: 'Latest news', href: '/news', description: 'Follow producer updates and regional stories.' },
    { title: 'Planting calendar', href: '/calendar', description: 'See when to sow and harvest each variety.' },
];

const formatCurrency = (value) => `$${Number(value).toFixed(2)}`;

const trendOf = (value) => {
    const change = Number(value) || 0;
    if (change > 0) return { className: 'up', label: `▲ ${change.toFixed(1)}%` };
    if (change < 0) return { className: 'down', label: `▼ ${Math.abs(change).toFixed(1)}%` };
    return { className: 'flat', label: '• 0.0%' };
};

// Point and heading (degrees) at t along a cubic Bézier curve.
const bezier = ([p0, p1, p2, p3], t) => {
    const u = 1 - t;
    const [x, y] = [0, 1].map((i) => u * u * u * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t * t * t * p3[i]);
    const [dx, dy] = [0, 1].map((i) => 3 * u * u * (p1[i] - p0[i]) + 6 * u * t * (p2[i] - p1[i]) + 3 * t * t * (p3[i] - p2[i]));
    return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI };
};

const curvePath = ([p0, p1, p2, p3]) => `M${p0} C${p1} ${p2} ${p3}`;

// A rice stalk: a stem, a drooping panicle, and grains set alternately either side of it.
const riceStalk = ({ stem, panicle, grains, spread }) => ({
    stem: curvePath(stem),
    panicle: curvePath(panicle),
    grains: Array.from({ length: grains }, (_, i) => {
        const { x, y, angle } = bezier(panicle, 0.1 + (0.88 * i) / (grains - 1));
        const side = i % 2 ? 1 : -1;
        const normal = ((angle + 90) * Math.PI) / 180;
        return {
            cx: +(x + Math.cos(normal) * spread * side).toFixed(1),
            cy: +(y + Math.sin(normal) * spread * side).toFixed(1),
            rotate: +(angle + 30 * side).toFixed(1),
        };
    }),
});

const heroStalk = riceStalk({
    stem: [[80, 298], [78, 220], [70, 140], [78, 70]],
    panicle: [[78, 70], [88, 10], [140, 20], [144, 150]],
    grains: 16,
    spread: 5.5,
});

const scatteredGrains = [
    [18, 30, -30], [38, 16, 20], [54, 40, -60], [72, 22, 40],
    [88, 46, -15], [32, 56, 70], [60, 64, -35], [96, 18, 25],
];

// Rice sprigs and loose grains, used as a mask so the page pattern takes the theme's green.
const patternMask = (() => {
    const sprig = riceStalk({
        stem: [[40, 220], [40, 180], [34, 140], [42, 96]],
        panicle: [[42, 96], [48, 60], [84, 56], [90, 128]],
        grains: 10,
        spread: 4,
    });
    const grains = [[150, 40, -25], [176, 76, 35], [146, 160, 60], [200, 186, -40], [118, 214, 10], [104, 130, -70]]
        .concat(sprig.grains.map(({ cx, cy, rotate }) => [cx, cy, rotate]))
        .map(([cx, cy, rotate]) => `<ellipse cx='${cx}' cy='${cy}' rx='6' ry='2.6' transform='rotate(${rotate} ${cx} ${cy})'/>`)
        .join('');
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'>`
        + `<g fill='#000' stroke='#000' stroke-linecap='round'>`
        + `<path d='${sprig.stem}' fill='none' stroke-width='2'/><path d='${sprig.panicle}' fill='none' stroke-width='1.4'/>`
        + `<g stroke='none'>${grains}</g></g></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
})();

function RiceStalk() {
    return (
        <svg viewBox="0 0 160 300" aria-hidden="true" focusable="false">
            <path className="rice-leaf" d="M79 232 C60 200 34 160 18 118 C40 150 62 186 81 214 Z" />
            <path className="rice-leaf light" d="M78 192 C96 168 116 146 134 118 C122 150 102 176 80 206 Z" />
            <path className="rice-stem" d={heroStalk.stem} strokeWidth="3" />
            <path className="rice-stem" d={heroStalk.panicle} strokeWidth="2" />
            {heroStalk.grains.map(({ cx, cy, rotate }) => (
                <ellipse
                    key={`${cx}-${cy}`}
                    className="rice-grain"
                    cx={cx}
                    cy={cy}
                    rx="6.5"
                    ry="2.7"
                    transform={`rotate(${rotate} ${cx} ${cy})`}
                />
            ))}
        </svg>
    );
}

function RiceGrains() {
    return (
        <svg viewBox="0 0 114 76" aria-hidden="true" focusable="false">
            {scatteredGrains.map(([cx, cy, rotate], i) => (
                <ellipse
                    key={`${cx}-${cy}`}
                    className={`rice-grain${i % 3 ? '' : ' husked'}`}
                    cx={cx}
                    cy={cy}
                    rx="8"
                    ry="3.4"
                    transform={`rotate(${rotate} ${cx} ${cy})`}
                />
            ))}
        </svg>
    );
}

// byMarket: every row is the same variety, so lead with the market instead of repeating it.
function TickerItem({ price, clone, byMarket }) {
    const trend = trendOf(price.change_percent);
    return (
        <li className="home-ticker-item" aria-hidden={clone || undefined}>
            <strong>{byMarket ? price.market : price.rice_variety}</strong>
            {byMarket
                ? price.province !== price.market && <span>{price.province}</span>
                : <span>{price.market}</span>}
            <div>
                <b>{formatCurrency(price.price_per_kg)}</b>
                <em className={trend.className}>{trend.label}</em>
            </div>
        </li>
    );
}

export default function WelcomeApp({ prices = [] }) {
    const wrapRef = useRef(null);

    // Feeds the scroll position to CSS so the decorative rice drifts slower than the page.
    useEffect(() => {
        const wrap = wrapRef.current;
        if (!wrap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

        let frame = 0;
        const update = () => {
            frame = 0;
            wrap.style.setProperty('--scroll', String(window.scrollY));
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };

        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(frame);
        };
    }, []);

    const scrolls = prices.length >= 5;
    const onlyVariety = prices.length > 1 && prices.every((price) => price.rice_variety === prices[0].rice_variety)
        ? prices[0].rice_variety
        : null;
    const topMover = prices.reduce(
        (best, price) => (Math.abs(Number(price.change_percent)) > Math.abs(Number(best?.change_percent ?? 0)) ? price : best),
        null
    );
    const moverTrend = topMover ? trendOf(topMover.change_percent) : null;

    return (
        <>
            <style>{`
                .welcome-react-wrap {
                    --scroll: 0;
                    position: relative;
                    min-height: 100vh;
                    padding: 0 0 68px;
                    overflow-x: hidden;
                    overflow-x: clip;
                    background:
                        radial-gradient(circle at top left, rgba(var(--green-rgb), 0.10), transparent 30%),
                        linear-gradient(135deg, var(--green-soft) 0%, var(--bg) 100%);
                    color: var(--text);
                    font-family: var(--font-body);
                }
                /* Faint rice pattern across the whole page background. */
                .welcome-react-wrap::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                    background: var(--green);
                    opacity: 0.07;
                    pointer-events: none;
                    -webkit-mask: ${patternMask} 0 0 / 240px 240px repeat;
                    mask: ${patternMask} 0 0 / 240px 240px repeat;
                }
                .welcome-react-shell {
                    max-width: 1180px;
                    margin: 0 auto;
                }

                /* Full-width band with a softened rice-field photo that fades into the page. */
                .home-band {
                    position: relative;
                    z-index: 2;
                    isolation: isolate;
                    overflow: hidden;
                    padding: 40px 18px 56px;
                }
                .home-band-photo {
                    position: absolute;
                    inset: -12px;
                    z-index: -1;
                    background:
                        linear-gradient(
                            180deg,
                            color-mix(in srgb, var(--green-dark) 82%, transparent) 0%,
                            color-mix(in srgb, var(--green-dark) 52%, transparent) 55%,
                            color-mix(in srgb, var(--green-dark) 34%, transparent) 100%
                        ),
                        url('/images/extra/ricelandscape.jpg') center 65% / cover no-repeat;
                    filter: blur(3px) saturate(1.08);
                    -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 50%, transparent 90%);
                    mask-image: linear-gradient(180deg, #000 0%, #000 50%, transparent 90%);
                }
                .home-band-inner {
                    position: relative;
                }

                .welcome-react-hero {
                    position: relative;
                    z-index: 2;
                    background: linear-gradient(135deg, var(--green) 0%, var(--green) 100%);
                    border: 1px solid rgba(255,255,255,0.12);
                    color: white;
                    border-radius: 28px;
                    padding: 36px 32px;
                    /* Kept within the band's bottom padding so overflow: hidden doesn't cut it off. */
                    box-shadow: 0 18px 40px -14px rgba(0, 0, 0, 0.32);
                }
                .welcome-react-hero-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 18px;
                    flex-wrap: wrap;
                }
                .welcome-react-kicker {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    border-radius: 999px;
                    background: rgba(255,255,255,0.12);
                    border: 1px solid rgba(255,255,255,0.18);
                    padding: 7px 12px;
                    font-size: 0.78rem;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    font-weight: 700;
                }
                .welcome-react-hero h1 {
                    margin: 16px 0 12px;
                    font-size: clamp(2.3rem, 5vw, 4rem);
                    line-height: 1.08;
                    font-family: var(--font-heading);
                }
                .welcome-react-hero p {
                    margin: 0;
                    max-width: 680px;
                    color: rgba(255,255,255,0.82);
                    font-size: 1.06rem;
                    line-height: 1.7;
                }
                .welcome-react-actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    margin-top: 24px;
                }
                .welcome-react-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 48px;
                    padding: 0 20px;
                    border-radius: 999px;
                    text-decoration: none;
                    font-weight: 700;
                }
                .welcome-react-btn.primary {
                    background: var(--gold-light);
                    color: var(--on-gold);
                }
                .welcome-react-btn.secondary {
                    background: rgba(255,255,255,0.12);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.18);
                }
                .welcome-react-grid {
                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    gap: 18px;
                    margin-top: 28px;
                }
                .welcome-react-stat {
                    background: color-mix(in srgb, var(--surface) 92%, transparent);
                    border: 1px solid rgba(var(--green-rgb), 0.08);
                    border-radius: 20px;
                    padding: 22px 18px;
                    box-shadow: 0 10px 24px rgba(0,0,0,0.04);
                }
                .welcome-react-stat > span {
                    display: block;
                    color: var(--text-muted);
                    font-size: 0.78rem;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                }
                .welcome-react-stat strong {
                    display: block;
                    margin-top: 12px;
                    color: var(--green-ink);
                    font-size: clamp(1.8rem, 2vw, 2.4rem);
                    line-height: 1;
                }
                .welcome-react-stat small {
                    display: block;
                    margin-top: 8px;
                    color: var(--text-muted);
                }

                /* Rice stalks and grains tucked behind the hero card's corners. */
                .home-decor {
                    position: absolute;
                    z-index: 1;
                    pointer-events: none;
                }
                .home-decor svg { display: block; width: 100%; height: auto; }
                .rice-leaf { fill: var(--green); }
                .rice-leaf.light { fill: color-mix(in srgb, var(--green) 70%, white); }
                .rice-stem { fill: none; stroke: var(--gold); stroke-linecap: round; }
                .rice-grain { fill: var(--gold-light); stroke: var(--gold); stroke-width: 0.8; }
                .rice-grain.husked { fill: var(--gold-soft); }
                .home-decor.stalk-left,
                .home-decor.stalk-right {
                    bottom: -56px;
                    width: 136px;
                    transform: translate3d(0, calc(var(--scroll) * 0.12px), 0);
                    -webkit-mask-image: linear-gradient(0deg, transparent 0, #000 35%);
                    mask-image: linear-gradient(0deg, transparent 0, #000 35%);
                }
                .home-decor.stalk-left { left: -98px; }
                .home-decor.stalk-right { right: -98px; }
                .home-decor.stalk-left svg,
                .home-decor.stalk-right svg {
                    transform-origin: 50% 100%;
                    animation: home-sway 7s ease-in-out infinite alternate;
                }
                .home-decor.stalk-left svg { transform: scaleX(-1); }
                .home-decor.stalk-right svg { animation-delay: -3.5s; }
                .home-decor.grains-left,
                .home-decor.grains-right {
                    top: -26px;
                    width: 96px;
                    transform: translate3d(0, calc(var(--scroll) * 0.05px), 0);
                }
                .home-decor.grains-left { left: -66px; }
                .home-decor.grains-right { right: -66px; }
                .home-decor.grains-right svg { transform: scaleX(-1); }
                @keyframes home-sway {
                    from { rotate: -2.5deg; }
                    to { rotate: 2.5deg; }
                }

                /* Side rails that sit in the gutters beside the hero on wide screens. */
                .home-rail {
                    display: none;
                    position: absolute;
                    top: 56px;
                    z-index: 3;
                    width: min(210px, calc((100vw - 1180px) / 2 - 36px));
                    padding: 16px 14px;
                    border-radius: 20px;
                    background: color-mix(in srgb, var(--surface) 88%, transparent);
                    -webkit-backdrop-filter: blur(12px);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255,255,255,0.6);
                    box-shadow: 0 18px 36px rgba(0, 0, 0, 0.2);
                    color: var(--text);
                }
                .home-rail.left { right: calc(100% + 18px); }
                .home-rail.right { left: calc(100% + 18px); }
                .home-rail-head {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 10px;
                    color: var(--green-ink);
                    font-size: 0.72rem;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }
                .home-live-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--green);
                    box-shadow: 0 0 0 0 rgba(var(--green-rgb), 0.5);
                    animation: home-pulse 2s ease-out infinite;
                }
                @keyframes home-pulse {
                    to { box-shadow: 0 0 0 8px rgba(var(--green-rgb), 0); }
                }
                .home-ticker {
                    height: 252px;
                    overflow: hidden;
                    -webkit-mask-image: linear-gradient(180deg, transparent 0, #000 10%, #000 90%, transparent 100%);
                    mask-image: linear-gradient(180deg, transparent 0, #000 10%, #000 90%, transparent 100%);
                }
                .home-ticker-track {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }
                .home-ticker.scrolls .home-ticker-track {
                    animation: home-ticker var(--ticker-duration) linear infinite;
                }
                .home-ticker.scrolls:hover .home-ticker-track { animation-play-state: paused; }
                @keyframes home-ticker {
                    to { transform: translateY(-50%); }
                }
                .home-ticker-item {
                    padding: 9px 0;
                    border-bottom: 1px solid rgba(var(--green-rgb), 0.08);
                }
                .home-ticker-item strong,
                .home-ticker-item span {
                    display: block;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .home-ticker-item strong { color: var(--green-ink); font-size: 0.88rem; }
                .home-ticker-item span { color: var(--text-muted); font-size: 0.74rem; }
                .home-ticker-item div {
                    display: flex;
                    justify-content: space-between;
                    align-items: baseline;
                    gap: 6px;
                    margin-top: 4px;
                    font-size: 0.82rem;
                }
                .home-ticker-item em,
                .home-mover em {
                    font-style: normal;
                    font-weight: 700;
                    white-space: nowrap;
                }
                .home-rail .up { color: var(--green-ink); }
                .home-rail .down { color: var(--danger); }
                .home-rail .flat { color: var(--text-muted); }
                .home-rail-link {
                    display: inline-block;
                    margin-top: 10px;
                    color: var(--green-ink);
                    font-size: 0.82rem;
                    font-weight: 700;
                    text-decoration: none;
                }
                .home-rail-link:hover { text-decoration: underline; }
                .home-mover strong {
                    display: block;
                    color: var(--green-ink);
                    font-family: var(--font-heading);
                    font-size: 1.15rem;
                    line-height: 1.2;
                }
                .home-mover span {
                    display: block;
                    margin-top: 2px;
                    color: var(--text-muted);
                    font-size: 0.76rem;
                }
                .home-mover em {
                    display: block;
                    margin-top: 10px;
                    font-size: 1.6rem;
                    line-height: 1;
                }
                .home-mover small {
                    display: block;
                    margin-top: 6px;
                    color: var(--text-muted);
                }
                .home-rail-divider {
                    height: 1px;
                    margin: 16px 0 14px;
                    background: rgba(var(--green-rgb), 0.1);
                }
                .home-rail p {
                    margin: 0;
                    color: var(--text-muted);
                    font-size: 0.82rem;
                    line-height: 1.5;
                }
                .home-rail .home-rail-note {
                    margin: -6px 0 4px;
                    font-size: 0.74rem;
                }

                /* Soft gold and green glows that fill the margins beside the lower content. */
                .home-lower {
                    position: relative;
                    z-index: 1;
                    padding: 0 18px;
                }
                .home-lower::before,
                .home-lower::after {
                    content: '';
                    position: absolute;
                    z-index: 0;
                    width: 620px;
                    height: 620px;
                    border-radius: 50%;
                    pointer-events: none;
                }
                .home-lower::before {
                    top: -200px;
                    left: -260px;
                    background: radial-gradient(circle, rgba(var(--gold-rgb), 0.34) 0%, rgba(var(--gold-rgb), 0) 65%);
                }
                .home-lower::after {
                    top: -60px;
                    right: -260px;
                    background: radial-gradient(circle, rgba(var(--green-rgb), 0.22) 0%, rgba(var(--green-rgb), 0) 65%);
                }
                .home-lower .welcome-react-shell {
                    position: relative;
                    z-index: 1;
                }

                .welcome-react-content {
                    display: grid;
                    grid-template-columns: 1.4fr 0.9fr;
                    gap: 22px;
                    margin-top: 4px;
                }
                .welcome-react-panel {
                    background: color-mix(in srgb, var(--surface) 80%, transparent);
                    border: 1px solid rgba(var(--green-rgb), 0.08);
                    border-radius: 24px;
                    padding: 24px;
                    box-shadow: 0 14px 26px rgba(0,0,0,0.04);
                }
                .welcome-react-panel h2 {
                    margin: 0 0 20px;
                    font-size: clamp(1.5rem, 2vw, 2rem);
                    color: var(--green-ink);
                    font-family: var(--font-heading);
                }
                .welcome-react-link-list {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 16px;
                }
                .welcome-react-link-card {
                    background: linear-gradient(180deg, var(--bg) 0%, var(--green-soft) 100%);
                    border: 1px solid rgba(var(--green-rgb), 0.06);
                    border-radius: 18px;
                    padding: 18px;
                    text-decoration: none;
                    color: inherit;
                    display: block;
                }
                .welcome-react-link-card h3 {
                    margin: 0 0 8px;
                    color: var(--green-ink);
                    font-size: 1.1rem;
                }
                .welcome-react-link-card p {
                    margin: 0;
                    color: var(--text-muted);
                    line-height: 1.6;
                }
                .welcome-react-aside {
                    background: linear-gradient(180deg, var(--gold-soft) 0%, var(--bg) 100%);
                    border: 1px solid rgba(var(--gold-rgb), 0.25);
                    border-radius: 24px;
                    padding: 24px;
                }
                .welcome-react-aside h3 {
                    margin: 0 0 12px;
                    color: var(--green-ink);
                    font-size: 1.3rem;
                    font-family: var(--font-heading);
                }
                .welcome-react-bullet {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 10px 0;
                    border-bottom: 1px solid rgba(var(--green-rgb), 0.08);
                    color: var(--text);
                }
                .welcome-react-bullet:last-child { border-bottom: none; }
                .welcome-react-dot {
                    width: 12px;
                    height: 12px;
                    min-width: 12px;
                    border-radius: 50%;
                    background: var(--gold-light);
                    margin-top: 6px;
                }
                @media (min-width: 1500px) {
                    .home-rail { display: block; }
                }
                @media (max-width: 900px) {
                    .welcome-react-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    .welcome-react-content { grid-template-columns: 1fr; }
                    .home-decor { display: none; }
                }
                @media (max-width: 600px) {
                    .home-band { padding: 24px 14px 48px; }
                    .home-lower { padding: 0 14px; }
                    .welcome-react-grid { grid-template-columns: 1fr; }
                    .welcome-react-link-list { grid-template-columns: 1fr; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .home-decor svg,
                    .home-live-dot,
                    .home-ticker.scrolls .home-ticker-track { animation: none; }
                    .home-ticker { overflow-y: auto; }
                    .home-ticker-item[aria-hidden] { display: none; }
                }
            `}</style>

            <div className="welcome-react-wrap" ref={wrapRef}>
                <section className="home-band">
                    <div className="home-band-photo" aria-hidden="true" />

                    <div className="welcome-react-shell home-band-inner">
                        <span className="home-decor grains-left"><RiceGrains /></span>
                        <span className="home-decor grains-right"><RiceGrains /></span>
                        <span className="home-decor stalk-left"><RiceStalk /></span>
                        <span className="home-decor stalk-right"><RiceStalk /></span>

                        <header className="welcome-react-hero">
                            <div className="welcome-react-hero-top">
                                <div className="welcome-react-kicker">KhmerRice</div>
                                <a href="/login" className="welcome-react-btn secondary">Member login</a>
                            </div>

                            <h1>Fresh insights for rice markets and growers.</h1>
                            <p>
                                Follow live pricing, compare varieties, read trusted updates, and manage your content from a cleaner, more modern platform built around the market decisions that matter most.
                            </p>

                            <div className="welcome-react-actions">
                                <a href="/pricemarket" className="welcome-react-btn primary">View market prices</a>
                                <a href="/variety" className="welcome-react-btn secondary">Explore varieties</a>
                            </div>

                            <div className="welcome-react-grid">
                                {overviewCards.map((card) => (
                                    <div key={card.label} className="welcome-react-stat animate-fade-in-up hover-lift">
                                        <span>{card.label}</span>
                                        <strong><CountUp value={card.value} /></strong>
                                        <small>{card.detail}</small>
                                    </div>
                                ))}
                            </div>
                        </header>

                        {prices.length > 0 && (
                            <aside className="home-rail left animate-fade-in-up" aria-label="Latest rice prices">
                                <div className="home-rail-head"><span className="home-live-dot" />Live prices</div>
                                {onlyVariety && <p className="home-rail-note">{onlyVariety}, per kg</p>}
                                <div
                                    className={`home-ticker${scrolls ? ' scrolls' : ''}`}
                                    style={{ '--ticker-duration': `${prices.length * 3}s` }}
                                >
                                    <ul className="home-ticker-track">
                                        {prices.map((price, i) => <TickerItem key={i} price={price} byMarket={!!onlyVariety} />)}
                                        {scrolls && prices.map((price, i) => <TickerItem key={`clone-${i}`} price={price} byMarket={!!onlyVariety} clone />)}
                                    </ul>
                                </div>
                                <a href="/pricemarket" className="home-rail-link">All prices →</a>
                            </aside>
                        )}

                        <aside className="home-rail right animate-fade-in-up" aria-label="Market highlights">
                            {topMover && Number(topMover.change_percent) !== 0 && (
                                <>
                                    <div className="home-rail-head">Top mover</div>
                                    <div className="home-mover">
                                        <strong>{onlyVariety ? topMover.market : topMover.rice_variety}</strong>
                                        <span>{onlyVariety ? topMover.rice_variety : topMover.market}</span>
                                        <em className={moverTrend.className}>{moverTrend.label}</em>
                                        <small>{formatCurrency(topMover.price_per_kg)} / kg</small>
                                    </div>
                                    <div className="home-rail-divider" />
                                </>
                            )}
                            <div className="home-rail-head">Price alerts</div>
                            <p>Get notified when a variety crosses your target price.</p>
                            <a href="/alerts" className="home-rail-link">Set an alert →</a>
                        </aside>
                    </div>
                </section>

                <div className="home-lower">
                    <div className="welcome-react-shell">
                        <section className="welcome-react-content">
                            <div className="welcome-react-panel animate-fade-in-up">
                                <h2>Quick access</h2>
                                <div className="welcome-react-link-list">
                                    {quickLinks.map((link) => (
                                        <a key={link.title} href={link.href} className="welcome-react-link-card animate-fade-in-up hover-lift">
                                            <h3>{link.title}</h3>
                                            <p>{link.description}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <aside className="welcome-react-aside animate-fade-in-up">
                                <h3>Why growers use it</h3>
                                <div className="welcome-react-bullet">
                                    <span className="welcome-react-dot" />
                                    <span>See the latest trading movement across rice markets in one place.</span>
                                </div>
                                <div className="welcome-react-bullet">
                                    <span className="welcome-react-dot" />
                                    <span>Compare rice varieties and demand signals before buying or selling.</span>
                                </div>
                                <div className="welcome-react-bullet">
                                    <span className="welcome-react-dot" />
                                    <span>Keep up with regional coverage and grower-focused updates in real time.</span>
                                </div>
                            </aside>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
