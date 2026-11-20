import React from 'react';

export default function EditPostApp({ post = {}, csrfToken = '' }) {
    const currentImage = post.image ? `/storage/${post.image}` : null;

    return (
        <>
            <style>{`
                .edit-post-react-wrap {
                    background: var(--bg);
                    color: var(--text);
                    font-family: var(--font-body);
                }
                .edit-post-react-wrap .hero-band {
                    background: var(--green);
                    color: white;
                    padding: 38px 0 32px;
                }
                .edit-post-react-wrap .inner {
                    max-width: 1180px;
                    margin: 0 auto;
                    padding: 0 24px;
                }
                .edit-post-react-wrap .eyebrow {
                    color: var(--gold-light);
                    font-size: 0.78rem;
                    font-weight: 800;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                }
                .edit-post-react-wrap h1 {
                    margin: 10px 0 0;
                    font-size: clamp(2.3rem, 4vw, 3.2rem);
                    font-weight: 800;
                    font-family: var(--font-heading);
                }
                .edit-post-react-wrap .content {
                    max-width: 920px;
                    margin: 0 auto;
                    padding: 36px 24px 80px;
                }
                .edit-post-react-wrap .panel {
                    background: var(--surface);
                    border: 1px solid rgba(var(--green-rgb), 0.08);
                    border-radius: 18px;
                    box-shadow: 0 14px 32px rgba(0,0,0,0.05);
                    padding: 28px;
                }
                .edit-post-react-wrap .form-grid {
                    display: grid;
                    gap: 18px;
                }
                .edit-post-react-wrap .label {
                    display: block;
                    font-size: 0.83rem;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: var(--green-ink);
                    font-weight: 800;
                    margin-bottom: 8px;
                }
                .edit-post-react-wrap .field,
                .edit-post-react-wrap .file-field {
                    width: 100%;
                    border: 1px solid var(--border);
                    background: var(--blue-soft);
                    border-radius: 10px;
                    padding: 12px 14px;
                    color: var(--text);
                    font: inherit;
                }
                .edit-post-react-wrap textarea.field {
                    min-height: 180px;
                    resize: vertical;
                }
                .edit-post-react-wrap .image-box {
                    background: var(--bg);
                    border: 1px dashed rgba(var(--green-rgb), 0.22);
                    border-radius: 12px;
                    padding: 16px;
                    color: var(--text-muted);
                }
                .edit-post-react-wrap .image-box img {
                    max-height: 180px;
                    width: auto;
                    display: block;
                    border-radius: 12px;
                    margin-top: 12px;
                }
                .edit-post-react-wrap .checkbox-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: var(--text-muted);
                    font-weight: 600;
                }
                .edit-post-react-wrap .actions {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                    margin-top: 8px;
                }
                .edit-post-react-wrap .btn-gold {
                    background: var(--gold-light);
                    color: var(--on-gold);
                    border: none;
                    border-radius: 10px;
                    padding: 12px 20px;
                    font-weight: 800;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                }
                .edit-post-react-wrap .btn-light {
                    background: var(--green-soft);
                    color: var(--green-ink);
                    border: 1px solid rgba(var(--green-rgb), 0.1);
                    border-radius: 10px;
                    padding: 12px 20px;
                    font-weight: 800;
                    text-decoration: none;
                    display: inline-block;
                }
                .edit-post-react-wrap .btn-danger {
                    background: var(--surface);
                    color: var(--danger);
                    border: 1px solid var(--danger-border);
                    border-radius: 10px;
                    padding: 12px 20px;
                    font-weight: 800;
                    text-decoration: none;
                    display: inline-block;
                }
                .edit-post-react-wrap .modal-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(17, 24, 39, 0.45);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 20;
                    padding: 20px;
                }
                .edit-post-react-wrap .modal-card {
                    width: min(460px, 100%);
                    background: var(--surface);
                    border-radius: 18px;
                    box-shadow: 0 22px 48px rgba(0,0,0,0.18);
                    padding: 28px 24px 20px;
                }
                .edit-post-react-wrap .modal-title {
                    margin: 0 0 12px;
                    color: var(--green-ink);
                    font-size: 1.7rem;
                }
                .edit-post-react-wrap .modal-text {
                    margin: 0;
                    color: var(--text-muted);
                    line-height: 1.7;
                }
                .edit-post-react-wrap .modal-actions {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                    margin-top: 20px;
                    flex-wrap: wrap;
                }
            `}</style>

            <div className="edit-post-react-wrap">
                <section className="hero-band">
                    <div className="inner">
                        <div className="eyebrow">Edit Update</div>
                        <h1>Edit Post</h1>
                    </div>
                </section>

                <section className="content">
                    <div className="panel animate-fade-in-up">
                        <form action={`/edit-post/${post.id}`} method="POST" encType="multipart/form-data" className="form-grid">
                            <input type="hidden" name="_token" value={csrfToken} />
                            <input type="hidden" name="_method" value="PUT" />

                            <div>
                                <label className="label" htmlFor="title">Post Title</label>
                                <input id="title" className="field" type="text" name="title" defaultValue={post.title} placeholder="Post title" required />
                            </div>

                            <div>
                                <label className="label" htmlFor="body">Content</label>
                                <textarea id="body" className="field" name="body" defaultValue={post.body} placeholder="Write market news..." required />
                            </div>

                            {currentImage ? (
                                <div className="image-box">
                                    <strong>Current image:</strong>
                                    <img src={currentImage} alt={post.title} />
                                </div>
                            ) : null}

                            <div>
                                <label className="label" htmlFor="image">Replace image</label>
                                <input id="image" className="file-field" type="file" name="image" accept="image/*" />
                            </div>

                            <label className="checkbox-row" htmlFor="isTrending">
                                <input id="isTrending" type="checkbox" name="isTrending" value="1" defaultChecked={Boolean(post.isTrending)} />
                                <span>Mark as Trending</span>
                            </label>

                            <div className="actions">
                                <button type="submit" className="btn-gold">Save Changes</button>
                                <a href="/dashboard" className="btn-light">Cancel</a>
                                <button type="button" className="btn-danger" onClick={() => document.getElementById('delete-modal').style.display = 'flex'}>Delete Post</button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>

            <div id="delete-modal" style={{ display: 'none' }} className="modal-backdrop">
                <div className="modal-card animate-fade-in-up">
                    <h3 className="modal-title">Delete Post</h3>
                    <p className="modal-text">Are you sure you want to delete this post? This action cannot be undone.</p>
                    <div className="modal-actions">
                        <button type="button" className="btn-light" onClick={() => document.getElementById('delete-modal').style.display = 'none'}>Cancel</button>
                        <form action={`/delete-post/${post.id}`} method="POST">
                            <input type="hidden" name="_token" value={csrfToken} />
                            <input type="hidden" name="_method" value="DELETE" />
                            <button type="submit" className="btn-danger">Yes, Delete</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
