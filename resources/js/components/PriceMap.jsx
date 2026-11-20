import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { t, provinceName } from '../i18n.js';

// One hue, light to dark: cheaper markets are lighter. Real colour values (not CSS variables),
// because Leaflet writes them straight into SVG attributes. Shades of the site's --green.
export const PRICE_RAMP = ['#cfe8d8', '#9fcfb1', '#62a87e', '#2b7049', '#1f5638'];
const NO_DATA = '#93a3b0';
const SELECTED = '#e8bd45';

// Map of Cambodia with a circle per province, colored by its average rice price.
export default function PriceMap({ provinces = [], selected = '', onSelect = () => {} }) {
    const elementRef = useRef(null);
    const mapRef = useRef(null);
    const layerRef = useRef(null);

    const priced = provinces.filter((p) => p.avg !== null);
    const min = Math.min(...priced.map((p) => p.avg));
    const max = Math.max(...priced.map((p) => p.avg));
    const colorFor = (avg) => {
        if (avg === null) return NO_DATA;
        if (max === min) return PRICE_RAMP[2];
        const step = Math.round(((avg - min) / (max - min)) * (PRICE_RAMP.length - 1));
        return PRICE_RAMP[step];
    };

    useEffect(() => {
        if (mapRef.current) return undefined;

        mapRef.current = L.map(elementRef.current, { scrollWheelZoom: false, attributionControl: true })
            .setView([12.6, 104.9], 7);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 12,
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(mapRef.current);

        layerRef.current = L.layerGroup().addTo(mapRef.current);

        return () => {
            mapRef.current.remove();
            mapRef.current = null;
        };
    }, []);

    useEffect(() => {
        const layer = layerRef.current;
        if (!layer) return;
        layer.clearLayers();

        provinces.forEach((province) => {
            const isSelected = province.name === selected;
            const marker = L.circleMarker([province.lat, province.lng], {
                radius: province.avg === null ? 6 : 9 + Math.min(province.markets, 4) * 2,
                color: isSelected ? SELECTED : '#ffffff',
                weight: isSelected ? 4 : 2,
                fillColor: colorFor(province.avg),
                fillOpacity: province.avg === null ? 0.5 : 0.95,
            });

            const price = province.avg === null
                ? t('prices.map.noData')
                : `$${province.avg.toFixed(2)}/kg · ${t('prices.markets', { count: province.markets })}`;
            const change = province.change1m === null ? '' : `<br>${t('prices.change1m')}: ${province.change1m > 0 ? '+' : ''}${province.change1m}%`;

            marker.bindTooltip(`<strong>${provinceName(province)}</strong><br>${price}${change}`, { direction: 'top' });
            marker.on('click', () => onSelect(isSelected ? '' : province.name));
            marker.addTo(layer);
        });
    }, [provinces, selected]);

    return (
        <div>
            <div ref={elementRef} className="price-map" style={{ height: 380, borderRadius: 14, overflow: 'hidden', zIndex: 0 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: '.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                <span>{priced.length ? `$${min.toFixed(2)}` : ''}</span>
                {PRICE_RAMP.map((color) => <span key={color} style={{ width: 26, height: 10, background: color, borderRadius: 3 }} />)}
                <span>{priced.length ? `$${max.toFixed(2)}` : ''}</span>
                <span style={{ marginLeft: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: NO_DATA }} /> {t('prices.map.noData')}
                </span>
            </div>
        </div>
    );
}
