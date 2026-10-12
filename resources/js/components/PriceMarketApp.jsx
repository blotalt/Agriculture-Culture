import React, { Suspense, lazy, useMemo, useState } from 'react';
import PriceChart from './PriceChart.jsx';
import PriceCards from './PriceCards.jsx';
import WeatherCard from './WeatherCard.jsx';
import useIsMobile from '../hooks/useIsMobile.js';
import { t, formatMonth, monthName, provinceName, getLocale } from '../i18n.js';

const formatCurrency = (value) => `$${Number(value).toFixed(2)}`;

// "2026-03-15" or an ISO timestamp -> "Mar 2026" / "Oct 6, 2026" (Khmer: "6 តុលា 2026").
// Chrome has no Khmer month names in its date formatting, so Khmer dates use monthName() instead.
const formatDate = (value, monthOnly) => {
    if (!value) return '—';
    if (monthOnly) return formatMonth(String(value).slice(0, 7), true);
    const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
    if (getLocale() === 'km') return `${date.getDate()} ${monthName(date.getMonth() + 1)} ${date.getFullYear()}`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const Change = ({ value }) => {
    if (value === null || value === undefined) return <span style={{ color: 'var(--text-muted)' }}>—</span>;
    const up = value > 0;
    const flat = value === 0;
    return (
        <span className={flat ? '' : up ? 'change-up' : 'change-down'}>
            {flat ? '■' : up ? '▲' : '▼'} {up ? '+' : ''}{value}%
        </span>
    );
};

// Leaflet is large, so the map loads only on this page.
const PriceMap = lazy(() => import('./PriceMap.jsx'));

// The chart applies these through style props, so CSS variables work and follow light/dark.
const NATIONAL_COLOR = 'var(--green-ink)'; // follows light/dark; PriceChart applies it via style
const PROVINCE_COLOR = '#d9a92e'; // a touch deeper than --gold so the line shows on white

export default function PriceMarketApp({ prices = [], insights = {}, weather = {}, initialProvince = '' }) {
    const { national = [], byProvince = {}, provinces = [], provenance = null } = insights;

    const startProvince = provinces.find((p) => p.name === initialProvince)?.name
        || prices.find((p) => p.province === initialProvince)?.province_name
        || '';
    const [province, setProvince] = useState(startProvince);
    const [sort, setSort] = useState({ key: 'province_name', dir: 1 });
    // Phones get their own layout for the price list, the chart and the sources box.
    const isMobile = useIsMobile();
    // On phones the source details fold away under a summary line; on wider screens they're always shown.
    const SourceDetails = isMobile ? 'details' : 'div';

    const imported = prices.filter((price) => price.source === 'wfp');
    const importedMonth = imported.length ? formatDate(imported[0].recorded_on, true) : null;
    const selected = provinces.find((p) => p.name === province) || null;
    const weatherProvince = province || 'Phnom Penh';
    const marketCounts = national.map((point) => point.markets);
    const dataUrl = `/pricemarket/data.csv${province ? `?province=${encodeURIComponent(province)}` : ''}`;

    // Headline numbers, for the whole country or the selected province.
    const summary = useMemo(() => {
        const rows = province ? prices.filter((p) => p.province_name === province) : prices;
        const series = province ? (byProvince[province] || []) : national;
        const change = (months) => {
            const last = series[series.length - 1];
            if (!last) return null;
            const [y, m] = last.month.split('-').map(Number);
            const target = new Date(y, m - 1 - months, 1);
            const key = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}`;
            const before = series.find((point) => point.month === key);
            return before && before.avg > 0 ? Math.round(((last.avg - before.avg) / before.avg) * 1000) / 10 : null;
        };
        return {
            avg: rows.length ? rows.reduce((sum, p) => sum + Number(p.price_per_kg), 0) / rows.length : null,
            low: rows.length ? Math.min(...rows.map((p) => Number(p.price_per_kg))) : null,
            markets: rows.length,
            change1m: change(1),
            change12m: change(12),
        };
    }, [prices, province, national, byProvince]);

    const chartSeries = [
        { key: 'national', label: t('prices.chart.national'), color: NATIONAL_COLOR, points: national },
        ...(province && byProvince[province]?.length
            ? [{ key: province, label: provinceName(selected || { name: province }), color: PROVINCE_COLOR, points: byProvince[province] }]
            : []),
    ];

    const rows = useMemo(() => {
        const filtered = province ? prices.filter((p) => p.province_name === province) : prices;
        return [...filtered].sort((a, b) => {
            const av = a[sort.key];
            const bv = b[sort.key];
            const numeric = sort.key === 'price_per_kg' || sort.key === 'change_percent';
            return (numeric ? Number(av) - Number(bv) : String(av).localeCompare(String(bv))) * sort.dir;
        });
    }, [prices, province, sort]);

    const sortBy = (key) => setSort((current) => ({ key, dir: current.key === key ? -current.dir : 1 }));
    const SortHeader = ({ label, field }) => (
        <th aria-sort={sort.key === field ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
            <button type="button" className="sort-btn" onClick={() => sortBy(field)}>
                {label} {sort.key === field ? (sort.dir === 1 ? '↑' : '↓') : ''}
            </button>
        </th>
    );

    return (
        <>
            <style>{`
                .price-react-wrap { background: var(--bg); color: var(--text); }
                .price-react-wrap .hero-band { background: var(--green); color: white; padding: 40px 0 32px; }
                .price-react-wrap .inner { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
                .price-react-wrap .eyebrow { color: var(--gold); text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.78rem; font-weight: 800; }
                .price-react-wrap h1 { font-size: clamp(2.5rem, 4vw, 3.2rem); font-weight: 800; margin: 8px 0 10px; font-family: var(--font-heading); }
                .price-react-wrap h2 { margin: 0 0 6px; font-size: 1.5rem; font-weight: 800; font-family: var(--font-heading); color: var(--green-ink); }
                .price-react-wrap .subtitle { color: rgba(255,255,255,0.76); margin: 0; font-size: 1.05rem; }
                .price-react-wrap .content { max-width: 1180px; margin: 0 auto; padding: 32px 24px 70px; display: grid; grid-template-columns: minmax(0, 1fr); gap: 24px; }
                .price-react-wrap .toolbar { display: flex; gap: 12px; align-items: center; justify-content: space-between; flex-wrap: wrap; }
                .price-react-wrap .toolbar select { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 10px 14px; font: inherit; min-width: 220px; }
                .price-react-wrap .alert-link { background: var(--gold); color: white; text-decoration: none; border-radius: 10px; padding: 10px 16px; font-weight: 800; }
                .price-react-wrap .tiles { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
                .price-react-wrap .tile { background: var(--surface); border: 1px solid rgba(var(--green-rgb), 0.08); border-radius: 16px; padding: 16px 18px; box-shadow: 0 10px 24px rgba(0,0,0,0.04); }
                .price-react-wrap .tile strong { display: block; color: var(--green-ink); font-size: 1.7rem; font-family: var(--font-heading); }
                .price-react-wrap .tile > span { color: var(--text-muted); font-size: 0.78rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
                .price-react-wrap .card { background: var(--surface); border-radius: 18px; padding: 22px; box-shadow: 0 12px 30px rgba(0,0,0,0.04); border: 1px solid rgba(var(--green-rgb), 0.08); }
                .price-react-wrap .card > p { margin: 0 0 14px; color: var(--text-muted); font-size: .92rem; }
                .price-react-wrap .split { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: 24px; align-items: start; }
                .price-react-wrap .table-shell { background: var(--surface); border-radius: 18px; overflow: auto; max-height: min(560px, 70vh); overscroll-behavior: contain; box-shadow: 0 12px 30px rgba(0,0,0,0.04); border: 1px solid rgba(var(--green-rgb), 0.08); }
                .price-react-wrap .table-shell:focus-visible { outline: 3px solid var(--gold); outline-offset: 2px; }
                .price-react-wrap table { width: 100%; min-width: 720px; border-collapse: separate; border-spacing: 0; }
                .price-react-wrap .table-shell thead th { position: sticky; top: 0; z-index: 2; }
                .price-react-wrap .table-shell thead th:first-child { left: 0; z-index: 3; box-shadow: 1px 0 0 var(--border); }
                .price-react-wrap .table-shell tbody td:first-child { position: sticky; left: 0; z-index: 1; background: var(--surface); box-shadow: 1px 0 0 var(--border); }
                .price-react-wrap .table-shell tbody tr:hover td:first-child { background: var(--bg); }
                .price-react-wrap .sources-box { background: var(--surface); border: 1px solid var(--border); border-left: 4px solid var(--gold); border-radius: 16px; padding: 18px 20px; display: grid; gap: 14px; scroll-margin-top: calc(var(--site-nav-height, 0px) + 16px); }
                .price-react-wrap .sources-head { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; flex-wrap: wrap; }
                .price-react-wrap .sources-head h2 { font-size: 1.25rem; margin: 0 0 4px; }
                .price-react-wrap .sources-head p { margin: 0; color: var(--text-muted); max-width: 660px; font-size: .92rem; }
                .price-react-wrap .sources-actions { display: flex; gap: 8px; flex-wrap: wrap; }
                .price-react-wrap .btn-download, .price-react-wrap .btn-outline { text-decoration: none; border-radius: 10px; padding: 9px 14px; font-weight: 700; font-size: .88rem; white-space: nowrap; }
                .price-react-wrap .btn-download { background: var(--green); color: #fff; }
                .price-react-wrap .btn-outline { border: 1px solid var(--border); color: var(--green-ink); }
                .price-react-wrap .sources-more { display: grid; gap: 14px; }
                .price-react-wrap .sources-facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 12px 24px; margin: 0; }
                .price-react-wrap .sources-facts dt { font-size: .72rem; text-transform: uppercase; letter-spacing: .06em; color: var(--text-muted); font-weight: 700; }
                .price-react-wrap .sources-facts dd { margin: 2px 0 0; font-size: .9rem; color: var(--text); }
                .price-react-wrap .sources-facts a, .price-react-wrap .sources-box details a { color: var(--green-ink); font-weight: 700; }
                .price-react-wrap .sources-box summary { cursor: pointer; color: var(--green-ink); font-weight: 700; font-size: .9rem; }
                .price-react-wrap .sources-box details ul { margin: 8px 0 0; padding-left: 18px; color: var(--text-muted); font-size: .88rem; display: grid; gap: 6px; }
                .price-react-wrap .sources-box code { font-size: .78rem; word-break: break-all; background: var(--blue-soft); color: var(--text); padding: 2px 6px; border-radius: 6px; }
                .price-react-wrap th, .price-react-wrap td { padding: 14px 18px; text-align: left; border-bottom: 1px solid var(--blue-soft); vertical-align: middle; }
                .price-react-wrap thead th { background: var(--green-soft); color: var(--green-ink); font-weight: 800; }
                .price-react-wrap .sort-btn { background: none; border: none; padding: 0; font: inherit; font-weight: 800; color: inherit; cursor: pointer; }
                .price-react-wrap tbody tr:hover { background: var(--bg); }
                .price-react-wrap .rice-name { font-weight: 800; color: var(--green-ink); margin-bottom: 2px; }
                .price-react-wrap .rice-type { color: var(--text-muted); font-size: 0.8rem; }
                .price-react-wrap .price-value { font-weight: 800; color: var(--green-ink); }
                .price-react-wrap .change-up { color: var(--success); font-weight: 700; }
                .price-react-wrap .change-down { color: var(--danger); font-weight: 700; }
                .price-react-wrap .empty { padding: 28px; text-align: center; color: var(--text-muted); }
                @media (max-width: 900px) {
                    .price-react-wrap .tiles { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    .price-react-wrap .split { grid-template-columns: 1fr; }
                }
                @media (max-width: 768px) {
                    .price-react-wrap .content, .price-react-wrap .inner { padding-left: 16px; padding-right: 16px; }
                    .price-react-wrap th, .price-react-wrap td { padding: 12px 10px; }
                    .price-react-wrap table { font-size: 0.92rem; }
                    .price-react-wrap .toolbar select { min-width: 0; flex: 1; }
                }
            `}</style>

            <div className="price-react-wrap">
                <section className="hero-band">
                    <div className="inner">
                        <div className="eyebrow">{t('prices.eyebrow')}{importedMonth ? ` · ${importedMonth}` : ''}</div>
                        <h1>{t('prices.title')}</h1>
                        <p className="subtitle">{t('prices.subtitle')}</p>
                    </div>
                </section>

                <section className="content">
                    <div className="toolbar">
                        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, color: 'var(--green-ink)', flexWrap: 'wrap' }}>
                            {t('prices.province')}
                            <select value={province} onChange={(e) => setProvince(e.target.value)}>
                                <option value="">{t('prices.allProvinces')}</option>
                                {provinces.map((p) => (
                                    <option key={p.name} value={p.name}>
                                        {provinceName(p)}{p.markets ? ` (${p.markets})` : ''}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <a className="alert-link" href="/alerts">🔔 {t('prices.getAlerts')}</a>
                    </div>

                    {provenance ? (
                        <section id="price-sources" className="sources-box animate-fade-in-up" aria-labelledby="price-sources-title">
                            <div className="sources-head">
                                <div>
                                    <h2 id="price-sources-title">📄 {t('prices.sources.title')}</h2>
                                    <p>{t('prices.sources.summary')}</p>
                                </div>
                                <div className="sources-actions">
                                    <a className="btn-download" href={dataUrl} download>
                                        ⬇ {province ? t('prices.sources.downloadProvince', { province: provinceName(selected || { name: province }) }) : t('prices.sources.download')}
                                    </a>
                                    {provenance.hasBackup ? (
                                        <a className="btn-outline" href="/pricemarket/source-file" download>{t('prices.sources.original')}</a>
                                    ) : null}
                                </div>
                            </div>

                            <SourceDetails className={isMobile ? 'm-collapse sources-more' : 'sources-more'}>
                            {isMobile ? <summary>{t('prices.sources.details')}</summary> : null}
                            <dl className="sources-facts">
                                <div>
                                    <dt>{t('prices.sources.publisher')}</dt>
                                    <dd>
                                        {t('prices.sources.publisherValue')}{' '}
                                        <a href={provenance.datasetUrl} target="_blank" rel="noreferrer">{t('prices.sources.datasetLink')}</a>
                                    </dd>
                                </div>
                                <div>
                                    <dt>{t('prices.sources.collectedBy')}</dt>
                                    <dd>{t('prices.sources.collectedByValue')}</dd>
                                </div>
                                <div>
                                    <dt>{t('prices.sources.measures')}</dt>
                                    <dd>{t('prices.sources.measuresValue')}</dd>
                                </div>
                                <div>
                                    <dt>{t('prices.sources.covers')}</dt>
                                    <dd>
                                        {t('prices.sources.coversValue', {
                                            from: formatDate(provenance.from, true),
                                            to: formatDate(provenance.to, true),
                                            records: Number(provenance.records).toLocaleString(),
                                            markets: provenance.markets,
                                        })}
                                    </dd>
                                </div>
                                <div>
                                    <dt>{t('prices.sources.imported')}</dt>
                                    <dd>
                                        {provenance.importedAt
                                            ? t('prices.sources.importedValue', {
                                                date: formatDate(provenance.importedAt),
                                                updated: provenance.sourceUpdatedAt ? formatDate(provenance.sourceUpdatedAt) : '—',
                                            })
                                            : t('prices.sources.notImported')}
                                    </dd>
                                </div>
                                <div>
                                    <dt>{t('prices.sources.licence')}</dt>
                                    <dd>{t('prices.sources.licenceValue')}</dd>
                                </div>
                            </dl>

                            <details>
                                <summary>{t('prices.sources.method')}</summary>
                                <ul>
                                    {marketCounts.length ? (
                                        <li>{t('prices.sources.methodAverage', { min: Math.min(...marketCounts), max: Math.max(...marketCounts) })}</li>
                                    ) : null}
                                    <li>{t('prices.sources.methodChange')}</li>
                                    <li>{t('prices.sources.methodCurrency')}</li>
                                    {provenance.manual ? <li>{t('prices.sources.methodManual', { count: provenance.manual })}</li> : null}
                                    <li>{t('prices.sources.methodWeather')}</li>
                                    {provenance.sha256 ? (
                                        <li>
                                            {t('prices.sources.methodVerify')}{' '}
                                            <code>{provenance.sha256}</code>
                                        </li>
                                    ) : null}
                                </ul>
                            </details>
                            </SourceDetails>
                        </section>
                    ) : null}

                    <div className="tiles">
                        <div className="tile animate-fade-in-up hover-lift">
                            <strong>{summary.avg !== null ? formatCurrency(summary.avg) : '—'}</strong>
                            <span>{t('prices.tile.avg')}</span>
                        </div>
                        <div className="tile animate-fade-in-up hover-lift">
                            <strong>{summary.low !== null ? formatCurrency(summary.low) : '—'}</strong>
                            <span>{t('prices.tile.low')}</span>
                        </div>
                        <div className="tile animate-fade-in-up hover-lift">
                            <strong><Change value={summary.change1m} /></strong>
                            <span>{t('prices.change1m')}</span>
                        </div>
                        <div className="tile animate-fade-in-up hover-lift">
                            <strong><Change value={summary.change12m} /></strong>
                            <span>{t('prices.change12m')}</span>
                        </div>
                    </div>

                    <div className="card animate-fade-in-up">
                        <h2>{t('prices.chart.title')}</h2>
                        <p>{province ? t('prices.chart.compare', { province: provinceName(selected || { name: province }) }) : t('prices.chart.hint')}</p>
                        <PriceChart series={chartSeries} compact={isMobile} />
                    </div>

                    <div className="split">
                        <div className="card animate-fade-in-up">
                            <h2>{t('prices.map.title')}</h2>
                            <p>{t('prices.map.hint')}</p>
                            <Suspense fallback={
                                <div style={{ height: 380, borderRadius: 14, background: 'var(--blue-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} role="status" aria-label="Loading map">
                                    <div className="rice-spinner is-small" />
                                </div>
                            }>
                                <PriceMap provinces={provinces} selected={province} onSelect={setProvince} />
                            </Suspense>
                        </div>
                        <div className="card animate-fade-in-up">
                            <h2>{t('weather.title', { province: provinceName(provinces.find((p) => p.name === weatherProvince) || { name: weatherProvince }) })}</h2>
                            <WeatherCard province={weatherProvince} days={weather[weatherProvince] || []} />
                        </div>
                    </div>

                    <div>
                        <h2>{t('prices.latest')}</h2>
                        <p style={{ margin: '0 0 16px', color: 'var(--text-muted)' }}>
                            {imported.length ? t('prices.latestNote', { count: imported.length }) : t('prices.latestNoteManual')}
                        </p>

                        {isMobile ? (
                            <PriceCards
                                rows={rows}
                                sort={sort}
                                onSort={setSort}
                                Change={Change}
                                formatCurrency={formatCurrency}
                                provinceLabel={(price) => provinceName(provinces.find((p) => p.name === price.province_name) || { name: price.province })}
                                formatUpdated={(price) => (price.recorded_on ? formatDate(price.recorded_on, true) : formatDate(price.updated_at))}
                            />
                        ) : (
                        <div className="table-shell animate-fade-in-up" tabIndex={0} role="region" aria-label={t('prices.tableLabel')}>
                            <table>
                                <thead>
                                    <tr>
                                        <SortHeader label={t('prices.col.variety')} field="rice_variety" />
                                        <SortHeader label={t('prices.province')} field="province_name" />
                                        <SortHeader label={t('prices.col.market')} field="market" />
                                        <SortHeader label={t('prices.col.price')} field="price_per_kg" />
                                        <SortHeader label={t('prices.col.change')} field="change_percent" />
                                        <th>{t('prices.col.updated')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.length === 0 ? (
                                        <tr><td colSpan="6" className="empty">{t('prices.empty')}</td></tr>
                                    ) : rows.map((price) => (
                                        <tr key={price.id ?? `${price.rice_variety}-${price.market}`}>
                                            <td>
                                                <div className="rice-name">{price.rice_variety}</div>
                                                <div className="rice-type">{price.rice_type}</div>
                                            </td>
                                            <td>{provinceName(provinces.find((p) => p.name === price.province_name) || { name: price.province })}</td>
                                            <td>{price.market}</td>
                                            <td className="price-value">{formatCurrency(price.price_per_kg)}</td>
                                            <td><Change value={Number(price.change_percent ?? 0)} /></td>
                                            <td>{price.recorded_on ? formatDate(price.recorded_on, true) : formatDate(price.updated_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        )}

                        {imported.length ? (
                            <p style={{ margin: '16px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                {t('prices.source')}{' '}
                                <a href="https://data.humdata.org/dataset/wfp-food-prices-for-cambodia" target="_blank" rel="noreferrer" style={{ color: 'var(--green-ink)' }}>
                                    Humanitarian Data Exchange
                                </a>
                                {' '}(CC BY-IGO). <a href="#price-sources" style={{ color: 'var(--green-ink)' }}>{t('prices.sources.seeAbove')}</a>
                            </p>
                        ) : null}
                    </div>
                </section>
            </div>
        </>
    );
}
