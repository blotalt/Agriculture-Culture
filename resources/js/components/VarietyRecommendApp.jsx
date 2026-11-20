import React from 'react';
import { t, monthName, provinceName } from '../i18n.js';

const imageUrl = (image) => (image ? `/storage/${image}` : '/images/extra/ricefields.png');

export default function VarietyRecommendApp({ results = [], filters = {}, provinces = [] }) {
    const searched = Boolean(filters.season);

    return (
        <>
            <style>{`
                .rec-wrap { background: var(--bg); min-height: 100vh; color: var(--text); }
                .rec-wrap .hero { background: var(--green); color: white; padding: 38px 0 30px; }
                .rec-wrap .inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
                .rec-wrap h1 { margin: 6px 0 8px; font-size: clamp(2.2rem, 4vw, 3rem); font-family: var(--font-heading); font-weight: 800; }
                .rec-wrap .hero p { margin: 0; color: rgba(255,255,255,.75); }
                .rec-wrap .content { max-width: 1100px; margin: 0 auto; padding: 28px 24px 70px; }
                .rec-wrap form { background: var(--surface); border-radius: 16px; padding: 20px; border: 1px solid rgba(var(--green-rgb), .08); display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)) auto; gap: 14px; align-items: end; margin-bottom: 26px; }
                .rec-wrap label { display: grid; gap: 6px; font-weight: 700; color: var(--green-ink); font-size: .9rem; }
                .rec-wrap select { background: var(--blue-soft); border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; font: inherit; }
                .rec-wrap button { background: var(--gold); color: white; border: none; border-radius: 10px; padding: 11px 20px; font-weight: 800; cursor: pointer; }
                .rec-wrap .result { display: grid; grid-template-columns: 150px minmax(0, 1fr) 110px; gap: 18px; background: var(--surface); border-radius: 16px; padding: 16px; border: 1px solid rgba(var(--green-rgb), .08); margin-bottom: 14px; align-items: center; box-shadow: 0 10px 24px rgba(0,0,0,.04); }
                .rec-wrap .result img { width: 150px; height: 110px; object-fit: cover; border-radius: 12px; }
                .rec-wrap .result h3 { margin: 0 0 4px; color: var(--green-ink); font-family: var(--font-heading); }
                .rec-wrap .chips { display: flex; gap: 6px; flex-wrap: wrap; margin: 8px 0; }
                .rec-wrap .chip { background: var(--green-soft); color: var(--green-ink); border-radius: 999px; padding: 4px 10px; font-size: .78rem; font-weight: 700; text-decoration: none; }
                .rec-wrap .chip-unsourced { background: var(--gold-soft); color: var(--gold-dark); }
                .rec-wrap .score { text-align: center; }
                .rec-wrap .score strong { display: block; font-size: 2rem; color: var(--green-ink); font-family: var(--font-heading); }
                .rec-wrap .score span { font-size: .75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: .06em; }
                .rec-wrap .rank { display: inline-block; background: var(--gold); color: white; border-radius: 999px; padding: 2px 10px; font-size: .75rem; font-weight: 800; margin-bottom: 6px; }
                .rec-wrap .meta { font-size: .88rem; color: var(--text-muted); margin: 0; }
                @media (max-width: 820px) {
                    .rec-wrap form { grid-template-columns: 1fr; }
                    .rec-wrap .result { grid-template-columns: minmax(0, 1fr); }
                    .rec-wrap .result img { width: 100%; height: 160px; }
                    .rec-wrap .score { text-align: left; }
                }
            `}</style>

            <div className="rec-wrap">
                <section className="hero">
                    <div className="inner">
                        <h1>{t('recommend.title')}</h1>
                        <p>{t('recommend.subtitle')}</p>
                    </div>
                </section>

                <section className="content">
                    <form className="animate-fade-in-up" method="GET" action="/variety/recommend">
                        <label>
                            {t('variety.season')}
                            <select name="season" defaultValue={filters.season || 'wet'} required>
                                <option value="wet">{t('season.wet')}</option>
                                <option value="dry">{t('season.dry')}</option>
                            </select>
                        </label>
                        <label>
                            {t('prices.province')}
                            <select name="province" defaultValue={filters.province || ''}>
                                <option value="">{t('alerts.anyProvince')}</option>
                                {provinces.map((name) => <option key={name} value={name}>{provinceName({ name })}</option>)}
                            </select>
                        </label>
                        <label>
                            {t('recommend.priority')}
                            <select name="priority" defaultValue={filters.priority || 'demand'}>
                                <option value="demand">{t('recommend.priority.demand')}</option>
                                <option value="yield">{t('recommend.priority.yield')}</option>
                                <option value="fast">{t('recommend.priority.fast')}</option>
                            </select>
                        </label>
                        <button type="submit">{t('recommend.button')}</button>
                    </form>

                    {!searched ? (
                        <p style={{ color: 'var(--text-muted)' }}>{t('recommend.prompt')}</p>
                    ) : results.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>{t('recommend.none')}</p>
                    ) : (
                        <>
                            {results.map((v, index) => {
                                const plan = v.calendar.find((row) => row.season === filters.season);
                                return (
                                    <article className="result animate-fade-in-up hover-lift" key={v.id}>
                                        <img src={imageUrl(v.image)} alt="" />
                                        <div>
                                            {index === 0 ? <span className="rank">{t('recommend.best')}</span> : null}
                                            <h3>{v.name} <small lang="km" style={{ fontWeight: 400, fontSize: '.95rem' }}>{v.khmer_name}</small></h3>
                                            <p className="meta">{v.type} · {v.yield} · {v.cycle} · {t('variety.demand')}: {v.demand}</p>
                                            <div className="chips">
                                                {v.reasons.map((reason) => <span className="chip" key={reason}>✓ {t(`recommend.reason.${reason}`)}</span>)}
                                                <a
                                                    className={`chip ${v.sources?.length ? '' : 'chip-unsourced'}`}
                                                    href={`/variety/compare?ids[]=${v.id}`}
                                                    title={t('variety.sources.title')}
                                                >
                                                    {v.sources?.length ? `📄 ${t('variety.sources.count', { count: v.sources.length })}` : t('variety.sources.noneShort')}
                                                </a>
                                            </div>
                                            {plan ? (
                                                <p className="meta">
                                                    📅 {t('calendar.sow')} {plan.sow.map((m) => monthName(m)).join(', ')} · {t('calendar.harvest')} {monthName(plan.harvest[0])}–{monthName(plan.harvest[plan.harvest.length - 1])}
                                                </p>
                                            ) : null}
                                        </div>
                                        <div className="score">
                                            <strong>{v.score}</strong>
                                            <span>{t('recommend.score')}</span>
                                            <div style={{ marginTop: 8 }}>
                                                <a href={`/variety/compare?ids[]=${v.id}`} style={{ color: 'var(--green-ink)', fontWeight: 700 }}>{t('variety.details')}</a>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                            <p style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>{t('recommend.disclaimer')}</p>
                        </>
                    )}
                </section>
            </div>
        </>
    );
}
