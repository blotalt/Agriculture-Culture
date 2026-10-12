import React from 'react';
import CountUp from './CountUp.jsx';

export default function AboutApp({ teamMembers = [] }) {
    return (
        <>
            <style>{`
                .about-react-wrap {
                    background: var(--bg);
                    color: var(--text);
                    font-family: var(--font-body);
                }
                .about-react-wrap .hero-band {
                    background: var(--green);
                    color: white;
                    padding: 32px 0 28px;
                }
                .about-react-wrap .inner {
                    max-width: 1180px;
                    margin: 0 auto;
                    padding: 0 24px;
                }
                .about-react-wrap .eyebrow {
                    color: var(--gold-light);
                    font-size: 0.78rem;
                    font-weight: 800;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                }
                .about-react-wrap h1, .about-react-wrap h2, .about-react-wrap h3, .about-react-wrap h4, .about-react-wrap h5 {
                    font-family: var(--font-heading);
                }
                .about-react-wrap h1 {
                    margin: 10px 0 8px;
                    font-size: clamp(2.5rem, 4vw, 3.3rem);
                    font-weight: 800;
                }
                .about-react-wrap .subtitle {
                    margin: 0;
                    color: rgba(255,255,255,0.72);
                    font-size: 1.08rem;
                }
                .about-react-wrap .section {
                    max-width: 1180px;
                    margin: 0 auto;
                    padding: 52px 24px 30px;
                }
                .about-react-wrap .mission-grid {
                    display: grid;
                    grid-template-columns: 1.2fr 1fr;
                    gap: 36px;
                    align-items: center;
                }
                .about-react-wrap .stat-panel {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 18px;
                }
                .about-react-wrap .stat-card {
                    background: var(--surface);
                    border: 1px solid rgba(var(--green-rgb), 0.08);
                    border-radius: 18px;
                    box-shadow: 0 10px 24px rgba(0,0,0,0.04);
                    padding: 24px 20px;
                    text-align: center;
                }
                .about-react-wrap .stat-value {
                    color: var(--gold-light);
                    font-size: 2rem;
                    font-weight: 800;
                    margin: 0 0 8px;
                }
                .about-react-wrap .stat-label {
                    color: var(--text-muted);
                    margin: 0;
                }
                .about-react-wrap .text-block {
                    color: var(--text-muted);
                    line-height: 1.8;
                    margin: 0 0 16px;
                }
                .about-react-wrap .section-heading {
                    text-align: center;
                    margin: 18px 0 24px;
                }
                .about-react-wrap .team-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 24px;
                }
                .about-react-wrap .team-card {
                    background: var(--surface);
                    border-radius: 18px;
                    overflow: hidden;
                    border: 1px solid rgba(var(--green-rgb), 0.08);
                    box-shadow: 0 10px 24px rgba(0,0,0,0.04);
                }
                .about-react-wrap .team-card img {
                    width: 100%;
                    height: 390px;
                    display: block;
                    object-fit: cover;
                }
                .about-react-wrap .team-body {
                    padding: 20px;
                }
                .about-react-wrap .team-name {
                    margin: 0 0 6px;
                    color: var(--green-ink);
                    font-size: 1.5rem;
                }
                .about-react-wrap .team-role {
                    margin: 0 0 10px;
                    color: var(--gold);
                    font-weight: 800;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                }
                .about-react-wrap .team-location {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--text-muted);
                    font-size: 0.95rem;
                    margin: 0;
                }
                .about-react-wrap .contact-wrap {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 32px;
                    align-items: start;
                    padding-bottom: 56px;
                }
                .about-react-wrap .contact-list {
                    display: grid;
                    gap: 18px;
                }
                .about-react-wrap .contact-item {
                    display: flex;
                    gap: 14px;
                    align-items: flex-start;
                }
                .about-react-wrap .icon-box {
                    width: 42px;
                    height: 42px;
                    background: var(--green-soft);
                    color: var(--green-ink);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .about-react-wrap .contact-label {
                    margin: 0 0 4px;
                    font-size: 0.9rem;
                    font-weight: 800;
                    color: var(--green-ink);
                }
                .about-react-wrap .contact-value {
                    margin: 0;
                    color: var(--text-muted);
                    line-height: 1.6;
                }
                .about-react-wrap .message-box {
                    background: var(--surface);
                    border-radius: 18px;
                    padding: 30px;
                    border: 1px solid rgba(var(--green-rgb), 0.08);
                    box-shadow: 0 10px 24px rgba(0,0,0,0.04);
                }
                .about-react-wrap .field {
                    width: 100%;
                    background: var(--blue-soft);
                    border: none;
                    border-radius: 12px;
                    padding: 14px 16px;
                    margin-bottom: 16px;
                    font-size: 0.96rem;
                }
                .about-react-wrap textarea.field {
                    min-height: 120px;
                    resize: vertical;
                }
                .about-react-wrap .submit-btn {
                    width: 100%;
                    background: var(--gold-light);
                    color: var(--on-gold);
                    border: none;
                    border-radius: 12px;
                    padding: 14px 18px;
                    font-weight: 800;
                    cursor: pointer;
                }
                @media (max-width: 960px) {
                    .about-react-wrap .mission-grid,
                    .about-react-wrap .team-grid,
                    .about-react-wrap .contact-wrap {
                        grid-template-columns: 1fr;
                    }
                    .about-react-wrap .stat-panel {
                        grid-template-columns: 1fr 1fr;
                    }
                }
                @media (max-width: 560px) {
                    .about-react-wrap .stat-panel {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            <div className="about-react-wrap">
                <section className="hero-band">
                    <div className="inner">
                        <div className="eyebrow">About KhmerRice</div>
                        <h1>Cambodia's Rice Market Platform</h1>
                        <p className="subtitle">Empowering farmers, exporters, and traders with transparent market data</p>
                    </div>
                </section>

                <section className="section">
                    <div className="mission-grid">
                        <div>
                            <div className="eyebrow" style={{ color: 'var(--gold)' }}>Our Mission</div>
                            <h2 style={{ margin: '12px 0 18px', fontSize: 'clamp(2rem,3vw,2.7rem)' }}>Connecting Cambodia's Rice Economy</h2>
                            <p className="text-block">KhmerRice was established under the Ministry of Agriculture, Forestry and Fisheries of Cambodia to create a transparent, data-driven marketplace for the country's most important crop.</p>
                            <p className="text-block">We aggregate real-time price data from 25 provincial markets, maintain the national rice variety registry, and provide tools for farmers, millers, exporters, and researchers to make informed decisions.</p>
                            <p className="text-block">Cambodia's rice sector employs over 3.5 million farming families. Our platform helps ensure they receive fair market prices and connect with international buyers.</p>
                        </div>

                        <div className="stat-panel">
                            <div className="stat-card animate-fade-in-up hover-lift">
                                <div className="stat-value"><CountUp value="3.5M+" /></div>
                                <p className="stat-label">Farming Families</p>
                            </div>
                            <div className="stat-card animate-fade-in-up hover-lift">
                                <div className="stat-value"><CountUp value="#1" /></div>
                                <p className="stat-label">Best Rice</p>
                            </div>
                            <div className="stat-card animate-fade-in-up hover-lift">
                                <div className="stat-value"><CountUp value="60+" /></div>
                                <p className="stat-label">Export Countries</p>
                            </div>
                            <div className="stat-card animate-fade-in-up hover-lift">
                                <div className="stat-value"><CountUp value="25" /></div>
                                <p className="stat-label">Provinces Covered</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team section (hidden)
                <section className="section" style={{ paddingTop: 18 }}>
                    <div className="section-heading">
                        <div className="eyebrow" style={{ color: 'var(--gold)' }}>The Team</div>
                        <h2 style={{ margin: '8px 0 0', fontSize: 'clamp(2rem,3vw,2.7rem)' }}>Built by Cambodian Web Designers</h2>
                    </div>

                    <div className="team-grid">
                        {teamMembers.map((member) => (
                            <div className="team-card animate-fade-in-up hover-lift" key={member.name}>
                */}
                                {/* <img src={`/images/team_members_stuff/${member.image}`} alt={member.name} /> */}
                {/*
                                <div className="team-body">
                                    <h5 className="team-name">{member.name}</h5>
                                    <p className="team-role">{member.role}</p>
                                    <p className="team-location">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                        {member.location}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                */}

                <section className="section" style={{ paddingBottom: 0 }}>
                    <div className="section-heading">
                        <div className="eyebrow" style={{ color: 'var(--gold)' }}>Get In Touch</div>
                        <h2 style={{ margin: '8px 0 0', fontSize: 'clamp(2rem,3vw,2.7rem)' }}>Contact Us</h2>
                    </div>

                    <div className="contact-wrap">
                        <div className="contact-list">
                            <div className="contact-item">
                                <div className="icon-box">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                </div>
                                <div>
                                    <p className="contact-label">Address</p>
                                    <p className="contact-value">Ministry of Agriculture, Phnom Penh, Cambodia</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="icon-box">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <p className="contact-label">Email</p>
                                    <p className="contact-value">info@khmerrice.gov.kh</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="icon-box">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p className="contact-label">Phone</p>
                                    <p className="contact-value">+855 23 456 789</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="icon-box">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="2" y1="12" x2="22" y2="12"></line>
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p className="contact-label">Website</p>
                                    <p className="contact-value">www.khmerrice.gov.kh</p>
                                </div>
                            </div>
                        </div>

                        <div className="message-box animate-fade-in-up">
                            <h5 style={{ margin: '0 0 20px', fontSize: '1.8rem', color: 'var(--green-ink)' }}>Send a Message</h5>
                            <form action="#" method="POST">
                                <input className="field" type="text" placeholder="Your name" required />
                                <input className="field" type="email" placeholder="Email address" required />
                                <textarea className="field" placeholder="Write your message here..." required />
                                <button type="submit" className="submit-btn">Send Message</button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
