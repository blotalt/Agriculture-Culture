import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App.jsx';
import PriceMarketApp from './components/PriceMarketApp.jsx';
import VarietyApp from './components/VarietyApp.jsx';
import DashboardApp from './components/DashboardApp.jsx';
import AboutApp from './components/AboutApp.jsx';
import EditPostApp from './components/EditPostApp.jsx';
import ManageVarietiesApp from './components/ManageVarietiesApp.jsx';
import EditVarietyApp from './components/EditVarietyApp.jsx';
import MarketPricesAdminApp from './components/MarketPricesAdminApp.jsx';
import MarketPriceFormApp from './components/MarketPriceFormApp.jsx';
import LoginApp from './components/LoginApp.jsx';
import SignupApp from './components/SignupApp.jsx';
import NewsApp from './components/NewsApp.jsx';
import SearchApp from './components/SearchApp.jsx';
import NewsDetailApp from './components/NewsDetailApp.jsx';
import WelcomeApp from './components/WelcomeApp.jsx';
import SiteShellApp from './components/SiteShellApp.jsx';

const rootElement = document.getElementById('react-app');

if (rootElement) {
    const root = createRoot(rootElement);
    const page = rootElement.dataset.page || 'home';
    const prices = rootElement.dataset.prices ? JSON.parse(rootElement.dataset.prices) : [];
    const varieties = rootElement.dataset.varieties ? JSON.parse(rootElement.dataset.varieties) : [];
    const totalCount = Number(rootElement.dataset.totalCount || 0);
    const highDemandCount = Number(rootElement.dataset.highDemandCount || 0);
    const filters = rootElement.dataset.filters ? JSON.parse(rootElement.dataset.filters) : {};
    const posts = rootElement.dataset.posts ? JSON.parse(rootElement.dataset.posts) : [];
    const csrfToken = rootElement.dataset.csrf || '';
    const teamMembers = rootElement.dataset.team ? JSON.parse(rootElement.dataset.team) : [];
    const post = rootElement.dataset.post ? JSON.parse(rootElement.dataset.post) : {};
    const myVarieties = rootElement.dataset.myVarieties ? JSON.parse(rootElement.dataset.myVarieties) : [];
    const variety = rootElement.dataset.variety ? JSON.parse(rootElement.dataset.variety) : {};
    const newsPosts = rootElement.dataset.posts ? JSON.parse(rootElement.dataset.posts) : [];
    const searchQuery = rootElement.dataset.q || '';
    const searchVarieties = rootElement.dataset.searchVarieties ? JSON.parse(rootElement.dataset.searchVarieties) : [];
    const searchPosts = rootElement.dataset.searchPosts ? JSON.parse(rootElement.dataset.searchPosts) : [];
    const detailPost = rootElement.dataset.post ? JSON.parse(rootElement.dataset.post) : null;
    const currentUserId = Number(rootElement.dataset.userId || 0);

    const renderApp = (Component, props = {}) => {
        root.render(
            React.createElement(
                React.StrictMode,
                null,
                React.createElement(Component, props)
            )
        );
    };

    const shellProps = {
        userName: document.body.dataset.userName || '',
        isGuest: !document.body.dataset.isAuthenticated || document.body.dataset.isAuthenticated === 'false',
        currentPath: window.location.pathname,
        csrfToken: rootElement.dataset.csrf || '',
    };

    let PageComponent = App;
    let pageProps = {};

    if (page === 'pricemarket') {
        PageComponent = PriceMarketApp;
        pageProps = { prices };
    } else if (page === 'variety') {
        PageComponent = VarietyApp;
        pageProps = { varieties, totalCount, highDemandCount, filters };
    } else if (page === 'dashboard') {
        PageComponent = DashboardApp;
        pageProps = { posts, csrfToken };
    } else if (page === 'about') {
        PageComponent = AboutApp;
        pageProps = { teamMembers };
    } else if (page === 'edit-post') {
        PageComponent = EditPostApp;
        pageProps = { post, csrfToken };
    } else if (page === 'manage-varieties') {
        PageComponent = ManageVarietiesApp;
        pageProps = { varieties: myVarieties, csrfToken };
    } else if (page === 'edit-variety') {
        PageComponent = EditVarietyApp;
        pageProps = { variety, csrfToken };
    } else if (page === 'market-prices-admin') {
        PageComponent = MarketPricesAdminApp;
        pageProps = { prices, csrfToken };
    } else if (page === 'market-price-create') {
        PageComponent = MarketPriceFormApp;
        pageProps = { mode: 'create', csrfToken };
    } else if (page === 'market-price-edit') {
        PageComponent = MarketPriceFormApp;
        pageProps = { mode: 'edit', price: rootElement.dataset.marketPrice ? JSON.parse(rootElement.dataset.marketPrice) : null, csrfToken };
    } else if (page === 'login') {
        PageComponent = LoginApp;
    } else if (page === 'signup') {
        PageComponent = SignupApp;
    } else if (page === 'news') {
        PageComponent = NewsApp;
        pageProps = { posts: newsPosts };
    } else if (page === 'search') {
        PageComponent = SearchApp;
        pageProps = { q: searchQuery, varieties: searchVarieties, posts: searchPosts };
    } else if (page === 'news-detail') {
        PageComponent = NewsDetailApp;
        pageProps = { post: detailPost, csrfToken, currentUserId };
    } else if (page === 'welcome') {
        PageComponent = WelcomeApp;
    }

    renderApp(SiteShellApp, {
        ...shellProps,
        children: React.createElement(PageComponent, pageProps),
    });
}
