import React from 'react';
import { t } from '../i18n.js';

export default function NewsApp({ posts = [], pagination = { current: 1, last: 1 } }) {
    return (
        <>
            <style>{`
                .news-react-wrap {
                    background: var(--bg);
                    color: var(--text);
                    font-family: var(--font-body);
                }
                .news-react-hero {
                    background: var(--green);
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
                    color: var(--gold-light);
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
                    font-family: var(--font-heading);
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
                    font-family: var(--font-heading);
                }
                .news-react-header p {
                    margin: 0;
                    color: var(--text-muted);
                }
                .news-react-list {
                    display: grid;
                    gap: 18px;
                }
                .news-react-card {
                    background: var(--surface);
                    border: 1px solid rgba(var(--green-rgb), .08);
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
                    background: var(--green-soft);
                    color: var(--green-ink);
                    border-radius: 999px;
                    padding: 6px 10px;
                    font-size: .75rem;
                    font-weight: 800;
                    margin-bottom: 8px;
                }
                .news-react-card h3 {
                    margin: 0 0 8px;
                    font-size: 1.5rem;
                    color: var(--green-ink);
                }
                .news-react-meta {
                    margin: 0 0 12px;
                    color: var(--text-muted);
                    font-size: .84rem;
                }
                .news-react-body {
                    margin: 0;
                    color: var(--text-muted);
                    line-height: 1.7;
                }
                .news-react-button {
                    display: inline-block;
                    margin-top: 14px;
                    background: var(--green);
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
                    color: var(--text-muted);
                    background: var(--surface);
                    border: 1px dashed rgba(var(--green-rgb), .22);
                    border-radius: 18px;
                }
                .news-react-pages{display:flex;gap:8px;justify-content:center;margin-top:28px;flex-wrap:wrap;}.news-react-pages a{min-width:40px;text-align:center;padding:8px 12px;border-radius:10px;background:var(--surface);border:1px solid var(--border);color:var(--green-ink);text-decoration:none;font-weight:700;}.news-react-pages a.active{background:var(--green);color:white;border-color:var(--green);}
                @media(max-width:760px){.news-react-row{grid-template-columns:1fr;}.news-react-image{height:200px;}}
            `}</style>

            <div className="news-react-wrap">
                <section className="news-react-hero">
                    <div className="news-react-inner">
                        <span className="news-react-kicker">{t('news.kicker')}</span>
                        <h1>{t('news.title')}</h1>
                        <p>{t('news.subtitle')}</p>
                    </div>
                </section>

                <section className="news-react-content">
                    <div className="news-react-header">
                        <h2>{t('news.latest')}</h2>
                        <p>{t('news.latestSub')}</p>
                    </div>

                    <div className="news-react-list">
                        {posts.length === 0 ? (
                            <div className="news-react-empty">
                                <h3 style={{ margin: '0 0 10px', color: 'var(--green-ink)' }}>{t('news.empty')}</h3>
                                <p style={{ margin: 0 }}>{t('news.emptySub')}</p>
                            </div>
                        ) : (
                            posts.map((post) => (
                                <article key={post.id} className="news-react-card animate-fade-in-up hover-lift">
                                    <div className="news-react-row">
                                        <div>
                                            <span className="news-react-badge">{t('news.badge')}</span>
                                            {post.isTrending ? <span style={{ marginLeft: 8, background: 'var(--danger-soft)', color: 'var(--danger)', borderRadius: 999, padding: '5px 10px', fontSize: '.72rem', fontWeight: 800 }}>🔥 {t('common.trending')}</span> : null}
                                            <h3>{post.title}</h3>
                                            <p className="news-react-meta">{t('common.by')} {post.user?.name || t('common.unknownUser')} · {post.date} · 👁 {post.views ?? 0} · 💬 {post.comments ?? 0}</p>
                                            <p className="news-react-body">{post.body.slice(0, 200)}{post.body.length > 200 ? '...' : ''}</p>
                                            <a className="news-react-button" href={`/news/${post.id}`}>{t('variety.details')}</a>
                                        </div>

                                        {post.image ? (
                                            <img className="news-react-image" src={`/storage/${post.image}`} alt={post.title} />
                                        ) : null}
                                    </div>
                                </article>
                            ))
                        )}
                    </div>

                    {pagination.last > 1 ? (
                        <nav className="news-react-pages" aria-label="Pages">
                            {Array.from({ length: pagination.last }, (_, index) => (
                                <a
                                    key={index + 1}
                                    href={`/news?page=${index + 1}`}
                                    className={index + 1 === pagination.current ? 'active' : ''}
                                    aria-current={index + 1 === pagination.current ? 'page' : undefined}
                                >
                                    {index + 1}
                                </a>
                            ))}
                        </nav>
                    ) : null}
                </section>
            </div>
        </>
    );
}
