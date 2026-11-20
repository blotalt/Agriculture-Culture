import React from 'react';
import { t } from '../i18n.js';

export default function AdminReportsApp({ reports = [], csrfToken = '' }) {
    const action = (report, verb, label, danger) => (
        <form method="POST" action={`/admin/reports/${report.id}/${verb}`}>
            <input type="hidden" name="_token" value={csrfToken} />
            <button type="submit" className={danger ? 'danger' : ''}>{label}</button>
        </form>
    );

    return (
        <>
            <style>{`
                .reports-wrap { background: var(--bg); min-height: 100vh; color: var(--text); }
                .reports-wrap .hero { background: var(--green); color: white; padding: 38px 0 30px; }
                .reports-wrap .inner { max-width: 960px; margin: 0 auto; padding: 0 24px; }
                .reports-wrap h1 { margin: 6px 0 8px; font-size: clamp(2.2rem, 4vw, 3rem); font-family: var(--font-heading); font-weight: 800; }
                .reports-wrap .hero p { margin: 0; color: rgba(255,255,255,.75); }
                .reports-wrap .content { max-width: 960px; margin: 0 auto; padding: 28px 24px 70px; display: grid; gap: 14px; }
                .reports-wrap .report { background: var(--surface); border-radius: 16px; padding: 18px 20px; border: 1px solid rgba(var(--green-rgb), .08); box-shadow: 0 10px 24px rgba(0,0,0,.04); }
                .reports-wrap .head { display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; font-size: .85rem; color: var(--text-muted); }
                .reports-wrap .reason { background: var(--danger-soft); color: var(--danger); border-radius: 999px; padding: 3px 10px; font-weight: 800; font-size: .78rem; text-transform: uppercase; }
                .reports-wrap blockquote { margin: 12px 0; padding: 12px 14px; background: var(--bg); border-left: 3px solid var(--gold); border-radius: 6px; }
                .reports-wrap blockquote strong { color: var(--green-ink); display: block; margin-bottom: 4px; }
                .reports-wrap blockquote p { margin: 0; white-space: pre-wrap; max-height: 140px; overflow: auto; }
                .reports-wrap .actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
                .reports-wrap button { background: var(--green-soft); color: var(--green-ink); border: 1px solid rgba(var(--green-rgb), .15); border-radius: 8px; padding: 8px 14px; font-weight: 700; cursor: pointer; }
                .reports-wrap button.danger { background: var(--danger); color: white; border-color: var(--danger); }
            `}</style>

            <div className="reports-wrap">
                <section className="hero">
                    <div className="inner">
                        <h1>{t('reports.title')}</h1>
                        <p>{t('reports.subtitle')}</p>
                    </div>
                </section>

                <section className="content">
                    {reports.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>✓ {t('reports.none')}</p>
                    ) : reports.map((report) => (
                        <article className="report animate-fade-in-up" key={report.id}>
                            <div className="head">
                                <span>
                                    <span className="reason">{t(`report.reason.${report.reason}`)}</span>{' '}
                                    {t(`reports.type.${report.type}`)} · {t('reports.by', { name: report.reporter })} · {report.created_at}
                                </span>
                            </div>
                            {report.details ? <p style={{ margin: '10px 0 0' }}>“{report.details}”</p> : null}
                            {report.content ? (
                                <blockquote>
                                    <strong>{report.content.title}</strong>
                                    <p>{report.content.body}</p>
                                </blockquote>
                            ) : (
                                <blockquote><p>{t('reports.gone')}</p></blockquote>
                            )}
                            <div className="actions">
                                {report.content ? <a href={report.content.url} style={{ color: 'var(--green-ink)', fontWeight: 700 }}>{t('common.view')} →</a> : null}
                                {action(report, 'dismiss', t('reports.dismiss'), false)}
                                {report.content ? action(report, 'remove', t('reports.remove'), true) : null}
                            </div>
                        </article>
                    ))}
                </section>
            </div>
        </>
    );
}
