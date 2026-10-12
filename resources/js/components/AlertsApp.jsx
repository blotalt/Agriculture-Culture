import React, { useState } from 'react';
import { t, provinceName } from '../i18n.js';

export default function AlertsApp({ alerts = [], options = {}, csrfToken = '', errors = [], old = {} }) {
    const { varieties = [], provinces = [], telegramEnabled = false, telegramBot = '' } = options;
    const [useTelegram, setUseTelegram] = useState(Boolean(old.telegram_chat_id));

    return (
        <>
            <style>{`
                .alerts-wrap { background: var(--bg); min-height: 100vh; color: var(--text); }
                .alerts-wrap .hero { background: var(--green); color: white; padding: 38px 0 30px; }
                .alerts-wrap .inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
                .alerts-wrap h1 { margin: 6px 0 8px; font-size: clamp(2.2rem, 4vw, 3rem); font-family: var(--font-heading); font-weight: 800; }
                .alerts-wrap .hero p { margin: 0; color: rgba(255,255,255,.75); }
                .alerts-wrap .eyebrow { color: var(--gold-light); font-size: .78rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
                .alerts-wrap .grid { display: grid; grid-template-columns: 400px minmax(0, 1fr); gap: 24px; padding: 32px 24px 70px; max-width: 1100px; margin: 0 auto; align-items: start; }
                .alerts-wrap .panel { background: var(--surface); border: 1px solid rgba(var(--green-rgb), .08); border-radius: 18px; padding: 24px; box-shadow: 0 12px 28px rgba(0,0,0,.04); }
                .alerts-wrap h2 { margin: 0 0 16px; font-size: 1.6rem; color: var(--green-ink); font-family: var(--font-heading); }
                .alerts-wrap form.create { display: grid; gap: 14px; }
                .alerts-wrap label.field-label { display: grid; gap: 6px; font-weight: 700; color: var(--green-ink); font-size: .9rem; }
                .alerts-wrap .field { width: 100%; background: var(--blue-soft); border: 1px solid var(--border); border-radius: 10px; padding: 11px 13px; font: inherit; color: var(--text); }
                .alerts-wrap .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                .alerts-wrap .check { display: flex; gap: 10px; align-items: center; font-weight: 600; color: var(--text-muted); }
                .alerts-wrap .help { font-size: .8rem; color: var(--text-muted); margin: 0; }
                .alerts-wrap .btn { background: var(--gold); color: white; border: none; border-radius: 10px; padding: 12px 18px; font-weight: 800; cursor: pointer; }
                .alerts-wrap .errors { background: var(--danger-soft); color: var(--danger); border-radius: 10px; padding: 10px 14px; margin: 0; list-style: none; }
                .alerts-wrap .alert-item { display: flex; justify-content: space-between; align-items: center; gap: 14px; padding: 16px 0; border-bottom: 1px solid var(--blue-soft); }
                .alerts-wrap .alert-item:last-child { border-bottom: none; }
                .alerts-wrap .alert-item strong { color: var(--green-ink); }
                .alerts-wrap .alert-item small { display: block; color: var(--text-muted); margin-top: 4px; }
                .alerts-wrap .delete { background: var(--surface); color: var(--danger); border: 1px solid var(--danger-border); border-radius: 8px; padding: 8px 12px; font-weight: 700; cursor: pointer; }
                @media (max-width: 900px) { .alerts-wrap .grid { grid-template-columns: minmax(0, 1fr); } }
            `}</style>

            <div className="alerts-wrap">
                <section className="hero">
                    <div className="inner">
                        <div className="eyebrow">{t('alerts.eyebrow')}</div>
                        <h1>{t('alerts.title')}</h1>
                        <p>{t('alerts.subtitle')}</p>
                    </div>
                </section>

                <div className="grid">
                    <div className="panel animate-fade-in-up">
                        <h2>{t('alerts.new')}</h2>
                        <form className="create" method="POST" action="/alerts">
                            <input type="hidden" name="_token" value={csrfToken} />

                            {errors.length ? (
                                <ul className="errors">{errors.map((error) => <li key={error}>{error}</li>)}</ul>
                            ) : null}

                            <label className="field-label">
                                {t('alerts.variety')}
                                <select className="field" name="rice_variety" defaultValue={old.rice_variety || ''}>
                                    <option value="">{t('alerts.anyVariety')}</option>
                                    {varieties.map((variety) => <option key={variety} value={variety}>{variety}</option>)}
                                </select>
                            </label>

                            <label className="field-label">
                                {t('prices.province')}
                                <select className="field" name="province" defaultValue={old.province || ''}>
                                    <option value="">{t('alerts.anyProvince')}</option>
                                    {provinces.map((name) => <option key={name} value={name}>{provinceName({ name })}</option>)}
                                </select>
                            </label>

                            <div className="row">
                                <label className="field-label">
                                    {t('alerts.when')}
                                    <select className="field" name="direction" defaultValue={old.direction || 'above'}>
                                        <option value="above">{t('alerts.above')}</option>
                                        <option value="below">{t('alerts.below')}</option>
                                    </select>
                                </label>
                                <label className="field-label">
                                    {t('alerts.threshold')}
                                    <input className="field" type="number" name="threshold" step="0.01" min="0" max="100" required defaultValue={old.threshold || ''} placeholder="0.50" />
                                </label>
                            </div>

                            <label className="check">
                                <input type="checkbox" name="notify_email" value="1" defaultChecked={old.notify_email !== undefined ? Boolean(old.notify_email) : true} />
                                {t('alerts.byEmail')}
                            </label>

                            {telegramEnabled ? (
                                <>
                                    <label className="check">
                                        <input type="checkbox" checked={useTelegram} onChange={(e) => setUseTelegram(e.target.checked)} />
                                        {t('alerts.byTelegram')}
                                    </label>
                                    {useTelegram ? (
                                        <label className="field-label">
                                            {t('alerts.chatId')}
                                            <input className="field" type="text" name="telegram_chat_id" inputMode="numeric" pattern="-?[0-9]+" defaultValue={old.telegram_chat_id || ''} />
                                            <p className="help">
                                                {t('alerts.chatIdHelp')}
                                                {telegramBot ? <> {t('alerts.startBot')} <a href={`https://t.me/${telegramBot}`} target="_blank" rel="noreferrer">@{telegramBot}</a>.</> : null}
                                            </p>
                                        </label>
                                    ) : null}
                                </>
                            ) : null}

                            <button type="submit" className="btn">{t('alerts.create')}</button>
                        </form>
                    </div>

                    <div className="panel animate-fade-in-up">
                        <h2>{t('alerts.yours')} ({alerts.length})</h2>
                        {alerts.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>{t('alerts.none')}</p>
                        ) : alerts.map((alert) => (
                            <div className="alert-item" key={alert.id}>
                                <div>
                                    <strong>
                                        {alert.rice_variety || t('alerts.anyVariety')} · {alert.province ? provinceName({ name: alert.province }) : t('alerts.anyProvince')}
                                    </strong>
                                    <div>
                                        {t(alert.direction === 'above' ? 'alerts.above' : 'alerts.below')} <strong>${Number(alert.threshold).toFixed(2)}</strong>/kg
                                    </div>
                                    <small>
                                        {[alert.notify_email ? t('alerts.email') : null, alert.telegram ? 'Telegram' : null].filter(Boolean).join(' + ')}
                                        {alert.last_notified_at ? ` · ${t('alerts.lastSent', { when: alert.last_notified_at })}` : ''}
                                    </small>
                                </div>
                                <form method="POST" action={`/alerts/${alert.id}`}>
                                    <input type="hidden" name="_token" value={csrfToken} />
                                    <input type="hidden" name="_method" value="DELETE" />
                                    <button type="submit" className="delete">{t('common.delete')}</button>
                                </form>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
