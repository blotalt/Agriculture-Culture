import React, { useState } from 'react';

// The fields each layout's items have, in display order.
const ITEM_FIELDS = {
    cards: [
        { key: 'icon', label: 'Icon', placeholder: '🌾', width: 80, maxLength: 16 },
        { key: 'title', label: 'Title', placeholder: 'Fact headline', required: true, maxLength: 255 },
        { key: 'text', label: 'Front', placeholder: 'The fact in one or two sentences, with a citation like [1]', required: true, multiline: true, maxLength: 2000 },
        { key: 'details', label: 'Back (optional)', placeholder: 'More detail. When filled in, the card flips on hover to show this.', multiline: true, maxLength: 2000 },
        {
            key: 'part',
            label: 'Diagram part (optional)',
            width: 170,
            // Picking a part shows the rice plant and grain diagram above the cards, with a numbered pin for this card.
            options: [['', '— none —'], ['root', 'Roots'], ['stem', 'Stem / air channels'], ['tiller', 'Tillers'], ['leaf', 'Leaves'], ['panicle', 'Panicle'], ['flower', 'Flower'], ['hull', 'Grain: hull'], ['bran', 'Grain: bran'], ['germ', 'Grain: germ'], ['endosperm', 'Grain: endosperm']],
        },
    ],
    timeline: [
        { key: 'phase', label: 'Phase', placeholder: 'Vegetative', maxLength: 100 },
        { key: 'days', label: 'When', placeholder: 'Day 0–5', maxLength: 100 },
        { key: 'title', label: 'Stage', placeholder: 'Germination', required: true, maxLength: 255 },
        { key: 'text', label: 'Text', placeholder: 'What happens in this stage', required: true, multiline: true, maxLength: 2000 },
    ],
};

const LAYOUT_HELP = {
    article: 'Text only. Write the lesson in the body.',
    cards: 'The body, then a grid of fact cards.',
    timeline: 'The body, then numbered stages on a timeline with growing rice drawings.',
};

// A new row starts empty, or on the first option for a dropdown.
const emptyRow = (fields) => Object.fromEntries(fields.map((field) => [field.key, field.options ? field.options[0][0] : '']));

// An editable list of rows (items or sources) submitted as name[index][field].
function RowEditor({ name, rows, setRows, fields, addLabel, numbered = false }) {
    const update = (index, key, value) => setRows(rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
    const move = (index, step) => {
        const next = [...rows];
        [next[index], next[index + step]] = [next[index + step], next[index]];
        setRows(next);
    };

    return (
        <div className="rows">
            {rows.map((row, index) => (
                // Index keys are fine here: inputs are controlled, so their values follow the rows.
                <div className="row-card" key={index}>
                    <div className="row-head">
                        <span className="row-number">{numbered ? `[${index + 1}]` : index + 1}</span>
                        <div className="row-tools">
                            <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up">↑</button>
                            <button type="button" onClick={() => move(index, 1)} disabled={index === rows.length - 1} aria-label="Move down">↓</button>
                            <button type="button" className="remove" onClick={() => setRows(rows.filter((_, i) => i !== index))}>Remove</button>
                        </div>
                    </div>
                    <div className="row-fields">
                        {fields.map((field) => {
                            const props = {
                                className: 'field',
                                name: `${name}[${index}][${field.key}]`,
                                value: row[field.key] ?? '',
                                onChange: (event) => update(index, field.key, event.target.value),
                                placeholder: field.placeholder,
                                required: field.required,
                                maxLength: field.maxLength,
                                type: field.type,
                            };
                            let input = <input {...props} />;
                            if (field.multiline) input = <textarea rows={3} {...props} />;
                            if (field.options) {
                                input = (
                                    <select {...props}>
                                        {field.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                    </select>
                                );
                            }
                            return (
                                <label key={field.key} className={field.multiline ? 'wide' : ''} style={field.width ? { width: field.width, flex: 'none' } : null}>
                                    {field.label}
                                    {input}
                                </label>
                            );
                        })}
                    </div>
                </div>
            ))}
            <button type="button" className="btn secondary" onClick={() => setRows([...rows, emptyRow(fields)])}>{addLabel}</button>
        </div>
    );
}

const SOURCE_FIELDS = [
    { key: 'title', label: 'Title', placeholder: 'Title of the article or page', required: true, maxLength: 255 },
    { key: 'publisher', label: 'Publisher', placeholder: 'e.g. FAO, May 2025', maxLength: 255 },
    { key: 'url', label: 'Link', placeholder: 'https://…', required: true, type: 'url', maxLength: 2048 },
];

// One multiple-choice question per row. The controller turns the four choice boxes into a list.
const QUIZ_FIELDS = [
    { key: 'question', label: 'Question', placeholder: 'e.g. How many souls does a rice plant have in Khmer tradition?', required: true, multiline: true, maxLength: 300 },
    { key: 'choice1', label: 'Choice 1', required: true, maxLength: 200 },
    { key: 'choice2', label: 'Choice 2', required: true, maxLength: 200 },
    { key: 'choice3', label: 'Choice 3 (optional)', maxLength: 200 },
    { key: 'choice4', label: 'Choice 4 (optional)', maxLength: 200 },
    { key: 'answer', label: 'Right answer', width: 170, options: [1, 2, 3, 4].map((n) => [String(n), `Choice ${n}`]) },
    { key: 'explain', label: 'Explanation (optional)', placeholder: 'Shown after the question is answered, with a link to this lesson.', multiline: true, maxLength: 1000 },
];

export default function LessonFormApp({ lesson = {}, topics = [], levels = [], layouts = [], csrfToken = '' }) {
    const isEdit = Boolean(lesson.id);
    const [layout, setLayout] = useState(lesson.layout || 'article');
    const [items, setItems] = useState(lesson.items || []);
    const [quiz, setQuiz] = useState(lesson.quiz || []);
    const [sources, setSources] = useState(lesson.sources || []);
    const itemFields = ITEM_FIELDS[layout];
    const action = isEdit ? `/admin/learn/lessons/${lesson.id}` : '/admin/learn/lessons';

    return (
        <>
            <style>{`
                .lesson-form-react-wrap { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }
                .lesson-form-react-wrap .shell { max-width: 980px; margin: 0 auto; padding: 42px 24px 80px; }
                .lesson-form-react-wrap .back { display: inline-block; color: var(--text-muted); text-decoration: none; font-size: .9rem; margin-bottom: 18px; }
                .lesson-form-react-wrap .card { background: var(--surface); border: 1px solid rgba(var(--green-rgb), .08); border-radius: 20px; box-shadow: 0 16px 36px rgba(0,0,0,.05); padding: 28px; margin-bottom: 22px; }
                .lesson-form-react-wrap h1 { margin: 0 0 6px; color: var(--green-ink); font-size: clamp(2rem, 4vw, 2.6rem); font-family: var(--font-heading); }
                .lesson-form-react-wrap h2 { margin: 0 0 6px; color: var(--green-ink); font-size: 1.4rem; font-family: var(--font-heading); }
                .lesson-form-react-wrap .help { margin: 0 0 18px; color: var(--text-muted); line-height: 1.6; font-size: .92rem; }
                .lesson-form-react-wrap code { background: var(--gold-soft); color: var(--gold-dark); border-radius: 4px; padding: 0 4px; }
                .lesson-form-react-wrap .grid { display: grid; gap: 16px; }
                .lesson-form-react-wrap .two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
                .lesson-form-react-wrap .three { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
                .lesson-form-react-wrap label { display: grid; gap: 7px; color: var(--green-ink); font-size: .78rem; letter-spacing: .07em; text-transform: uppercase; font-weight: 800; }
                .lesson-form-react-wrap .field { display: block; width: 100%; background: var(--blue-soft); border: 1px solid var(--border); border-radius: 10px; padding: 11px 13px; color: var(--text); font: inherit; text-transform: none; letter-spacing: normal; font-weight: 400; }
                .lesson-form-react-wrap textarea.field { resize: vertical; line-height: 1.6; }
                .lesson-form-react-wrap .check { display: flex; align-items: center; gap: 10px; text-transform: none; letter-spacing: normal; font-size: 1rem; }
                .lesson-form-react-wrap .check input { width: 18px; height: 18px; }
                .lesson-form-react-wrap .rows { display: grid; gap: 14px; }
                .lesson-form-react-wrap .row-card { background: var(--bg); border: 1px solid var(--border); border-radius: 14px; padding: 14px; }
                .lesson-form-react-wrap .row-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
                .lesson-form-react-wrap .row-number { font-weight: 800; color: var(--gold-dark); }
                .lesson-form-react-wrap .row-tools { display: flex; gap: 6px; }
                .lesson-form-react-wrap .row-tools button { border: 1px solid var(--border); background: var(--surface); color: var(--text); border-radius: 8px; padding: 4px 10px; cursor: pointer; font: inherit; font-size: .85rem; }
                .lesson-form-react-wrap .row-tools button:disabled { opacity: .4; cursor: default; }
                .lesson-form-react-wrap .row-tools .remove { color: var(--danger); border-color: var(--danger-border); }
                .lesson-form-react-wrap .row-fields { display: flex; flex-wrap: wrap; gap: 12px; }
                .lesson-form-react-wrap .row-fields label { flex: 1; min-width: 160px; }
                .lesson-form-react-wrap .row-fields label.wide { flex-basis: 100%; }
                .lesson-form-react-wrap .btn { border: none; border-radius: 10px; padding: 12px 22px; font-weight: 800; cursor: pointer; text-decoration: none; display: inline-block; font-family: inherit; justify-self: start; }
                .lesson-form-react-wrap .btn.primary { background: var(--green); color: #fff; }
                .lesson-form-react-wrap .btn.secondary { background: var(--green-soft); color: var(--green-ink); }
                .lesson-form-react-wrap .actions { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
                @media (max-width: 720px) {
                    .lesson-form-react-wrap .two, .lesson-form-react-wrap .three { grid-template-columns: 1fr; }
                    .lesson-form-react-wrap .card { padding: 22px 18px; }
                }
            `}</style>

            <div className="lesson-form-react-wrap">
                <div className="shell">
                    <a href="/admin/learn" className="back">← Back to Learn Content</a>

                    <form action={action} method="POST">
                        <input type="hidden" name="_token" value={csrfToken} />
                        {isEdit ? <input type="hidden" name="_method" value="PUT" /> : null}

                        <div className="card animate-fade-in-up">
                            <h1>{isEdit ? 'Edit Lesson' : 'New Lesson'}</h1>
                            <p className="help">
                                Cite a source anywhere in the text by writing its number in brackets, like <code>[1]</code>. It becomes a link to that source on the lesson page.
                                Published lessons need at least one source.
                            </p>

                            <div className="grid">
                                <div className="two">
                                    <label>Topic
                                        <select className="field" name="topic_id" defaultValue={lesson.topic_id ?? ''} required>
                                            {topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.title}</option>)}
                                        </select>
                                    </label>
                                    <label>Title
                                        <input className="field" name="title" defaultValue={lesson.title} required maxLength={255} placeholder="e.g. Pests and How to Stop Them" />
                                    </label>
                                </div>

                                <label>Summary
                                    <input className="field" name="summary" defaultValue={lesson.summary} maxLength={500} placeholder="One sentence shown in lesson lists" />
                                </label>

                                <label>Body
                                    <textarea className="field" name="body" rows={8} defaultValue={lesson.body} maxLength={20000} placeholder="Leave an empty line between paragraphs." />
                                </label>

                                <div className="three">
                                    <label>Layout
                                        <select className="field" name="layout" value={layout} onChange={(event) => setLayout(event.target.value)}>
                                            {layouts.map((value) => <option key={value} value={value}>{value}</option>)}
                                        </select>
                                    </label>
                                    <label>Level
                                        <select className="field" name="level" defaultValue={lesson.level}>
                                            {levels.map((value) => <option key={value} value={value}>{value}</option>)}
                                        </select>
                                    </label>
                                    <label>Order in topic
                                        <input className="field" type="number" min="0" max="1000" name="position" defaultValue={lesson.position ?? ''} placeholder="Last" />
                                    </label>
                                </div>
                                <p className="help" style={{ margin: 0 }}>{LAYOUT_HELP[layout]}</p>

                                <div className="two">
                                    <label>URL slug
                                        <input className="field" name="slug" defaultValue={lesson.slug} maxLength={255} pattern="[A-Za-z0-9_-]+" placeholder="Left empty, it is made from the title" />
                                    </label>
                                    <label className="check" style={{ alignSelf: 'end', paddingBottom: 10 }}>
                                        <input type="checkbox" name="published" value="1" defaultChecked={lesson.published} />
                                        Published (visible to visitors)
                                    </label>
                                </div>
                            </div>
                        </div>

                        {itemFields ? (
                            <div className="card">
                                <h2>{layout === 'cards' ? 'Fact cards' : 'Timeline stages'}</h2>
                                <p className="help">{layout === 'cards' ? 'Each card is one fact.' : 'Stages appear left to right in this order. Stages that share a phase are grouped under one label.'}</p>
                                <RowEditor name="items" rows={items} setRows={setItems} fields={itemFields} addLabel={layout === 'cards' ? '+ Add card' : '+ Add stage'} />
                            </div>
                        ) : null}

                        <div className="card">
                            <h2>Quiz questions</h2>
                            <p className="help">
                                The quick quiz on the Learn page picks 5 questions at random from every published lesson and shuffles their choices,
                                so the right answer can go in any box. After each answer it shows the explanation and links back to this lesson.
                            </p>
                            <RowEditor name="quiz" rows={quiz} setRows={setQuiz} fields={QUIZ_FIELDS} addLabel="+ Add question" />
                        </div>

                        <div className="card">
                            <h2>Sources</h2>
                            <p className="help">The number next to each source is what you write in the text to cite it. Moving a source changes its number.</p>
                            <RowEditor name="sources" rows={sources} setRows={setSources} fields={SOURCE_FIELDS} addLabel="+ Add source" numbered />
                        </div>

                        <div className="actions">
                            <button type="submit" className="btn primary">{isEdit ? 'Save Changes' : 'Create Lesson'}</button>
                            <a href="/admin/learn" className="btn secondary">Cancel</a>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
