import React from 'react';

export default function SearchApp({ q = '', varieties = [], posts = [] }) {
    return (
        <>
            <style>{`
                .search-react-wrap {
                    background: #faf6ee;
                    color: #202020;
                    font-family: system-ui, -apple-system, Segoe UI, sans-serif;
                    min-height: 100vh;
                }
                .search-react-hero {
                    background: #1b4d22;
                    color: white;
                    padding: 34px 0 28px;
                }
                .search-react-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 0 24px;
                }
                .search-react-hero h1 {
                    margin: 0 0 6px;
                    font-size: clamp(2rem, 4vw, 2.6rem);
                    font-family: Georgia, "Times New Roman", serif;
                }
                .search-react-hero p {
                    margin: 0;
                    color: rgba(255,255,255,.7);
                }
                .search-react-content {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 36px 24px 72px;
                }
                .search-react-section {
                    margin-bottom: 28px;
                }
                .search-react-section h3 {
                    margin: 0 0 14px;
                    font-size: 1.8rem;
                    color: #1b4d22;
                }
                .search-react-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    background: white;
                    border: 1px solid rgba(27,77,34,.08);
                    border-radius: 12px;
                    padding: 14px 18px;
                    margin-bottom: 12px;
                    box-shadow: 0 10px 24px rgba(0,0,0,.04);
                }
                .search-react-item strong {
                    color: #1b4d22;
                    display: block;
                }
                .search-react-item span {
                    color: #6f6845;
                    font-size: .82rem;
                }
                .search-react-link {
                    display: inline-block;
                    background: #1b4d22;
                    color: white;
                    text-decoration: none;
                    border-radius: 999px;
                    padding: 8px 14px;
                    font-weight: 700;
                }
                .search-react-empty {
                    margin: 0;
                    color: #6f6845;
                }
            `}</style>

            <div className="search-react-wrap">
                <section className="search-react-hero">
                    <div className="search-react-inner">
                        <h1>Search Results</h1>
                        <p>{q ? <>Showing results for “{q}”</> : 'Type something to search'}</p>
                    </div>
                </section>

                <section className="search-react-content">
                    <div className="search-react-section">
                        <h3>Rice Varieties ({varieties.length})</h3>
                        {varieties.length > 0 ? (
                            varieties.map((rice) => (
                                <div key={rice.id} className="search-react-item">
                                    <div>
                                        <strong>{rice.name}</strong>
                                        <span>— {rice.type}, {rice.location}</span>
                                    </div>
                                    <a className="search-react-link" href={`/variety?search=${encodeURIComponent(rice.name)}`}>View</a>
                                </div>
                            ))
                        ) : (
                            <p className="search-react-empty">No varieties found.</p>
                        )}
                    </div>

                    <div className="search-react-section">
                        <h3>News Posts ({posts.length})</h3>
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div key={post.id} className="search-react-item" style={{ display: 'block' }}>
                                    <strong>{post.title}</strong>
                                    <p style={{ margin: '8px 0 0', color: '#6f6845' }}>{post.body.slice(0, 100)}{post.body.length > 100 ? '...' : ''}</p>
                                </div>
                            ))
                        ) : (
                            <p className="search-react-empty">No news posts found.</p>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}
