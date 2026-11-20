import React from 'react';
import WeatherCard from './WeatherCard.jsx';
import { t, monthName, provinceName } from '../i18n.js';

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function CalendarApp({ varieties = [], province = 'Phnom Penh', provinces = [], forecast = [] }) {
    const thisMonth = new Date().getMonth() + 1;

    // What can be sown right now, across all varieties and seasons.
    const sowNow = varieties.filter((v) => v.calendar.some((row) => row.sow.includes(thisMonth)));
    const harvestNow = varieties.filter((v) => v.calendar.some((row) => row.harvest.includes(thisMonth)));

    return (
        <>
            <style>{`
                .cal-wrap { background: var(--bg); min-height: 100vh; color: var(--text); }
                .cal-wrap .hero { background: var(--green); color: white; padding: 38px 0 30px; }
                .cal-wrap .inner { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
                .cal-wrap h1 { margin: 6px 0 8px; font-size: clamp(2.2rem, 4vw, 3rem); font-family: var(--font-heading); font-weight: 800; }
                .cal-wrap h2 { margin: 0 0 12px; font-size: 1.4rem; color: var(--green-ink); font-family: var(--font-heading); }
                .cal-wrap .hero p { margin: 0; color: rgba(255,255,255,.75); }
                .cal-wrap .content { max-width: 1180px; margin: 0 auto; padding: 28px 24px 70px; display: grid; grid-template-columns: minmax(0, 1fr); gap: 24px; }
                .cal-wrap .card { background: var(--surface); border-radius: 18px; padding: 22px; border: 1px solid rgba(var(--green-rgb), .08); box-shadow: 0 12px 30px rgba(0,0,0,.04); }
                .cal-wrap .top { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 24px; }
                .cal-wrap .now-list { list-style: none; padding: 0; margin: 0 0 12px; display: flex; flex-wrap: wrap; gap: 6px; }
                .cal-wrap .now-list li { background: var(--green-soft); color: var(--green-ink); border-radius: 999px; padding: 4px 12px; font-weight: 700; font-size: .85rem; }
                .cal-wrap .now-list.harvest li { background: var(--gold-soft); color: var(--gold-dark); }
                .cal-wrap .scroll { overflow-x: auto; }
                .cal-wrap table { width: 100%; border-collapse: separate; border-spacing: 2px; min-width: 760px; }
                .cal-wrap th { font-size: .78rem; color: var(--text-muted); font-weight: 700; padding: 6px 2px; text-align: center; }
                .cal-wrap th.current { color: var(--green-ink); text-decoration: underline; text-underline-offset: 4px; }
                .cal-wrap td { height: 28px; border-radius: 4px; background: var(--bg); font-size: .7rem; text-align: center; font-weight: 800; }
                .cal-wrap td.name, .cal-wrap thead th:first-child { position: sticky; left: 0; z-index: 1; background: var(--surface); }
                .cal-wrap td.name { text-align: left; font-size: .9rem; padding-right: 12px; white-space: nowrap; color: var(--green-ink); }
                .cal-wrap td.name small { display: block; color: var(--text-muted); font-weight: 400; font-size: .75rem; }
                .cal-wrap td.sow { background: var(--green); color: white; }
                .cal-wrap td.harvest { background: var(--gold); color: white; }
                .cal-wrap td.both { background: repeating-linear-gradient(135deg, var(--green) 0 6px, var(--gold) 6px 12px); color: white; }
/* Harvest months worked out from a growing cycle no source confirms yet: striped, not solid. */                .cal-wrap td.harvest.est { background: repeating-linear-gradient(135deg, var(--gold) 0 5px, rgba(var(--gold-rgb), .45) 5px 10px); }                .cal-wrap .estimate-badge { display: inline-block; margin-left: 6px; padding: 0 7px; border-radius: 999px; background: var(--gold-soft); color: var(--gold-dark); font-size: .68rem; font-weight: 700; vertical-align: middle; }                .cal-wrap .cal-sources { font-size: .8rem; color: var(--text-muted); margin: 8px 0 0; padding-left: 18px; }                .cal-wrap .cal-sources a { color: var(--green-ink); }
                .cal-wrap .legend { display: flex; gap: 16px; flex-wrap: wrap; font-size: .85rem; color: var(--text-muted); margin-top: 12px; }
                .cal-wrap .legend span { display: inline-flex; gap: 6px; align-items: center; }
                .cal-wrap .legend i { width: 16px; height: 12px; border-radius: 3px; display: inline-block; }
                .cal-wrap select { background: var(--blue-soft); border: 1px solid var(--border); border-radius: 10px; padding: 8px 12px; font: inherit; }
                @media (max-width: 860px) { .cal-wrap .top { grid-template-columns: minmax(0, 1fr); } }
            `}</style>

            <div className="cal-wrap">
                <section className="hero">
                    <div className="inner">
                        <h1>{t('calendar.title')}</h1>
                        <p>{t('calendar.subtitle')}</p>
                    </div>
                </section>

                <section className="content">
                    <div className="top">
                        <div className="card animate-fade-in-up">
                            <h2>{t('calendar.thisMonth', { month: monthName(thisMonth, true) })}</h2>
                            <strong style={{ color: 'var(--green-ink)' }}>🌱 {t('calendar.sowNow')}</strong>
                            <ul className="now-list">
                                {sowNow.length ? sowNow.map((v) => <li key={v.id}>{v.name}</li>) : <li>{t('calendar.nothing')}</li>}
                            </ul>
                            <strong style={{ color: 'var(--gold-dark)' }}>🌾 {t('calendar.harvestNow')}</strong>
                            <ul className="now-list harvest">
                                {harvestNow.length ? harvestNow.map((v) => <li key={v.id}>{v.name}</li>) : <li>{t('calendar.nothing')}</li>}
                            </ul>
                        </div>

                        <div className="card animate-fade-in-up">
                            <form method="GET" action="/calendar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                                <h2 style={{ margin: 0 }}>{t('weather.title', { province: provinceName({ name: province }) })}</h2>
                                <select name="province" defaultValue={province} onChange={(e) => e.target.form.submit()} aria-label={t('prices.province')}>
                                    {provinces.map((name) => <option key={name} value={name}>{provinceName({ name })}</option>)}
                                </select>
                            </form>
                            <WeatherCard province={province} days={forecast} />
                        </div>
                    </div>

                    <div className="card animate-fade-in-up">
                        <h2>{t('calendar.yearView')}</h2>
                        <div className="scroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th />
                                        {MONTHS.map((m) => <th key={m} className={m === thisMonth ? 'current' : ''}>{monthName(m)}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {varieties.flatMap((v) => v.calendar.map((row) => (
                                        <tr key={`${v.id}-${row.season}`}>
                                            <td className="name">
                                                {v.name}
                                                {row.estimate ? <span className="estimate-badge" title={t('calendar.estimateHint')}>{t('calendar.estimate')}</span> : null}
                                                <small>{t(`season.${row.season}`)} · {v.cycle}</small>
                                            </td>
                                            {MONTHS.map((m) => {
                                                const sow = row.sow.includes(m);
                                                const harvest = row.harvest.includes(m);
                                                const cls = sow && harvest ? 'both' : sow ? 'sow' : harvest ? `harvest${row.estimate ? ' est' : ''}` : '';
                                                const label = sow && harvest ? t('calendar.sow') + ' / ' + t('calendar.harvest') : sow ? t('calendar.sow') : harvest ? t('calendar.harvest') : '';
                                                return <td key={m} className={cls} title={label}>{sow ? 'S' : harvest ? 'H' : ''}</td>;
                                            })}
                                        </tr>
                                    )))}
                                </tbody>
                            </table>
                        </div>
                        <div className="legend">
                            <span><i style={{ background: 'var(--green)' }} /> S = {t('calendar.sow')}</span>
                            <span><i style={{ background: 'var(--gold)' }} /> H = {t('calendar.harvest')}</span>
                            <span><i style={{ background: 'repeating-linear-gradient(135deg, var(--gold) 0 4px, rgba(var(--gold-rgb), .45) 4px 8px)' }} /> {t('calendar.harvestEstimate')}</span>
                        </div>
                        <p style={{ fontSize: '.82rem', color: 'var(--text-muted)', margin: '12px 0 0' }}>{t('calendar.disclaimer')}</p>
                        <ol className="cal-sources" aria-label={t('calendar.sources')}>
                            <li><a href="https://www.fao.org/4/y4347e/y4347e0d.htm" target="_blank" rel="noopener noreferrer">FAO Rice Information Vol. 3 (2002): Cambodia, cropping seasons</a></li>
                            <li><a href="https://www.fao.org/4/j5649e/pays/cmb.htm" target="_blank" rel="noopener noreferrer">FAO GIEWS country brief: Cambodia</a></li>
                        </ol>
                    </div>
                </section>
            </div>
        </>
    );
}
