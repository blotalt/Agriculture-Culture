import React, { useMemo, useRef, useState } from 'react';
import { t, formatMonth } from '../i18n.js';

// Drawing sizes. The compact one is for phones: a narrower drawing keeps the axis text readable
// once it's scaled down to the screen, and it shows fewer month labels.
const SIZES = {
    wide: { WIDTH: 760, HEIGHT: 280, PAD: { top: 16, right: 18, bottom: 34, left: 52 }, LABELS: 8 },
    compact: { WIDTH: 360, HEIGHT: 250, PAD: { top: 14, right: 12, bottom: 30, left: 44 }, LABELS: 4 },
};

// "2026-03" <-> month number, so the x axis follows time even when months are missing.
const toIndex = (month) => {
    const [year, m] = month.split('-').map(Number);
    return year * 12 + (m - 1);
};
const fromIndex = (index) => `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, '0')}`;

// Split a series wherever months are missing, so gaps in the data stay visible.
const segmentsOf = (points) => points.reduce((segments, point, i) => {
    if (i > 0 && toIndex(point.month) - toIndex(points[i - 1].month) > 1) segments.push([]);
    segments[segments.length - 1].push(point);
    return segments;
}, [[]]);

// Line chart of monthly average prices: one or two series ({ key, label, color, points: [{ month, avg }] }).
export default function PriceChart({ series = [], compact = false }) {
    const { WIDTH, HEIGHT, PAD, LABELS } = compact ? SIZES.compact : SIZES.wide;
    const svgRef = useRef(null);
    const [hover, setHover] = useState(null);

    const months = useMemo(
        () => [...new Set(series.flatMap((s) => s.points.map((p) => p.month)))].sort(),
        [series]
    );

    if (months.length < 2) {
        return <p style={{ color: 'var(--text-muted)', margin: 0 }}>{t('prices.chart.notEnough')}</p>;
    }

    const first = toIndex(months[0]);
    const last = toIndex(months[months.length - 1]);

    const values = series.flatMap((s) => s.points.map((p) => p.avg));
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const pad = Math.max((rawMax - rawMin) * 0.15, 0.02);
    const min = Math.max(0, rawMin - pad);
    const max = rawMax + pad;

    const plotWidth = WIDTH - PAD.left - PAD.right;
    const x = (month) => PAD.left + ((toIndex(month) - first) / (last - first)) * plotWidth;
    const y = (value) => PAD.top + (1 - (value - min) / (max - min)) * (HEIGHT - PAD.top - PAD.bottom);

    const ticks = Array.from({ length: 5 }, (_, i) => min + ((max - min) * i) / 4);

    // A few evenly spaced month labels; the last month is always labelled.
    const step = Math.max(1, Math.ceil((last - first) / LABELS));
    const labels = [];
    for (let i = first; i <= last - step / 2; i += step) labels.push(fromIndex(i));
    labels.push(months[months.length - 1]);

    const onMove = (event) => {
        const box = svgRef.current.getBoundingClientRect();
        const px = ((event.clientX - box.left) / box.width) * WIDTH;
        // Snap to the nearest month that has data.
        const nearest = months.reduce((best, month) => (Math.abs(x(month) - px) < Math.abs(x(best) - px) ? month : best), months[0]);
        setHover(nearest);
    };

    const hoverValues = hover
        ? series.map((s) => ({ ...s, point: s.points.find((p) => p.month === hover) })).filter((s) => s.point)
        : [];

    const linePath = (points) => points.map((p, i) => `${i ? 'L' : 'M'}${x(p.month).toFixed(1)},${y(p.avg).toFixed(1)}`).join(' ');

    return (
        <div className="price-chart">
            <style>{`
                .price-chart { position: relative; }
                .price-chart svg { width: 100%; height: auto; display: block; touch-action: pan-y; }
                .price-chart .legend { display: flex; gap: 18px; flex-wrap: wrap; margin-bottom: 10px; font-size: .85rem; color: var(--text-muted); }
                .price-chart .legend span { display: inline-flex; align-items: center; gap: 6px; }
                .price-chart .legend i { width: 18px; height: 3px; border-radius: 2px; display: inline-block; }
                .price-chart .tip {
                    position: absolute; top: 34px; transform: translateX(-50%); pointer-events: none;
                    background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 8px 10px;
                    box-shadow: 0 8px 20px rgba(0,0,0,.08); font-size: .82rem; white-space: nowrap; color: var(--text);
                }
                .price-chart .tip b { display: block; margin-bottom: 4px; color: var(--green-ink); }
                .price-chart .tip i { width: 10px; height: 3px; display: inline-block; margin-right: 6px; vertical-align: middle; border-radius: 2px; }
            `}</style>

            {series.length > 1 ? (
                <div className="legend">
                    {series.map((s) => (
                        <span key={s.key}><i style={{ background: s.color }} />{s.label}</span>
                    ))}
                </div>
            ) : null}

            <svg
                ref={svgRef}
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                role="img"
                aria-label={t('prices.chart.aria')}
                onMouseMove={onMove}
                onMouseLeave={() => setHover(null)}
                onTouchStart={(e) => onMove(e.touches[0])}
                onTouchMove={(e) => onMove(e.touches[0])}
            >
                {ticks.map((tick) => (
                    <g key={tick}>
                        <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y(tick)} y2={y(tick)} style={{ stroke: 'var(--blue-soft)' }} />
                        <text x={PAD.left - 8} y={y(tick) + 4} textAnchor="end" fontSize="11" style={{ fill: 'var(--text-muted)' }}>${tick.toFixed(2)}</text>
                    </g>
                ))}

                {labels.map((month, i) => (
                    // The last label ends at the right edge rather than centring on it, so it isn't cut off.
                    <text key={month} x={x(month)} y={HEIGHT - 10} textAnchor={i === labels.length - 1 ? 'end' : 'middle'} fontSize="11" style={{ fill: 'var(--text-muted)' }}>
                        {formatMonth(month)}
                    </text>
                ))}

                {series.map((s) => {
                    const segments = segmentsOf(s.points);
                    return (
                        <g key={s.key}>
                            {/* Months with no data: a faint dashed bridge instead of a solid line. */}
                            {segments.slice(1).map((segment, i) => {
                                const before = segments[i][segments[i].length - 1];
                                return (
                                    <line
                                        key={segment[0].month}
                                        x1={x(before.month)} y1={y(before.avg)} x2={x(segment[0].month)} y2={y(segment[0].avg)}
                                        style={{ stroke: s.color }} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5"
                                    />
                                );
                            })}
                            {segments.map((segment) => (
                                segment.length > 1 ? (
                                    <path key={segment[0].month} d={linePath(segment)} fill="none" style={{ stroke: s.color }} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                                ) : (
                                    <circle key={segment[0].month} cx={x(segment[0].month)} cy={y(segment[0].avg)} r="2.5" style={{ fill: s.color }} />
                                )
                            ))}
                        </g>
                    );
                })}

                {/* Mark the latest value at the end of each line. */}
                {series.map((s) => {
                    const lastPoint = s.points[s.points.length - 1];
                    return lastPoint ? (
                        <circle key={s.key} cx={x(lastPoint.month)} cy={y(lastPoint.avg)} r="4" style={{ fill: s.color, stroke: 'var(--surface)' }} strokeWidth="2" />
                    ) : null;
                })}

                {hover ? (
                    <g>
                        <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={HEIGHT - PAD.bottom} style={{ stroke: 'var(--text-faint)' }} strokeDasharray="3 3" />
                        {hoverValues.map((s) => (
                            <circle key={s.key} cx={x(hover)} cy={y(s.point.avg)} r="5" style={{ fill: s.color, stroke: 'var(--surface)' }} strokeWidth="2" />
                        ))}
                    </g>
                ) : null}
            </svg>

            {hover && hoverValues.length ? (
                <div className="tip" style={{ left: `${Math.min(85, Math.max(15, (x(hover) / WIDTH) * 100))}%` }}>
                    <b>{formatMonth(hover, true)}</b>
                    {hoverValues.map((s) => (
                        <div key={s.key}>
                            <i style={{ background: s.color }} />{s.label}: <strong>${s.point.avg.toFixed(3)}</strong>/kg
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
