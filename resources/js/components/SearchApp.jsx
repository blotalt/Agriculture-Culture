import React, { useEffect, useRef, useState } from 'react';
import { t } from '../i18n.js';

// Wrap each search word found in `text` in <mark>.
function Highlight({ text = '', q = '' }) {
    const words = q.split(/\s+/).filter(Boolean).map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (!words.length) return text;

    const parts = text.split(new RegExp(`(${words.join('|')})`, 'gi'));
    return parts.map((part, index) => (index % 2 === 1 ? <mark key={index}>{part}</mark> : part));
}

const excerpt = (body, q) => {
    const first = q.split(/\s+/).find(Boolean) || '';
    const at = first ? body.toLowerCase().indexOf(first.toLowerCase()) : -1;
    const start = Math.max(0, at - 60);
    const slice = body.slice(start, start + 180);
    return `${start > 0 ? '…' : ''}${slice}${start + 180 < body.length ? '…' : ''}`;
};

const searchUrl = ({ q, type }) => `/search?q=${encodeURIComponent(q)}&type=${type}`;

export default function SearchApp({ q: initialQ = '', type: initialType = 'all', varieties: initialVarieties = [], posts: initialPosts = [], prices: initialPrices = [], lessons: initialLessons = [] }) {
    const [input, setInput] = useState(initialQ);
    // `query` is what we ask the server for; `results` is the last answer we got back.
    const [query, setQuery] = useState({ q: initialQ, type: initialType });
    const [results, setResults] = useState({ q: initialQ, type: initialType, varieties: initialVarieties, posts: initialPosts, prices: initialPrices, lessons: initialLessons });
    const [loading, setLoading] = useState(false);
    const firstRender = useRef(true);

    // Merge `changes` into the latest query; keep the same object if nothing changed so no request fires.
    const search = (changes) => setQuery((current) => {
        const next = { ...current, ...changes };
        return current.q === next.q && current.type === next.type ? current : next;
    });

    // Search 300ms after the user stops typing.
    useEffect(() => {
        const timer = setTimeout(() => search({ q: input.trim() }), 300);
        return () => clearTimeout(timer);
    }, [input]);

    useEffect(() => {
        // The first results came with the page.
        if (firstRender.current) {
            firstRender.current = false;
            return undefined;
        }

        window.history.replaceState(null, '', searchUrl(query));

        if (!query.q) {
            setResults({ ...query, varieties: [], posts: [], prices: [], lessons: [] });
            setLoading(false);
            return undefined;
        }

        const controller = new AbortController();
        setLoading(true);
        fetch(searchUrl(query), { signal: controller.signal, headers: { Accept: 'application/json' } })
            .then((response) => (response.ok ? response.json() : Promise.reject(response)))
            .then((data) => {
                setResults(data);
                setLoading(false);
            })
            .catch((error) => {
                if (error.name !== 'AbortError') setLoading(false);
            });

        // A newer search cancels the one still in flight.
        return () => controller.abort();
    }, [query]);

    const { q, type, varieties, posts, prices, lessons = [] } = results;
    const tabs = [
        { key: 'all', count: varieties.length + lessons.length + posts.length + prices.length },
        { key: 'varieties', count: varieties.length },
        { key: 'lessons', count: lessons.length },
        { key: 'news', count: posts.length },
        { key: 'prices', count: prices.length },
    ];
    const show = (key) => type === 'all' || type === key;

    const submit = (event) => {
        event.preventDefault();
        search({ q: input.trim() });
    };

    const selectTab = (event, key) => {
        event.preventDefault();
        search({ type: key });
    };

    return (
        <>
            <style>{`
                .search-react-wrap { background: var(--bg); color: var(--text); min-height: 100vh; }
                .search-react-hero { background: var(--green); color: white; padding: 34px 0 28px; }
                .search-react-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
                .search-react-hero h1 { margin: 0 0 6px; font-size: clamp(2rem, 4vw, 2.6rem); font-family: var(--font-heading); }
                .search-react-hero p { margin: 0; color: rgba(255,255,255,.7); }
                .search-react-form { display: flex; gap: 8px; margin-top: 18px; max-width: 560px; }
                .search-react-form input { flex: 1; border: none; border-radius: 10px; padding: 11px 14px; font: inherit; min-width: 0; }
                .search-react-form button { border: none; border-radius: 10px; padding: 11px 18px; background: var(--gold); color: white; font-weight: 800; cursor: pointer; }
                .search-react-content { max-width: 1100px; margin: 0 auto; padding: 28px 24px 72px; transition: opacity .15s; }
                .search-react-content.is-loading { opacity: .55; }
                .search-react-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 26px; }
                .search-react-tabs a { text-decoration: none; background: var(--blue-soft); color: var(--text-muted); border-radius: 999px; padding: 7px 16px; font-weight: 700; font-size: .9rem; }
                .search-react-tabs a.active { background: var(--green); color: white; }
                .search-react-section { margin-bottom: 28px; }
                .search-react-section h3 { margin: 0 0 14px; font-size: 1.6rem; color: var(--green-ink); font-family: var(--font-heading); }
                .search-react-item { display: flex; align-items: center; justify-content: space-between; gap: 12px; background: var(--surface); border: 1px solid rgba(var(--green-rgb), .08); border-radius: 12px; padding: 14px 18px; margin-bottom: 12px; box-shadow: 0 10px 24px rgba(0,0,0,.04); text-decoration: none; color: inherit; }
                .search-react-item strong { color: var(--green-ink); display: block; }
                .search-react-item span, .search-react-item p { color: var(--text-muted); font-size: .88rem; }
                .search-react-item mark { background: var(--gold-soft); color: inherit; padding: 0 2px; border-radius: 3px; }
                .search-react-link { flex-shrink: 0; display: inline-block; background: var(--green); color: white; text-decoration: none; border-radius: 999px; padding: 8px 14px; font-weight: 700; }
                .search-react-empty { margin: 0; color: var(--text-muted); }
                .search-react-price { font-weight: 800; color: var(--green-ink); white-space: nowrap; }
            `}</style>

            <div className="search-react-wrap">
                <section className="search-react-hero">
                    <div className="search-react-inner">
                        <h1>{t('search.title')}</h1>
                        <p aria-live="polite">{q ? t('search.showing', { q }) : t('search.prompt')}</p>
                        <form className="search-react-form" action="/search" method="GET" role="search" onSubmit={submit}>
                            <input type="search" name="q" value={input} onChange={(event) => setInput(event.target.value)} placeholder={t('nav.search')} aria-label={t('nav.search')} autoComplete="off" />
                            <input type="hidden" name="type" value={query.type} />
                            <button type="submit">{t('search.button')}</button>
                        </form>
                    </div>
                </section>

                <section className={`search-react-content${loading ? ' is-loading' : ''}`} aria-busy={loading}>
                    {q ? (
                        <nav className="search-react-tabs" aria-label={t('search.filter')}>
                            {tabs.map((tab) => (
                                <a key={tab.key} href={searchUrl({ q, type: tab.key })} onClick={(event) => selectTab(event, tab.key)} className={query.type === tab.key ? 'active' : ''}>
                                    {t(`search.tab.${tab.key}`)}{type === 'all' || type === tab.key ? ` (${tab.count})` : ''}
                                </a>
                            ))}
                        </nav>
                    ) : null}

                    {show('varieties') ? (
                        <div className="search-react-section">
                            <h3>{t('search.tab.varieties')} ({varieties.length})</h3>
                            {varieties.length > 0 ? varieties.map((rice) => (
                                <div key={rice.id} className="search-react-item animate-fade-in-up hover-lift">
                                    <div>
                                        <strong><Highlight text={rice.name} q={q} /> <small lang="km" style={{ fontWeight: 400 }}>{rice.khmer_name}</small></strong>
                                        <span><Highlight text={`${rice.type} · ${rice.location}`} q={q} /></span>
                                    </div>
                                    <a className="search-react-link" href={`/variety?search=${encodeURIComponent(rice.name)}`}>{t('common.view')}</a>
                                </div>
                            )) : <p className="search-react-empty">{t('search.noVarieties')}</p>}
                        </div>
                    ) : null}

                    {show('lessons') ? (
                        <div className="search-react-section">
                            <h3>{t('search.tab.lessons')} ({lessons.length})</h3>
                            {lessons.length > 0 ? lessons.map((lesson) => (
                                <a key={lesson.id} className="search-react-item animate-fade-in-up hover-lift" href={lesson.url} style={{ display: 'block' }}>
                                    <strong><Highlight text={lesson.title} q={q} /></strong>
                                    <span>{lesson.topic}</span>
                                    <p style={{ margin: '8px 0 0' }}><Highlight text={excerpt(lesson.body.replace(/\[\d+\]/g, ''), q)} q={q} /></p>
                                </a>
                            )) : <p className="search-react-empty">{t('search.noLessons')}</p>}
                        </div>
                    ) : null}

                    {show('prices') ? (
                        <div className="search-react-section">
                            <h3>{t('search.tab.prices')} ({prices.length})</h3>
                            {prices.length > 0 ? prices.map((price) => (
                                <a key={price.id} className="search-react-item animate-fade-in-up hover-lift" href={`/pricemarket?province=${encodeURIComponent(price.province)}`}>
                                    <div>
                                        <strong><Highlight text={price.market} q={q} /></strong>
                                        <span><Highlight text={`${price.rice_variety} · ${price.province}`} q={q} /></span>
                                    </div>
                                    <span className="search-react-price">${price.price_per_kg.toFixed(2)}/kg</span>
                                </a>
                            )) : <p className="search-react-empty">{t('search.noPrices')}</p>}
                        </div>
                    ) : null}

                    {show('news') ? (
                        <div className="search-react-section">
                            <h3>{t('search.tab.news')} ({posts.length})</h3>
                            {posts.length > 0 ? posts.map((post) => (
                                <a key={post.id} className="search-react-item animate-fade-in-up hover-lift" href={`/news/${post.id}`} style={{ display: 'block' }}>
                                    <strong><Highlight text={post.title} q={q} /></strong>
                                    <p style={{ margin: '8px 0 0' }}><Highlight text={excerpt(post.body, q)} q={q} /></p>
                                </a>
                            )) : <p className="search-react-empty">{t('search.noNews')}</p>}
                        </div>
                    ) : null}
                </section>
            </div>
        </>
    );
}
