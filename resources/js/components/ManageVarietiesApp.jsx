import React, { useMemo, useState } from 'react';

export default function ManageVarietiesApp({ varieties = [], csrfToken = '' }) {
    const [selectedId, setSelectedId] = useState(null);

    const stats = useMemo(() => ({
        total: varieties.length,
        highDemand: varieties.filter((item) => ['Very High', 'High'].includes(item.demand)).length,
    }), [varieties]);

    return (
        <>
            <style>{`
                .manage-varieties-react-wrap{
                    background:#faf6ee;color:#202020;font-family:system-ui,-apple-system,Segoe UI,sans-serif;
                }
                .manage-varieties-react-wrap .hero-band{background:#1b4d22;color:white;padding:38px 0 30px;}
                .manage-varieties-react-wrap .inner{max-width:1180px;margin:0 auto;padding:0 24px;}
                .manage-varieties-react-wrap .eyebrow{color:#f4c84f;font-size:.78rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;}
                .manage-varieties-react-wrap h1{margin:10px 0 8px;font-size:clamp(2.3rem,4vw,3.2rem);font-weight:800;font-family:Georgia,"Times New Roman",serif;}
                .manage-varieties-react-wrap .subtitle{margin:0;color:rgba(255,255,255,.75);font-size:1.08rem;}
                .manage-varieties-react-wrap .content{max-width:1180px;margin:0 auto;padding:36px 24px 72px;}
                .manage-varieties-react-wrap .stats-bar{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-bottom:18px;}
                .manage-varieties-react-wrap .stat-box{background:#fff;border:1px solid rgba(27,77,34,.08);border-radius:16px;padding:16px 18px;box-shadow:0 10px 24px rgba(0,0,0,.04);}
                .manage-varieties-react-wrap .stat-box strong{display:block;color:#1b4d22;font-size:1.8rem;font-family:Georgia,"Times New Roman",serif;}
                .manage-varieties-react-wrap .stat-box span{color:#6f6845;font-size:.8rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;}
                .manage-varieties-react-wrap .grid{display:grid;grid-template-columns:420px minmax(0,1fr);gap:24px;align-items:start;}
                .manage-varieties-react-wrap .panel{background:white;border:1px solid rgba(27,77,34,.08);border-radius:18px;padding:24px;box-shadow:0 12px 28px rgba(0,0,0,.04);}
                .manage-varieties-react-wrap .panel h2{margin:0 0 18px;font-size:2rem;font-family:Georgia,"Times New Roman",serif;}
                .manage-varieties-react-wrap .form-grid{display:grid;gap:14px;}
                .manage-varieties-react-wrap .label{display:block;margin-bottom:8px;color:#1b4d22;font-size:.8rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;}
                .manage-varieties-react-wrap .field,.manage-varieties-react-wrap select,.manage-varieties-react-wrap textarea{width:100%;background:#f7f1e3;border:1px solid #e7dcc4;border-radius:10px;padding:12px 14px;color:#202020;font:inherit;}
                .manage-varieties-react-wrap textarea{min-height:100px;resize:vertical;}
                .manage-varieties-react-wrap .row-2{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;}
                .manage-varieties-react-wrap .btn-primary{display:inline-block;background:#f4c84f;color:#1b4d22;border:none;border-radius:10px;padding:12px 18px;font-weight:800;cursor:pointer;}
                .manage-varieties-react-wrap .post-list{display:flex;flex-direction:column;gap:16px;}
                .manage-varieties-react-wrap .card{background:white;border:1px solid rgba(27,77,34,.08);border-radius:18px;padding:16px;box-shadow:0 10px 24px rgba(0,0,0,.04);}
                .manage-varieties-react-wrap .card-row{display:grid;grid-template-columns:180px minmax(0,1fr);gap:16px;align-items:center;}
                .manage-varieties-react-wrap .card-image{width:100%;height:125px;object-fit:cover;border-radius:12px;display:block;}
                .manage-varieties-react-wrap .topline{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;}
                .manage-varieties-react-wrap .topline h4{margin:0 0 6px;color:#1b4d22;font-size:1.2rem;}
                .manage-varieties-react-wrap .badge{display:inline-flex;align-items:center;background:#e3f3e6;color:#107c41;border-radius:999px;padding:5px 10px;font-size:.72rem;font-weight:800;}
                .manage-varieties-react-wrap .meta{color:#6f6845;margin:0 0 10px;font-size:.82rem;}
                .manage-varieties-react-wrap .facts{display:flex;gap:14px;flex-wrap:wrap;color:#6f6845;font-size:.8rem;}
                .manage-varieties-react-wrap .actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;}
                .manage-varieties-react-wrap .btn-light{display:inline-block;background:#f7e8ad;color:#1b4d22;border-radius:8px;padding:8px 12px;font-weight:700;text-decoration:none;}
                .manage-varieties-react-wrap .btn-danger{display:inline-block;background:#fff;color:#b42318;border:1px solid #f7c8c1;border-radius:8px;padding:8px 12px;font-weight:700;cursor:pointer;}
                .manage-varieties-react-wrap .empty{padding:42px 18px;text-align:center;background:white;border:1px dashed rgba(27,77,34,.2);border-radius:18px;color:#6f6845;}
                .manage-varieties-react-wrap .modal-backdrop{position:fixed;inset:0;background:rgba(17,24,39,.45);display:flex;align-items:center;justify-content:center;padding:20px;z-index:20;}
                .manage-varieties-react-wrap .modal-card{background:white;border-radius:18px;padding:24px;width:min(420px,100%);box-shadow:0 22px 48px rgba(0,0,0,.18);}
                .manage-varieties-react-wrap .modal-card h3{margin:0 0 10px;color:#1b4d22;font-size:1.7rem;}
                .manage-varieties-react-wrap .modal-card p{margin:0;color:#4d4d4d;line-height:1.7;}
                .manage-varieties-react-wrap .modal-actions{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:18px;}
                @media(max-width:960px){.manage-varieties-react-wrap .grid{grid-template-columns:1fr;}.manage-varieties-react-wrap .card-row{grid-template-columns:1fr;}}
            `}</style>

            <div className="manage-varieties-react-wrap">
                <section className="hero-band">
                    <div className="inner">
                        <div className="eyebrow">Secure Administration Portal</div>
                        <h1>Manage Varieties</h1>
                        <p className="subtitle">Create entries and control existing structural cards in real time.</p>
                    </div>
                </section>

                <section className="content">
                    <div className="stats-bar">
                        <div className="stat-box">
                            <strong>{stats.total}</strong>
                            <span>Registered</span>
                        </div>
                        <div className="stat-box">
                            <strong>{stats.highDemand}</strong>
                            <span>High Demand</span>
                        </div>
                    </div>

                    <div className="grid">
                        <div className="panel">
                            <div className="eyebrow" style={{ color: '#1b4d22', letterSpacing: '.08em' }}>Database Create</div>
                            <h2>New Rice Variety</h2>

                            <form action="/create-variety" method="POST" encType="multipart/form-data" className="form-grid">
                                <input type="hidden" name="_token" value={csrfToken} />

                                <div>
                                    <label className="label">Variety Standard Name</label>
                                    <input className="field" type="text" name="name" required />
                                </div>
                                <div>
                                    <label className="label">Khmer Name</label>
                                    <input className="field" type="text" name="khmer_name" required />
                                </div>
                                <div>
                                    <label className="label">Classification Category</label>
                                    <select name="type" required defaultValue="">
                                        <option value="" disabled>Select rice type</option>
                                        <option value="Jasmine">Jasmine</option>
                                        <option value="Black Rice">Black Rice</option>
                                        <option value="Whole-grain">Whole-grain</option>
                                        <option value="Glutinous">Glutinous</option>
                                        <option value="Brown Rice">Brown Rice</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Grow Regions / Provinces</label>
                                    <input className="field" type="text" name="location" required />
                                </div>
                                <div>
                                    <label className="label">Aromatic/Structural Description</label>
                                    <textarea name="description" />
                                </div>

                                <div className="row-2">
                                    <div>
                                        <label className="label">Avg Yield</label>
                                        <input className="field" type="text" name="yield" required />
                                    </div>
                                    <div>
                                        <label className="label">Life Cycle</label>
                                        <input className="field" type="text" name="cycle" required />
                                    </div>
                                    <div>
                                        <label className="label">Season</label>
                                        <input className="field" type="text" name="season" required />
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Market Export Demand</label>
                                    <select name="demand" required defaultValue="">
                                        <option value="" disabled>Select demand rank</option>
                                        <option value="Very High">Very High</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="label">Display Cover Media</label>
                                    <input className="field" type="file" name="image" accept="image/*" required />
                                </div>

                                <button type="submit" className="btn-primary">Post!</button>
                            </form>
                        </div>

                        <div>
                            <div style={{ marginBottom: '16px' }}>
                                <h2 style={{ margin: '0 0 6px', fontSize: '2rem', fontWeight: 800, fontFamily: 'Georgia, "Times New Roman", serif' }}>Your Registered Entries</h2>
                                <p style={{ margin: 0, color: '#6f6845' }}>Review and modify cards you have uploaded to the system registry.</p>
                            </div>

                            <div className="post-list">
                                {varieties.length === 0 ? (
                                    <div className="empty">
                                        <h3 style={{ margin: '0 0 8px', color: '#1b4d22' }}>Workspace Portfolio Empty</h3>
                                        <p style={{ margin: 0 }}>Use the creation panel to add your first variety entry.</p>
                                    </div>
                                ) : (
                                    varieties.map((item) => (
                                        <article key={item.id} className="card">
                                            <div className="card-row">
                                                <img className="card-image" src={item.image ? `/storage/${item.image}` : '/images/extra/ricefields.png'} alt={item.name} />
                                                <div>
                                                    <div className="topline">
                                                        <div>
                                                            <span className="badge">{item.type}</span>
                                                            <h4>{item.name}</h4>
                                                            <p className="meta">{item.khmer_name} • {item.location}</p>
                                                        </div>
                                                        <div className="actions" style={{ marginTop: 0 }}>
                                                            <a href={`/edit-variety/${item.id}`} className="btn-light">Edit</a>
                                                            <button type="button" className="btn-danger" onClick={() => setSelectedId(item.id)}>Delete</button>
                                                        </div>
                                                    </div>

                                                    <div className="facts">
                                                        <span>🌾 {item.yield}</span>
                                                        <span>⏱️ {item.cycle}</span>
                                                        <span>☀️ {item.season}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {selectedId ? (
                <div className="modal-backdrop" onClick={() => setSelectedId(null)}>
                    <div className="modal-card" onClick={(event) => event.stopPropagation()}>
                        <h3>Delete Variety</h3>
                        <p>Delete this rice variety? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button type="button" className="btn-light" onClick={() => setSelectedId(null)}>Cancel</button>
                            <form action={`/delete-variety/${selectedId}`} method="POST" style={{ display: 'inline-block' }}>
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
