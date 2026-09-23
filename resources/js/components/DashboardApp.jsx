import React, { useMemo, useState } from 'react';

export default function DashboardApp({ posts = [], csrfToken = '' }) {
    const [selectedPostId, setSelectedPostId] = useState(null);
    const stats = useMemo(() => ({
        total: posts.length,
        trending: posts.filter((post) => post.isTrending).length,
    }), [posts]);

    return (
        <>
            <style>{`
                .dashboard-react-wrap {
                    background: #faf6ee;
                    color: #202020;
                    font-family: system-ui, -apple-system, Segoe UI, sans-serif;
                }
                .dashboard-react-wrap .hero-band {
                    background: #1b4d22;
                    color: white;
                    padding: 38px 0 32px;
                }
                .dashboard-react-wrap .inner {
                    max-width: 1180px;
                    margin: 0 auto;
                    padding: 0 24px;
                }
                .dashboard-react-wrap .eyebrow {
                    color: #f4c84f;
                    font-size: 0.78rem;
                    font-weight: 800;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                }
                .dashboard-react-wrap h1 {
                    margin: 10px 0 8px;
                    font-size: clamp(2.4rem, 4vw, 3.2rem);
                    font-weight: 800;
                    font-family: Georgia, "Times New Roman", serif;
                }
                .dashboard-react-wrap .subtitle {
                    margin: 0;
                    color: rgba(255,255,255,0.75);
                    font-size: 1.08rem;
                }
                .dashboard-react-wrap .content {
                    max-width: 1180px;
                    margin: 0 auto;
                    padding: 36px 24px 70px;
                }
                .dashboard-react-wrap .stats-bar {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 12px;
                    margin-bottom: 22px;
                }
                .dashboard-react-wrap .stat-box {
                    background: #fff;
                    border: 1px solid rgba(27,77,34,0.08);
                    border-radius: 16px;
                    padding: 16px 18px;
                    box-shadow: 0 10px 24px rgba(0,0,0,0.04);
                }
                .dashboard-react-wrap .stat-box strong {
                    display: block;
                    color: #1b4d22;
                    font-size: 1.8rem;
                    font-family: Georgia, "Times New Roman", serif;
                }
                .dashboard-react-wrap .stat-box span {
                    color: #6f6845;
                    font-size: 0.85rem;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }
                .dashboard-react-wrap .grid {
                    display: grid;
                    grid-template-columns: 420px minmax(0, 1fr);
                    gap: 24px;
                    align-items: start;
                }
                .dashboard-react-wrap .panel {
                    background: white;
                    border: 1px solid rgba(27,77,34,0.08);
                    border-radius: 18px;
                    box-shadow: 0 12px 28px rgba(0,0,0,0.04);
                    padding: 24px;
                }
                .dashboard-react-wrap .panel h2 {
                    margin: 0 0 18px;
                    font-size: 2rem;
                    font-weight: 800;
                    font-family: Georgia, "Times New Roman", serif;
                }
                .dashboard-react-wrap .form-grid {
                    display: grid;
                    gap: 14px;
                }
                .dashboard-react-wrap .field {
                    width: 100%;
                    background: #f7f1e3;
                    border: 1px solid #e7dcc4;
                    border-radius: 10px;
                    padding: 12px 14px;
                    font-size: 0.96rem;
                    resize: vertical;
                    color: #202020;
                }
                .dashboard-react-wrap textarea.field {
                    min-height: 170px;
                }
                .dashboard-react-wrap .btn-gold {
                    display: inline-block;
                    background: #f4c84f;
                    color: #1b4d22;
                    border: none;
                    border-radius: 10px;
                    padding: 12px 20px;
                    font-weight: 800;
                    text-decoration: none;
                    cursor: pointer;
                }
                .dashboard-react-wrap .checkbox-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #4c4a3d;
                    font-weight: 600;
                }
                .dashboard-react-wrap .post-list {
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }
                .dashboard-react-wrap .post-card {
                    background: white;
                    border: 1px solid rgba(27,77,34,0.08);
                    border-radius: 18px;
                    box-shadow: 0 12px 28px rgba(0,0,0,0.04);
                    padding: 22px;
                }
                .dashboard-react-wrap .post-head {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 16px;
                }
                .dashboard-react-wrap .post-title {
                    margin: 0 0 8px;
                    font-size: 1.45rem;
                    font-weight: 800;
                    color: #1b4d22;
                }
                .dashboard-react-wrap .badge {
                    display: inline-flex;
                    align-items: center;
                    background: #ffe4e1;
                    color: #b42318;
                    border-radius: 999px;
                    padding: 6px 10px;
                    font-size: 0.72rem;
                    font-weight: 800;
                }
                .dashboard-react-wrap .post-image {
                    width: 100%;
                    max-height: 220px;
                    object-fit: cover;
                    border-radius: 12px;
                    margin: 14px 0 16px;
                    display: block;
                }
                .dashboard-react-wrap .meta {
                    font-size: 0.82rem;
                    color: #6f6845;
                    margin-bottom: 8px;
                }
                .dashboard-react-wrap .body {
                    color: #4d4d4d;
                    line-height: 1.7;
                    margin: 0;
                }
                .dashboard-react-wrap .actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 18px;
                    flex-wrap: wrap;
                }
                .dashboard-react-wrap .btn-light {
                    display: inline-block;
                    background: #f7e8ad;
                    color: #1b4d22;
                    border-radius: 8px;
                    padding: 10px 14px;
                    font-weight: 700;
                    text-decoration: none;
                }
                .dashboard-react-wrap .btn-danger {
                    display: inline-block;
                    background: #fff;
                    color: #b42318;
                    border: 1px solid #f7c8c1;
                    border-radius: 8px;
                    padding: 10px 14px;
                    font-weight: 700;
                    text-decoration: none;
                    cursor: pointer;
                }
                .dashboard-react-wrap .empty {
                    text-align: center;
                    padding: 40px 18px;
                    background: white;
                    border-radius: 18px;
                    border: 1px dashed rgba(27,77,34,0.2);
                    color: #6f6845;
                }
                .dashboard-react-wrap .modal-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(17, 24, 39, 0.45);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    z-index: 20;
                }
                .dashboard-react-wrap .modal-card {
                    background: white;
                    border-radius: 18px;
                    width: min(420px, 100%);
                    padding: 24px;
                    box-shadow: 0 22px 48px rgba(0,0,0,0.18);
                }
                .dashboard-react-wrap .modal-card h3 {
                    margin: 0 0 12px;
                    color: #1b4d22;
                    font-size: 1.7rem;
                }
                .dashboard-react-wrap .modal-card p {
                    margin: 0;
                    color: #4d4d4d;
                    line-height: 1.7;
                }
                .dashboard-react-wrap .modal-actions {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                    margin-top: 20px;
                    flex-wrap: wrap;
                }
                @media (max-width: 960px) {
                    .dashboard-react-wrap .grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            <div className="dashboard-react-wrap">
                <section className="hero-band">
                    <div className="inner">
                        <div className="eyebrow">Community Dashboard</div>
                        <h1>Manage News Posts</h1>
                        <p className="subtitle">Create, edit, and manage KhmerRice market updates.</p>
                    </div>
                </section>

                <section className="content">
                    <div className="stats-bar">
                        <div className="stat-box">
                            <strong>{stats.total}</strong>
                            <span>Total Posts</span>
                        </div>
                        <div className="stat-box">
                            <strong>{stats.trending}</strong>
                            <span>Trending</span>
                        </div>
                    </div>

                    <div className="grid">
                        <div className="panel">
                            <div className="eyebrow" style={{ color: '#1b4d22', letterSpacing: '0.08em' }}>Create Update</div>
                            <h2>New Post</h2>

                            <form action="/create-post" method="POST" encType="multipart/form-data" className="form-grid">
                                <input type="hidden" name="_token" value={csrfToken} />
                                <input className="field" type="text" name="title" placeholder="Post title" required />
                                <textarea className="field" name="body" placeholder="Write market news..." required />
                                <input className="field" type="file" name="image" accept="image/*" />

                                <label className="checkbox-row" htmlFor="trendingCheck">
                                    <input id="trendingCheck" type="checkbox" name="isTrending" value="1" />
                                    <span>Mark as Trending</span>
                                </label>

                                <button type="submit" className="btn-gold">Create Post</button>
                            </form>
                        </div>

                        <div>
                            <div style={{ marginBottom: '16px' }}>
                                <h2 style={{ margin: '0 0 6px', fontSize: '2rem', fontWeight: 800, fontFamily: 'Georgia, "Times New Roman", serif' }}>Your Posts</h2>
                                <p style={{ margin: 0, color: '#6f6845' }}>Review and update your published rice market news</p>
                            </div>

                            <div className="post-list">
                                {posts.length === 0 ? (
                                    <div className="empty">
                                        <h3 style={{ margin: '0 0 8px', color: '#1b4d22' }}>No posts yet</h3>
                                        <p style={{ margin: 0 }}>Create your first market update using the form.</p>
                                    </div>
                                ) : (
                                    posts.map((post) => (
                                        <article className="post-card" key={post.id}>
                                            <div className="post-head">
                                                <div>
                                                    <h3 className="post-title">{post.title}</h3>
                                                    {post.isTrending ? <span className="badge">🔥 Trending</span> : null}
                                                </div>

                                                <div className="actions">
                                                    <a href={`/edit-post/${post.id}`} className="btn-light">Edit</a>
                                                    <button type="button" className="btn-danger" onClick={() => setSelectedPostId(post.id)}>Delete</button>
                                                </div>
                                            </div>

                                            {post.image ? (
                                                <img className="post-image" src={`/storage/${post.image}`} alt={post.title} />
                                            ) : null}

                                            <div className="meta">By {post.user?.name || 'Unknown user'}</div>
                                            <p className="body">{post.body}</p>
                                        </article>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {selectedPostId ? (
                <div className="modal-backdrop" onClick={() => setSelectedPostId(null)}>
                    <div className="modal-card" onClick={(event) => event.stopPropagation()}>
                        <h3>Delete Post</h3>
                        <p>Are you sure you want to delete this post? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button type="button" className="btn-light" onClick={() => setSelectedPostId(null)}>Cancel</button>
                            <form action={`/delete-post/${selectedPostId}`} method="POST" style={{ display: 'inline-block' }}>
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
