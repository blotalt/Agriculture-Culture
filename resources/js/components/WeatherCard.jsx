import React from 'react';
import { t, formatDay, provinceName } from '../i18n.js';

// WMO weather codes (used by Open-Meteo) grouped into a few kinds.
const kindOf = (code) => {
    if (code === null || code === undefined) return 'unknown';
    if (code === 0) return 'clear';
    if (code <= 3) return 'cloudy';
    if (code === 45 || code === 48) return 'fog';
    if (code >= 95) return 'storm';
    if (code >= 51) return 'rain';
    return 'cloudy';
};

// Heavy rain (10 mm+ or a heavy-rain code) pours instead of drizzling.
const HEAVY_CODES = [65, 67, 75, 82, 86];
const isHeavy = (day) => (day.rain ?? 0) >= 10 || HEAVY_CODES.includes(day.code);

// Daily max wind of 30 km/h or more counts as windy.
const isWindy = (day) => (day.wind ?? 0) >= 30;

// What to draw and say for one day.
const describe = (day) => {
    const kind = kindOf(day.code);
    const windy = isWindy(day);
    return {
        kind,
        windy,
        heavy: kind === 'storm' || (kind === 'rain' && isHeavy(day)),
        label: t(`weather.kind.${kind}`) + (windy ? ` · ${t('weather.windy')}` : ''),
    };
};

// Farming advice from the next three days of rain, the most reliable part of the forecast.
const adviceFor = (days) => {
    const rain = days.reduce((sum, day) => sum + (day.rain || 0), 0);
    if (days.some((day) => kindOf(day.code) === 'storm')) return 'storm';
    if (rain >= 30) return 'heavyRain';
    if (rain < 2) return 'dry';
    return 'normal';
};

// Raindrops fall from under the cloud; heavier rain means more, faster drops.
function Drops({ heavy }) {
    const xs = heavy ? [20, 26, 32, 38, 44, 23, 35, 41] : [24, 32, 40, 28];
    return (
        <g className="drops">
            {xs.map((x, i) => (
                <line key={i} x1={x} y1="34" x2={x - 2} y2="40" style={{ animationDelay: `${(i * (heavy ? 0.11 : 0.27)).toFixed(2)}s` }} />
            ))}
        </g>
    );
}

function Cloud({ className = '' }) {
    return (
        <g className={`cloud ${className}`}>
            <circle cx="24" cy="25" r="7" />
            <circle cx="33" cy="19" r="9.5" />
            <circle cx="42" cy="24" r="7.5" />
            <rect x="17" y="23" width="32" height="10" rx="5" />
        </g>
    );
}

function Sun({ small = false }) {
    return (
        <g className={`sun${small ? ' small' : ''}`}>
            <g className="rays">
                {Array.from({ length: 8 }, (_, i) => (
                    <line key={i} x1="32" y1="6" x2="32" y2="10" transform={`rotate(${i * 45} 32 20)`} />
                ))}
            </g>
            <circle cx="32" cy="20" r="7.5" />
        </g>
    );
}

function Wind() {
    return (
        <g className="wind">
            <path d="M4 14 h30 a5 5 0 1 0 -5 -5" />
            <path d="M8 38 h40 a5 5 0 1 1 -5 5" style={{ animationDelay: '0.5s' }} />
            <path d="M2 26 h22" style={{ animationDelay: '1s' }} />
        </g>
    );
}

// An animated picture of the day's weather, drawn in place of an emoji icon.
function WeatherScene({ kind, heavy, windy }) {
    return (
        <svg className={`scene scene-${kind}${heavy ? ' heavy' : ''}${windy ? ' windy' : ''}`} viewBox="0 0 64 48" aria-hidden="true">
            {kind === 'clear' ? <Sun /> : null}
            {kind === 'cloudy' ? (
                <>
                    <g transform="translate(-8 -4)"><Sun small /></g>
                    <Cloud className="drift" />
                </>
            ) : null}
            {kind === 'fog' ? (
                <g className="fog">
                    <path d="M10 18 h40" />
                    <path d="M16 26 h38" style={{ animationDelay: '0.8s' }} />
                    <path d="M8 34 h36" style={{ animationDelay: '1.6s' }} />
                </g>
            ) : null}
            {kind === 'rain' ? (
                <>
                    <Drops heavy={heavy} />
                    <Cloud className="rain-cloud" />
                </>
            ) : null}
            {kind === 'storm' ? (
                <>
                    <Drops heavy />
                    <polygon className="bolt" points="34,30 27,40 32,40 29,47 39,35 33,35 37,30" />
                    <Cloud className="storm-cloud" />
                </>
            ) : null}
            {kind === 'unknown' ? <text x="32" y="30" textAnchor="middle" className="unknown">·</text> : null}
            {windy ? <Wind /> : null}
        </svg>
    );
}

export default function WeatherCard({ province, days = [] }) {
    // The next three days get full tiles; the rest of the week is a compact list.
    const soon = days.slice(0, 3);
    const later = days.slice(3);

    return (
        <div className="weather-card animate-fade-in-up">
            <style>{`
                .weather-card .days { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 12px 0; }
                .weather-card .day { position: relative; overflow: hidden; isolation: isolate; background: var(--blue-soft); border-radius: 12px; padding: 12px 8px; text-align: center; }
                .weather-card .day > * { position: relative; z-index: 1; }
                .weather-card .day .name { font-weight: 800; color: var(--green-ink); font-size: .85rem; }
                .weather-card .day .temp { font-weight: 700; margin-top: 4px; }
                .weather-card .day .rain { color: #2b6cb0; font-size: .8rem; margin-top: 2px; }
                .weather-card .day .wind-speed { color: var(--text-muted); font-size: .76rem; margin-top: 2px; }
                .weather-card .day .wind-speed.strong { color: var(--green-ink); font-weight: 800; }
                .weather-card .later-title { font-size: .72rem; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted); margin: 0 0 6px; }
                .weather-card .later { list-style: none; margin: 0 0 12px; padding: 0; display: grid; gap: 6px; }
                .weather-card .later li { display: grid; grid-template-columns: 4.8rem 32px minmax(0, 1fr) auto 3.2rem; align-items: center; gap: 8px; background: var(--blue-soft); border-radius: 10px; padding: 4px 10px; font-size: .82rem; }
                .weather-card .later .name { font-weight: 800; color: var(--green-ink); white-space: nowrap; }
                .weather-card .later .scene { width: 32px; height: 24px; margin: 0; }
                .weather-card .later .kind { color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .weather-card .later .temp { font-weight: 700; white-space: nowrap; }
                .weather-card .later .chance { color: #2b6cb0; text-align: right; white-space: nowrap; }
                .weather-card .advice { background: var(--green-soft); color: var(--green-ink); border-radius: 10px; padding: 10px 12px; font-size: .88rem; margin: 0; }

                /* Tile backgrounds: a tint per kind, plus full-tile rain, lightning and wind. */
                .weather-card .day.kind-clear { background: radial-gradient(circle at 50% 22%, rgba(var(--gold-rgb), .28), transparent 62%), var(--blue-soft); }
                .weather-card .day.kind-rain { background: linear-gradient(rgba(70, 100, 140, .14), transparent), var(--blue-soft); }
                .weather-card .day.kind-storm { background: linear-gradient(rgba(40, 50, 90, .24), rgba(40, 50, 90, .06)), var(--blue-soft); }
                .weather-card .day .sky { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
                .weather-card .sky.rainfall {
                    background-image: repeating-linear-gradient(105deg, transparent 0 9px, rgba(43, 108, 176, .22) 9px 10px, transparent 10px 22px);
                    background-size: 44px 44px;
                    animation: wx-rainfall .7s linear infinite;
                    opacity: .6;
                }
                .weather-card .sky.rainfall.heavy { opacity: 1; animation-duration: .4s; background-size: 30px 30px; }
                .weather-card .sky.flash { background: #fff; opacity: 0; animation: wx-flash 5s infinite; }
                .weather-card .sky.gusts::before, .weather-card .sky.gusts::after {
                    content: ''; position: absolute; left: -40%; width: 40%; height: 2px; border-radius: 2px;
                    background: linear-gradient(90deg, transparent, rgba(var(--green-rgb), .35), transparent);
                    animation: wx-gust 2.4s ease-in-out infinite;
                }
                .weather-card .sky.gusts::before { top: 30%; }
                .weather-card .sky.gusts::after { top: 70%; animation-delay: 1.1s; }

                /* The scene */
                .weather-card .scene { width: 64px; height: 48px; display: block; margin: 4px auto 2px; overflow: visible; }
                .weather-card .sun circle { fill: #f6c445; }
                .weather-card .sun .rays line { stroke: #f6c445; stroke-width: 2.4; stroke-linecap: round; }
                .weather-card .sun .rays { transform-box: fill-box; transform-origin: center; animation: wx-spin 14s linear infinite; }
                .weather-card .sun:not(.small) circle { animation: wx-glow 3s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
                .weather-card .cloud circle, .weather-card .cloud rect { fill: #fff; }
                .weather-card .cloud { filter: drop-shadow(0 2px 2px rgba(0, 0, 0, .12)); }
                .weather-card .cloud.drift { animation: wx-drift 6s ease-in-out infinite; }
                .weather-card .cloud.rain-cloud circle, .weather-card .cloud.rain-cloud rect { fill: #c9d4e2; }
                .weather-card .cloud.storm-cloud circle, .weather-card .cloud.storm-cloud rect { fill: #6f7d94; }
                .weather-card .scene.windy .cloud { animation: wx-sway 1.6s ease-in-out infinite; }
                .weather-card .drops line { stroke: #4a90d9; stroke-width: 2; stroke-linecap: round; opacity: 0; animation: wx-drop 1.1s linear infinite; }
                .weather-card .scene.heavy .drops line { animation-duration: .55s; stroke-width: 2.4; }
                .weather-card .bolt { fill: #f6c445; opacity: 0; animation: wx-bolt 5s infinite; }
                .weather-card .fog path { stroke: #9aa8b8; stroke-width: 3.5; stroke-linecap: round; animation: wx-fog 4s ease-in-out infinite; }
                .weather-card .wind path { fill: none; stroke: var(--green-ink); stroke-width: 2; stroke-linecap: round; stroke-dasharray: 60; stroke-dashoffset: 60; opacity: .75; animation: wx-wind 2.4s ease-in-out infinite; }
                .weather-card .unknown { fill: var(--text-muted); font-size: 22px; }

                @keyframes wx-spin { to { transform: rotate(360deg); } }
                @keyframes wx-glow { 50% { transform: scale(1.08); } }
                @keyframes wx-drift { 50% { transform: translateX(5px); } }
                @keyframes wx-sway { 0%, 100% { transform: translateX(-2px); } 50% { transform: translateX(4px); } }
                @keyframes wx-drop { 0% { opacity: 0; transform: translateY(-3px); } 20% { opacity: 1; } 100% { opacity: 0; transform: translateY(9px); } }
                @keyframes wx-bolt { 0%, 8%, 14%, 100% { opacity: 0; } 9%, 13% { opacity: 1; } }
                @keyframes wx-flash { 0%, 8%, 14%, 100% { opacity: 0; } 9%, 13% { opacity: .55; } }
                @keyframes wx-fog { 50% { transform: translateX(6px); opacity: .55; } }
                @keyframes wx-wind { 0% { stroke-dashoffset: 60; opacity: 0; } 30% { opacity: .75; } 70% { stroke-dashoffset: 0; opacity: .75; } 100% { stroke-dashoffset: -60; opacity: 0; } }
                @keyframes wx-rainfall { to { background-position: -12px 44px; } }
                @keyframes wx-gust { 0% { left: -40%; } 100% { left: 110%; } }

                /* Still pictures for people who turn motion off. */
                @media (prefers-reduced-motion: reduce) {
                    .weather-card .scene *, .weather-card .sky, .weather-card .sky::before, .weather-card .sky::after { animation: none !important; }
                    .weather-card .drops line, .weather-card .bolt { opacity: 1; }
                    .weather-card .wind path { stroke-dashoffset: 0; }
                    .weather-card .sky.flash, .weather-card .sky.gusts { display: none; }
                }
            `}</style>

            {days.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>{t('weather.unavailable')}</p>
            ) : (
                <>
                    <div className="days">
                        {soon.map((day) => {
                            const { kind, heavy, windy, label } = describe(day);

                            return (
                                <div key={day.date} className={`day kind-${kind}`} title={label}>
                                    {kind === 'rain' || kind === 'storm' ? <div className={`sky rainfall${heavy ? ' heavy' : ''}`} aria-hidden="true" /> : null}
                                    {kind === 'storm' ? <div className="sky flash" aria-hidden="true" /> : null}
                                    {windy ? <div className="sky gusts" aria-hidden="true" /> : null}

                                    <div className="name">{formatDay(day.date)}</div>
                                    <WeatherScene kind={kind} heavy={heavy} windy={windy} />
                                    <div style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>{label}</div>
                                    <div className="temp">{Math.round(day.max)}° / {Math.round(day.min)}°</div>
                                    <div className="rain">💧 {day.rain ?? 0} mm · {day.rainChance ?? 0}%</div>
                                    {day.wind != null ? (
                                        <div className={`wind-speed${windy ? ' strong' : ''}`}>💨 {Math.round(day.wind)} km/h</div>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                    {later.length ? (
                        <>
                            <div className="later-title">{t('weather.laterDays')}</div>
                            <ul className="later">
                                {later.map((day) => {
                                    const { kind, heavy, windy, label } = describe(day);

                                    return (
                                        <li key={day.date} title={`${label} · ${day.rain ?? 0} mm`}>
                                            <span className="name">{formatDay(day.date)}</span>
                                            <WeatherScene kind={kind} heavy={heavy} windy={windy} />
                                            <span className="kind">{label}</span>
                                            <span className="temp">{Math.round(day.max)}° / {Math.round(day.min)}°</span>
                                            <span className="chance">💧 {day.rainChance ?? 0}%</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </>
                    ) : null}
                    <p className="advice">{t(`weather.advice.${adviceFor(soon)}`)}</p>
                    <p style={{ fontSize: '.75rem', color: 'var(--text-muted)', margin: '8px 0 0' }}>
                        {t('weather.source', { province: provinceName({ name: province }) })} <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--green-ink)' }}>Open-Meteo</a>
                    </p>
                </>
            )}
        </div>
    );
}
