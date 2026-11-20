import React from 'react';
import { t } from '../i18n.js';

// A small "Report" link that opens a reason picker and sends the report for admin review.
export default function ReportButton({ type, id, csrfToken }) {
    const reasons = ['spam', 'offensive', 'misleading', 'other'];

    return (
        <details className="report-button">
            <style>{`
                .report-button { display: inline-block; position: relative; font-size: 0.82rem; }
                .report-button summary { cursor: pointer; color: var(--text-muted); list-style: none; }
                .report-button summary::-webkit-details-marker { display: none; }
                .report-button[open] summary { color: var(--danger); }
                .report-button form {
                    position: absolute; right: 0; top: 22px; z-index: 10; width: 240px;
                    background: var(--surface); border: 1px solid var(--border); border-radius: 10px;
                    box-shadow: 0 12px 28px rgba(0,0,0,0.1); padding: 12px; display: grid; gap: 8px;
                }
                .report-button select, .report-button textarea {
                    width: 100%; border: 1px solid var(--border); border-radius: 8px; padding: 6px 8px;
                    background: var(--bg); font: inherit;
                }
                .report-button button {
                    background: var(--danger); color: white; border: none; border-radius: 8px;
                    padding: 7px 10px; font-weight: 700; cursor: pointer;
                }
            `}</style>
            <summary>⚑ {t('report.button')}</summary>
            <form method="POST" action="/reports">
                <input type="hidden" name="_token" value={csrfToken} />
                <input type="hidden" name="type" value={type} />
                <input type="hidden" name="id" value={id} />
                <label>
                    {t('report.reason')}
                    <select name="reason" required defaultValue="spam">
                        {reasons.map((reason) => (
                            <option key={reason} value={reason}>{t(`report.reason.${reason}`)}</option>
                        ))}
                    </select>
                </label>
                <textarea name="details" maxLength={500} rows={2} placeholder={t('report.details')} />
                <button type="submit">{t('report.send')}</button>
            </form>
        </details>
    );
}
