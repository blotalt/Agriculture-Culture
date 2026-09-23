import React from 'react';

const overviewCards = [
    { label: 'Live prices', value: '24', detail: 'Updated today' },
    { label: 'Rice varieties', value: '18', detail: 'Across regions' },
    { label: 'Market trends', value: '7%', detail: 'Positive this week' },
    { label: 'Local reports', value: '12', detail: 'Fresh insights' },
];

const quickLinks = [
    { title: 'Market overview', href: '/pricemarket', description: 'Compare rice prices by market and date.' },
    { title: 'Variety explorer', href: '/variety', description: 'Browse rice types and high-demand selections.' },
    { title: 'Latest news', href: '/news', description: 'Follow producer updates and regional stories.' },
    { title: 'Dashboard', href: '/dashboard', description: 'Manage posts, trends, and content.' },
];

export default function WelcomeApp() {
    return (
        <>
            <style>{`
                .welcome-react-wrap {
                    min-height: 100vh;
                    padding: 40px 18px 68px;
                    background:
                        radial-gradient(circle at top left, rgba(30, 93, 46, 0.10), transparent 30%),
                        linear-gradient(135deg, #f3f6eb 0%, #fffaf0 100%);
                    color: #1f2937;
                    font-family: system-ui, -apple-system, Segoe UI, sans-serif;
                }
                .welcome-react-shell {
                    max-width: 1180px;
                    margin: 0 auto;
                }
                .welcome-react-hero {
                    background: linear-gradient(135deg, #1b4d22 0%, #2a6d34 100%);
                    color: white;
                    border-radius: 28px;
                    padding: 36px 32px;
                    box-shadow: 0 22px 40px rgba(27, 77, 34, 0.15);
                }
                .welcome-react-hero-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 18px;
                    flex-wrap: wrap;
                }
                .welcome-react-kicker {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    border-radius: 999px;
                    background: rgba(255,255,255,0.12);
                    border: 1px solid rgba(255,255,255,0.18);
                    padding: 7px 12px;
                    font-size: 0.78rem;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    font-weight: 700;
                }
                .welcome-react-hero h1 {
                    margin: 16px 0 12px;
                    font-size: clamp(2.3rem, 5vw, 4rem);
                    line-height: 1.08;
                    font-family: Georgia, "Times New Roman", serif;
                }
                .welcome-react-hero p {
                    margin: 0;
                    max-width: 680px;
                    color: rgba(255,255,255,0.82);
                    font-size: 1.06rem;
                    line-height: 1.7;
                }
                .welcome-react-actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    margin-top: 24px;
                }
                .welcome-react-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 48px;
                    padding: 0 20px;
                    border-radius: 999px;
                    text-decoration: none;
                    font-weight: 700;
                    transition: transform 0.2s ease;
                }
                .welcome-react-btn:hover { transform: translateY(-1px); }
                .welcome-react-btn.primary {
                    background: #f4c84f;
                    color: #1b4d22;
                }
                .welcome-react-btn.secondary {
                    background: rgba(255,255,255,0.12);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.18);
                }
                .welcome-react-grid {
                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    gap: 18px;
                    margin-top: 28px;
                }
                .welcome-react-stat {
                    background: rgba(255,255,255,0.92);
                    border: 1px solid rgba(27,77,34,0.08);
                    border-radius: 20px;
                    padding: 22px 18px;
                    box-shadow: 0 10px 24px rgba(0,0,0,0.04);
                }
                .welcome-react-stat span {
                    display: block;
                    color: #6b7280;
                    font-size: 0.78rem;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                }
                .welcome-react-stat strong {
                    display: block;
                    margin-top: 12px;
                    color: #1b4d22;
                    font-size: clamp(1.8rem, 2vw, 2.4rem);
                    line-height: 1;
                }
                .welcome-react-stat small {
                    display: block;
                    margin-top: 8px;
                    color: #4b5563;
                }
                .welcome-react-content {
                    display: grid;
                    grid-template-columns: 1.4fr 0.9fr;
                    gap: 22px;
                    margin-top: 28px;
                }
                .welcome-react-panel {
                    background: rgba(255,255,255,0.8);
                    border: 1px solid rgba(27,77,34,0.08);
                    border-radius: 24px;
                    padding: 24px;
                    box-shadow: 0 14px 26px rgba(0,0,0,0.04);
                }
                .welcome-react-panel h2 {
                    margin: 0 0 20px;
                    font-size: clamp(1.5rem, 2vw, 2rem);
                    color: #1b4d22;
                    font-family: Georgia, "Times New Roman", serif;
                }
                .welcome-react-link-list {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 16px;
                }
                .welcome-react-link-card {
                    background: linear-gradient(180deg, #f9f6ef 0%, #f1f7ee 100%);
                    border: 1px solid rgba(27,77,34,0.06);
                    border-radius: 18px;
                    padding: 18px;
                    text-decoration: none;
                    color: inherit;
                    display: block;
                }
                .welcome-react-link-card h3 {
                    margin: 0 0 8px;
                    color: #1b4d22;
                    font-size: 1.1rem;
                }
                .welcome-react-link-card p {
                    margin: 0;
                    color: #4b5563;
                    line-height: 1.6;
                }
                .welcome-react-aside {
                    background: linear-gradient(180deg, #fff7d8 0%, #fffaf0 100%);
                    border: 1px solid rgba(204,160,29,0.25);
                    border-radius: 24px;
                    padding: 24px;
                }
                .welcome-react-aside h3 {
                    margin: 0 0 12px;
                    color: #1b4d22;
                    font-size: 1.3rem;
                    font-family: Georgia, "Times New Roman", serif;
                }
                .welcome-react-bullet {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 10px 0;
                    border-bottom: 1px solid rgba(27,77,34,0.08);
                    color: #374151;
                }
                .welcome-react-bullet:last-child { border-bottom: none; }
                .welcome-react-dot {
                    width: 12px;
                    height: 12px;
                    min-width: 12px;
                    border-radius: 50%;
                    background: #f4c84f;
                    margin-top: 6px;
                }
                @media (max-width: 900px) {
                    .welcome-react-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    .welcome-react-content { grid-template-columns: 1fr; }
                }
                @media (max-width: 600px) {
                    .welcome-react-grid { grid-template-columns: 1fr; }
                    .welcome-react-link-list { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="welcome-react-wrap">
                <div className="welcome-react-shell">
                    <header className="welcome-react-hero">
                        <div className="welcome-react-hero-top">
                            <div className="welcome-react-kicker">KhmerRice</div>
                            <a href="/login" className="welcome-react-btn secondary">Member login</a>
                        </div>

                        <h1>Fresh insights for rice markets and growers.</h1>
                        <p>
                            Follow live pricing, compare varieties, read trusted updates, and manage your content from a cleaner, more modern platform built around the market decisions that matter most.
                        </p>

                        <div className="welcome-react-actions">
                            <a href="/pricemarket" className="welcome-react-btn primary">View market prices</a>
                            <a href="/variety" className="welcome-react-btn secondary">Explore varieties</a>
                        </div>

                        <div className="welcome-react-grid">
                            {overviewCards.map((card) => (
                                <div key={card.label} className="welcome-react-stat">
                                    <span>{card.label}</span>
                                    <strong>{card.value}</strong>
                                    <small>{card.detail}</small>
                                </div>
                            ))}
                        </div>
                    </header>

                    <section className="welcome-react-content">
                        <div className="welcome-react-panel">
                            <h2>Quick access</h2>
                            <div className="welcome-react-link-list">
                                {quickLinks.map((link) => (
                                    <a key={link.title} href={link.href} className="welcome-react-link-card">
                                        <h3>{link.title}</h3>
                                        <p>{link.description}</p>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <aside className="welcome-react-aside">
                            <h3>Why growers use it</h3>
                            <div className="welcome-react-bullet">
                                <span className="welcome-react-dot" />
                                <span>See the latest trading movement across rice markets in one place.</span>
                            </div>
                            <div className="welcome-react-bullet">
                                <span className="welcome-react-dot" />
                                <span>Compare rice varieties and demand signals before buying or selling.</span>
                            </div>
                            <div className="welcome-react-bullet">
                                <span className="welcome-react-dot" />
                                <span>Keep up with regional coverage and grower-focused updates in real time.</span>
                            </div>
                        </aside>
                    </section>
                </div>
            </div>
        </>
    );
}
