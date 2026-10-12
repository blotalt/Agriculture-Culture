import React from 'react';
import { t } from '../i18n.js';

// Sort choices for phones, where there are no column headers to tap.
const SORTS = [
    { value: 'province_name:1', label: 'prices.sort.province' },
    { value: 'price_per_kg:1', label: 'prices.sort.cheapest' },
    { value: 'price_per_kg:-1', label: 'prices.sort.dearest' },
    { value: 'change_percent:-1', label: 'prices.sort.rising' },
    { value: 'change_percent:1', label: 'prices.sort.falling' },
    { value: 'market:1', label: 'prices.sort.market' },
];

// Phone version of the "Latest market prices" table: one card per market.
// Sorting and formatting come from PriceMarketApp so both views always agree.
export default function PriceCards({ rows, sort, onSort, provinceLabel, formatCurrency, formatUpdated, Change }) {
    const current = `${sort.key}:${sort.dir}`;

    return (
        <div className="m-price-list">
            <label className="m-sort">
                {t('prices.sortBy')}
                <select
                    value={SORTS.some((s) => s.value === current) ? current : ''}
                    onChange={(event) => {
                        const [key, dir] = event.target.value.split(':');
                        onSort({ key, dir: Number(dir) });
                    }}
                >
                    {SORTS.some((s) => s.value === current) ? null : <option value="" disabled>—</option>}
                    {SORTS.map((option) => <option key={option.value} value={option.value}>{t(option.label)}</option>)}
                </select>
            </label>

            {rows.length === 0 ? (
                <p className="empty">{t('prices.empty')}</p>
            ) : (
                <ul className="m-cards">
                    {rows.map((price) => (
                        <li key={price.id ?? `${price.rice_variety}-${price.market}`} className="m-price-card">
                            <p className="market">{price.market}</p>
                            <span className="price">{formatCurrency(price.price_per_kg)}<small style={{ fontSize: '.7rem', fontWeight: 600 }}>/kg</small></span>
                            <p className="where">{provinceLabel(price)} · {price.rice_variety}</p>
                            <span className="change"><Change value={Number(price.change_percent ?? 0)} /></span>
                            <div className="meta">
                                <span>{price.rice_type}</span>
                                <span>{formatUpdated(price)}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
