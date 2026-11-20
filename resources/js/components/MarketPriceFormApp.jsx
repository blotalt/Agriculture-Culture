import React from 'react';

export default function MarketPriceFormApp({ mode = 'create', price = null, csrfToken = '' }) {
    const currentPrice = price || {
        id: '',
        rice_variety: '',
        rice_type: '',
        province: '',
        market: '',
        price_per_kg: '',
        recorded_on: '',
    };
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time

    const isEdit = mode === 'edit';
    const action = isEdit ? `/admin/market-prices/${currentPrice.id}` : '/admin/market-prices';

    return (
        <>
            <style>{`
                .market-price-form-react-wrap {
                    background: var(--bg);
                    color: var(--text);
                    font-family: var(--font-body);
                    min-height: 100vh;
                }
                .market-price-form-react-shell {
                    max-width: 980px;
                    margin: 0 auto;
                    padding: 42px 24px 80px;
                }
                .market-price-form-react-back {
                    display: inline-block;
                    color: var(--text-muted);
                    text-decoration: none;
                    font-size: 0.9rem;
                    margin-bottom: 18px;
                }
                .market-price-form-react-card {
                    background: var(--surface);
                    border: 1px solid rgba(var(--green-rgb), 0.08);
                    border-radius: 20px;
                    box-shadow: 0 16px 36px rgba(0,0,0,0.05);
                    padding: 28px;
                }
                .market-price-form-react-card h1 {
                    margin: 0 0 8px;
                    color: var(--green-ink);
                    font-size: clamp(2rem, 4vw, 2.8rem);
                    font-family: var(--font-heading);
                }
                .market-price-form-react-card p {
                    margin: 0 0 26px;
                    color: var(--text-muted);
                    line-height: 1.6;
                }
                .market-price-form-react-form {
                    display: grid;
                    gap: 18px;
                }
                .market-price-form-react-row {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 16px;
                }
                .market-price-form-react-field {
                    display: block;
                    width: 100%;
                    background: var(--blue-soft);
                    border: 1px solid var(--border);
                    border-radius: 10px;
                    padding: 12px 14px;
                    color: var(--text);
                    font: inherit;
                }
                .market-price-form-react-label {
                    display: block;
                    margin-bottom: 8px;
                    color: var(--green-ink);
                    font-size: 0.82rem;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    font-weight: 800;
                }
                .market-price-form-react-actions {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex-wrap: wrap;
                    padding-top: 18px;
                    border-top: 1px solid var(--blue-soft);
                }
                .market-price-form-react-button {
                    border: none;
                    border-radius: 10px;
                    padding: 12px 22px;
                    font-weight: 800;
                    cursor: pointer;
                    display: inline-block;
                    text-decoration: none;
                }
                .market-price-form-react-button.primary {
                    background: var(--green);
                    color: white;
                }
                .market-price-form-react-button.secondary {
                    background: var(--green-soft);
                    color: var(--green-ink);
                    border: 1px solid rgba(var(--green-rgb), 0.1);
                }
                .market-price-form-react-input-wrap {
                    position: relative;
                }
                .market-price-form-react-input-wrap .prefix {
                    position: absolute;
                    inset: 0 auto 0 12px;
                    display: flex;
                    align-items: center;
                    color: var(--text-muted);
                    font-weight: 700;
                }
                .market-price-form-react-input-wrap input {
                    padding-left: 38px;
                }
                @media (max-width: 720px) {
                    .market-price-form-react-row {
                        grid-template-columns: 1fr;
                    }
                    .market-price-form-react-card {
                        padding: 22px 18px;
                    }
                }
            `}</style>

            <div className="market-price-form-react-wrap">
                <div className="market-price-form-react-shell">
                    <a href="/admin/market-prices" className="market-price-form-react-back">← Back to Price Management</a>

                    <div className="market-price-form-react-card animate-fade-in-up">
                        <h1>{isEdit ? 'Edit Market Price' : 'Add New Market Price'}</h1>
                        <p>{isEdit ? 'Update the pricing and location details for this record.' : 'Enter the details to add a new rice variety record to the live market map.'}</p>

                        <form action={action} method="POST" className="market-price-form-react-form">
                            <input type="hidden" name="_token" value={csrfToken} />
                            {isEdit ? <input type="hidden" name="_method" value="PUT" /> : null}

                            <div className="market-price-form-react-row">
                                <div>
                                    <label className="market-price-form-react-label" htmlFor="rice_variety">Rice Variety</label>
                                    <input id="rice_variety" className="market-price-form-react-field" type="text" name="rice_variety" defaultValue={currentPrice.rice_variety} placeholder="e.g., Phka Rumduol" required />
                                </div>

                                <div>
                                    <label className="market-price-form-react-label" htmlFor="rice_type">Rice Type</label>
                                    <input id="rice_type" className="market-price-form-react-field" type="text" name="rice_type" defaultValue={currentPrice.rice_type} placeholder="e.g., Jasmine Rice" required />
                                </div>
                            </div>

                            <div className="market-price-form-react-row">
                                <div>
                                    <label className="market-price-form-react-label" htmlFor="province">Province</label>
                                    <input id="province" className="market-price-form-react-field" type="text" name="province" defaultValue={currentPrice.province} placeholder="e.g., Takeo" required />
                                </div>

                                <div>
                                    <label className="market-price-form-react-label" htmlFor="market">Market Name</label>
                                    <input id="market" className="market-price-form-react-field" type="text" name="market" defaultValue={currentPrice.market} placeholder="e.g., Central Market" required />
                                </div>
                            </div>

                            <div className="market-price-form-react-row">
                                <div>
                                    <label className="market-price-form-react-label" htmlFor="price_per_kg">Price per kg ($)</label>
                                    <div className="market-price-form-react-input-wrap">
                                        <span className="prefix">$</span>
                                        <input id="price_per_kg" className="market-price-form-react-field" type="number" step="0.01" name="price_per_kg" defaultValue={currentPrice.price_per_kg} placeholder="0.00" required />
                                    </div>
                                </div>

                                <div>
                                    <label className="market-price-form-react-label" htmlFor="recorded_on">Price Date</label>
                                    <input id="recorded_on" className="market-price-form-react-field" type="date" name="recorded_on" defaultValue={currentPrice.recorded_on || today} max={today} />
                                    <small style={{ display: 'block', marginTop: 6, color: 'var(--text-muted)' }}>
                                        The change % is calculated automatically from this market&apos;s previous price.
                                    </small>
                                </div>
                            </div>

                            <div className="market-price-form-react-actions">
                                <button type="submit" className="market-price-form-react-button primary">
                                    {isEdit ? 'Save Changes' : 'Save Record'}
                                </button>
                                <a href="/admin/market-prices" className="market-price-form-react-button secondary">
                                    Cancel
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
