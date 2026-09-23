import React from 'react';

export default function NewsDetailApp({ post, csrfToken, currentUserId }) {
    if (!post) return null;

    const avgRating = Number(post.avgRating || 0);
    const userRating = Number(post.userRating || 0);

    return (
        <>
            <style>{`
                .news-detail-react-wrap {
                    background: #faf6ee;
                    color: #202020;
                    font-family: system-ui, -apple-system, Segoe UI, sans-serif;
                    min-height: 100vh;
                }
                .news-detail-react-hero {
                    background: #1b4d22;
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
                    font-family: Georgia, "Times New Roman", serif;
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
                    background: white;
                    border: 1px solid rgba(27,77,34,.08);
                    border-radius: 18px;
                    padding: 24px;
                    box-shadow: 0 12px 28px rgba(0,0,0,.04);
                    margin-bottom: 22px;
                }
                .news-card h2 {
                    margin: 0 0 8px;
                    color: #1b4d22;
                    font-size: clamp(1.8rem, 3.5vw, 2.4rem);
                    font-family: Georgia, "Times New Roman", serif;
                }
                .news-card .meta {
                    color: #6f6845;
                    margin: 0 0 18px;
                    font-size: .9rem;
                }
                .news-card img {
                    display: block;
                    width: 100%;
                    max-height: 420px;
                    object-fit: contain;
                    border-radius: 12px;
                    background: #f8f4ee;
                    margin-bottom: 18px;
                }
                .news-card .body {
                    color: #4b5563;
                    line-height: 1.8;
                    margin: 0;
                    white-space: pre-line;
                }
                .rating-box {
                    background: white;
                    border: 1px solid rgba(27,77,34,.08);
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
                    color: #1b4d22;
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
                .star-fill { color: #f7b500; }
                .star-empty { color: #d8d0b5; }
                .comment-card {
                    background: white;
                    border: 1px solid rgba(27,77,34,.08);
                    border-radius: 18px;
                    padding: 22px 20px;
                    box-shadow: 0 10px 24px rgba(0,0,0,.04);
                }
                .comment-card h4 {
                    margin: 0 0 16px;
                    color: #1b4d22;
                }
                .comment-form textarea {
                    width: 100%;
                    min-height: 110px;
                    resize: vertical;
                    border: 1px solid #e8dcc2;
                    border-radius: 12px;
                    background: #faf5eb;
                    padding: 12px 14px;
                    margin-bottom: 12px;
                }
                .comment-form button, .primary-btn {
                    background: #1b4d22;
                    color: white;
                    border: none;
                    border-radius: 999px;
                    padding: 10px 18px;
                    font-weight: 700;
                    cursor: pointer;
                }
                .comment-item {
                    border-bottom: 1px solid #efe7d7;
                    padding: 16px 0;
                }
                .comment-item:last-child { border-bottom: none; }
                .comment-head {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 12px;
                }
                .comment-head strong { color: #1b4d22; }
                .comment-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .comment-actions button, .comment-actions form button {
                    background: #f7e8ad;
                    color: #1b4d22;
                    border: none;
                    border-radius: 999px;
                    padding: 8px 12px;
                    font-weight: 700;
                    cursor: pointer;
                }
                .danger-button {
                    background: #fff1f0 !important;
                    color: #b42318 !important;
                    border: 1px solid #f7c8c1 !important;
                }
                .muted { color: #6f6845; }
                @media(max-width:640px){.comment-head{display:block;}.comment-actions{flex-direction:row;margin-top:12px;}}
            `}</style>

            <div className="news-detail-react-wrap">
                <section className="news-detail-react-hero">
                    <div className="news-detail-react-inner">
                        <h1>News Details</h1>
                        <p>Read the full update</p>
                    </div>
                </section>

                <section className="news-detail-react-content">
                    <article className="news-card">
                        <h2>{post.title}</h2>
                        {post.image ? <img src={`/storage/${post.image}`} alt={post.title} /> : null}
                        <p className="meta">By {post.user?.name || 'Unknown user'} · {post.created_at}</p>
                        <p className="body">{post.body}</p>
                    </article>

                    <div className="rating-box">
                        <h4>Leave a Review</h4>
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

                    <div className="comment-card">
                        <h4>Comments</h4>
                        <form method="POST" action={`/news/${post.id}/comments`} className="comment-form">
                            <input type="hidden" name="_token" value={csrfToken} />
                            <textarea name="body" placeholder="Write a comment..." required />
                            <button type="submit">Post Comment</button>
                        </form>

                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((comment) => (
                                <div key={comment.id} className="comment-item">
                                    <div className="comment-head">
                                        <div>
                                            <p style={{ margin: '0 0 6px' }}><strong>{comment.user?.name || 'User'}</strong></p>
                                            <p style={{ margin: '0 0 6px' }}>{comment.body}</p>
                                            <small className="muted">{comment.created_at}</small>
                                        </div>

                                        {Number(comment.user_id) === Number(currentUserId) ? (
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

                                    {Number(comment.user_id) === Number(currentUserId) ? (
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
                            <p className="muted" style={{ margin: '14px 0 0' }}>No comments yet.</p>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}
