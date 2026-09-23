import React, { useMemo, useState } from 'react';

export default function MarketPricesAdminApp({ prices = [], csrfToken = '' }) {
    const [selectedId, setSelectedId] = useState(null);

    const stats = useMemo(() => ({
        total: prices.length,
        positive: prices.filter((entry) => Number(entry.change_percent || 0) >= 0).length,
    }), [prices]);

    return (
        <>
            <style>{`
                .market-prices-admin-react-wrap{background:#f5f1e6;color:#1f2937;font-family:system-ui,-apple-system,Segoe UI,sans-serif;}
                .market-prices-admin-react-wrap .hero-band{background:#1b4d22;color:#fff;padding:38px 0 26px;}
                .market-prices-admin-react-wrap .inner{max-width:1200px;margin:0 auto;padding:0 24px;}
                .market-prices-admin-react-wrap .eyebrow{font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;font-weight:800;color:#f4c84f;}
                .market-prices-admin-react-wrap h1{margin:10px 0 8px;font-size:clamp(2.2rem,4vw,3rem);font-family:Georgia,"Times New Roman",serif;}
                .market-prices-admin-react-wrap .subtitle{margin:0;color:rgba(255,255,255,.76);}
                .market-prices-admin-react-wrap .content{max-width:1200px;margin:0 auto;padding:28px 24px 72px;}
                .market-prices-admin-react-wrap .stats-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-bottom:18px;}
                .market-prices-admin-react-wrap .stat-box{background:#fff;border:1px solid rgba(27,77,34,.08);border-radius:16px;padding:18px 20px;box-shadow:0 12px 24px rgba(0,0,0,.04);}
                .market-prices-admin-react-wrap .stat-box strong{display:block;color:#1b4d22;font-size:1.9rem;font-family:Georgia,"Times New Roman",serif;}
                .market-prices-admin-react-wrap .stat-box span{color:#6f6845;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;font-weight:800;}
                .market-prices-admin-react-wrap .panel{background:#fff;border:1px solid rgba(27,77,34,.08);border-radius:18px;overflow:hidden;box-shadow:0 16px 32px rgba(0,0,0,.04);}
                .market-prices-admin-react-wrap .toolbar{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:22px 22px 16px;}
                .market-prices-admin-react-wrap .toolbar h2{margin:0;color:#1b4d22;font-size:1.6rem;font-family:Georgia,"Times New Roman",serif;}
                .market-prices-admin-react-wrap .toolbar a{display:inline-block;background:#1b4d22;color:#fff;text-decoration:none;border-radius:10px;padding:10px 14px;font-weight:700;}
                .market-prices-admin-react-wrap table{width:100%;border-collapse:collapse;}
                .market-prices-admin-react-wrap th, .market-prices-admin-react-wrap td{padding:14px 16px;border-bottom:1px solid #efe7d6;text-align:left;}
                .market-prices-admin-react-wrap th{background:#edf5ea;color:#1b4d22;font-size:.76rem;letter-spacing:.08em;text-transform:uppercase;}
                .market-prices-admin-react-wrap tbody tr:hover{background:#faf7f1;}
                .market-prices-admin-react-wrap .price{font-weight:800;color:#1b4d22;}
                .market-prices-admin-react-wrap .positive{color:#0f9f63;font-weight:800;}
                .market-prices-admin-react-wrap .negative{color:#c93d3d;font-weight:800;}
                .market-prices-admin-react-wrap .actions{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;}
                .market-prices-admin-react-wrap .btn-light{display:inline-block;background:#f7e8ad;color:#1b4d22;border-radius:8px;padding:8px 12px;text-decoration:none;font-weight:700;}
                .market-prices-admin-react-wrap .btn-danger{display:inline-block;background:#fff;color:#b42318;border:1px solid #f7c8c1;border-radius:8px;padding:8px 12px;font-weight:700;cursor:pointer;}
                .market-prices-admin-react-wrap .empty{padding:42px 18px;text-align:center;color:#6f6845;}
                .market-prices-admin-react-wrap .modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.45);display:flex;align-items:center;justify-content:center;padding:20px;z-index:20;}
                .market-prices-admin-react-wrap .modal-card{width:min(420px,100%);background:#fff;border-radius:18px;padding:24px;box-shadow:0 22px 48px rgba(0,0,0,.18);}
                .market-prices-admin-react-wrap .modal-card h3{margin:0 0 10px;color:#1b4d22;font-size:1.7rem;}
                .market-prices-admin-react-wrap .modal-card p{margin:0;color:#4b5563;line-height:1.7;}
                .market-prices-admin-react-wrap .modal-actions{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:18px;}
                @media(max-width:760px){.market-prices-admin-react-wrap .stats-grid{grid-template-columns:1fr;}.market-prices-admin-react-wrap .toolbar{flex-direction:column;align-items:flex-start;}.market-prices-admin-react-wrap table,.market-prices-admin-react-wrap thead,.market-prices-admin-react-wrap tbody,.market-prices-admin-react-wrap th,.market-prices-admin-react-wrap td,.market-prices-admin-react-wrap tr{display:block;}.market-prices-admin-react-wrap th{display:none;}.market-prices-admin-react-wrap td{border:none;padding:10px 16px;}.market-prices-admin-react-wrap td::before{content:attr(data-label);display:block;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:#1b4d22;font-weight:800;margin-bottom:4px;}}
            `}</style>

            <div className="market-prices-admin-react-wrap">
                <section className="hero-band">
                    <div className="inner">
                        <div className="eyebrow">Administration panel</div>
                        <h1>Manage Market Prices</h1>
                        <p className="subtitle">Create, update, or remove live market records</p>
                    </div>
                </section>

                <section className="content">
                    <div className="stats-grid">
                        <div className="stat-box">
                            <strong>{stats.total}</strong>
                            <span>Total records</span>
                        </div>
                        <div className="stat-box">
                            <strong>{stats.positive}</strong>
                            <span>Positive trend</span>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="toolbar">
                            <h2>Live pricing list</h2>
                            <a href="/admin/market-prices/create">+ Add New Price</a>
                        </div>

                        {prices.length === 0 ? (
                            <div className="empty">No market prices found. Click “+ Add New Price” to add one.</div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Rice Variety</th>
                                        <th>Type</th>
                                        <th>Province</th>
                                        <th>Market</th>
                                        <th>Price/kg</th>
                                        <th>Change</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prices.map((price) => (
                                        <tr key={price.id}>
                                            <td data-label="Rice Variety"><strong>{price.rice_variety}</strong></td>
                                            <td data-label="Type"><span>{price.rice_type}</span></td>
                                            <td data-label="Province">{price.province}</td>
                                            <td data-label="Market">{price.market}</td>
                                            <td data-label="Price/kg" className="price">${Number(price.price_per_kg || 0).toFixed(2)}</td>
                                            <td data-label="Change">
                                                {Number(price.change_percent || 0) >= 0 ? (
                                                    <span className="positive">+{Number(price.change_percent || 0)}%</span>
                                                ) : (
                                                    <span className="negative">{Number(price.change_percent || 0)}%</span>
                                                )}
                                            </td>
                                            <td data-label="Actions" style={{ textAlign: 'right' }}>
                                                <div className="actions">
                                                    <a className="btn-light" href={`/admin/market-prices/${price.id}/edit`}>Edit</a>
                                                    <button type="button" className="btn-danger" onClick={() => setSelectedId(price.id)}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            </div>

            {selectedId ? (
                <div className="modal-backdrop" onClick={() => setSelectedId(null)}>
                    <div className="modal-card" onClick={(event) => event.stopPropagation()}>
                        <h3>Delete Price</h3>
                        <p>Delete this market price? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button type="button" className="btn-light" onClick={() => setSelectedId(null)}>Cancel</button>
                            <form action={`/admin/market-prices/${selectedId}`} method="POST" style={{ display: 'inline-block' }}>
                                <input type="hidden" name="_token" value={csrfToken} />
                                <input type="hidden" name="_method" value="DELETE" />
                                <button type="submit" className="btn-danger">Yes, Delete</button>
                            </form>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
