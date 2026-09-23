import React from 'react';

export default function EditVarietyApp({ variety = {}, csrfToken = '' }) {
    return (
        <>
            <style>{`
                .edit-variety-react-wrap{
                    min-height:100vh;
                    background:linear-gradient(180deg,#f9f1dc 0%,#fff 25%);
                    color:#1f2937;
                    font-family:system-ui,-apple-system,Segoe UI,sans-serif;
                    padding:42px 18px;
                }
                .edit-variety-react-wrap .shell{max-width:760px;margin:0 auto;}
                .edit-variety-react-wrap .card{background:#fff;border:1px solid rgba(27,77,34,.09);border-radius:24px;padding:28px 28px 30px;box-shadow:0 18px 32px rgba(0,0,0,.05);}
                .edit-variety-react-wrap .eyebrow{display:inline-block;margin-bottom:12px;font-size:.76rem;font-weight:800;letter-spacing:.12em;color:#b7791f;text-transform:uppercase;}
                .edit-variety-react-wrap h1{margin:0 0 6px;font-size:clamp(2rem,5vw,2.7rem);color:#1b4d22;font-family:Georgia,"Times New Roman",serif;}
                .edit-variety-react-wrap .note{margin:0 0 24px;color:#6f6845;}
                .edit-variety-react-wrap .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;}
                .edit-variety-react-wrap .full{grid-column:1 / -1;}
                .edit-variety-react-wrap label{display:block;margin-bottom:7px;color:#1b4d22;font-size:.76rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;}
                .edit-variety-react-wrap input,.edit-variety-react-wrap select,.edit-variety-react-wrap textarea{width:100%;background:#faf5eb;border:1px solid #e0d2b2;border-radius:12px;padding:12px 14px;color:#17202a;font:inherit;}
                .edit-variety-react-wrap textarea{min-height:120px;resize:vertical;}
                .edit-variety-react-wrap .actions{margin-top:22px;display:flex;gap:12px;flex-wrap:wrap;}
                .edit-variety-react-wrap .primary{background:#f4c84f;color:#1b4d22;border:none;border-radius:10px;padding:12px 18px;font-weight:800;cursor:pointer;}
                .edit-variety-react-wrap .secondary{display:inline-flex;align-items:center;justify-content:center;background:transparent;color:#4b5563;border:1px solid #d4d7dd;border-radius:10px;padding:12px 18px;font-weight:700;text-decoration:none;}
                @media(max-width:680px){.edit-variety-react-wrap .grid{grid-template-columns:1fr;}}
            `}</style>

            <div className="edit-variety-react-wrap">
                <div className="shell">
                    <div className="card">
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
