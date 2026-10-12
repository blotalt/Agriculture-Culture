import React from 'react';
import ReportButton from './ReportButton.jsx';
import { t } from '../i18n.js';

export default function NewsDetailApp({ post, csrfToken, currentUserId }) {
    if (!post) return null;

    const avgRating = Number(post.avgRating || 0);
    const userRating = Number(post.userRating || 0);
    const isGuest = !currentUserId;

    return (
        <>
            <style>{`
                .news-detail-react-wrap {
                    background: var(--bg);
                    color: var(--text);
                    font-family: var(--font-body);
                    min-height: 100vh;
                }
                .news-detail-react-hero {
                    background: var(--green);
                    color: white;
                    padding: 34px 0 28px;
                }
                .news-detail-react-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 0 24px;
                }
                .news-detail-react-hero h1 {
                    margin: 0 0 6px;
                    font-size: clamp(2rem, 4vw, 2.8rem);
                    font-family: var(--font-heading);
                }
                .news-detail-react-hero p {
                    margin: 0;
                    color: rgba(255,255,255,.72);
                }
                .news-detail-react-content {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 30px 24px 72px;
                }
                .news-card {
                    background: var(--surface);
                    border: 1px solid rgba(var(--green-rgb), .08);
                    border-radius: 18px;
                    padding: 24px;
                    box-shadow: 0 12px 28px rgba(0,0,0,.04);
                    margin-bottom: 22px;
                }
                .news-card h2 {
                    margin: 0 0 8px;
                    color: var(--green-ink);
                    font-size: clamp(1.8rem, 3.5vw, 2.4rem);
                    font-family: var(--font-heading);
                }
                .news-card .meta {
                    color: var(--text-muted);
                    margin: 0 0 18px;
                    font-size: .9rem;
                }
                .news-card img {
                    display: block;
                    width: 100%;
                    max-height: 420px;
                    object-fit: contain;
                    border-radius: 12px;
                    background: var(--bg);
                    margin-bottom: 18px;
                }
                .news-card .body {
                    color: var(--text-muted);
                    line-height: 1.8;
                    margin: 0;
                    white-space: pre-line;
                }
                .rating-box {
                    background: var(--surface);
                    border: 1px solid rgba(var(--green-rgb), .08);
                    border-radius: 18px;
                    padding: 22px 20px;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    flex-wrap: wrap;
                    margin-bottom: 22px;
                    box-shadow: 0 10px 24px rgba(0,0,0,.04);
                }
                .rating-box h4 {
                    margin: 0;
                    color: var(--green-ink);
                    font-size: 1.3rem;
                }
                .star-row {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 1.9rem;
                }
                .star-row button {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                }
                .star-fill { color: var(--gold); }
                .star-empty { color: var(--border); }
                .comment-card {
                    background: var(--surface);
                    border: 1px solid rgba(var(--green-rgb), .08);
                    border-radius: 18px;
                    padding: 22px 20px;
                    box-shadow: 0 10px 24px rgba(0,0,0,.04);
                }
                .comment-card h4 {
                    margin: 0 0 16px;
                    color: var(--green-ink);
                }
                .comment-form textarea {
                    width: 100%;
                    min-height: 110px;
                    resize: vertical;
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    background: var(--bg);
                    padding: 12px 14px;
                    margin-bottom: 12px;
                }
                .comment-form button, .primary-btn {
                    background: var(--green);
                    color: white;
                    border: none;
                    border-radius: 999px;
                    padding: 10px 18px;
                    font-weight: 700;
                    cursor: pointer;
                }
                .comment-item {
                    border-bottom: 1px solid var(--blue-soft);
                    padding: 16px 0;
                }
                .comment-item:last-child { border-bottom: none; }
                .comment-head {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 12px;
                }
                .comment-head strong { color: var(--green-ink); }
                .comment-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .comment-actions button, .comment-actions form button {
                    background: var(--gold-soft);
                    color: var(--green-ink);
                    border: none;
                    border-radius: 999px;
                    padding: 8px 12px;
                    font-weight: 700;
                    cursor: pointer;
                }
                .danger-button {
                    background: var(--danger-soft) !important;
                    color: var(--danger) !important;
                    border: 1px solid var(--danger-border) !important;
                }
                .muted { color: var(--text-muted); }
                @media(max-width:640px){.comment-head{display:block;}.comment-actions{flex-direction:row;margin-top:12px;}}
            `}</style>

            <div className="news-detail-react-wrap">
                <section className="news-detail-react-hero">
                    <div className="news-detail-react-inner">
                        <h1>{t('newsDetail.title')}</h1>
                        <p>{t('newsDetail.subtitle')}</p>
                    </div>
                </section>

                <section className="news-detail-react-content">
                    <article className="news-card animate-fade-in-up">
                        <h2>{post.title}</h2>
                        {post.image ? <img src={`/storage/${post.image}`} alt={post.title} /> : null}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                            <p className="meta" style={{ margin: 0 }}>
                                {t('common.by')} {post.user?.name || t('common.unknownUser')} · {post.created_at} · {t('newsDetail.views', { count: post.views || 0 })}
                            </p>
                            {!isGuest && post.user_id !== currentUserId ? <ReportButton type="post" id={post.id} csrfToken={csrfToken} /> : null}
                        </div>
                        <p className="body">{post.body}</p>
                    </article>

                    <div className="rating-box animate-fade-in-up">
                        <h4>{t('newsDetail.review')}</h4>
                        <form method="POST" action={`/news/${post.id}/rating`}>
                            <input type="hidden" name="_token" value={csrfToken} />
                            <div className="star-row">
                                {Array.from({ length: 5 }, (_, index) => {
                                    const value = index + 1;
                                    const filled = userRating >= value;
                                    return (
                                        <button key={value} type="submit" name="rating" value={value} aria-label={`Rate ${value} star`}>
                                            <span className={filled ? 'star-fill' : 'star-empty'}>★</span>
                                        </button>
                                    );
                                })}
                                <span className="muted" style={{ marginLeft: 8, fontSize: '0.9rem' }}>{avgRating.toFixed(1)} / 5</span>
                            </div>
                        </form>
                    </div>

                    <div className="comment-card animate-fade-in-up">
                        <h4>{t('newsDetail.comments')}</h4>
                        {isGuest ? (
                            <p className="muted">
                                <a href="/login" style={{ color: 'var(--green-ink)', fontWeight: 700 }}>{t('nav.login')}</a> {t('newsDetail.loginToComment')}
                            </p>
                        ) : (
                            <form method="POST" action={`/news/${post.id}/comments`} className="comment-form">
                                <input type="hidden" name="_token" value={csrfToken} />
                                <textarea name="body" placeholder={t('newsDetail.writeComment')} maxLength={1000} required />
                                <button type="submit">{t('newsDetail.postComment')}</button>
                            </form>
                        )}

                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((comment) => (
                                <div key={comment.id} className="comment-item">
                                    <div className="comment-head">
                                        <div>
                                            <p style={{ margin: '0 0 6px' }}><strong>{comment.user?.name || 'User'}</strong></p>
                                            <p style={{ margin: '0 0 6px' }}>{comment.body}</p>
                                            <small className="muted">{comment.created_at}</small>
                                        </div>

                                        {!comment.can_manage && !isGuest ? <ReportButton type="comment" id={comment.id} csrfToken={csrfToken} /> : null}
                                        {comment.can_manage ? (
                                            <div className="comment-actions">
                                                <button type="button" data-bs-toggle="collapse" data-bs-target={`#editComment${comment.id}`}>Edit</button>
                                                <form method="POST" action={`/comments/${comment.id}`}>
                                                    <input type="hidden" name="_token" value={csrfToken} />
                                                    <input type="hidden" name="_method" value="DELETE" />
                                                    <button type="submit" className="danger-button">Delete</button>
                                                </form>
                                            </div>
                                        ) : null}
                                    </div>

                                    {comment.can_manage ? (
                                        <div className="collapse mt-3" id={`editComment${comment.id}`}>
                                            <form method="POST" action={`/comments/${comment.id}`} className="comment-form">
                                                <input type="hidden" name="_token" value={csrfToken} />
                                                <input type="hidden" name="_method" value="PUT" />
                                                <textarea name="body" defaultValue={comment.body} />
                                                <button type="submit">Save Changes</button>
                                            </form>
                                        </div>
                                    ) : null}
                                </div>
                            ))
                        ) : (
                            <p className="muted" style={{ margin: '14px 0 0' }}>{t('newsDetail.noComments')}</p>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}
