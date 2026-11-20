import React, { useState } from 'react';
import { t } from '../i18n.js';

// All numbers here are computed by DashboardController; this component only displays them.
export default function DashboardApp({ posts = [], csrfToken = '', stats = {}, site = null, popular = [] }) {
    const [selectedPostId, setSelectedPostId] = useState(null);
    const tiles = [
        { value: stats.posts ?? 0, label: t('dashboard.stat.posts') },
        { value: stats.views ?? 0, label: t('dashboard.stat.views') },
        { value: stats.comments ?? 0, label: t('dashboard.stat.comments') },
        { value: stats.avgRating ? `${stats.avgRating} ★` : '—', label: t('dashboard.stat.rating') },
    ];

    return (
        <>
            <style>{`
                .dashboard-react-wrap {
                    background: var(--bg);
                    color: var(--text);
                    font-family: var(--font-body);
                }
                .dashboard-react-wrap .hero-band {
                    background: var(--green);
                    color: white;
                    padding: 38px 0 32px;
                }
                .dashboard-react-wrap .inner {
                    max-width: 1180px;
                    margin: 0 auto;
                    padding: 0 24px;
                }
                .dashboard-react-wrap .eyebrow {
                    color: var(--gold-light);
                    font-size: 0.78rem;
                    font-weight: 800;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                }
                .dashboard-react-wrap h1 {
                    margin: 10px 0 8px;
                    font-size: clamp(2.4rem, 4vw, 3.2rem);
                    font-weight: 800;
                    font-family: var(--font-heading);
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
                .dashboard-react-wrap .side-panels {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 16px;
                    margin-bottom: 24px;
                }
                .dashboard-react-wrap .side-panels h3 {
                    margin: 0 0 12px;
                    font-size: 1.2rem;
                    color: var(--green-ink);
                    font-family: var(--font-heading);
                }
                .dashboard-react-wrap .rank-list {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    display: grid;
                    gap: 8px;
                }
                .dashboard-react-wrap .rank-list li {
                    display: flex;
                    justify-content: space-between;
                    gap: 10px;
                    font-size: .92rem;
                }
                .dashboard-react-wrap .rank-list a { color: var(--green-ink); font-weight: 700; text-decoration: none; }
                .dashboard-react-wrap .rank-list small { color: var(--text-muted); white-space: nowrap; }
                .dashboard-react-wrap .post-stats {
                    display: flex;
                    gap: 14px;
                    flex-wrap: wrap;
                    font-size: .82rem;
                    color: var(--text-muted);
                    margin-bottom: 10px;
                }
                .dashboard-react-wrap .stats-bar {
                    background: none;
                    color: inherit;
                    padding: 0;
                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    gap: 12px;
                    margin-bottom: 22px;
                }
                .dashboard-react-wrap .stat-box {
                    background: var(--surface);
                    border: 1px solid rgba(var(--green-rgb), 0.08);
                    border-radius: 16px;
                    padding: 16px 18px;
                    box-shadow: 0 10px 24px rgba(0,0,0,0.04);
                }
                .dashboard-react-wrap .stat-box strong {
                    display: block;
                    color: var(--green-ink);
                    font-size: 1.8rem;
                    font-family: var(--font-heading);
                }
                .dashboard-react-wrap .stat-box span {
                    color: var(--text-muted);
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
                    background: var(--surface);
                    border: 1px solid rgba(var(--green-rgb), 0.08);
                    border-radius: 18px;
                    box-shadow: 0 12px 28px rgba(0,0,0,0.04);
                    padding: 24px;
                }
                .dashboard-react-wrap .panel h2 {
                    margin: 0 0 18px;
                    font-size: 2rem;
                    font-weight: 800;
                    font-family: var(--font-heading);
                }
                .dashboard-react-wrap .form-grid {
                    display: grid;
                    gap: 14px;
                }
                .dashboard-react-wrap .field {
                    width: 100%;
                    background: var(--blue-soft);
                    border: 1px solid var(--border);
                    border-radius: 10px;
                    padding: 12px 14px;
                    font-size: 0.96rem;
                    resize: vertical;
                    color: var(--text);
                }
                .dashboard-react-wrap textarea.field {
                    min-height: 170px;
                }
                .dashboard-react-wrap .btn-gold {
                    display: inline-block;
                    background: var(--gold-light);
                    color: var(--on-gold);
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
                    color: var(--text-muted);
                    font-weight: 600;
                }
                .dashboard-react-wrap .post-list {
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }
                .dashboard-react-wrap .post-card {
                    background: var(--surface);
                    border: 1px solid rgba(var(--green-rgb), 0.08);
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
                    color: var(--green-ink);
                }
                .dashboard-react-wrap .badge {
                    display: inline-flex;
                    align-items: center;
                    background: var(--danger-soft);
                    color: var(--danger);
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
                    color: var(--text-muted);
                    margin-bottom: 8px;
                }
                .dashboard-react-wrap .body {
                    color: var(--text-muted);
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
                    background: var(--gold-soft);
                    color: var(--green-ink);
                    border-radius: 8px;
                    padding: 10px 14px;
                    font-weight: 700;
                    text-decoration: none;
                }
                .dashboard-react-wrap .btn-danger {
                    display: inline-block;
                    background: var(--surface);
                    color: var(--danger);
                    border: 1px solid var(--danger-border);
                    border-radius: 8px;
                    padding: 10px 14px;
                    font-weight: 700;
                    text-decoration: none;
                    cursor: pointer;
                }
                .dashboard-react-wrap .empty {
                    text-align: center;
                    padding: 40px 18px;
                    background: var(--surface);
                    border-radius: 18px;
                    border: 1px dashed rgba(var(--green-rgb), 0.2);
                    color: var(--text-muted);
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
                    background: var(--surface);
                    border-radius: 18px;
                    width: min(420px, 100%);
                    padding: 24px;
                    box-shadow: 0 22px 48px rgba(0,0,0,0.18);
                }
                .dashboard-react-wrap .modal-card h3 {
                    margin: 0 0 12px;
                    color: var(--green-ink);
                    font-size: 1.7rem;
                }
                .dashboard-react-wrap .modal-card p {
                    margin: 0;
                    color: var(--text-muted);
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
                @media (max-width: 640px) {
                    .dashboard-react-wrap .stats-bar {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }
                }
            `}</style>

            <div className="dashboard-react-wrap">
                <section className="hero-band">
                    <div className="inner">
                        <div className="eyebrow">{t('dashboard.eyebrow')}</div>
                        <h1>{t('dashboard.title')}</h1>
                        <p className="subtitle">{t('dashboard.subtitle')}</p>
                    </div>
                </section>

                <section className="content">
                    <div className="stats-bar">
                        {tiles.map((tile) => (
                            <div className="stat-box animate-fade-in-up hover-lift" key={tile.label}>
                                <strong>{tile.value}</strong>
                                <span>{tile.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="side-panels">
                        <div className="panel animate-fade-in-up">
                            <h3>{t('dashboard.popular')}</h3>
                            {popular.length === 0 ? (
                                <p style={{ margin: 0, color: 'var(--text-muted)' }}>{t('dashboard.noPosts')}</p>
                            ) : (
                                <ol className="rank-list">
                                    {popular.map((post) => (
                                        <li key={post.id}>
                                            <a href={`/news/${post.id}`}>{post.title}</a>
                                            <small>👁 {post.views}{post.rating ? ` · ${post.rating}★` : ''}</small>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </div>

                        <div className="panel animate-fade-in-up">
                            <h3>{t('dashboard.tools')}</h3>
                            <ul className="rank-list">
                                <li><a href="/alerts">🔔 {t('nav.alerts')}</a></li>
                                <li><a href="/variety/recommend">🌱 {t('nav.recommend')}</a></li>
                                <li><a href="/calendar">📅 {t('nav.calendar')}</a></li>
                                {stats.topPost ? (
                                    <li><span>{t('dashboard.topPost')}</span><a href={`/news/${stats.topPost.id}`}>{stats.topPost.title}</a></li>
                                ) : null}
                            </ul>
                        </div>

                        {site ? (
                            <div className="panel animate-fade-in-up">
                                <h3>{t('dashboard.site')}</h3>
                                <ul className="rank-list">
                                    <li><span>{t('dashboard.site.users')}</span><strong>{site.users}</strong></li>
                                    <li><span>{t('dashboard.stat.posts')}</span><strong>{site.posts}</strong></li>
                                    <li><span>{t('dashboard.site.varieties')}</span><strong>{site.varieties}</strong></li>
                                    <li><span>{t('dashboard.site.prices')}</span><strong>{site.prices}</strong></li>
                                    <li>
                                        <a href="/admin/reports">⚑ {t('dashboard.site.reports')}</a>
                                        <strong style={{ color: site.openReports ? 'var(--danger)' : undefined }}>{site.openReports}</strong>
                                    </li>
                                </ul>
                            </div>
                        ) : null}
                    </div>

                    <div className="grid">
                        <div className="panel animate-fade-in-up">
                            <div className="eyebrow" style={{ color: 'var(--green-ink)', letterSpacing: '0.08em' }}>{t('dashboard.createUpdate')}</div>
                            <h2>{t('dashboard.newPost')}</h2>

                            <form action="/create-post" method="POST" encType="multipart/form-data" className="form-grid">
                                <input type="hidden" name="_token" value={csrfToken} />
                                <input className="field" type="text" name="title" placeholder={t('dashboard.titlePlaceholder')} required />
                                <textarea className="field" name="body" placeholder={t('dashboard.bodyPlaceholder')} required />
                                <input className="field" type="file" name="image" accept="image/*" />

                                <label className="checkbox-row" htmlFor="trendingCheck">
                                    <input id="trendingCheck" type="checkbox" name="isTrending" value="1" />
                                    <span>{t('dashboard.markTrending')}</span>
                                </label>

                                <button type="submit" className="btn-gold">{t('dashboard.create')}</button>
                            </form>
                        </div>

                        <div>
                            <div style={{ marginBottom: '16px' }}>
                                <h2 style={{ margin: '0 0 6px', fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{t('dashboard.yourPosts')}</h2>
                                <p style={{ margin: 0, color: 'var(--text-muted)' }}>{t('dashboard.yourPostsSub')}</p>
                            </div>

                            <div className="post-list">
                                {posts.length === 0 ? (
                                    <div className="empty">
                                        <h3 style={{ margin: '0 0 8px', color: 'var(--green-ink)' }}>{t('dashboard.empty')}</h3>
                                        <p style={{ margin: 0 }}>{t('dashboard.emptySub')}</p>
                                    </div>
                                ) : (
                                    posts.map((post) => (
                                        <article className="post-card animate-fade-in-up hover-lift" key={post.id}>
                                            <div className="post-head">
                                                <div>
                                                    <h3 className="post-title">{post.title}</h3>
                                                    {post.isTrending ? <span className="badge">🔥 {t('common.trending')}</span> : null}
                                                </div>

                                                <div className="actions">
                                                    <a href={`/edit-post/${post.id}`} className="btn-light">{t('dashboard.edit')}</a>
                                                    <button type="button" className="btn-danger" onClick={() => setSelectedPostId(post.id)}>{t('common.delete')}</button>
                                                </div>
                                            </div>

                                            {post.image ? (
                                                <img className="post-image" src={`/storage/${post.image}`} alt={post.title} />
                                            ) : null}

                                            <div className="post-stats">
                                                <span>👁 {t('dashboard.post.views', { count: post.views })}</span>
                                                <span>💬 {t('dashboard.post.comments', { count: post.comments })}</span>
                                                <span>★ {post.rating ? `${post.rating} (${post.ratings})` : t('dashboard.post.noRatings')}</span>
                                                <a href={`/news/${post.id}`} style={{ color: 'var(--green-ink)', fontWeight: 700 }}>{t('common.view')} →</a>
                                            </div>
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
                    <div className="modal-card animate-fade-in-up" onClick={(event) => event.stopPropagation()}>
                        <h3>{t('dashboard.deleteTitle')}</h3>
                        <p>{t('dashboard.deleteConfirm')}</p>
                        <div className="modal-actions">
                            <button type="button" className="btn-light" onClick={() => setSelectedPostId(null)}>{t('dashboard.cancel')}</button>
                            <form action={`/delete-post/${selectedPostId}`} method="POST" style={{ display: 'inline-block' }}>
                                <input type="hidden" name="_token" value={csrfToken} />
                                <input type="hidden" name="_method" value="DELETE" />
                                <button type="submit" className="btn-danger">{t('dashboard.confirmDelete')}</button>
                            </form>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
