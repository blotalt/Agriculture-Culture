import React from 'react';
import VarietyCompareCards from './VarietyCompareCards.jsx';
import { Sources, Unconfirmed } from './VarietySources.jsx';
import useIsMobile from '../hooks/useIsMobile.js';
import { t, monthName } from '../i18n.js';

const imageUrl = (image) => (image ? (image.startsWith('http') || image.startsWith('/') ? image : `/storage/${image}`) : null);

// A 0..1 bar, so differences in yield, cycle and demand are visible at a glance.
function Bar({ value, label }) {
    return (
        <div className="cmp-bar" title={label}>
            <span style={{ width: `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%` }} />
        </div>
    );
}

const FACTS = ['type', 'location', 'yield', 'cycle', 'season', 'demand'];

export default function VarietyCompareApp({ selected = [], all = [] }) {
    // Phones get one card per variety instead of a wide table.
    const isMobile = useIsMobile();
    const selectedIds = selected.map((v) => v.id);
    const maxYield = Math.max(...selected.map((v) => v.facts.yieldMax || 0), 1);
    const maxCycle = Math.max(...selected.map((v) => v.facts.cycleMax || 0), 1);

    // Best value in each numeric row, to highlight it.
    const best = {
        yield: Math.max(...selected.map((v) => v.facts.yieldMid || 0)),
        cycle: Math.min(...selected.map((v) => v.facts.cycleMid || Infinity)),
        demand: Math.max(...selected.map((v) => v.facts.demandScore || 0)),
    };

    const rows = [
        { key: 'type', label: t('variety.type'), render: (v) => v.type },
        { key: 'location', label: t('variety.location'), render: (v) => v.location },
        {
            key: 'yield', label: t('variety.yield'),
            render: (v) => <>{v.yield}<Bar value={(v.facts.yieldMax || 0) / maxYield} label={v.yield} /></>,
            isBest: (v) => selected.length > 1 && v.facts.yieldMid === best.yield,
        },
        {
            key: 'cycle', label: t('variety.cycle'),
            render: (v) => <>{v.cycle}<Bar value={(v.facts.cycleMax || 0) / maxCycle} label={v.cycle} /></>,
            isBest: (v) => selected.length > 1 && v.facts.cycleMid === best.cycle,
        },
        { key: 'season', label: t('variety.season'), render: (v) => v.season },
        {
            key: 'demand', label: t('variety.demand'),
            render: (v) => <>{v.demand}<Bar value={(v.facts.demandScore || 0) / 4} label={v.demand} /></>,
            isBest: (v) => selected.length > 1 && v.facts.demandScore === best.demand,
        },
        {
            key: 'calendar', label: t('calendar.title'),
            render: (v) => (
                <>
                    {v.calendar.map((row) => (
                        <div key={row.season} style={{ fontSize: '.85rem' }}>
                            <strong>{t(`season.${row.season}`)}:</strong> {t('calendar.sow')} {row.sow.map((m) => monthName(m)).join(', ')}
                            {' · '}{t('calendar.harvest')} {monthName(row.harvest[0])}
                            {row.harvest.length > 1 ? `–${monthName(row.harvest[row.harvest.length - 1])}` : ''}
                            {/* Harvest worked out from sowing + growing cycle, not stated by a source. */}
                            {row.harvestStated ? null : <span className="cmp-muted"> ({t('calendar.estimate')})</span>}
                        </div>
                    ))}
                    {v.harvest ? <Unconfirmed variety={v} fact="harvest" /> : null}
                </>
            ),
        },
        { key: 'sources', label: t('variety.sources.title'), render: (v) => <Sources variety={v} /> },
    ];

    return (
        <>
            <style>{`
                .cmp-wrap { background: var(--bg); min-height: 100vh; color: var(--text); }
                .cmp-wrap .hero { background: var(--green); color: white; padding: 38px 0 30px; }
                .cmp-wrap .inner { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
                .cmp-wrap h1 { margin: 6px 0 8px; font-size: clamp(2.2rem, 4vw, 3rem); font-family: var(--font-heading); font-weight: 800; }
                .cmp-wrap .hero p { margin: 0; color: rgba(255,255,255,.75); }
                .cmp-wrap .content { max-width: 1180px; margin: 0 auto; padding: 28px 24px 70px; }
                .cmp-wrap .picker { background: var(--surface); border-radius: 16px; padding: 18px; border: 1px solid rgba(var(--green-rgb), .08); margin-bottom: 24px; }
                .cmp-wrap .picker-list { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0 14px; }
                .cmp-wrap .picker-list label { background: var(--blue-soft); border-radius: 999px; padding: 6px 14px; cursor: pointer; font-weight: 600; font-size: .9rem; display: inline-flex; gap: 6px; align-items: center; }
                .cmp-wrap .picker-list label:has(input:checked) { background: var(--green); color: white; }
                .cmp-wrap .btn { background: var(--gold); color: white; border: none; border-radius: 10px; padding: 10px 18px; font-weight: 800; cursor: pointer; }
                .cmp-wrap .table-shell { overflow-x: auto; background: var(--surface); border-radius: 18px; border: 1px solid rgba(var(--green-rgb), .08); box-shadow: 0 12px 30px rgba(0,0,0,.04); }
                .cmp-wrap table { width: 100%; border-collapse: collapse; min-width: 640px; }
                .cmp-wrap th, .cmp-wrap td { padding: 14px 16px; border-bottom: 1px solid var(--blue-soft); text-align: left; vertical-align: top; }
                .cmp-wrap thead th { background: var(--green-soft); color: var(--green-ink); }
                .cmp-wrap thead img { width: 100%; height: 110px; object-fit: cover; border-radius: 10px; margin-bottom: 8px; display: block; }
                .cmp-wrap tbody th { color: var(--text-muted); font-size: .8rem; text-transform: uppercase; letter-spacing: .06em; width: 150px; }
                .cmp-wrap td.best { background: var(--green-soft); }
                .cmp-best { display: inline-block; margin-left: 6px; color: var(--success); font-size: .72rem; font-weight: 800; white-space: nowrap; vertical-align: middle; }
                .cmp-unconfirmed { display: inline-block; margin-left: 6px; padding: 1px 8px; border-radius: 999px; background: var(--gold-soft); color: var(--gold-dark); font-size: .72rem; font-weight: 700; white-space: nowrap; vertical-align: middle; }
                .cmp-sources { margin: 0; padding-left: 18px; display: grid; gap: 10px; font-size: .85rem; }
                .cmp-sources a { color: var(--green-ink); font-weight: 700; }
                .cmp-muted { color: var(--text-muted); font-size: .8rem; }
                .cmp-note { color: var(--text); font-style: italic; margin-top: 2px; }
                .cmp-confirms { color: var(--success); font-size: .78rem; font-weight: 700; margin-top: 2px; }
                .cmp-legend { color: var(--text-muted); font-size: .85rem; margin: 0 0 12px; }
                .cmp-bar { height: 6px; background: var(--blue-soft); border-radius: 3px; margin-top: 6px; overflow: hidden; }
                .cmp-bar span { display: block; height: 100%; background: var(--green); border-radius: 3px; }
            `}</style>

            <div className="cmp-wrap">
                <section className="hero">
                    <div className="inner">
                        <h1>{t('compare.title')}</h1>
                        <p>{t('compare.subtitle')}</p>
                    </div>
                </section>

                <section className="content">
                    <form className="picker animate-fade-in-up" method="GET" action="/variety/compare">
                        <strong style={{ color: 'var(--green-ink)' }}>{t('compare.pick')}</strong>
                        <div className="picker-list">
                            {all.map((variety) => (
                                <label key={variety.id}>
                                    <input type="checkbox" name="ids[]" value={variety.id} defaultChecked={selectedIds.includes(variety.id)} style={{ display: 'none' }} />
                                    {variety.name}
                                </label>
                            ))}
                        </div>
                        <button type="submit" className="btn">{t('compare.button')}</button>
                    </form>

                    {selected.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>{t('compare.empty')}</p>
                    ) : (
                        <>
                        <p className="cmp-legend">
                            <span className="cmp-unconfirmed" style={{ marginLeft: 0 }}>{t('variety.sources.unconfirmed')}</span>{' '}
                            {t(isMobile ? 'variety.sources.legendCards' : 'variety.sources.legend')}
                        </p>
                        {isMobile ? (
                            <VarietyCompareCards selected={selected} rows={rows} facts={FACTS} imageUrl={imageUrl} />
                        ) : (
                        <div className="table-shell animate-fade-in-up">
                            <table>
                                <thead>
                                    <tr>
                                        <th />
                                        {selected.map((v) => (
                                            <th key={v.id}>
                                                {v.image ? <img src={imageUrl(v.image)} alt="" /> : null}
                                                {v.name}
                                                <div lang="km" style={{ fontWeight: 400, fontSize: '.9rem' }}>{v.khmer_name}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row) => (
                                        <tr key={row.key}>
                                            <th scope="row">{row.label}</th>
                                            {selected.map((v) => (
                                                <td key={v.id} className={row.isBest && row.isBest(v) ? 'best' : ''}>
                                                    {row.render(v)}
                                                    {row.isBest && row.isBest(v) ? <span className="cmp-best">★ {t('compare.best')}</span> : null}
                                                    {FACTS.includes(row.key) ? <Unconfirmed variety={v} fact={row.key} /> : null}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        )}
                        </>
                    )}
                </section>
            </div>
        </>
    );
}
