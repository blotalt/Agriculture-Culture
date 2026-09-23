import React from 'react';

export default function NewsApp({ posts = [] }) {
    return (
        <>
            <style>{`
                .news-react-wrap {
                    background: #faf6ee;
                    color: #202020;
                    font-family: system-ui, -apple-system, Segoe UI, sans-serif;
                }
                .news-react-hero {
                    background: #1b4d22;
                    color: white;
                    padding: 36px 0 28px;
                }
                .news-react-inner {
                    max-width: 1180px;
                    margin: 0 auto;
                    padding: 0 24px;
                }
                .news-react-kicker {
                    display: inline-block;
                    background: rgba(255,255,255,0.12);
                    color: #f4c84f;
                    border-radius: 999px;
                    padding: 6px 12px;
                    font-size: .75rem;
                    letter-spacing: .12em;
                    text-transform: uppercase;
                    font-weight: 800;
                }
                .news-react-hero h1 {
                    margin: 12px 0 8px;
                    font-size: clamp(2.3rem, 4vw, 3rem);
                    font-family: Georgia, "Times New Roman", serif;
                }
                .news-react-hero p {
                    margin: 0;
                    color: rgba(255,255,255,.68);
                    font-size: 1.08rem;
                }
                .news-react-content {
                    max-width: 1180px;
                    margin: 0 auto;
                    padding: 30px 24px 72px;
                }
                .news-react-header {
                    margin-bottom: 18px;
                }
                .news-react-header h2 {
                    margin: 0 0 6px;
                    font-size: clamp(2rem, 3vw, 2.4rem);
                    font-family: Georgia, "Times New Roman", serif;
                }
                .news-react-header p {
                    margin: 0;
                    color: #6f6845;
                }
                .news-react-list {
                    display: grid;
                    gap: 18px;
                }
                .news-react-card {
                    background: white;
                    border: 1px solid rgba(27,77,34,.08);
                    border-radius: 18px;
                    padding: 18px;
                    box-shadow: 0 12px 28px rgba(0,0,0,.04);
                }
                .news-react-row {
                    display: grid;
                    grid-template-columns: minmax(0,1.7fr) minmax(180px, 0.8fr);
                    gap: 18px;
                    align-items: center;
                }
                .news-react-badge {
                    display: inline-flex;
                    align-items: center;
                    background: #eff7ee;
                    color: #1b4d22;
                    border-radius: 999px;
                    padding: 6px 10px;
                    font-size: .75rem;
                    font-weight: 800;
                    margin-bottom: 8px;
                }
                .news-react-card h3 {
                    margin: 0 0 8px;
                    font-size: 1.5rem;
                    color: #1b4d22;
                }
                .news-react-meta {
                    margin: 0 0 12px;
                    color: #6f6845;
                    font-size: .84rem;
                }
                .news-react-body {
                    margin: 0;
                    color: #4b5563;
                    line-height: 1.7;
                }
                .news-react-button {
                    display: inline-block;
                    margin-top: 14px;
                    background: #1b4d22;
                    color: white;
                    padding: 10px 18px;
                    border-radius: 999px;
                    text-decoration: none;
                    font-weight: 700;
                }
                .news-react-image {
                    width: 100%;
                    height: 170px;
                    object-fit: cover;
                    border-radius: 12px;
                    display: block;
                }
                .news-react-empty {
                    padding: 44px 18px;
                    text-align: center;
                    color: #6f6845;
                    background: white;
                    border: 1px dashed rgba(27,77,34,.22);
                    border-radius: 18px;
                }
                @media(max-width:760px){.news-react-row{grid-template-columns:1fr;}.news-react-image{height:200px;}}
            `}</style>

            <div className="news-react-wrap">
                <section className="news-react-hero">
                    <div className="news-react-inner">
                        <span className="news-react-kicker">Agriculture Updates</span>
                        <h1>Rice Market News</h1>
                        <p>Latest updates from Cambodia&apos;s rice markets, farmers, and trade sector.</p>
                    </div>
                </section>

                <section className="news-react-content">
                    <div className="news-react-header">
                        <h2>Latest News</h2>
                        <p>Stories and updates from the KhmerRice community</p>
                    </div>

                    <div className="news-react-list">
                        {posts.length === 0 ? (
                            <div className="news-react-empty">
                                <h3 style={{ margin: '0 0 10px', color: '#1b4d22' }}>No news posted yet</h3>
                                <p style={{ margin: 0 }}>New rice market updates will appear here.</p>
                            </div>
                        ) : (
                            posts.map((post) => (
                                <article key={post.id} className="news-react-card">
                                    <div className="news-react-row">
                                        <div>
                                            <span className="news-react-badge">Market Update</span>
                                            {post.isTrending ? <span style={{ marginLeft: 8, background: '#ffe5e5', color: '#b42318', borderRadius: 999, padding: '5px 10px', fontSize: '.72rem', fontWeight: 800 }}>🔥 Trending</span> : null}
                                            <h3>{post.title}</h3>
                                            <p className="news-react-meta">By {post.user?.name || 'Unknown user'} · {post.date}</p>
                                            <p className="news-react-body">{post.body.slice(0, 200)}{post.body.length > 200 ? '...' : ''}</p>
                                            <a className="news-react-button" href={`/news/${post.id}`}>View Details</a>
                                        </div>

                                        {post.image ? (
                                            <img className="news-react-image" src={`/storage/${post.image}`} alt={post.title} />
                                        ) : null}
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}
