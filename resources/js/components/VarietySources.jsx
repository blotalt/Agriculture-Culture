import React from 'react';
import { t } from '../i18n.js';

// Shared by the comparison table (desktop) and the comparison cards (phones).
// Styles (.cmp-*) are in VarietyCompareApp.

// Shown next to a fact that no published source backs up.
export function Unconfirmed({ variety, fact }) {
    if (!Array.isArray(variety.unconfirmed) || !variety.unconfirmed.includes(fact)) return null;
    return <span className="cmp-unconfirmed" title={t('variety.sources.unconfirmedHint')}>{t('variety.sources.unconfirmed')}</span>;
}

// The references for one variety: what each says and which facts it confirms.
export function Sources({ variety }) {
    const sources = variety.sources || [];
    if (!sources.length) return <span className="cmp-muted">{t('variety.sources.none')}</span>;

    return (
        <ol className="cmp-sources">
            {sources.map((source, i) => (
                <li key={source.url || source.title || i}>
                    {source.url ? <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a> : <strong>{source.title}</strong>}
                    <div className="cmp-muted">
                        {[source.publisher, source.date].filter(Boolean).join(' · ')}
                        {source.added_by ? `${source.publisher || source.date ? ' · ' : ''}${t('variety.sources.addedBy', { name: source.added_by })}` : ''}
                    </div>
                    {source.note ? <div className="cmp-note">“{source.note}”</div> : null}
                    {Array.isArray(source.confirms) && source.confirms.length ? (
                        <div className="cmp-confirms">✓ {t('variety.sources.confirms')}: {source.confirms.map((fact) => t(`variety.${fact}`)).join(', ')}</div>
                    ) : null}
                </li>
            ))}
        </ol>
    );
}
