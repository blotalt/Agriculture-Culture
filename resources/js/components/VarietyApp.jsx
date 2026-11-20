import React from 'react';
import { t } from '../i18n.js';

const formatDemand = (value) => value || 'Medium';

export default function VarietyApp({ varieties = [], totalCount = 0, highDemandCount = 0, filters = {}, pagination = { current: 1, last: 1 } }) {
    const currentType = filters.type || 'All Types';
    const currentSortLabel = filters.sort === 'za' ? 'Z–A' : 'A–Z';
    const currentSearch = filters.search || '';

    const buildQueryString = (changes = {}) => {
        const params = new URLSearchParams(window.location.search);

        Object.entries(changes).forEach(([key, value]) => {
            if (!value || value === '' || value === null || value === undefined) {
                params.delete(key);
                return;
            }

            params.set(key, String(value));
        });

        const queryString = params.toString();
        return queryString ? `?${queryString}` : '/variety';
    };

    const typeLinks = [
        { label: 'All Types', value: '' },
        { label: 'Jasmine', value: 'Jasmine' },
        { label: 'Black Rice', value: 'Black Rice' },
        { label: 'Glutinous', value: 'Glutinous' },
        { label: 'Whole-Grain White', value: 'Whole-Grain White' },
        { label: 'Brown Rice', value: 'Brown Rice' },
    ];

    return (
        <>
            <style>{`
                .variety-react-wrap {
                    background: var(--bg);
                    color: var(--text);
                    font-family: var(--font-body);
                }
                .variety-react-wrap .hero-band {
                    background: var(--green);
                    color: white;
                    padding: 38px 0 32px;
                }
                .variety-react-wrap .inner {
                    max-width: 1180px;
                    margin: 0 auto;
                    padding: 0 24px;
                }
                .variety-react-wrap .hero-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 26px;
                    flex-wrap: wrap;
                }
                .variety-react-wrap h1 {
                    margin: 6px 0 8px;
                    font-size: clamp(2.4rem, 4vw, 3.2rem);
                    font-weight: 800;
                    font-family: var(--font-heading);
                }
                .variety-react-wrap .subtext {
                    color: rgba(255,255,255,0.77);
                    margin: 0;
                    font-size: 1.06rem;
                }
                .variety-react-wrap .tool-links {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    margin-top: 16px;
                }
                .variety-react-wrap .tool-links a {
                    background: rgba(255,255,255,0.12);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    text-decoration: none;
                    border-radius: 999px;
                    padding: 7px 14px;
                    font-weight: 700;
                    font-size: 0.88rem;
                }
                .variety-react-wrap .tool-links a:hover {
                    background: var(--gold);
                }
                .variety-react-wrap .stats-box {
                    display: flex;
                    gap: 18px;
                    background: rgba(255,255,255,0.08);
                    padding: 16px 18px;
                    border-radius: 16px;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                .variety-react-wrap .stat-item {
                    min-width: 90px;
                    text-align: center;
                    border-right: 1px solid rgba(255,255,255,0.2);
                    padding-right: 16px;
                }
                .variety-react-wrap .stat-item:last-child {
                    border-right: none;
                    padding-right: 0;
                }
                .variety-react-wrap .stat-item h3 {
                    margin: 0;
                    color: var(--gold-light);
                    font-weight: 800;
                    font-size: 1.8rem;
                    font-family: var(--font-heading);
                }
                .variety-react-wrap .stat-item small {
                    color: rgba(255,255,255,0.7);
                }
                .variety-react-wrap .content {
                    max-width: 1180px;
                    margin: 0 auto;
                    padding: 30px 24px 70px;
                }
                .variety-react-wrap .toolbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                    flex-wrap: wrap;
                    margin-bottom: 26px;
                }
                .variety-react-wrap .search-box {
                    flex: 1 1 280px;
                    max-width: 420px;
                    position: relative;
                }
                .variety-react-wrap .search-box input {
                    width: 100%;
                    border: none;
                    background: var(--blue-soft);
                    border-radius: 999px;
                    padding: 12px 18px 12px 42px;
                    font-size: 1rem;
                    color: var(--text);
                    outline: none;
                    box-shadow: inset 0 0 0 1px rgba(var(--green-rgb), 0.08);
                }
                .variety-react-wrap .search-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 0.9rem;
                    opacity: 0.75;
                }
                .variety-react-wrap .type-pills {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }
                .variety-react-wrap .type-pill {
                    display: inline-block;
                    background: var(--blue-soft);
                    color: var(--text-muted);
                    border-radius: 999px;
                    padding: 8px 16px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: 0.15s ease;
                }
                .variety-react-wrap .type-pill.active {
                    background: var(--green);
                    color: white;
                }
                .variety-react-wrap .sort-box {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--blue-soft);
                    border: none;
                    border-radius: 10px;
                    padding: 10px 14px;
                    text-decoration: none;
                    color: var(--green-ink);
                    font-weight: 700;
                }
                .variety-react-wrap .grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 20px;
                }
                .variety-react-wrap .card {
                    background: var(--surface);
                    border: none;
                    border-radius: 18px;
                    overflow: hidden;
                    box-shadow: 0 12px 28px rgba(0,0,0,0.04);
                    height: 100%;
                }
                .variety-react-wrap .image-wrap {
                    position: relative;
                    height: 200px;
                    overflow: hidden;
                }
                .variety-react-wrap .image-wrap img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                .variety-react-wrap .badge-type {
                    position: absolute;
                    top: 14px;
                    left: 14px;
                    background: var(--green);
                    color: white;
                    border-radius: 999px;
                    padding: 6px 12px;
                    font-size: 0.72rem;
                    font-weight: 700;
                }
                .variety-react-wrap .card-body {
                    padding: 20px;
                }
                .variety-react-wrap .title-row {
                    display: flex;
                    align-items: start;
                    justify-content: space-between;
                    gap: 10px;
                    margin-bottom: 8px;
                }
                .variety-react-wrap .title-row h5 {
                    margin: 0;
                    font-size: 1.12rem;
                    font-weight: 800;
                    color: var(--green-ink);
                }
                .variety-react-wrap .subtitle {
                    color: var(--text-muted);
                    font-size: 0.82rem;
                    margin: 0;
                }
                .variety-react-wrap .demand-badge {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--green-soft);
                    color: var(--success);
                    border-radius: 999px;
                    padding: 6px 10px;
                    font-size: 0.72rem;
                    font-weight: 800;
                }
                .variety-react-wrap .description {
                    color: var(--text-muted);
                    line-height: 1.7;
                    margin: 12px 0 18px;
                    font-size: 0.92rem;
                }
                .variety-react-wrap .meta-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                    border-top: 1px solid var(--blue-soft);
                    padding-top: 14px;
                }
                .variety-react-wrap .meta-stat {
                    text-align: center;
                    flex: 1;
                }
                .variety-react-wrap .meta-stat strong {
                    display: block;
                    font-size: 0.8rem;
                    color: var(--green-ink);
                }
                .variety-react-wrap .meta-stat span {
                    color: var(--text-muted);
                    font-size: 0.7rem;
                }
                .variety-react-wrap .view-btn {
                    display: inline-block;
                    background: var(--green);
                    color: white;
                    padding: 9px 16px;
                    border-radius: 999px;
                    font-weight: 700;
                    text-decoration: none;
                    white-space: nowrap;
                }
                .variety-react-wrap .pagination {
                    margin-top: 28px;
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                .variety-react-wrap .page-link {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 38px;
                    height: 38px;
                    padding: 0 12px;
                    border-radius: 8px;
                    background: var(--green-soft);
                    color: var(--green-ink);
                    text-decoration: none;
                    font-weight: 700;
                }
                .variety-react-wrap .page-link.active {
                    background: var(--green);
                    color: white;
                }
                .variety-react-wrap .empty-state {
                    text-align: center;
                    padding: 32px 0;
                    color: var(--text-muted);
                    font-size: 1.1rem;
                }
                @media (max-width: 960px) {
                    .variety-react-wrap .grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }
                }
                @media (max-width: 680px) {
                    .variety-react-wrap .grid {
                        grid-template-columns: 1fr;
                    }
                    .variety-react-wrap .stats-box {
                        width: 100%;
                    }
                    .variety-react-wrap .toolbar {
                        align-items: flex-start;
                    }
                }
            `}</style>

            <div className="variety-react-wrap">
                <section className="hero-band">
                    <div className="inner hero-row">
                        <div>
                            <h1>{t('variety.title')}</h1>
                            <p className="subtext">{t('variety.subtitle')}</p>
                            <div className="tool-links">
                                <a href="/variety/recommend">🌱 {t('nav.recommend')}</a>
                                <a href="/variety/compare">⚖️ {t('nav.compare')}</a>
                                <a href="/calendar">📅 {t('nav.calendar')}</a>
                            </div>
                        </div>

                        <div className="stats-box">
                            <div className="stat-item">
                                <h3>{totalCount}</h3>
                                <small>Total Varieties</small>
                            </div>
                            <div className="stat-item">
                                <h3>{highDemandCount}</h3>
                                <small>High Demand</small>
                            </div>
                            <div className="stat-item">
                                <h3>25</h3>
                                <small>Provinces</small>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="content">
                    <div className="toolbar">
                        <form method="GET" action="/variety" className="search-box">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                name="search"
                                defaultValue={currentSearch}
                                placeholder="Search varieties..."
                            />
                            {filters.type ? <input type="hidden" name="type" value={filters.type} /> : null}
                            {filters.sort ? <input type="hidden" name="sort" value={filters.sort} /> : null}
                        </form>

                        <div className="type-pills">
                            {typeLinks.map((typeOption) => {
                                const isActive = currentType === typeOption.label || (!filters.type && typeOption.label === 'All Types');
                                const href = buildQueryString({
                                    type: typeOption.value || undefined,
                                    search: currentSearch || undefined,
                                    page: undefined,
                                });

                                return (
                                    <a
                                        key={typeOption.value || 'all'}
                                        href={href}
                                        className={`type-pill ${isActive ? 'active' : ''}`}
                                    >
                                        {typeOption.label}
                                    </a>
                                );
                            })}
                        </div>

                        <a
                            href={buildQueryString({
                                sort: filters.sort === 'za' ? 'az' : 'za',
                                page: undefined,
                            })}
                            className="sort-box"
                        >
                            <span>⚙️</span> Sort: {currentSortLabel} <span>▼</span>
                        </a>
                    </div>

                    <div className="grid">
                        {varieties.length === 0 ? (
                            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                                No rice varieties have been uploaded to the registry yet.
                            </div>
                        ) : (
                            varieties.map((rice) => (
                                <article className="card animate-fade-in-up hover-lift" key={rice.id}>
                                    <div className="image-wrap">
                                        <img src={rice.image ? `/storage/${rice.image}` : '/images/extra/ricefields.png'} alt={rice.name} />
                                        <span className="badge-type">{rice.type}</span>
                                    </div>

                                    <div className="card-body">
                                        <div className="title-row">
                                            <div>
                                                <h5>{rice.name}</h5>
                                                <p className="subtitle"><span lang="km">{rice.khmer_name}</span> • {rice.location}</p>
                                            </div>
                                            <span className="demand-badge">{formatDemand(rice.demand)}</span>
                                        </div>

                                        <p className="description">{rice.description}</p>

                                        <div className="meta-row">
                                            <div className="meta-stat">
                                                <strong>{rice.yield}</strong>
                                                <span>Yield</span>
                                            </div>
                                            <div className="meta-stat">
                                                <strong>{rice.cycle}</strong>
                                                <span>Cycle</span>
                                            </div>
                                            <div className="meta-stat">
                                                <strong>{rice.season}</strong>
                                                <span>Season</span>
                                            </div>
                                            <a className="view-btn" href={`/variety/compare?ids[]=${rice.id}`}>{t('variety.details')}</a>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>

                    {pagination.last > 1 && (
                        <div className="pagination">
                            {Array.from({ length: pagination.last }, (_, index) => (
                                <a
                                    key={index + 1}
                                    href={buildQueryString({ page: index + 1 })}
                                    className={`page-link ${index + 1 === pagination.current ? 'active' : ''}`}
                                    aria-current={index + 1 === pagination.current ? 'page' : undefined}
                                >
                                    {index + 1}
                                </a>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
