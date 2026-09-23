import React from 'react';

const stats = [
    { label: 'Rice Varieties', value: '25+' },
    { label: 'Export Countries', value: '60+' },
    { label: 'Farming Provinces', value: '25' },
];

const slides = [
    {
        image: '/images/extra/ricefields.png',
        badge: 'Live Market Data',
        title: 'From Field to Market',
        description:
            'Connecting Cambodia’s rice producers and buyers through accurate, real-time market pricing and regional insights. With transparent pricing for Cambodia\'s premier rice varieties.',
        primary: '/pricemarket',
        primaryLabel: 'View Market Prices',
        secondary: '/variety',
        secondaryLabel: 'Explore Varieties',
    },
    {
        image: '/images/extra/cambodia rice farmer.jpg',
        badge: 'Cambodian Rice',
        title: 'Supporting Local Farmers',
        description:
            'Connecting farmers, traders, and buyers through accurate rice market data and pricing insights.',
        primary: '/pricemarket',
        primaryLabel: 'View Market Prices',
        secondary: '/about',
        secondaryLabel: 'Learn More',
    },
    {
        image: '/images/extra/ricelandscape.jpg',
        badge: 'Daily Price Updates',
        title: 'Track Rice Prices',
        description:
            'Explore rice price trends from Cambodia’s provincial markets, including variations across regions, seasons, and local trading conditions.',
        primary: '/pricemarket',
        primaryLabel: 'Explore Prices',
        secondary: '/variety',
        secondaryLabel: 'Rice Varieties',
    },
];

export default function App() {
    return (
        <>
            <style>{`
                .khmer-react-wrap {
                    background: #faf6ee;
                    color: #202020;
                    font-family: system-ui, -apple-system, Segoe UI, sans-serif;
                }
                .khmer-react-wrap .hero-panel {
                    position: relative;
                    overflow: hidden;
                    min-height: 620px;
                    display: flex;
                    align-items: end;
                    background: #0c2611;
                }
                .khmer-react-wrap .hero-image {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    filter: brightness(0.72);
                }
                .khmer-react-wrap .hero-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(90deg, rgba(0,0,0,0.38), rgba(0,0,0,0.22));
                }
                .khmer-react-wrap .hero-content {
                    position: relative;
                    z-index: 2;
                    max-width: 720px;
                    padding: 72px 8% 80px;
                    color: #fff;
                }
                .khmer-react-wrap .hero-badge {
                    display: inline-block;
                    background: #cca01d;
                    color: #1b4d22;
                    font-weight: 700;
                    padding: 6px 18px;
                    border-radius: 20px;
                    margin-bottom: 18px;
                }
                .khmer-react-wrap .hero-content h1 {
                    font-size: clamp(2.8rem, 5vw, 4rem);
                    line-height: 1.08;
                    font-weight: 800;
                    margin: 0 0 16px;
                    font-family: Georgia, "Times New Roman", serif;
                }
                .khmer-react-wrap .hero-content p {
                    font-size: 1.2rem;
                    line-height: 1.6;
                    color: rgba(255,255,255,0.95);
                    margin: 0;
                }
                .khmer-react-wrap .hero-actions {
                    display: flex;
                    gap: 18px;
                    margin-top: 26px;
                    flex-wrap: wrap;
                }
                .khmer-react-wrap .btn-primary {
                    background: #f4c84f;
                    color: #1b4d22;
                    border: none;
                    border-radius: 8px;
                    padding: 12px 24px;
                    font-weight: 700;
                    text-decoration: none;
                    display: inline-block;
                }
                .khmer-react-wrap .btn-secondary {
                    background: transparent;
                    color: #fff;
                    border: 1px solid rgba(255,255,255,0.8);
                    border-radius: 8px;
                    padding: 12px 24px;
                    font-weight: 700;
                    text-decoration: none;
                    display: inline-block;
                }
                .khmer-react-wrap .stats-bar {
                    background: #1b4d22;
                    color: white;
                    padding: 28px 0;
                }
                .khmer-react-wrap .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 16px;
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 0 24px;
                }
                .khmer-react-wrap .stat-item {
                    text-align: center;
                    padding: 12px 10px;
                }
                .khmer-react-wrap .stat-item h3 {
                    margin: 0 0 4px;
                    color: #cca01d;
                    font-weight: 800;
                    font-size: 2.2rem;
                    font-family: Georgia, "Times New Roman", serif;
                }
                .khmer-react-wrap .stat-item p {
                    margin: 0;
                    color: rgba(255,255,255,0.76);
                }
                .khmer-react-wrap .section-wrap {
                    max-width: 1180px;
                    margin: 0 auto;
                    padding: 80px 24px;
                }
                .khmer-react-wrap .story-grid {
                    display: grid;
                    grid-template-columns: 1.3fr 0.95fr;
                    gap: 40px;
                    align-items: center;
                }
                .khmer-react-wrap .video-card {
                    border-radius: 12px;
                    overflow: hidden;
                    background: #fff;
                    box-shadow: 0 14px 30px rgba(0,0,0,0.08);
                }
                .khmer-react-wrap .video-card iframe {
                    width: 100%;
                    height: 100%;
                    min-height: 360px;
                    border: none;
                    display: block;
                }
                .khmer-react-wrap .section-label {
                    color: #cca01d;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 10px;
                }
                .khmer-react-wrap h2 {
                    color: #202020;
                    font-size: clamp(2rem, 3vw, 2.7rem);
                    font-weight: 800;
                    margin: 0 0 18px;
                    line-height: 1.2;
                    font-family: Georgia, "Times New Roman", serif;
                }
                .khmer-react-wrap p {
                    color: #6f6845;
                    line-height: 1.8;
                    margin: 0 0 14px;
                }
                .khmer-react-wrap .story-link {
                    color: #1b4d22;
                    font-weight: 700;
                    text-decoration: none;
                }
                .khmer-react-wrap .about-panel {
                    background: #faf7ea;
                }
                .khmer-react-wrap .about-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 40px;
                    align-items: center;
                }
                .khmer-react-wrap .mini-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 16px;
                    margin-top: 18px;
                }
                .khmer-react-wrap .mini-stat {
                    background: #eee8d6;
                    border: 1px solid #d8d0b6;
                    border-radius: 8px;
                    padding: 22px;
                }
                .khmer-react-wrap .mini-stat h3 {
                    margin: 0 0 2px;
                    color: #cca01d;
                    font-size: 2rem;
                    font-weight: 800;
                    font-family: Georgia, "Times New Roman", serif;
                }
                .khmer-react-wrap .mini-stat p {
                    margin: 0;
                    color: #6f6845;
                }
                .khmer-react-wrap .about-image {
                    width: 100%;
                    display: block;
                    border-radius: 12px;
                    object-fit: cover;
                    min-height: 420px;
                }
                @media (max-width: 768px) {
                    .khmer-react-wrap .stats-grid,
                    .khmer-react-wrap .story-grid,
                    .khmer-react-wrap .about-grid,
                    .khmer-react-wrap .mini-grid {
                        grid-template-columns: 1fr;
                    }
                    .khmer-react-wrap .hero-panel {
                        min-height: 540px;
                    }
                    .khmer-react-wrap .hero-content {
                        padding: 62px 22px 56px;
                    }
                    .khmer-react-wrap .hero-content p {
                        font-size: 1rem;
                    }
                }
            `}</style>

            <div className="khmer-react-wrap">
                <section className="hero-panel">
                    <img className="hero-image" src={slides[0].image} alt="Cambodian rice field" />
                    <div className="hero-overlay" />
                    <div className="hero-content">
                        <span className="hero-badge">{slides[0].badge}</span>
                        <h1>{slides[0].title}</h1>
                        <p>{slides[0].description}</p>
                        <div className="hero-actions">
                            <a href={slides[0].primary} className="btn-primary">{slides[0].primaryLabel}</a>
                            <a href={slides[0].secondary} className="btn-secondary">{slides[0].secondaryLabel}</a>
                        </div>
                    </div>
                </section>

                <section className="stats-bar">
                    <div className="stats-grid">
                        {stats.map((stat) => (
                            <div className="stat-item" key={stat.label}>
                                <h3>{stat.value}</h3>
                                <p>{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="section-wrap">
                    <div className="story-grid">
                        <div className="video-card">
                            <iframe
                                src="https://www.youtube.com/embed/9FmFKUwm41o?si=H0blIlSJHAfosmLA"
                                title="Rice story video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            />
                        </div>

                        <div>
                            <div className="section-label">Featured Story</div>
                            <h2>The Story of Cambodia&apos;s Rice Culture</h2>
                            <p>
                                Rice is the heart of Cambodian life. For over 2,000 years, Khmer farmers have cultivated diverse varieties across the floodplains of the Mekong and Tonle Sap.
                            </p>
                            <p>
                                Today, Cambodia exports premium fragrant rice to over 15 countries, with Phka Rumduol recognized as one of the world&apos;s finest jasmine rice varieties.
                            </p>
                            <a className="story-link" href="/about">Learn more about our mission →</a>
                        </div>
                    </div>
                </section>

                <section className="about-panel">
                    <div className="section-wrap about-grid">
                        <div>
                            <div className="section-label">About KhmerRice</div>
                            <h2>Cambodia&apos;s Most Trusted Rice Market Platform</h2>
                            <p>
                                KhmerRice is the official agricultural market information system for Cambodia&apos;s rice sector. We aggregate daily price data from provincial markets across all provinces.
                            </p>

                            <div className="mini-grid">
                                <div className="mini-stat">
                                    <h3>25</h3>
                                    <p>Provinces Covered</p>
                                </div>
                                <div className="mini-stat">
                                    <h3>60+</h3>
                                    <p>Export Markets</p>
                                </div>
                            </div>

                            <div style={{ marginTop: '24px' }}>
                                <a href="/pricemarket" className="btn-primary">Explore Market Data →</a>
                            </div>
                        </div>

                        <img className="about-image" src="/images/riceheartandsoul/heartandsoul_4.jpg" alt="Cambodian rice farmer" />
                    </div>
                </section>
            </div>
        </>
    );
}
