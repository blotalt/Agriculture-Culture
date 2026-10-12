import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const levelLabel = (level = 'beginner') => level.charAt(0).toUpperCase() + level.slice(1);

// Turn [n] markers in lesson text into links to the lesson's n-th source.
function Cited({ text = '' }) {
    const parts = text.split(/\[(\d+)\]/);
    return parts.map((part, index) => (index % 2 === 1 ? (
        <sup className="cite" key={index}>
            <a href={`#source-${part}`} aria-label={`Source ${part}`}>[{part}]</a>
        </sup>
    ) : part));
}

// A small rice plant drawing that gets taller and fuller with each of the 8 growth stages (0–7).
function RicePlant({ stage }) {
    const ground = 70;

    if (stage === 0) {
        return (
            <svg className="rice-plant" viewBox="0 0 48 76" aria-hidden="true">
                <line x1="6" y1={ground} x2="42" y2={ground} className="soil" />
                <ellipse cx="24" cy={ground - 5} rx="5" ry="3.2" className="grain ripe" />
                <path d={`M24 ${ground - 8} q1 -6 4 -8`} className="leaf" />
            </svg>
        );
    }

    const height = 12 + stage * 7;
    const top = ground - height;
    const stems = stage >= 2 ? [-6, 0, 6] : [0];
    const leafPairs = Math.min(stage, 3);
    const ripe = stage === 7;
    const hasHead = stage >= 5;

    return (
        <svg className="rice-plant" viewBox="0 0 48 76" aria-hidden="true">
            <line x1="6" y1={ground} x2="42" y2={ground} className="soil" />
            {stems.map((lean) => (
                <path key={lean} d={`M24 ${ground} Q${24 + lean / 2} ${ground - height / 2} ${24 + lean} ${top}`} className={`stem${ripe ? ' ripe' : ''}`} />
            ))}
            {Array.from({ length: leafPairs }, (_, i) => {
                const y = ground - 8 - i * (height / 4);
                return (
                    <g key={i} className={`leaf${ripe ? ' ripe' : ''}`}>
                        <path d={`M24 ${y} q-9 -3 -14 -11`} />
                        <path d={`M24 ${y} q9 -3 14 -11`} />
                    </g>
                );
            })}
            {stage === 4 ? (
                // Booting: the panicle is still hidden, so the stem top swells.
                <ellipse cx="24" cy={top + 6} rx="2.4" ry="5" className="grain" />
            ) : null}
            {hasHead ? stems.map((lean) => {
                const x = 24 + lean;
                const side = lean >= 0 ? 1 : -1;
                const droop = stage >= 6 ? 9 : 3;
                return (
                    <g key={`head${lean}`}>
                        <path d={`M${x} ${top} q${side * 6} 2 ${side * 7} ${droop + 6}`} className={`stem${ripe ? ' ripe' : ''}`} />
                        {[0, 1, 2].map((g) => (
                            <ellipse
                                key={g}
                                cx={x + side * (2 + g * 2.4)}
                                cy={top + 1 + g * ((droop + 4) / 3)}
                                rx="1.6"
                                ry="2.4"
                                className={`grain${ripe ? ' ripe' : ''}`}
                            />
                        ))}
                    </g>
                );
            }) : null}
        </svg>
    );
}

const canHover = () => window.matchMedia('(hover: hover)').matches;

// A fact card with details on its back. It flips on hover, on tap (touch screens), or with its button.
// The hidden face is inert, so its links and button can't be clicked or focused.
function FlipCard({ item, number = null, id }) {
    const [flipped, setFlipped] = useState(false);

    const onCardClick = (event) => {
        if (canHover() || event.target.closest('a, button')) return;
        setFlipped(!flipped);
    };

    return (
        <div
            id={id}
            className={`flip-card animate-fade-in-up hover-lift${flipped ? ' is-flipped' : ''}`}
            onMouseEnter={() => canHover() && setFlipped(true)}
            onMouseLeave={() => canHover() && setFlipped(false)}
            onClick={onCardClick}
        >
            <div className="flip-inner">
                <div className="flip-face fact-card" inert={flipped}>
                    {item.icon ? <div className="fact-icon" aria-hidden="true">{item.icon}</div> : null}
                    <h4>{number ? <span className="part-no">{number}</span> : null}{item.title}</h4>
                    <p><Cited text={item.text} /></p>
                    <button type="button" className="flip-toggle" onClick={() => setFlipped(true)} aria-label={`More about: ${item.title}`}>
                        More detail ↻
                    </button>
                </div>
                <div className="flip-face flip-back" inert={!flipped}>
                    <div className="flip-back-title">{number ? `${number}. ` : ''}{item.icon ? `${item.icon} ` : ''}{item.title}</div>
                    <p><Cited text={item.details} /></p>
                    <button type="button" className="flip-toggle" onClick={() => setFlipped(false)}>↺ Back</button>
                </div>
            </div>
        </div>
    );
}

function FactCards({ items, pins = [] }) {
    return (
        <div className="fact-grid">
            {items.map((item) => {
                // Cards on the diagram carry its pin number, and an id the pins link to.
                const number = pins.find((pin) => pin.item === item)?.number ?? null;
                const id = number ? `part-${item.part}` : undefined;

                return item.details ? <FlipCard item={item} number={number} id={id} key={item.title} /> : (
                    <div id={id} className="fact-card animate-fade-in-up hover-lift" key={item.title}>
                        {item.icon ? <div className="fact-icon" aria-hidden="true">{item.icon}</div> : null}
                        <h4>{number ? <span className="part-no">{number}</span> : null}{item.title}</h4>
                        <p><Cited text={item.text} /></p>
                    </div>
                );
            })}
        </div>
    );
}

// Each diagram part's pin, and the point on the drawing its leader line runs to (in the 620×340 drawing).
const DIAGRAM_PINS = {
    root: { pin: [256, 306], to: [218, 300] },
    stem: { pin: [22, 238], to: [36, 254] },
    tiller: { pin: [112, 222], to: [156, 228] },
    leaf: { pin: [302, 166], to: [256, 146] },
    panicle: { pin: [270, 52], to: [240, 68] },
    flower: { pin: [292, 108], to: [262, 116] },
    hull: { pin: [478, 82], to: [478, 116] },
    bran: { pin: [604, 210], to: [566, 176] },
    germ: { pin: [376, 246], to: [396, 206] },
    endosperm: { pin: [506, 262], to: [506, 196] },
};

// A cards lesson's items that point at a diagram part, numbered in card order.
const diagramPins = (lesson) => (lesson.layout === 'cards' ? lesson.items : [])
    .filter((item) => DIAGRAM_PINS[item.part])
    .map((item, index) => ({ item, part: item.part, title: item.title, number: index + 1 }));

// A rice plant in a flooded field, with its stem cut across to show the air channels, beside one grain cut open.
// Numbered pins mark the parts the cards explain. They link to the cards, or turn the book to the card's page.
function RiceDiagram({ pins, onPick = null }) {
    const pick = (event, part) => {
        if (!onPick) return;
        event.preventDefault();
        onPick(part);
    };
    const airChannels = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);

    return (
        <figure className="rice-diagram">
            <svg viewBox="0 0 620 340" role="img" aria-label="A rice plant growing in a flooded field, and a rice grain cut open lengthways">
                <text className="caption" x="160" y="20" textAnchor="middle">The plant</text>
                <text className="caption" x="478" y="20" textAnchor="middle">One grain, cut open</text>

                {/* The field: standing water over soft soil */}
                <rect className="soil" x="8" y="244" width="324" height="88" rx="10" />
                <rect className="water" x="8" y="198" width="324" height="46" />
                <path className="water-line" d="M8 198 q20 -4 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" />

                <g className="roots">
                    {[-58, -44, -28, -12, 4, 20, 36, 52].map((dx, i) => (
                        <path key={dx} d={`M166 244 q${dx * 0.3} ${24 + (i % 3) * 8} ${dx} ${44 + (i % 4) * 11}`} />
                    ))}
                </g>

                {/* Tillers (stems), leaves and the drooping heads of grain */}
                <g className="leaves">
                    <path d="M168 206 C140 182 110 172 82 178 C110 166 142 170 168 198 Z" />
                    <path d="M170 160 C200 142 236 138 270 152 C236 132 198 136 170 152 Z" />
                    <path d="M171 116 C150 98 126 86 100 84 C126 78 154 90 171 108 Z" />
                    <path d="M150 156 C126 142 102 138 76 146 C102 130 128 134 150 148 Z" />
                    <path d="M194 176 C222 166 250 170 276 188 C250 160 222 158 194 168 Z" />
                </g>
                <g className="stems">
                    <path d="M166 244 C168 180 170 120 172 64" />
                    <path d="M162 244 C150 200 136 150 122 104" />
                    <path d="M170 244 C184 200 198 150 212 112" />
                    <path d="M158 244 C150 210 148 180 150 140" />
                </g>
                <g className="nodes">
                    <circle cx="168" cy="206" r="2.8" />
                    <circle cx="170" cy="160" r="2.8" />
                    <circle cx="171" cy="116" r="2.8" />
                </g>
                <g className="panicle">
                    <path d="M172 64 C186 42 214 44 238 70 C246 80 250 92 252 102" />
                    <path d="M204 50 C214 58 220 70 222 86" />
                    <path d="M226 60 C236 70 240 84 238 98" />
                    {[[184, 52], [196, 47], [210, 49], [224, 56], [234, 66], [242, 78], [247, 90], [216, 70], [221, 81], [235, 86], [237, 97]].map(([x, y], i) => (
                        <ellipse key={i} cx={x} cy={y} rx="3.4" ry="5.6" transform={`rotate(${30 + i * 6} ${x} ${y})`} />
                    ))}
                    <path d="M122 104 C112 86 98 82 86 92" />
                    {[[116, 93], [108, 87], [99, 85], [90, 88]].map(([x, y], i) => (
                        <ellipse key={i} cx={x} cy={y} rx="3" ry="5" transform={`rotate(-40 ${x} ${y})`} />
                    ))}
                </g>
                {/* One flower, open, with its six stamens hanging out */}
                <g className="flower">
                    {[-10, -6, -2, 2, 6, 10].map((dx) => (
                        <g key={dx}>
                            <line x1="254" y1="112" x2={254 + dx} y2="124" />
                            <ellipse cx={254 + dx} cy="126" rx="1.6" ry="2.6" />
                        </g>
                    ))}
                    <ellipse cx="254" cy="106" rx="5" ry="8" transform="rotate(16 254 106)" />
                </g>

                {/* The stem cut across: a ring of air channels */}
                <g className="inset">
                    <line className="inset-link" x1="88" y1="268" x2="164" y2="222" />
                    <circle className="inset-ring" cx="58" cy="284" r="34" />
                    {airChannels.map((angle) => {
                        const x = 58 + Math.cos(angle) * 20;
                        const y = 284 + Math.sin(angle) * 20;
                        return <ellipse key={angle} className="air" cx={x} cy={y} rx="7" ry="5" transform={`rotate(${(angle * 180) / Math.PI} ${x} ${y})`} />;
                    })}
                    <circle className="air" cx="58" cy="284" r="7" />
                </g>

                {/* One grain cut open lengthways: hull, bran, the starchy endosperm and the germ at one end */}
                <g className="grain">
                    <ellipse className="hull" cx="478" cy="170" rx="104" ry="58" />
                    <ellipse className="bran" cx="480" cy="170" rx="92" ry="48" />
                    <ellipse className="endosperm" cx="482" cy="170" rx="82" ry="38" />
                    <ellipse className="germ" cx="402" cy="186" rx="13" ry="19" transform="rotate(-24 402 186)" />
                </g>

                {pins.map(({ part, title, number }) => {
                    const { pin: [x, y], to: [toX, toY] } = DIAGRAM_PINS[part];
                    return (
                        <a key={`${part}-${number}`} className="pin" href={`#part-${part}`} onClick={(event) => pick(event, part)} aria-label={`${number}. ${title}`}>
                            <title>{title}</title>
                            <line className="pin-line" x1={x} y1={y} x2={toX} y2={toY} />
                            <circle className="pin-dot" cx={toX} cy={toY} r="2.6" />
                            <circle className="pin-badge" cx={x} cy={y} r="12" />
                            <text x={x} y={y} textAnchor="middle" dominantBaseline="central">{number}</text>
                        </a>
                    );
                })}
            </svg>
            <figcaption>
                <ol className="diagram-key">
                    {pins.map(({ part, title, number }) => (
                        <li key={`${part}-${number}`}>
                            <a href={`#part-${part}`} onClick={(event) => pick(event, part)}>
                                <span className="part-no">{number}</span>{title}
                            </a>
                        </li>
                    ))}
                </ol>
            </figcaption>
        </figure>
    );
}

// Spreads the drawings over the 8 plant stages, however many steps a timeline has.
const plantStage = (index, count) => (count > 1 ? Math.round((index * 7) / (count - 1)) : 7);

function Timeline({ items }) {
    // Group consecutive stages that share a phase, for the phase bar above the timeline.
    const phases = items.reduce((groups, item) => {
        const last = groups[groups.length - 1];
        if (last && last.name === item.phase) last.span += 1;
        else groups.push({ name: item.phase, span: 1 });
        return groups;
    }, []);
    const phaseClass = (name = '') => `phase-${phases.findIndex((phase) => phase.name === name)}`;
    const columns = { gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` };

    return (
        <>
            <div className="phase-bar" style={columns} aria-hidden="true">
                {phases.map((phase) => (
                    <div key={phase.name} className={`phase-label ${phaseClass(phase.name)}`} style={{ gridColumn: `span ${phase.span}` }}>{phase.name}</div>
                ))}
            </div>
            <ol className="growth-timeline" style={columns}>
                {items.map((item, index) => (
                    <li className="growth-step animate-fade-in-up hover-lift" key={item.title}>
                        <RicePlant stage={plantStage(index, items.length)} />
                        <div className="growth-dot">{index + 1}</div>
                        <div className="growth-text">
                            <div className="growth-days">
                                {item.phase ? <span className="growth-phase-inline">{item.phase} · </span> : null}{item.days}
                            </div>
                            <h4>{item.title}</h4>
                            <p><Cited text={item.text} /></p>
                        </div>
                    </li>
                ))}
            </ol>
        </>
    );
}

// Admins get a shortcut to the matching editor screen.
const isAdmin = () => document.body.dataset.isAdmin === 'true';

function Hero({ eyebrow, title, subtitle, crumbs = [], adminHref = null, adminLabel = 'Manage lessons' }) {
    return (
        <section className="hero-band">
            <div className="inner">
                {crumbs.length ? (
                    <nav className="crumbs" aria-label="Breadcrumb">
                        {crumbs.map((crumb) => (
                            <span key={crumb.href}><a href={crumb.href}>{crumb.label}</a> / </span>
                        ))}
                    </nav>
                ) : null}
                <div className="eyebrow">{eyebrow}</div>
                <h1>{title}</h1>
                {subtitle ? <p className="subtitle">{subtitle}</p> : null}
                {adminHref && isAdmin() ? <a className="admin-link" href={adminHref}>{adminLabel}</a> : null}
            </div>
        </section>
    );
}

function LessonList({ topic }) {
    if (!topic.lessons.length) {
        return <p className="empty">Lessons for this topic are coming soon.</p>;
    }

    return (
        <ol className="lesson-list">
            {topic.lessons.map((lesson, index) => (
                <li key={lesson.slug}>
                    <a className="lesson-link animate-fade-in-up" href={`/learn/${topic.slug}/${lesson.slug}`}>
                        <span className="lesson-number">{index + 1}</span>
                        <span>
                            <strong>{lesson.title}</strong>
                            {lesson.summary ? <span className="lesson-summary">{lesson.summary}</span> : null}
                        </span>
                        <span className="level-badge">{levelLabel(lesson.level)}</span>
                    </a>
                </li>
            ))}
        </ol>
    );
}

// [n] citations point at a lesson's sources, which the hub doesn't list, so they are left out there.
const withoutCitations = (text = '') => text.replace(/\[\d+\]/g, '');

const shuffle = (list) => {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

const QUIZ_LENGTH = 5;

// A round of random questions from every lesson, each with its choices in a random order.
const newRound = (pool) => shuffle(pool).slice(0, QUIZ_LENGTH).map((question) => ({
    ...question,
    options: shuffle(question.choices.map((text, index) => ({ text, correct: index === question.answer }))),
}));

const resultMessage = (score, total) => {
    if (score === total) return 'Perfect score! You know your rice. 🏆';
    if (score >= total / 2) return 'Nice work! 🌾';
    return 'Good try! Have another read and play again. 🌱';
};

// Used on the hub (questions from every lesson) and at the end of a lesson's book (its own questions).
function Quiz({ pool, onClose, closeLabel = 'Back to fun facts', doneLink = { href: '#topics', label: 'Start learning 📚' } }) {
    const [round, setRound] = useState(() => newRound(pool));
    const [step, setStep] = useState(0);
    const [picked, setPicked] = useState(null);
    const [score, setScore] = useState(0);
    const headingRef = useRef(null);
    const nextRef = useRef(null);

    // Keyboard and screen reader users land on each new question, then on the Next button once they answer.
    useEffect(() => { headingRef.current?.focus(); }, [step, round]);
    useEffect(() => { if (picked !== null) nextRef.current?.focus(); }, [picked]);

    const restart = () => {
        setRound(newRound(pool));
        setStep(0);
        setPicked(null);
        setScore(0);
    };

    if (step >= round.length) {
        return (
            <div className="quiz-result">
                <div className="eyebrow">Quick quiz</div>
                <h2 ref={headingRef} tabIndex={-1}>You got {score} of {round.length}</h2>
                <p>{resultMessage(score, round.length)}</p>
                <div className="spot-actions">
                    <button type="button" className="spot-btn gold" onClick={restart}>Play again ↻</button>
                    {doneLink ? <a className="spot-btn green" href={doneLink.href}>{doneLink.label}</a> : null}
                    <button type="button" className="text-btn" onClick={onClose}>{closeLabel}</button>
                </div>
            </div>
        );
    }

    const question = round[step];
    const answered = picked !== null;
    const pick = (index) => {
        if (answered) return;
        setPicked(index);
        if (question.options[index].correct) setScore(score + 1);
    };
    const optionClass = (option, index) => {
        if (!answered) return 'quiz-option';
        if (option.correct) return 'quiz-option is-correct';
        return index === picked ? 'quiz-option is-wrong' : 'quiz-option is-faded';
    };

    return (
        <div className="quiz">
            <div className="spot-top">
                <div className="eyebrow">Quick quiz · Question {step + 1} of {round.length}</div>
                <button type="button" className="text-btn" onClick={onClose}>✕ Close</button>
            </div>
            <div className="quiz-progress" aria-hidden="true">
                <span style={{ width: `${((step + (answered ? 1 : 0)) / round.length) * 100}%` }} />
            </div>
            <h3 ref={headingRef} tabIndex={-1}>{question.question}</h3>
            <div className="quiz-options">
                {question.options.map((option, index) => (
                    <button type="button" key={option.text} className={optionClass(option, index)} onClick={() => pick(index)} disabled={answered}>
                        {option.text}
                    </button>
                ))}
            </div>
            <div aria-live="polite">
                {answered ? (
                    <div className={`quiz-feedback ${question.options[picked].correct ? 'good' : 'bad'}`}>
                        <strong>{question.options[picked].correct ? '✅ Correct!' : '❌ Not quite.'}</strong>
                        {question.explain ? <p>{withoutCitations(question.explain)}</p> : null}
                        {question.lesson ? <a href={question.lesson.href}>From the lesson: {question.lesson.title} →</a> : null}
                    </div>
                ) : null}
            </div>
            {answered ? (
                <button type="button" ref={nextRef} className="spot-btn green" onClick={() => { setStep(step + 1); setPicked(null); }}>
                    {step + 1 < round.length ? 'Next question →' : 'See my score'}
                </button>
            ) : null}
        </div>
    );
}

// The first thing on the Learn page: one fun fact, then a choice between a quick quiz and the lessons.
function FactSpotlight({ facts = [], quiz = [] }) {
    const [index, setIndex] = useState(() => Math.floor(Math.random() * facts.length));
    const [quizOpen, setQuizOpen] = useState(false);

    if (!facts.length && !quiz.length) return null;

    // Any other fact, never the same one twice in a row.
    const anotherFact = () => setIndex((index + 1 + Math.floor(Math.random() * (facts.length - 1))) % facts.length);
    const fact = facts[index];

    return (
        <section className="section spotlight" aria-label="Fun fact and quick quiz">
            <div className="spotlight-card animate-fade-in-up">
                {quizOpen ? <Quiz pool={quiz} onClose={() => setQuizOpen(false)} /> : (
                    <>
                        {fact ? (
                            <>
                                <div className="spot-top">
                                    <div className="eyebrow">Did you know?</div>
                                    {facts.length > 1 ? <button type="button" className="text-btn" onClick={anotherFact}>Another fact ↻</button> : null}
                                </div>
                                <div className="spot-fact" aria-live="polite">
                                    {fact.icon ? <div className="fact-icon" aria-hidden="true">{fact.icon}</div> : null}
                                    <div>
                                        <h2>{fact.title}</h2>
                                        <p>{withoutCitations(fact.text)}</p>
                                        <a className="spot-more" href={fact.lesson.href}>Read the full story →</a>
                                    </div>
                                </div>
                            </>
                        ) : null}
                        <div className="spot-actions">
                            {quiz.length ? (
                                <button type="button" className="spot-btn gold" onClick={() => setQuizOpen(true)}>Take the quick quiz 🎯</button>
                            ) : null}
                            <a className="spot-btn green" href="#topics">Start learning 📚</a>
                            {quiz.length ? <span className="spot-hint">{Math.min(QUIZ_LENGTH, quiz.length)} questions · about a minute</span> : null}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

function Hub({ topics = [], facts = [], quiz = [] }) {
    const lessonCount = topics.reduce((total, topic) => total + topic.lessons.length, 0);

    return (
        <>
            <Hero
                eyebrow="Learn"
                title="KhmerRice Academy"
                adminHref="/admin/learn"
                subtitle="Short, sourced lessons about Cambodian rice: its history and culture, how it grows, and the market around it. Free for students, farmers and anyone curious."
            />
            <FactSpotlight facts={facts} quiz={quiz} />
            <section className="section" id="topics">
                <div className="section-heading">
                    <div className="eyebrow" style={{ color: 'var(--gold)' }}>{topics.length} topics · {lessonCount} lessons</div>
                    <h2>Choose a Topic</h2>
                </div>
                {topics.length ? (
                    <div className="topic-grid">
                        {topics.map((topic) => (
                            <article className="topic-card animate-fade-in-up hover-lift" key={topic.slug}>
                                <a className="topic-head" href={`/learn/${topic.slug}`}>
                                    {topic.icon ? <span className="fact-icon" aria-hidden="true">{topic.icon}</span> : null}
                                    <span>
                                        <h3>{topic.title}</h3>
                                        {topic.description ? <p>{topic.description}</p> : null}
                                    </span>
                                </a>
                                <LessonList topic={topic} />
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="empty">No lessons have been published yet.</p>
                )}
            </section>
        </>
    );
}

function TopicPage({ topic }) {
    return (
        <>
            <Hero
                crumbs={[{ href: '/learn', label: 'Learn' }]}
                eyebrow={`${topic.lessons.length} lesson${topic.lessons.length === 1 ? '' : 's'}`}
                title={topic.title}
                subtitle={topic.description}
                adminHref="/admin/learn"
            />
            <section className="section narrow">
                <LessonList topic={topic} />
            </section>
        </>
    );
}

/*
|--------------------------------------------------------------------------
| Lesson book: the lesson laid out as pages that turn
|--------------------------------------------------------------------------
*/

// About how many characters of lesson text fit on one page.
const PAGE_TEXT = 700;
const SOURCES_PER_PAGE = 6;
const TURN_MS = 700;

// Splits lesson text into pages: whole paragraphs where they fit, long ones between sentences.
function textPages(body = '') {
    const pages = [];
    let page = [];
    let size = 0;
    const flush = () => {
        if (page.length) pages.push(page);
        page = [];
        size = 0;
    };

    body.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean).forEach((paragraph) => {
        let part = [];
        paragraph.split(/(?<=[.!?]["”’)]*(?:\[\d+\])*)\s+/).forEach((sentence) => {
            if (size + part.join(' ').length + sentence.length > PAGE_TEXT && (part.length || page.length)) {
                if (part.length) page.push(part.join(' '));
                flush();
                part = [];
            }
            part.push(sentence);
        });
        page.push(part.join(' '));
        size += part.join(' ').length;
    });
    flush();

    return pages;
}

// Every page of a lesson's book, in order. Pages with a chapter name are listed on the contents page.
function buildPages(lesson) {
    const pages = textPages(lesson.body || '').map((paragraphs, index) => ({
        kind: 'text', paragraphs, first: index === 0, chapter: index === 0 ? 'Introduction' : null,
    }));
    if (lesson.layout === 'cards') {
        const pins = diagramPins(lesson);
        if (pins.length) pages.push({ kind: 'diagram', pins, chapter: 'The diagram' });
        lesson.items.forEach((item) => pages.push({
            kind: 'fact', item, number: pins.find((pin) => pin.item === item)?.number ?? null, chapter: item.title,
        }));
    }
    if (lesson.layout === 'timeline') {
        lesson.items.forEach((item, index) => pages.push({
            kind: 'stage', item, number: index + 1, plant: plantStage(index, lesson.items.length), chapter: item.title,
        }));
    }
    for (let first = 0; first < lesson.sources.length; first += SOURCES_PER_PAGE) {
        pages.push({ kind: 'sources', first, chapter: first === 0 ? 'Sources' : null });
    }
    pages.push({ kind: 'end', chapter: (lesson.quiz || []).length ? 'Test yourself' : 'The end' });

    const chapters = pages.filter((page) => page.chapter).length;
    return [{ kind: 'title' }, ...(chapters >= 4 ? [{ kind: 'contents' }] : []), ...pages];
}

function useMedia(query) {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
    useEffect(() => {
        const list = window.matchMedia(query);
        const onChange = () => setMatches(list.matches);
        list.addEventListener('change', onChange);
        return () => list.removeEventListener('change', onChange);
    }, [query]);
    return matches;
}

function EndPage({ book }) {
    const { lesson, nextLink, goTo } = book;
    const quiz = lesson.quiz || [];
    const [quizOpen, setQuizOpen] = useState(false);

    if (quizOpen) {
        return <Quiz pool={quiz} onClose={() => setQuizOpen(false)} closeLabel="Back to the book" doneLink={nextLink} />;
    }

    return (
        <div className="end-page">
            <div className="end-mark" aria-hidden="true">🌾</div>
            <h3 className="page-heading">The End</h3>
            <p>You've finished <strong>{lesson.title}</strong>.</p>
            {quiz.length ? <p>How much do you remember? {Math.min(QUIZ_LENGTH, quiz.length)} quick questions.</p> : null}
            <div className="end-actions">
                {quiz.length ? <button type="button" className="spot-btn gold" onClick={() => setQuizOpen(true)}>Test yourself 🎯</button> : null}
                <a className="spot-btn green" href={nextLink.href}>{nextLink.label}</a>
                <button type="button" className="text-btn" onClick={() => goTo(0)}>↺ Read again</button>
            </div>
        </div>
    );
}

function BookPage({ page, index, side, book }) {
    if (!page) return <div className={`book-page ${side} is-blank`} />;

    const { topic, lesson, pages, goTo, highlight } = book;
    let content = null;

    if (page.kind === 'title') {
        content = (
            <div className="title-page">
                {topic.icon ? <div className="title-icon" aria-hidden="true">{topic.icon}</div> : null}
                <div className="eyebrow">{topic.title}</div>
                <h2>{lesson.title}</h2>
                {lesson.summary ? <p>{lesson.summary}</p> : null}
                <span className="level-badge">{levelLabel(lesson.level)}</span>
                <button type="button" className="turn-hint" onClick={book.forward}>Turn the page →</button>
            </div>
        );
    } else if (page.kind === 'contents') {
        content = (
            <>
                <h3 className="page-heading">Contents</h3>
                <ol className="contents-list">
                    {pages.map((entry, entryIndex) => (entry && entry.chapter ? (
                        <li key={entryIndex}>
                            <button type="button" onClick={() => goTo(entryIndex)}>
                                <span className="chapter-name">{entry.chapter}</span>
                                <span className="leader" aria-hidden="true" />
                                <span>{entryIndex + 1}</span>
                            </button>
                        </li>
                    ) : null))}
                </ol>
            </>
        );
    } else if (page.kind === 'text') {
        content = (
            <div className={page.first ? 'drop-cap' : ''}>
                {page.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}><Cited text={paragraph} /></p>)}
            </div>
        );
    } else if (page.kind === 'diagram') {
        const pageOf = (part) => pages.findIndex((entry) => entry && entry.kind === 'fact' && entry.item.part === part);
        content = (
            <>
                <h3 className="page-heading">The rice plant, part by part</h3>
                <RiceDiagram pins={page.pins} onPick={(part) => goTo(pageOf(part))} />
            </>
        );
    } else if (page.kind === 'fact') {
        content = (
            <>
                {page.item.icon ? <div className="page-icon" aria-hidden="true">{page.item.icon}</div> : null}
                <h3 className="page-heading">{page.number ? <span className="part-no">{page.number}</span> : null}{page.item.title}</h3>
                <p className="page-lead"><Cited text={page.item.text} /></p>
                {page.item.details ? <p><Cited text={page.item.details} /></p> : null}
            </>
        );
    } else if (page.kind === 'stage') {
        content = (
            <>
                <div className="stage-art"><RicePlant stage={page.plant} /></div>
                <div className="stage-meta">
                    Stage {page.number}{page.item.phase ? ` · ${page.item.phase}` : ''}{page.item.days ? ` · ${page.item.days}` : ''}
                </div>
                <h3 className="page-heading">{page.item.title}</h3>
                <p><Cited text={page.item.text} /></p>
            </>
        );
    } else if (page.kind === 'sources') {
        content = (
            <>
                <h3 className="page-heading">{page.first ? 'Sources (continued)' : 'Sources'}</h3>
                <ol className="book-sources" start={page.first + 1}>
                    {lesson.sources.slice(page.first, page.first + SOURCES_PER_PAGE).map((source, sourceIndex) => {
                        const number = page.first + sourceIndex + 1;
                        return (
                            <li key={number} className={highlight === number ? 'is-target' : ''}>
                                <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
                                {source.publisher ? <span className="source-publisher">{source.publisher}</span> : null}
                            </li>
                        );
                    })}
                </ol>
            </>
        );
    } else if (page.kind === 'end') {
        content = <EndPage book={book} />;
    }

    return (
        <div className={`book-page ${side} page-${page.kind}`}>
            <div className="page-body">{content}</div>
            {page.kind === 'title' ? null : <div className="page-number">{index + 1}</div>}
        </div>
    );
}

// Two pages side by side on wide screens, one on phones. Pages turn with the buttons, the page corners,
// the arrow keys or a swipe, and a [n] citation turns to the page that lists source n.
function LessonBook({ topic, lesson, next }) {
    const wide = useMedia('(min-width: 900px)');
    const reduceMotion = useMedia('(prefers-reduced-motion: reduce)');
    const per = wide ? 2 : 1;
    const pages = useMemo(() => {
        const list = buildPages(lesson);
        // An open book shows pages in pairs, so an odd last page gets a blank partner.
        return wide && list.length % 2 ? [...list, null] : list;
    }, [lesson, wide]);
    const pageCount = pages.filter(Boolean).length;
    const lastStart = pages.length - 1 - ((pages.length - 1) % per);

    const [start, setStart] = useState(0);
    const [turn, setTurn] = useState(null);
    const [highlight, setHighlight] = useState(null);
    const touch = useRef(null);

    // Going between one and two pages keeps the reader on the same page.
    useEffect(() => {
        setStart((current) => Math.min(current - (current % per), lastStart));
    }, [per, lastStart]);

    // The turning page is drawn on top until its animation has finished.
    useEffect(() => {
        if (!turn) return undefined;
        const timer = setTimeout(() => {
            setStart(turn.to);
            setTurn(null);
        }, TURN_MS + 50);
        return () => clearTimeout(timer);
    }, [turn]);

    const goTo = useCallback((index) => {
        const to = Math.max(0, Math.min(index - (index % per), lastStart));
        if (turn || to === start) return;
        if (reduceMotion) setStart(to);
        else setTurn({ to });
    }, [per, lastStart, turn, start, reduceMotion]);

    useEffect(() => {
        const onKey = (event) => {
            if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
            if (event.target.closest?.('input, textarea, select, [contenteditable="true"]')) return;
            if (event.key === 'ArrowRight') goTo(start + per);
            if (event.key === 'ArrowLeft') goTo(start - per);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [goTo, start, per]);

    const onTouchStart = (event) => {
        const point = event.touches[0];
        touch.current = { x: point.clientX, y: point.clientY };
    };
    const onTouchEnd = (event) => {
        if (!touch.current) return;
        const point = event.changedTouches[0];
        const dx = point.clientX - touch.current.x;
        const dy = point.clientY - touch.current.y;
        touch.current = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) goTo(dx < 0 ? start + per : start - per);
    };

    // Citations link to #source-n, which in the book means turning to the page that lists it.
    const onClick = (event) => {
        const link = event.target.closest('a[href^="#source-"]');
        if (!link) return;
        event.preventDefault();
        const number = Number(link.getAttribute('href').slice('#source-'.length));
        const target = pages.findIndex((page) => page && page.kind === 'sources' && number > page.first && number <= page.first + SOURCES_PER_PAGE);
        if (target < 0) return;
        setHighlight(number);
        goTo(target);
    };

    const nextLink = next
        ? { href: `/learn/${topic.slug}/${next.slug}`, label: `Next: ${next.title} →` }
        : { href: `/learn/${topic.slug}`, label: `Back to ${topic.title}` };
    const book = { topic, lesson, pages, goTo, forward: () => goTo(start + per), highlight, nextLink };
    const render = (index, side) => <BookPage key={index} page={pages[index]} index={index} side={side} book={book} />;

    // While a page turns, the pages it uncovers are already in place underneath it.
    const dir = turn ? Math.sign(turn.to - start) : 0;
    let slots;
    let leaf = null;
    if (wide) {
        slots = [render(dir < 0 ? turn.to : start, 'left'), render(dir > 0 ? turn.to + 1 : start + 1, 'right')];
        if (dir) {
            leaf = (
                <div className={`leaf ${dir > 0 ? 'on-right' : 'on-left'}`} aria-hidden="true" inert>
                    <div className="leaf-face front">{render(dir > 0 ? start + 1 : start, dir > 0 ? 'right' : 'left')}</div>
                    <div className="leaf-face back">{render(dir > 0 ? turn.to : turn.to + 1, dir > 0 ? 'left' : 'right')}</div>
                </div>
            );
        }
    } else {
        slots = [render(dir > 0 ? turn.to : start, 'single')];
        if (dir) {
            leaf = (
                <div className={`leaf single ${dir > 0 ? 'out' : 'in'}`} aria-hidden="true" inert>
                    <div className="leaf-face front">{render(dir > 0 ? start : turn.to, 'single')}</div>
                </div>
            );
        }
    }

    const shown = Math.min(start + per, pageCount);
    const label = shown > start + 1 ? `Pages ${start + 1}–${shown} of ${pageCount}` : `Page ${start + 1} of ${pageCount}`;

    return (
        <section className={`book ${wide ? 'open' : 'single'}`} aria-label={`${lesson.title}, as a book`} onClick={onClick}>
            <div className="book-spread" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                {slots}
                {leaf}
                {start > 0 ? <button type="button" className="page-corner prev" onClick={() => goTo(start - per)} tabIndex={-1} aria-hidden="true" title="Previous page" /> : null}
                {start < lastStart ? <button type="button" className="page-corner next" onClick={() => goTo(start + per)} tabIndex={-1} aria-hidden="true" title="Next page" /> : null}
            </div>
            <div className="book-controls">
                <button type="button" className="turn-btn" onClick={() => goTo(start - per)} disabled={start === 0} aria-label="Previous page">←</button>
                <div className="book-progress">
                    <div className="book-progress-bar" aria-hidden="true"><span style={{ width: `${(shown / pageCount) * 100}%` }} /></div>
                    <span aria-live="polite">{label}</span>
                </div>
                <button type="button" className="turn-btn" onClick={() => goTo(start + per)} disabled={start >= lastStart} aria-label="Next page">→</button>
            </div>
            <p className="book-help">Turn pages with the arrows, the ← → keys, a swipe, or the page corners.</p>
        </section>
    );
}

const VIEW_KEY = 'lessonView';
const savedView = () => {
    try {
        return localStorage.getItem(VIEW_KEY) === 'scroll' ? 'scroll' : 'book';
    } catch (e) {
        return 'book';
    }
};

function LessonPage({ topic, lesson, previous, next }) {
    const paragraphs = (lesson.body || '').split(/\n\s*\n/).filter(Boolean);
    // Read as a book by default; the one-page view stays for anyone who prefers scrolling.
    const [view, setView] = useState(savedView);
    const chooseView = (value) => {
        setView(value);
        try { localStorage.setItem(VIEW_KEY, value); } catch (e) { /* private mode: still switches for this page */ }
    };

    return (
        <>
            <Hero
                crumbs={[{ href: '/learn', label: 'Learn' }, { href: `/learn/${topic.slug}`, label: topic.title }]}
                eyebrow={`${levelLabel(lesson.level)} lesson`}
                title={lesson.title}
                subtitle={lesson.summary}
                adminHref={`/admin/learn/lessons/${lesson.id}/edit`}
                adminLabel="Edit this lesson"
            />

            <div className="view-switch" role="group" aria-label="How to read this lesson">
                <button type="button" aria-pressed={view === 'book'} onClick={() => chooseView('book')}>📖 Book</button>
                <button type="button" aria-pressed={view === 'scroll'} onClick={() => chooseView('scroll')}>📜 One page</button>
            </div>

            {view === 'book' ? <LessonBook topic={topic} lesson={lesson} next={next} /> : (
                <ScrollLesson lesson={lesson} paragraphs={paragraphs} />
            )}

            <nav className="section lesson-nav" aria-label="More lessons">
                {previous ? <a href={`/learn/${topic.slug}/${previous.slug}`}>← {previous.title}</a> : <span />}
                {next ? <a href={`/learn/${topic.slug}/${next.slug}`}>{next.title} →</a> : <a href={`/learn/${topic.slug}`}>Back to {topic.title}</a>}
            </nav>
        </>
    );
}

// The whole lesson on one scrolling page.
function ScrollLesson({ lesson, paragraphs }) {
    const pins = diagramPins(lesson);

    return (
        <>
            {paragraphs.length ? (
                <section className="section narrow lesson-body">
                    {paragraphs.map((paragraph, index) => <p key={index}><Cited text={paragraph} /></p>)}
                </section>
            ) : null}

            {lesson.items.length ? (
                <section className="section" style={{ paddingTop: 10 }}>
                    {lesson.layout === 'timeline' ? <Timeline items={lesson.items} /> : null}
                    {lesson.layout === 'cards' && pins.length ? <RiceDiagram pins={pins} /> : null}
                    {lesson.layout === 'cards' ? <FactCards items={lesson.items} pins={pins} /> : null}
                </section>
            ) : null}

            {lesson.sources.length ? (
                <section className="section" id="sources" style={{ paddingTop: 18 }}>
                    <div className="section-heading">
                        <div className="eyebrow" style={{ color: 'var(--gold)' }}>References</div>
                        <h2>Sources</h2>
                    </div>
                    <ol className="source-list animate-fade-in-up">
                        {lesson.sources.map((source, index) => (
                            <li key={index} id={`source-${index + 1}`}>
                                <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
                                {source.publisher ? <span className="source-publisher">{source.publisher}</span> : null}
                            </li>
                        ))}
                    </ol>
                </section>
            ) : null}
        </>
    );
}

export default function LearnApp({ data = {} }) {
    let content = null;
    if (data.view === 'lesson') content = <LessonPage {...data} />;
    else if (data.view === 'topic') content = <TopicPage topic={data.topic} />;
    else content = <Hub topics={data.topics} facts={data.facts} quiz={data.quiz} />;

    return (
        <>
            <style>{`
                .learn-react-wrap {
                    background: var(--bg);
                    color: var(--text);
                    font-family: var(--font-body);
                    min-height: 70vh;
                }
                .learn-react-wrap .hero-band {
                    background: var(--green);
                    color: white;
                    padding: 32px 0 28px;
                }
                .learn-react-wrap .inner {
                    max-width: 1180px;
                    margin: 0 auto;
                    padding: 0 24px;
                }
                .learn-react-wrap .crumbs {
                    font-size: 0.88rem;
                    margin-bottom: 10px;
                    color: rgba(255,255,255,0.6);
                }
                .learn-react-wrap .crumbs a {
                    color: rgba(255,255,255,0.85);
                    text-decoration: none;
                }
                .learn-react-wrap .crumbs a:hover { text-decoration: underline; }
                .learn-react-wrap .admin-link {
                    display: inline-block;
                    margin-top: 16px;
                    background: var(--gold-light);
                    color: var(--on-gold);
                    border-radius: 999px;
                    padding: 7px 16px;
                    font-weight: 800;
                    font-size: 0.88rem;
                    text-decoration: none;
                }
                .learn-react-wrap .eyebrow {
                    color: var(--gold-light);
                    font-size: 0.78rem;
                    font-weight: 800;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                }
                .learn-react-wrap h1, .learn-react-wrap h2, .learn-react-wrap h3, .learn-react-wrap h4 {
                    font-family: var(--font-heading);
                }
                .learn-react-wrap h1 {
                    margin: 10px 0 8px;
                    font-size: clamp(2.3rem, 4vw, 3.3rem);
                    font-weight: 800;
                }
                .learn-react-wrap .subtitle {
                    margin: 0;
                    color: rgba(255,255,255,0.72);
                    font-size: 1.08rem;
                    max-width: 700px;
                    line-height: 1.55;
                }
                .learn-react-wrap .section {
                    max-width: 1180px;
                    margin: 0 auto;
                    padding: 48px 24px 30px;
                }
                .learn-react-wrap .section.narrow { max-width: 820px; }
                .learn-react-wrap .section-heading {
                    text-align: center;
                    margin: 0 0 28px;
                }
                .learn-react-wrap .section-heading h2 {
                    margin: 8px 0 0;
                    font-size: clamp(2rem, 3vw, 2.7rem);
                }
                .learn-react-wrap .empty {
                    text-align: center;
                    color: var(--text-muted);
                }
                .learn-react-wrap .topic-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 24px;
                }
                .learn-react-wrap .topic-card {
                    background: var(--surface);
                    border: 1px solid rgba(var(--green-rgb), 0.08);
                    border-radius: 18px;
                    box-shadow: 0 10px 24px rgba(0,0,0,0.04);
                    padding: 24px;
                }
                .learn-react-wrap .topic-head {
                    display: flex;
                    gap: 14px;
                    align-items: flex-start;
                    text-decoration: none;
                    color: inherit;
                    margin-bottom: 16px;
                }
                .learn-react-wrap .topic-head h3 {
                    margin: 0 0 4px;
                    color: var(--green-ink);
                    font-size: 1.5rem;
                }
                .learn-react-wrap .topic-head p {
                    margin: 0;
                    color: var(--text-muted);
                    line-height: 1.55;
                }
                .learn-react-wrap .lesson-list {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    display: grid;
                    gap: 10px;
                }
                .learn-react-wrap .lesson-link {
                    display: grid;
                    grid-template-columns: 32px 1fr auto;
                    gap: 12px;
                    align-items: center;
                    background: var(--bg);
                    border: 1px solid rgba(var(--green-rgb), 0.08);
                    border-radius: 12px;
                    padding: 12px 14px;
                    text-decoration: none;
                    color: inherit;
                }
                .learn-react-wrap .section.narrow .lesson-link { background: var(--surface); }
                .learn-react-wrap .lesson-link:hover { border-color: rgba(var(--green-rgb), 0.3); }
                .learn-react-wrap .lesson-link strong {
                    display: block;
                    color: var(--green-ink);
                }
                .learn-react-wrap .lesson-number {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: var(--green);
                    color: #fff;
                    font-weight: 800;
                    font-size: 0.85rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .learn-react-wrap .lesson-summary {
                    display: block;
                    color: var(--text-muted);
                    font-size: 0.88rem;
                    margin-top: 2px;
                }
                .learn-react-wrap .level-badge {
                    background: var(--gold-soft);
                    color: var(--gold-dark);
                    border-radius: 999px;
                    padding: 4px 10px;
                    font-size: 0.72rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .learn-react-wrap .lesson-body p {
                    color: var(--text);
                    font-size: 1.08rem;
                    line-height: 1.8;
                    margin: 0 0 18px;
                }
                .learn-react-wrap .fact-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 20px;
                }
                .learn-react-wrap .fact-card {
                    background: var(--surface);
                    border: 1px solid rgba(var(--green-rgb), 0.08);
                    border-radius: 18px;
                    box-shadow: 0 10px 24px rgba(0,0,0,0.04);
                    padding: 22px;
                }
                .learn-react-wrap .fact-icon {
                    width: 46px;
                    height: 46px;
                    flex-shrink: 0;
                    border-radius: 50%;
                    background: var(--green-soft);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.4rem;
                    margin-bottom: 14px;
                }
                .learn-react-wrap .topic-head .fact-icon { margin-bottom: 0; }
                .learn-react-wrap .fact-card h4 {
                    margin: 0 0 8px;
                    color: var(--green-ink);
                    font-size: 1.25rem;
                }
                .learn-react-wrap .fact-card p {
                    margin: 0;
                    color: var(--text);
                    line-height: 1.65;
                    font-size: 0.95rem;
                }
                /* Flip cards: both faces share one grid cell, so the card is as tall as its longer face. */
                .learn-react-wrap .flip-card {
                    perspective: 1400px;
                    border-radius: 18px;
                    cursor: pointer;
                }
                .learn-react-wrap .flip-inner {
                    display: grid;
                    height: 100%;
                    transform-style: preserve-3d;
                    transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
                }
                .learn-react-wrap .flip-card.is-flipped .flip-inner {
                    transform: rotateY(180deg);
                }
                .learn-react-wrap .flip-face {
                    grid-area: 1 / 1;
                    display: flex;
                    flex-direction: column;
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                .learn-react-wrap .flip-back {
                    transform: rotateY(180deg);
                    background: var(--green);
                    color: #fff;
                    border-radius: 18px;
                    padding: 22px;
                    box-shadow: 0 10px 24px rgba(0,0,0,0.08);
                }
                .learn-react-wrap .flip-back-title {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 1.1rem;
                    margin-bottom: 10px;
                    color: var(--gold-light);
                }
                .learn-react-wrap .flip-back p {
                    margin: 0;
                    line-height: 1.65;
                    font-size: 0.93rem;
                    color: rgba(255,255,255,0.92);
                }
                .learn-react-wrap .flip-back .cite a { color: var(--gold-light); }
                /* The rice plant and grain diagram, and the numbered pins that tie it to the cards. */
                .learn-react-wrap .rice-diagram {
                    margin: 0 0 24px;
                    background: var(--surface);
                    border: 1px solid rgba(var(--green-rgb), 0.08);
                    border-radius: 18px;
                    padding: 16px 18px 14px;
                    box-shadow: 0 10px 24px rgba(0,0,0,0.04);
                }
                .learn-react-wrap .rice-diagram svg { display: block; width: 100%; height: auto; max-height: 440px; overflow: visible; }
                .learn-react-wrap .rice-diagram .caption { fill: var(--text-muted); font-size: 14px; font-weight: 700; letter-spacing: 0.04em; }
                .learn-react-wrap .rice-diagram .soil { fill: #8b6a45; opacity: 0.34; }
                .learn-react-wrap .rice-diagram .water { fill: #4a90d9; opacity: 0.16; }
                .learn-react-wrap .rice-diagram .water-line { fill: none; stroke: #4a90d9; stroke-width: 2; opacity: 0.6; }
                .learn-react-wrap .rice-diagram .roots path { fill: none; stroke: #a07850; stroke-width: 1.7; stroke-linecap: round; }
                .learn-react-wrap .rice-diagram .stems path { fill: none; stroke: #3f8f55; stroke-width: 4; stroke-linecap: round; }
                .learn-react-wrap .rice-diagram .nodes circle { fill: #285e39; }
                .learn-react-wrap .rice-diagram .leaves path { fill: #5aa86c; stroke: #3f8f55; stroke-width: 0.8; }
                .learn-react-wrap .rice-diagram .panicle path { fill: none; stroke: #9a8a3a; stroke-width: 2; stroke-linecap: round; }
                .learn-react-wrap .rice-diagram .panicle ellipse,
                .learn-react-wrap .rice-diagram .flower ellipse { fill: #e2b545; stroke: #b88a1f; stroke-width: 0.8; }
                .learn-react-wrap .rice-diagram .flower line { stroke: #b88a1f; stroke-width: 1; }
                .learn-react-wrap .rice-diagram .inset-ring { fill: #4f9c62; stroke: #2f6f42; stroke-width: 3; }
                .learn-react-wrap .rice-diagram .inset .air { fill: #dceefb; stroke: #8fb7d6; stroke-width: 0.8; }
                .learn-react-wrap .rice-diagram .inset-link { stroke: #3f8f55; stroke-width: 1.4; stroke-dasharray: 4 3; }
                .learn-react-wrap .rice-diagram .hull { fill: #d9a93a; stroke: #a87a18; stroke-width: 1.5; }
                .learn-react-wrap .rice-diagram .bran { fill: #9a6a3c; }
                .learn-react-wrap .rice-diagram .endosperm { fill: #f7f2e6; }
                .learn-react-wrap .rice-diagram .germ { fill: #e8c46a; stroke: #b88a1f; stroke-width: 1; }
                .learn-react-wrap .rice-diagram .pin { cursor: pointer; text-decoration: none; }
                /* On phones the drawing shrinks to about half size, so the pins grow to stay readable and tappable. */
                @media (max-width: 640px) {
                    .learn-react-wrap .rice-diagram .pin-badge { r: 19px; }
                    .learn-react-wrap .rice-diagram .pin text { font-size: 19px; }
                    .learn-react-wrap .rice-diagram .caption { font-size: 22px; }
                }
                .learn-react-wrap .rice-diagram .pin-line { stroke: var(--text-muted); stroke-width: 1.3; }
                .learn-react-wrap .rice-diagram .pin-dot { fill: var(--text-muted); }
                .learn-react-wrap .rice-diagram .pin-badge { fill: var(--gold); stroke: var(--surface); stroke-width: 2.5; transition: fill 0.15s ease; }
                .learn-react-wrap .rice-diagram .pin text { fill: #3b2a05; font-size: 12px; font-weight: 800; pointer-events: none; text-decoration: none; }
                .learn-react-wrap .rice-diagram .pin:hover .pin-badge,
                .learn-react-wrap .rice-diagram .pin:focus-visible .pin-badge { fill: var(--green); }
                .learn-react-wrap .rice-diagram .pin:hover text,
                .learn-react-wrap .rice-diagram .pin:focus-visible text { fill: #fff; }
                .learn-react-wrap .diagram-key {
                    list-style: none;
                    margin: 10px 0 0;
                    padding: 0;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px 16px;
                }
                .learn-react-wrap .diagram-key a {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    color: var(--text);
                    text-decoration: none;
                    font-size: 0.9rem;
                }
                .learn-react-wrap .diagram-key a:hover { color: var(--green-ink); text-decoration: underline; }
                .learn-react-wrap .part-no {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: var(--gold);
                    color: #3b2a05;
                    font-family: var(--font-body);
                    font-size: 0.75rem;
                    font-weight: 800;
                    line-height: 1;
                }
                .learn-react-wrap h4 .part-no,
                .learn-react-wrap .page-heading .part-no { margin-right: 8px; vertical-align: 0.15em; }
                .learn-react-wrap .book-page .rice-diagram { background: none; border: none; box-shadow: none; padding: 0; margin: 0; }
                .learn-react-wrap .book-page .diagram-key a { font-size: 0.85rem; }
                .learn-react-wrap .flip-toggle {
                    margin-top: auto;
                    align-self: flex-start;
                    border: none;
                    background: none;
                    padding: 14px 0 0;
                    font: inherit;
                    font-size: 0.85rem;
                    font-weight: 800;
                    color: var(--gold-dark);
                    cursor: pointer;
                }
                .learn-react-wrap .flip-back .flip-toggle { color: var(--gold-light); }
                .learn-react-wrap .flip-toggle:focus-visible {
                    outline: 2px solid currentColor;
                    outline-offset: 3px;
                    border-radius: 4px;
                }
                @media (prefers-reduced-motion: reduce) {
                    .learn-react-wrap .flip-inner { transition: none; }
                }
                .learn-react-wrap .cite a {
                    color: var(--gold);
                    font-weight: 800;
                    text-decoration: none;
                    margin-left: 2px;
                }
                .learn-react-wrap .cite a:hover { text-decoration: underline; }
                .learn-react-wrap .phase-bar {
                    display: grid;
                    gap: 14px;
                    margin-bottom: 18px;
                }
                .learn-react-wrap .phase-label {
                    text-align: center;
                    font-size: 0.78rem;
                    font-weight: 800;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    padding: 8px;
                    border-radius: 10px;
                    background: var(--green-soft);
                    color: var(--green-ink);
                }
                .learn-react-wrap .phase-label.phase-1 { background: rgba(var(--gold-rgb), 0.14); color: var(--green-ink); }
                .learn-react-wrap .phase-label.phase-2 { background: var(--gold-soft); color: var(--gold-dark); }
                .learn-react-wrap .growth-timeline {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    display: grid;
                    gap: 14px;
                    position: relative;
                }
                .learn-react-wrap .growth-timeline::before {
                    content: '';
                    position: absolute;
                    left: 6%;
                    right: 6%;
                    top: 108px;
                    height: 4px;
                    border-radius: 2px;
                    background: linear-gradient(90deg, var(--green), var(--gold-light));
                }
                .learn-react-wrap .growth-step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }
                .learn-react-wrap .rice-plant {
                    width: 64px;
                    height: 94px;
                    margin-bottom: 4px;
                    fill: none;
                    stroke-linecap: round;
                }
                .learn-react-wrap .rice-plant .soil { stroke: #b08b5a; stroke-width: 3; }
                .learn-react-wrap .rice-plant .stem,
                .learn-react-wrap .rice-plant .leaf { stroke: var(--green); stroke-width: 2.2; }
                .learn-react-wrap .rice-plant .ripe { stroke: var(--gold); }
                .learn-react-wrap .rice-plant .grain { fill: #9cc58f; stroke: none; }
                .learn-react-wrap .rice-plant .grain.ripe { fill: var(--gold-light); }
                .learn-react-wrap .growth-dot {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: var(--green);
                    color: #fff;
                    font-size: 0.8rem;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    z-index: 1;
                    box-shadow: 0 0 0 4px var(--bg);
                    margin-bottom: 14px;
                }
                .learn-react-wrap .growth-step:last-child .growth-dot { background: var(--gold); }
                .learn-react-wrap .growth-days {
                    color: var(--gold);
                    font-size: 0.72rem;
                    font-weight: 800;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                }
                .learn-react-wrap .growth-phase-inline { display: none; }
                .learn-react-wrap .growth-step h4 {
                    margin: 4px 0 6px;
                    color: var(--green-ink);
                    font-size: 1.02rem;
                }
                .learn-react-wrap .growth-step p {
                    margin: 0;
                    color: var(--text-muted);
                    font-size: 0.84rem;
                    line-height: 1.55;
                }
                .learn-react-wrap .source-list {
                    background: var(--surface);
                    border: 1px solid rgba(var(--green-rgb), 0.08);
                    border-radius: 18px;
                    padding: 24px 28px 24px 52px;
                    margin: 0;
                    display: grid;
                    gap: 12px;
                }
                .learn-react-wrap .source-list li {
                    color: var(--text);
                    line-height: 1.55;
                }
                .learn-react-wrap .source-list li:target {
                    background: var(--gold-soft);
                    border-radius: 6px;
                }
                .learn-react-wrap .source-list a {
                    color: var(--green-ink);
                    font-weight: 700;
                    word-break: break-word;
                }
                .learn-react-wrap .source-publisher {
                    display: block;
                    color: var(--text-muted);
                    font-size: 0.88rem;
                }
                .learn-react-wrap .lesson-nav {
                    display: flex;
                    justify-content: space-between;
                    gap: 16px;
                    flex-wrap: wrap;
                    padding-bottom: 56px;
                }
                .learn-react-wrap .lesson-nav a {
                    background: var(--green);
                    color: #fff;
                    text-decoration: none;
                    border-radius: 999px;
                    padding: 10px 18px;
                    font-weight: 700;
                }
                /* Fun fact spotlight and quick quiz at the top of the hub */
                .learn-react-wrap .section.spotlight {
                    max-width: 860px;
                    padding-bottom: 0;
                }
                .learn-react-wrap .spotlight-card {
                    background: var(--surface);
                    border: 1px solid rgba(var(--green-rgb), 0.08);
                    border-top: 4px solid var(--gold);
                    border-radius: 18px;
                    box-shadow: 0 16px 36px rgba(0,0,0,0.06);
                    padding: 26px 28px;
                }
                .learn-react-wrap .spotlight-card .eyebrow { color: var(--gold-dark); }
                .learn-react-wrap .spot-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 14px;
                }
                .learn-react-wrap .spot-fact {
                    display: flex;
                    gap: 18px;
                    align-items: flex-start;
                }
                .learn-react-wrap .spot-fact .fact-icon {
                    width: 60px;
                    height: 60px;
                    font-size: 1.8rem;
                    margin: 0;
                }
                .learn-react-wrap .spot-fact h2 {
                    margin: 0 0 8px;
                    color: var(--green-ink);
                    font-size: clamp(1.5rem, 3vw, 2rem);
                }
                .learn-react-wrap .spot-fact p {
                    margin: 0 0 10px;
                    font-size: 1.08rem;
                    line-height: 1.65;
                }
                .learn-react-wrap .spot-more {
                    color: var(--green-ink);
                    font-weight: 700;
                    font-size: 0.92rem;
                    text-decoration: none;
                }
                .learn-react-wrap .spot-more:hover { text-decoration: underline; }
                .learn-react-wrap .spot-actions {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 12px;
                    margin-top: 22px;
                    padding-top: 20px;
                    border-top: 1px solid var(--border);
                }
                .learn-react-wrap .spot-btn {
                    border: none;
                    border-radius: 999px;
                    padding: 12px 22px;
                    font: inherit;
                    font-weight: 800;
                    text-decoration: none;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }
                .learn-react-wrap .spot-btn.gold { background: var(--gold); color: var(--on-gold); }
                .learn-react-wrap .spot-btn.green { background: var(--green); color: #fff; }
                .learn-react-wrap .spot-btn:hover { filter: brightness(1.07); }
                .learn-react-wrap .spot-hint {
                    color: var(--text-muted);
                    font-size: 0.88rem;
                }
                .learn-react-wrap .text-btn {
                    border: none;
                    background: none;
                    padding: 4px 0;
                    font: inherit;
                    font-size: 0.88rem;
                    font-weight: 800;
                    color: var(--gold-dark);
                    cursor: pointer;
                }
                .learn-react-wrap .text-btn:hover { text-decoration: underline; }
                .learn-react-wrap .quiz h3 {
                    margin: 18px 0 16px;
                    color: var(--green-ink);
                    font-size: clamp(1.3rem, 2.6vw, 1.7rem);
                    outline: none;
                }
                .learn-react-wrap .quiz-progress {
                    height: 6px;
                    border-radius: 3px;
                    background: var(--green-soft);
                    overflow: hidden;
                }
                .learn-react-wrap .quiz-progress span {
                    display: block;
                    height: 100%;
                    background: linear-gradient(90deg, var(--green), var(--gold));
                    transition: width 0.3s ease;
                }
                .learn-react-wrap .quiz-options {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 10px;
                }
                .learn-react-wrap .quiz-option {
                    display: flex;
                    justify-content: space-between;
                    gap: 10px;
                    text-align: left;
                    background: var(--bg);
                    color: var(--text);
                    border: 2px solid var(--border);
                    border-radius: 12px;
                    padding: 13px 16px;
                    font: inherit;
                    font-weight: 600;
                    cursor: pointer;
                    transition: border-color 0.15s ease, background-color 0.15s ease;
                }
                .learn-react-wrap .quiz-option:hover:not(:disabled) { border-color: var(--green); }
                .learn-react-wrap .quiz-option:disabled { cursor: default; color: var(--text); }
                .learn-react-wrap .quiz-option.is-correct { border-color: var(--success); background: var(--success-soft); }
                .learn-react-wrap .quiz-option.is-correct::after { content: '✓'; color: var(--success); font-weight: 800; }
                .learn-react-wrap .quiz-option.is-wrong { border-color: var(--danger); background: var(--danger-soft); }
                .learn-react-wrap .quiz-option.is-wrong::after { content: '✗'; color: var(--danger); font-weight: 800; }
                .learn-react-wrap .quiz-option.is-faded { opacity: 0.55; }
                .learn-react-wrap .quiz-feedback {
                    margin: 16px 0;
                    padding: 14px 16px;
                    border-radius: 12px;
                }
                .learn-react-wrap .quiz-feedback.good { background: var(--success-soft); }
                .learn-react-wrap .quiz-feedback.bad { background: var(--danger-soft); }
                .learn-react-wrap .quiz-feedback p {
                    margin: 6px 0 8px;
                    line-height: 1.6;
                }
                .learn-react-wrap .quiz-feedback a {
                    color: var(--green-ink);
                    font-weight: 700;
                    font-size: 0.92rem;
                }
                .learn-react-wrap .quiz-result { text-align: center; }
                .learn-react-wrap .quiz-result h2 {
                    margin: 8px 0 6px;
                    color: var(--green-ink);
                    font-size: clamp(1.8rem, 3.5vw, 2.4rem);
                    outline: none;
                }
                .learn-react-wrap .quiz-result p {
                    margin: 0;
                    color: var(--text-muted);
                    font-size: 1.05rem;
                }
                .learn-react-wrap .quiz-result .spot-actions { justify-content: center; }
                @media (prefers-reduced-motion: reduce) {
                    .learn-react-wrap .quiz-progress span { transition: none; }
                }
                /* Lesson book */
                .learn-react-wrap {
                    --paper: #fffcf3;
                    --paper-line: #e2d6b8;
                }
                :root[data-theme="dark"] .learn-react-wrap {
                    --paper: #1b2631;
                    --paper-line: #34475a;
                }
                .learn-react-wrap .view-switch {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    padding: 26px 24px 0;
                }
                .learn-react-wrap .view-switch button {
                    border: 1px solid var(--border);
                    background: var(--surface);
                    color: var(--text-muted);
                    border-radius: 999px;
                    padding: 7px 16px;
                    font: inherit;
                    font-size: 0.9rem;
                    font-weight: 700;
                    cursor: pointer;
                }
                .learn-react-wrap .view-switch button[aria-pressed="true"] {
                    background: var(--green);
                    border-color: var(--green);
                    color: #fff;
                }
                .learn-react-wrap .book {
                    max-width: 1040px;
                    margin: 0 auto;
                    padding: 22px 24px 8px;
                }
                /* The dark green border around the pages is the book's hard cover. */
                .learn-react-wrap .book-spread {
                    position: relative;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    height: 640px;
                    padding: 12px;
                    background: var(--green-dark);
                    border-radius: 14px;
                    box-shadow: 0 26px 50px rgba(0,0,0,0.18);
                    perspective: 2400px;
                }
                .learn-react-wrap .book.single .book-spread {
                    grid-template-columns: 1fr;
                    height: min(640px, 76vh);
                    min-height: 480px;
                    max-width: 560px;
                    margin: 0 auto;
                }
                .learn-react-wrap .book-page {
                    position: relative;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    background-color: var(--paper);
                    color: var(--text);
                    overflow: hidden;
                }
                /* A soft shadow along the spine. */
                .learn-react-wrap .book-page.left {
                    border-radius: 6px 0 0 6px;
                    background-image: linear-gradient(to left, rgba(0,0,0,0.12), rgba(0,0,0,0) 56px);
                }
                .learn-react-wrap .book-page.right {
                    border-radius: 0 6px 6px 0;
                    background-image: linear-gradient(to right, rgba(0,0,0,0.12), rgba(0,0,0,0) 56px);
                }
                .learn-react-wrap .book-page.single {
                    border-radius: 6px;
                    background-image: linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0) 26px);
                }
                .learn-react-wrap .page-body {
                    flex: 1;
                    min-height: 0;
                    overflow-y: auto;
                    padding: 38px 42px 8px;
                    scrollbar-width: thin;
                }
                .learn-react-wrap .page-number {
                    text-align: center;
                    color: var(--text-faint);
                    font-size: 0.8rem;
                    padding: 6px 0 14px;
                }
                .learn-react-wrap .page-heading {
                    margin: 0 0 12px;
                    color: var(--green-ink);
                    font-size: 1.55rem;
                    line-height: 1.25;
                }
                .learn-react-wrap .book-page p {
                    margin: 0 0 14px;
                    font-size: 1rem;
                    line-height: 1.72;
                }
                .learn-react-wrap .book-page .page-lead {
                    font-size: 1.08rem;
                    font-weight: 600;
                }
                .learn-react-wrap .page-icon {
                    font-size: 2.4rem;
                    line-height: 1;
                    margin-bottom: 12px;
                }
                .learn-react-wrap .drop-cap p:first-child::first-letter {
                    float: left;
                    font-family: var(--font-heading);
                    font-size: 3.6em;
                    line-height: 0.85;
                    padding: 6px 8px 0 0;
                    color: var(--green-ink);
                }
                .learn-react-wrap .book-page.page-title {
                    background-color: var(--green);
                    background-image: radial-gradient(circle at 50% 35%, rgba(var(--gold-rgb), 0.2), rgba(0,0,0,0) 60%);
                    color: #fff;
                }
                .learn-react-wrap .title-page {
                    min-height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    text-align: center;
                }
                .learn-react-wrap .title-icon {
                    font-size: 3.4rem;
                    line-height: 1;
                }
                .learn-react-wrap .title-page h2 {
                    margin: 0;
                    color: #fff;
                    font-size: clamp(1.8rem, 3vw, 2.4rem);
                    line-height: 1.2;
                }
                .learn-react-wrap .book-page .title-page p {
                    margin: 0;
                    color: rgba(255,255,255,0.8);
                }
                .learn-react-wrap .title-page .turn-hint {
                    margin-top: 14px;
                    border: 1px solid rgba(255,255,255,0.4);
                    background: none;
                    color: var(--gold-light);
                    border-radius: 999px;
                    padding: 8px 18px;
                    font: inherit;
                    font-weight: 800;
                    cursor: pointer;
                }
                .learn-react-wrap .contents-list {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    display: grid;
                    gap: 2px;
                }
                .learn-react-wrap .contents-list button {
                    width: 100%;
                    display: flex;
                    align-items: baseline;
                    gap: 8px;
                    border: none;
                    background: none;
                    padding: 7px 0;
                    font: inherit;
                    color: var(--text);
                    text-align: left;
                    cursor: pointer;
                }
                .learn-react-wrap .contents-list button:hover .chapter-name {
                    color: var(--green-ink);
                    text-decoration: underline;
                }
                .learn-react-wrap .contents-list .leader {
                    flex: 1;
                    min-width: 20px;
                    border-bottom: 2px dotted var(--paper-line);
                }
                .learn-react-wrap .stage-art {
                    display: flex;
                    justify-content: center;
                    margin: 4px 0 10px;
                }
                .learn-react-wrap .stage-art .rice-plant {
                    width: 120px;
                    height: 176px;
                    margin: 0;
                }
                .learn-react-wrap .stage-meta {
                    color: var(--gold-dark);
                    font-size: 0.78rem;
                    font-weight: 800;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    margin-bottom: 6px;
                }
                .learn-react-wrap .book-sources {
                    margin: 0;
                    padding-left: 22px;
                    display: grid;
                    gap: 12px;
                }
                .learn-react-wrap .book-sources li { line-height: 1.5; }
                .learn-react-wrap .book-sources li.is-target {
                    background: var(--gold-soft);
                    border-radius: 6px;
                    box-shadow: 0 0 0 6px var(--gold-soft);
                }
                .learn-react-wrap .book-sources a {
                    color: var(--green-ink);
                    font-weight: 700;
                    word-break: break-word;
                }
                .learn-react-wrap .end-page {
                    text-align: center;
                    padding-top: 30px;
                }
                .learn-react-wrap .end-mark { font-size: 3rem; }
                .learn-react-wrap .end-actions {
                    display: grid;
                    justify-items: center;
                    gap: 12px;
                    margin-top: 20px;
                }
                /* The quiz on the last page is tighter, so a question and its answer fit on one page. */
                .learn-react-wrap .book-page .quiz h3 {
                    margin: 12px 0 10px;
                    font-size: 1.25rem;
                }
                .learn-react-wrap .book-page .quiz-options {
                    grid-template-columns: 1fr;
                    gap: 8px;
                }
                .learn-react-wrap .book-page .quiz-option { padding: 9px 14px; }
                .learn-react-wrap .book-page .quiz-feedback {
                    margin: 12px 0;
                    padding: 10px 14px;
                }
                .learn-react-wrap .book-page .quiz-feedback p {
                    margin: 4px 0;
                    font-size: 0.95rem;
                    line-height: 1.55;
                }
                /* The page being turned. It hinges on the spine (or the left edge on phones). */
                .learn-react-wrap .leaf {
                    position: absolute;
                    top: 12px;
                    bottom: 12px;
                    width: calc(50% - 12px);
                    z-index: 3;
                    transform-style: preserve-3d;
                    animation-duration: ${TURN_MS}ms;
                    animation-timing-function: ease-in-out;
                    animation-fill-mode: forwards;
                }
                .learn-react-wrap .leaf.on-right {
                    right: 12px;
                    transform-origin: left center;
                    animation-name: book-turn-forward;
                }
                .learn-react-wrap .leaf.on-left {
                    left: 12px;
                    transform-origin: right center;
                    animation-name: book-turn-back;
                }
                .learn-react-wrap .leaf.single {
                    left: 12px;
                    right: 12px;
                    width: auto;
                    transform-origin: left center;
                }
                .learn-react-wrap .leaf.single.out {
                    animation-name: book-flip-out;
                    animation-timing-function: ease-in;
                }
                .learn-react-wrap .leaf.single.in {
                    animation-name: book-flip-in;
                    animation-timing-function: ease-out;
                }
                .learn-react-wrap .leaf-face {
                    position: absolute;
                    inset: 0;
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                .learn-react-wrap .leaf-face.back { transform: rotateY(180deg); }
                /* The page darkens a little as it stands up, like paper catching the light. */
                .learn-react-wrap .leaf-face::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background: rgba(0,0,0,0.22);
                    opacity: 0;
                    animation: leaf-shade ${TURN_MS}ms ease-in-out forwards;
                }
                @keyframes book-turn-forward { from { transform: rotateY(0deg); } to { transform: rotateY(-180deg); } }
                @keyframes book-turn-back { from { transform: rotateY(0deg); } to { transform: rotateY(180deg); } }
                @keyframes book-flip-out { from { transform: rotateY(0deg); } to { transform: rotateY(-90deg); } }
                @keyframes book-flip-in { from { transform: rotateY(-90deg); } to { transform: rotateY(0deg); } }
                @keyframes leaf-shade { 50% { opacity: 1; } }
                /* Turned-up page corners: click one to turn the page. */
                .learn-react-wrap .page-corner {
                    position: absolute;
                    bottom: 12px;
                    z-index: 2;
                    width: 46px;
                    height: 46px;
                    padding: 0;
                    border: none;
                    cursor: pointer;
                    transition: width 0.2s ease, height 0.2s ease;
                }
                .learn-react-wrap .page-corner.next {
                    right: 12px;
                    border-radius: 0 0 6px 0;
                    background: linear-gradient(135deg, rgba(0,0,0,0) 50%, rgba(var(--gold-rgb), 0.6) 50%);
                }
                .learn-react-wrap .page-corner.prev {
                    left: 12px;
                    border-radius: 0 0 0 6px;
                    background: linear-gradient(225deg, rgba(0,0,0,0) 50%, rgba(var(--gold-rgb), 0.6) 50%);
                }
                .learn-react-wrap .page-corner:hover {
                    width: 62px;
                    height: 62px;
                }
                .learn-react-wrap .book-controls {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    max-width: 560px;
                    margin: 18px auto 0;
                }
                .learn-react-wrap .turn-btn {
                    width: 46px;
                    height: 46px;
                    flex-shrink: 0;
                    border: none;
                    border-radius: 50%;
                    background: var(--green);
                    color: #fff;
                    font-size: 1.25rem;
                    font-weight: 800;
                    cursor: pointer;
                }
                .learn-react-wrap .turn-btn:disabled {
                    opacity: 0.35;
                    cursor: default;
                }
                .learn-react-wrap .book-progress {
                    flex: 1;
                    display: grid;
                    gap: 6px;
                    text-align: center;
                    color: var(--text-muted);
                    font-size: 0.88rem;
                }
                .learn-react-wrap .book-progress-bar {
                    height: 5px;
                    border-radius: 3px;
                    background: var(--green-soft);
                    overflow: hidden;
                }
                .learn-react-wrap .book-progress-bar span {
                    display: block;
                    height: 100%;
                    background: linear-gradient(90deg, var(--green), var(--gold));
                    transition: width 0.4s ease;
                }
                .learn-react-wrap .book-help {
                    margin: 10px 0 0;
                    text-align: center;
                    color: var(--text-faint);
                    font-size: 0.82rem;
                }
                @media (prefers-reduced-motion: reduce) {
                    .learn-react-wrap .book-progress-bar span,
                    .learn-react-wrap .page-corner { transition: none; }
                }
                @media (max-width: 560px) {
                    .learn-react-wrap .book { padding: 16px 12px 4px; }
                    .learn-react-wrap .page-body { padding: 26px 22px 6px; }
                    .learn-react-wrap .page-heading { font-size: 1.35rem; }
                }
                @media (max-width: 960px) {
                    .learn-react-wrap .topic-grid { grid-template-columns: 1fr; }
                    .learn-react-wrap .fact-grid { grid-template-columns: 1fr 1fr; }
                    .learn-react-wrap .phase-bar { display: none; }
                    .learn-react-wrap .growth-timeline {
                        grid-template-columns: 1fr !important;
                        gap: 0;
                    }
                    .learn-react-wrap .growth-timeline::before {
                        left: 13px;
                        right: auto;
                        top: 20px;
                        bottom: 20px;
                        width: 4px;
                        height: auto;
                        background: linear-gradient(180deg, var(--green), var(--gold-light));
                    }
                    .learn-react-wrap .growth-step {
                        display: grid;
                        grid-template-columns: 28px 64px 1fr;
                        column-gap: 14px;
                        align-items: center;
                        text-align: left;
                        padding: 10px 0;
                    }
                    .learn-react-wrap .growth-dot { margin: 0; grid-column: 1; grid-row: 1; }
                    .learn-react-wrap .rice-plant { margin: 0; grid-column: 2; grid-row: 1; }
                    .learn-react-wrap .growth-text { grid-column: 3; grid-row: 1; }
                    .learn-react-wrap .growth-phase-inline { display: inline; }
                }
                @media (max-width: 560px) {
                    .learn-react-wrap .fact-grid { grid-template-columns: 1fr; }
                    .learn-react-wrap .source-list { padding: 20px 18px 20px 38px; }
                    .learn-react-wrap .lesson-link { grid-template-columns: 32px 1fr; }
                    .learn-react-wrap .level-badge { grid-column: 2; justify-self: start; }
                    .learn-react-wrap .spotlight-card { padding: 20px 18px; }
                    .learn-react-wrap .spot-fact { flex-direction: column; gap: 12px; }
                    .learn-react-wrap .quiz-options { grid-template-columns: 1fr; }
                    .learn-react-wrap .spot-btn { width: 100%; }
                }
            `}</style>

            <div className="learn-react-wrap">{content}</div>
        </>
    );
}
