import React, { useState } from 'react';

const confirmSubmit = (message) => (event) => {
    if (!window.confirm(message)) event.preventDefault();
};

function Hidden({ csrfToken, method }) {
    return (
        <>
            <input type="hidden" name="_token" value={csrfToken} />
            {method ? <input type="hidden" name="_method" value={method} /> : null}
        </>
    );
}

// Create or edit a topic. Used inline on each topic card and for "New topic".
function TopicForm({ topic = null, csrfToken, onCancel }) {
    const action = topic ? `/admin/learn/topics/${topic.id}` : '/admin/learn/topics';

    return (
        <form className="topic-form" action={action} method="POST">
            <Hidden csrfToken={csrfToken} method={topic ? 'PUT' : null} />
            <div className="row">
                <label>Icon<input className="field" name="icon" defaultValue={topic?.icon ?? ''} maxLength={16} placeholder="🌾" style={{ width: 80 }} /></label>
                <label className="grow">Title<input className="field" name="title" defaultValue={topic?.title ?? ''} required maxLength={255} placeholder="e.g. Farming Practice" /></label>
                <label>Order<input className="field" type="number" min="0" name="position" defaultValue={topic?.position ?? ''} style={{ width: 90 }} /></label>
            </div>
            <label>Description<input className="field" name="description" defaultValue={topic?.description ?? ''} maxLength={500} placeholder="One sentence shown on the Learn page" /></label>
            <label>URL slug<input className="field" name="slug" defaultValue={topic?.slug ?? ''} maxLength={255} placeholder="Left empty, it is made from the title" pattern="[A-Za-z0-9_-]+" /></label>
            <div className="actions">
                <button type="submit" className="btn primary">{topic ? 'Save topic' : 'Create topic'}</button>
                {onCancel ? <button type="button" className="btn secondary" onClick={onCancel}>Cancel</button> : null}
            </div>
        </form>
    );
}

function TopicCard({ topic, csrfToken }) {
    const [editing, setEditing] = useState(false);

    return (
        <section className="topic-card animate-fade-in-up">
            <div className="topic-top">
                <div>
                    <h2>{topic.icon} {topic.title}</h2>
                    {topic.description ? <p className="muted">{topic.description}</p> : null}
                    <a className="small-link" href={`/learn/${topic.slug}`}>/learn/{topic.slug}</a>
                </div>
                <div className="actions">
                    <a className="btn primary" href={`/admin/learn/lessons/create?topic=${topic.id}`}>+ Add lesson</a>
                    <button type="button" className="btn secondary" onClick={() => setEditing(!editing)}>{editing ? 'Close' : 'Edit topic'}</button>
                    {topic.lessons.length === 0 ? (
                        <form action={`/admin/learn/topics/${topic.id}`} method="POST" onSubmit={confirmSubmit(`Delete the topic "${topic.title}"?`)}>
                            <Hidden csrfToken={csrfToken} method="DELETE" />
                            <button type="submit" className="btn danger">Delete</button>
                        </form>
                    ) : null}
                </div>
            </div>

            {editing ? <TopicForm topic={topic} csrfToken={csrfToken} onCancel={() => setEditing(false)} /> : null}

            {topic.lessons.length ? (
                <table>
                    <thead>
                        <tr><th>#</th><th>Lesson</th><th>Layout</th><th>Level</th><th>Sources</th><th>Status</th><th aria-label="Actions" /></tr>
                    </thead>
                    <tbody>
                        {topic.lessons.map((lesson, index) => (
                            <tr key={lesson.id}>
                                <td data-label="#">{index + 1}</td>
                                <td data-label="Lesson"><strong>{lesson.title}</strong></td>
                                <td data-label="Layout">{lesson.layout}</td>
                                <td data-label="Level">{lesson.level}</td>
                                <td data-label="Sources">{lesson.sources_count}</td>
                                <td data-label="Status"><span className={`badge ${lesson.published ? 'live' : 'draft'}`}>{lesson.published ? 'Published' : 'Draft'}</span></td>
                                <td className="row-actions">
                                    {lesson.published ? <a className="btn secondary" href={`/learn/${topic.slug}/${lesson.slug}`}>View</a> : null}
                                    <a className="btn secondary" href={`/admin/learn/lessons/${lesson.id}/edit`}>Edit</a>
                                    <form action={`/admin/learn/lessons/${lesson.id}`} method="POST" onSubmit={confirmSubmit(`Delete the lesson "${lesson.title}"? This cannot be undone.`)}>
                                        <Hidden csrfToken={csrfToken} method="DELETE" />
                                        <button type="submit" className="btn danger">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p className="muted">No lessons yet.</p>}
        </section>
    );
}

export default function LearnAdminApp({ topics = [], csrfToken = '' }) {
    const [addingTopic, setAddingTopic] = useState(topics.length === 0);
    const lessonCount = topics.reduce((total, topic) => total + topic.lessons.length, 0);

    return (
        <>
            <style>{`
                .learn-admin-react-wrap { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }
                .learn-admin-react-wrap .shell { max-width: 1100px; margin: 0 auto; padding: 42px 24px 80px; }
                .learn-admin-react-wrap .page-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; margin-bottom: 26px; }
                .learn-admin-react-wrap .eyebrow { font-size: .78rem; letter-spacing: .12em; text-transform: uppercase; font-weight: 800; color: var(--gold-dark); }
                .learn-admin-react-wrap h1 { margin: 6px 0 4px; font-family: var(--font-heading); color: var(--green-ink); font-size: clamp(2rem, 4vw, 2.6rem); }
                .learn-admin-react-wrap h2 { margin: 0 0 4px; font-family: var(--font-heading); color: var(--green-ink); font-size: 1.5rem; }
                .learn-admin-react-wrap .muted { color: var(--text-muted); margin: 0; }
                .learn-admin-react-wrap .small-link { color: var(--text-muted); font-size: .85rem; }
                .learn-admin-react-wrap .topic-card, .learn-admin-react-wrap .new-topic { background: var(--surface); border: 1px solid rgba(var(--green-rgb), .1); border-radius: 18px; box-shadow: 0 12px 28px rgba(0,0,0,.04); padding: 22px; margin-bottom: 22px; }
                .learn-admin-react-wrap .topic-top { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
                .learn-admin-react-wrap .actions, .learn-admin-react-wrap .row-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
                .learn-admin-react-wrap .row-actions { justify-content: flex-end; }
                .learn-admin-react-wrap form { margin: 0; }
                .learn-admin-react-wrap .btn { border: none; border-radius: 10px; padding: 9px 16px; font-weight: 800; font-size: .88rem; cursor: pointer; text-decoration: none; display: inline-block; font-family: inherit; }
                .learn-admin-react-wrap .btn.primary { background: var(--green); color: #fff; }
                .learn-admin-react-wrap .btn.secondary { background: var(--green-soft); color: var(--green-ink); }
                .learn-admin-react-wrap .btn.danger { background: var(--danger-soft); color: var(--danger); border: 1px solid var(--danger-border); }
                .learn-admin-react-wrap table { width: 100%; border-collapse: collapse; }
                .learn-admin-react-wrap th { background: var(--green-soft); color: var(--green-ink); font-size: .74rem; letter-spacing: .08em; text-transform: uppercase; text-align: left; padding: 10px 12px; }
                .learn-admin-react-wrap td { padding: 10px 12px; border-top: 1px solid var(--border); vertical-align: middle; }
                .learn-admin-react-wrap .badge { border-radius: 999px; padding: 3px 10px; font-size: .74rem; font-weight: 800; }
                .learn-admin-react-wrap .badge.live { background: var(--success-soft); color: var(--success); }
                .learn-admin-react-wrap .badge.draft { background: var(--gold-soft); color: var(--gold-dark); }
                .learn-admin-react-wrap .topic-form { display: grid; gap: 12px; background: var(--bg); border-radius: 14px; padding: 16px; margin-bottom: 16px; }
                .learn-admin-react-wrap .topic-form label { display: grid; gap: 6px; font-size: .78rem; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--green-ink); }
                .learn-admin-react-wrap .topic-form .row { display: flex; gap: 12px; flex-wrap: wrap; }
                .learn-admin-react-wrap .topic-form .grow { flex: 1; min-width: 200px; }
                .learn-admin-react-wrap .field { background: var(--blue-soft); border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; color: var(--text); font: inherit; text-transform: none; letter-spacing: normal; font-weight: 400; }
                @media (max-width: 760px) {
                    .learn-admin-react-wrap table, .learn-admin-react-wrap tbody, .learn-admin-react-wrap tr, .learn-admin-react-wrap td { display: block; }
                    .learn-admin-react-wrap thead { display: none; }
                    .learn-admin-react-wrap tr { border-top: 1px solid var(--border); padding: 8px 0; }
                    .learn-admin-react-wrap td { border: none; padding: 4px 0; }
                    .learn-admin-react-wrap td[data-label]::before { content: attr(data-label) ": "; font-weight: 800; color: var(--green-ink); }
                    .learn-admin-react-wrap .row-actions { justify-content: flex-start; padding-top: 8px; }
                }
            `}</style>

            <div className="learn-admin-react-wrap">
                <div className="shell">
                    <div className="page-head">
                        <div>
                            <div className="eyebrow">Admin · KhmerRice Academy</div>
                            <h1>Learn Content</h1>
                            <p className="muted">{topics.length} topics · {lessonCount} lessons. Drafts are hidden from visitors.</p>
                        </div>
                        <div className="actions">
                            <a className="btn secondary" href="/learn">View Learn section</a>
                            {topics.length ? <a className="btn primary" href="/admin/learn/lessons/create">+ New lesson</a> : null}
                        </div>
                    </div>

                    {topics.map((topic) => <TopicCard key={topic.id} topic={topic} csrfToken={csrfToken} />)}

                    <section className="new-topic">
                        {addingTopic ? (
                            <>
                                <h2>New topic</h2>
                                <p className="muted" style={{ marginBottom: 12 }}>{topics.length ? 'Topics group related lessons on the Learn page.' : 'Create a topic first, then add lessons to it.'}</p>
                                <TopicForm csrfToken={csrfToken} onCancel={topics.length ? () => setAddingTopic(false) : null} />
                            </>
                        ) : (
                            <button type="button" className="btn secondary" onClick={() => setAddingTopic(true)}>+ New topic</button>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}
