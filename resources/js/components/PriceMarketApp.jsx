import React from 'react';

const formatCurrency = (value) => `$${Number(value).toFixed(2)}`;

export default function PriceMarketApp({ prices = [] }) {
    return (
        <>
            <style>{`
                .price-react-wrap {
                    background: #faf6ee;
                    color: #202020;
                    font-family: system-ui, -apple-system, Segoe UI, sans-serif;
                }
                .price-react-wrap .hero-band {
                    background: #1b4d22;
                    color: white;
                    padding: 40px 0 32px;
                }
                .price-react-wrap .inner {
                    max-width: 1180px;
                    margin: 0 auto;
                    padding: 0 24px;
                }
                .price-react-wrap .eyebrow {
                    color: #cca01d;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    font-size: 0.78rem;
                    font-weight: 800;
                }
                .price-react-wrap h1 {
                    font-size: clamp(2.5rem, 4vw, 3.2rem);
                    font-weight: 800;
                    margin: 8px 0 10px;
                    font-family: Georgia, "Times New Roman", serif;
                }
                .price-react-wrap .subtitle {
                    color: rgba(255,255,255,0.76);
                    margin: 0;
                    font-size: 1.05rem;
                }
                .price-react-wrap .content {
                    max-width: 1180px;
                    margin: 0 auto;
                    padding: 40px 24px 70px;
                }
                .price-react-wrap .table-shell {
                    background: white;
                    border-radius: 18px;
                    overflow: hidden;
                    box-shadow: 0 12px 30px rgba(0,0,0,0.04);
                    border: 1px solid rgba(27, 77, 34, 0.08);
                }
                .price-react-wrap table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .price-react-wrap th,
                .price-react-wrap td {
                    padding: 16px 18px;
                    text-align: left;
                    border-bottom: 1px solid #f0eadf;
                    vertical-align: middle;
                }
                .price-react-wrap thead th {
                    background: #dfeee3;
                    color: #1b4d22;
                    font-weight: 800;
                }
                .price-react-wrap tbody tr:hover {
                    background: #fbfaf6;
                }
                .price-react-wrap .rice-name {
                    font-weight: 800;
                    color: #1b4d22;
                    margin-bottom: 2px;
                }
                .price-react-wrap .rice-type {
                    color: #6f6845;
                    font-size: 0.8rem;
                }
                .price-react-wrap .price-value {
                    font-weight: 800;
                    color: #1b4d22;
                }
                .price-react-wrap .change-up {
                    color: #0f8a4a;
                    font-weight: 700;
                }
                .price-react-wrap .change-down {
                    color: #b42318;
                    font-weight: 700;
                }
                .price-react-wrap .empty {
                    padding: 28px;
                    text-align: center;
                    color: #6f6845;
                }
                @media (max-width: 768px) {
                    .price-react-wrap .content,
                    .price-react-wrap .inner {
                        padding-left: 14px;
                        padding-right: 14px;
                    }
                    .price-react-wrap th,
                    .price-react-wrap td {
                        padding: 12px 10px;
                    }
                    .price-react-wrap table {
                        font-size: 0.92rem;
                    }
                }
            `}</style>

            <div className="price-react-wrap">
                <section className="hero-band">
                    <div className="inner">
                        <div className="eyebrow">Live Data · Updated Today</div>
                        <h1>Market Prices</h1>
                        <p className="subtitle">Track daily Cambodian rice prices from provincial markets, farmers markets, and more...</p>
                    </div>
                </section>

                <section className="content">
                    <h2 style={{ margin: '0 0 12px', fontSize: '2rem', fontWeight: 800, fontFamily: 'Georgia, "Times New Roman", serif' }}>Latest Market Prices</h2>
                    <p style={{ margin: '0 0 22px', color: '#6f6845' }}>Updated daily from 25 provincial markets</p>

                    <div className="table-shell">
                        <table>
                            <thead>
                                <tr>
                                    <th>Rice Variety</th>
                                    <th>Province</th>
                                    <th>Market</th>
                                    <th>Price / kg</th>
                                    <th>Change</th>
                                    <th>Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prices.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="empty">No prices available yet.</td>
                                    </tr>
                                ) : (
                                    prices.map((price) => {
                                        const changeValue = Number(price.change_percent ?? 0);
                                        const changeClass = changeValue >= 0 ? 'change-up' : 'change-down';
                                        const sign = changeValue >= 0 ? '+' : '';

                                        return (
                                            <tr key={price.id ?? `${price.rice_variety}-${price.market}`}>
                                                <td>
                                                    <div className="rice-name">{price.rice_variety}</div>
                                                    <div className="rice-type">{price.rice_type}</div>
                                                </td>
                                                <td>{price.province}</td>
                                                <td>{price.market}</td>
                                                <td className="price-value">{formatCurrency(price.price_per_kg)}</td>
                                                <td className={changeClass}>{sign}{changeValue}%</td>
                                                <td>Today</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </>
    );
}
