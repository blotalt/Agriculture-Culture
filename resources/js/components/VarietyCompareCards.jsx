import React from 'react';
import { Sources, Unconfirmed } from './VarietySources.jsx';
import { t } from '../i18n.js';

// Phone version of the variety comparison: one card per variety, with the same rows as the
// desktop table (passed in from VarietyCompareApp) and the sources folded away at the bottom.
export default function VarietyCompareCards({ selected, rows, facts, imageUrl }) {
    return (
        <ul className="m-cards">
            {selected.map((variety) => (
                <li key={variety.id} className="m-variety-card">
                    {variety.image ? <img src={imageUrl(variety.image)} alt="" /> : null}
                    <div className="body">
                        <div>
                            <h2>{variety.name}</h2>
                            <div lang="km" className="cmp-muted" style={{ fontSize: '.95rem' }}>{variety.khmer_name}</div>
                        </div>

                        <dl className="facts">
                            {rows.filter((row) => row.key !== 'sources').map((row) => (
                                <React.Fragment key={row.key}>
                                    <dt>{row.label}</dt>
                                    <dd>
                                        {row.render(variety)}
                                        {row.isBest && row.isBest(variety) ? <span className="cmp-best">★ {t('compare.best')}</span> : null}
                                        {facts.includes(row.key) ? <Unconfirmed variety={variety} fact={row.key} /> : null}
                                    </dd>
                                </React.Fragment>
                            ))}
                        </dl>

                        <details>
                            <summary>{t('variety.sources.title')} ({(variety.sources || []).length})</summary>
                            <div style={{ marginTop: 10 }}>
                                <Sources variety={variety} />
                            </div>
                        </details>
                    </div>
                </li>
            ))}
        </ul>
    );
}
