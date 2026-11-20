import React from 'react';

export default function EditVarietyApp({ variety = {}, csrfToken = '' }) {
    return (
        <>
            <style>{`
                .edit-variety-react-wrap{
                    min-height:100vh;
                    background:linear-gradient(180deg,var(--gold-soft) 0%,#fff 25%);
                    color:var(--on-gold);
                    font-family:var(--font-body);
                    padding:42px 18px;
                }
                .edit-variety-react-wrap .shell{max-width:760px;margin:0 auto;}
                .edit-variety-react-wrap .card{background:var(--surface);border:1px solid rgba(var(--green-rgb), .09);border-radius:24px;padding:28px 28px 30px;box-shadow:0 18px 32px rgba(0,0,0,.05);}
                .edit-variety-react-wrap .eyebrow{display:inline-block;margin-bottom:12px;font-size:.76rem;font-weight:800;letter-spacing:.12em;color:#b7791f;text-transform:uppercase;}
                .edit-variety-react-wrap h1{margin:0 0 6px;font-size:clamp(2rem,5vw,2.7rem);color:var(--green-ink);font-family:var(--font-heading);}
                .edit-variety-react-wrap .note{margin:0 0 24px;color:var(--text-muted);}
                .edit-variety-react-wrap .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;}
                .edit-variety-react-wrap .full{grid-column:1 / -1;}
                .edit-variety-react-wrap label{display:block;margin-bottom:7px;color:var(--green-ink);font-size:.76rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;}
                .edit-variety-react-wrap input,.edit-variety-react-wrap select,.edit-variety-react-wrap textarea{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:12px 14px;color:var(--text);font:inherit;}
                .edit-variety-react-wrap textarea{min-height:120px;resize:vertical;}
                .edit-variety-react-wrap .actions{margin-top:22px;display:flex;gap:12px;flex-wrap:wrap;}
                .edit-variety-react-wrap .primary{background:var(--gold-light);color:var(--on-gold);border:none;border-radius:10px;padding:12px 18px;font-weight:800;cursor:pointer;}
                .edit-variety-react-wrap .secondary{display:inline-flex;align-items:center;justify-content:center;background:transparent;color:var(--text-muted);border:1px solid var(--border);border-radius:10px;padding:12px 18px;font-weight:700;text-decoration:none;}
                .edit-variety-react-wrap .sources{margin:0 0 4px;padding-left:18px;color:var(--text-muted);font-size:.9rem;display:grid;gap:4px;}
                .edit-variety-react-wrap .sources a{color:var(--green-ink);font-weight:700;}
                @media(max-width:680px){.edit-variety-react-wrap .grid{grid-template-columns:1fr;}}
            `}</style>

            <div className="edit-variety-react-wrap">
                <div className="shell">
                    <div className="card animate-fade-in-up">
                        <div className="eyebrow">Update record</div>
                        <h1>Edit Variety Portfolio</h1>
                        <p className="note">Modify properties for record collection: <strong>{variety.name || 'Variety'}</strong></p>

                        <form action={`/edit-variety/${variety.id}`} method="POST" encType="multipart/form-data">
                            <input type="hidden" name="_token" value={csrfToken} />
                            <input type="hidden" name="_method" value="PUT" />

                            <div className="grid">
                                <div className="full">
                                    <label>Variety Name</label>
                                    <input type="text" name="name" defaultValue={variety.name || ''} required />
                                </div>

                                <div className="full">
                                    <label>Khmer Writing</label>
                                    <input type="text" name="khmer_name" defaultValue={variety.khmer_name || ''} required />
                                </div>

                                <div className="full">
                                    <label>Classification Profile</label>
                                    <select name="type" defaultValue={variety.type || ''} required>
                                        <option value="Jasmine">Jasmine</option>
                                        <option value="Black Rice">Black Rice</option>
                                        <option value="Whole-grain">Whole-grain</option>
                                        <option value="Glutinous">Glutinous</option>
                                        <option value="Brown Rice">Brown Rice</option>
                                    </select>
                                </div>

                                <div className="full">
                                    <label>Cultivation Location</label>
                                    <input type="text" name="location" defaultValue={variety.location || ''} required />
                                </div>

                                <div className="full">
                                    <label>Description Details</label>
                                    <textarea name="description" defaultValue={variety.description || ''} />
                                </div>

                                <div>
                                    <label>Yield</label>
                                    <input type="text" name="yield" defaultValue={variety.yield || ''} required />
                                </div>
                                <div>
                                    <label>Cycle</label>
                                    <input type="text" name="cycle" defaultValue={variety.cycle || ''} required />
                                </div>
                                <div>
                                    <label>Season</label>
                                    <input type="text" name="season" defaultValue={variety.season || ''} required />
                                </div>
                                <div>
                                    <label>Harvest months (optional)</label>
                                    <input type="text" name="harvest" maxLength={50} defaultValue={variety.harvest || ''} placeholder="e.g. Nov - Jan" />
                                </div>
                                <div>
                                    <label>Market Demand</label>
                                    <select name="demand" defaultValue={variety.demand || ''} required>
                                        <option value="Very High">Very High</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>

                                <div className="full">
                                    <label>Media Cover Image (Leave blank to keep current)</label>
                                    <input type="file" name="image" accept="image/*" />
                                </div>

                                <div className="full">
                                    <label>Sources</label>
                                    {variety.sources && variety.sources.length ? (
                                        <ul className="sources">
                                            {variety.sources.map((source, i) => (
                                                <li key={source.url || source.title || i}>
                                                    {source.url ? <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a> : source.title}
                                                    {source.publisher || source.date ? <span> · {[source.publisher, source.date].filter(Boolean).join(' · ')}</span> : null}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="note" style={{ margin: '0 0 8px' }}>No sources yet. Add where these facts come from so readers can check them.</p>
                                    )}
                                </div>
                                <div>
                                    <label>Add a source (title)</label>
                                    <input type="text" name="source_title" maxLength={255} placeholder="e.g. CARDI variety release note" />
                                </div>
                                <div>
                                    <label>Source link</label>
                                    <input type="url" name="source_url" maxLength={1024} placeholder="https://" />
                                </div>
                            </div>

                            <div className="actions">
                                <button type="submit" className="primary">Save Dynamic Matrix</button>
                                <a href="/manage-varieties" className="secondary">Cancel</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
