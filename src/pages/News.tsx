import React, { useState, useEffect } from 'react';
import './News.css';
import { Newspaper, Clock, ExternalLink, RefreshCw, AlertCircle, Share2 } from 'lucide-react';
import { Modal, Button, message } from 'antd';

// Define interfaces for type safety
interface NewsArticle {
  urlToImage: string;
  title: string;
  description: string | null;
  content?: string | null;
  url: string;
  publishedAt: string;
  author: string | null;
  source: {
    name: string;
  };
}

interface NewsCategory {
  id: string;
  name: string;
  icon: string;
}

const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // Prefer an environment variable so keys are not hard-coded into source.
  // Set this in a `.env` file at project root as: REACT_APP_NEWS_API_KEY=your_key_here
  const API_KEY = (process.env.REACT_APP_NEWS_API_KEY || process.env.REACT_APP_NEWSAPI_KEY || '').trim();
  
  const categories: NewsCategory[] = [
    { id: 'water pollution rural india', name: 'Rural India', icon: '🏘️' },
    { id: 'water pollution meghalaya', name: 'Meghalaya', icon: '⛰️' },
    { id: 'water diseases india', name: 'Water Diseases', icon: '🦠' },
    { id: 'clean water access rural', name: 'Clean Water Access', icon: '💧' },
    { id: 'waterborne diseases prevention', name: 'Prevention', icon: '🛡️' },
    { id: 'water quality testing india', name: 'Water Quality', icon: '🔬' },
    { id: 'groundwater contamination', name: 'Contamination', icon: '⚠️' }
  ];

  const fetchNews = async (category: string = 'general', replace: boolean = true): Promise<void> => {
    setLoading(true);
    setError(null);
    
    // Quick validation: if no API key, surface clear instructions to the user
    if (!API_KEY) {
      setLoading(false);
      const msg = "No News API key provided. Add `REACT_APP_NEWS_API_KEY` to a .env file and restart the dev server.";
      setError(msg);
      console.error(msg);
      return;
    }
    try {
      // NewsAPI only accepts a limited set of values for the `category` parameter.
      // If the selected category is not one of those, use the `everything` endpoint
      // or use `q` to perform a search query so custom terms work.
      const allowedCategories = new Set([
        'business',
        'entertainment',
        'general',
        'health',
        'science',
        'sports',
        'technology',
      ]);

      let url = '';
      // Always prefer news related to water. We'll add a water-focused `q` query
      // so the API returns water-related articles. We still keep country=in for
      // top-headlines to favour India, but we include `q` in both top-headlines
      // and everything calls to bias results toward water topics.
      const waterKeywords = [
        'water', 'waterborne', 'water quality', 'water pollution', 'river', 'drinking water',
        'contamination', 'sewage', 'wastewater', 'treatment', 'sanitation', 'groundwater', 'aquifer'
      ];
      const waterQuery = encodeURIComponent(waterKeywords.join(' OR '));

      // Location-specific keywords for certain categories
      let locationKeywords: string[] = [];
      if (category.toLowerCase().includes('meghalaya')) {
        locationKeywords = ['meghalaya', 'shillong', 'tura', 'mawphlang'];
      } else if (category.toLowerCase().includes('rural india')) {
        locationKeywords = ['rural india', 'rural', 'village', 'villages', 'rural communities'];
      }
      const locationQuery = locationKeywords.length ? encodeURIComponent(locationKeywords.join(' OR ')) : '';

      if (allowedCategories.has(category)) {
        // For location categories, include location keywords OR water keywords in the q param
        if (locationKeywords.length) {
          const combined = `${waterKeywords.join(' OR ')} OR ${locationKeywords.join(' OR ')}`;
          url = `https://newsapi.org/v2/top-headlines?country=in&category=${category}&q=${encodeURIComponent(combined)}&language=en&pageSize=12&apiKey=${API_KEY}`;
        } else {
          url = `https://newsapi.org/v2/top-headlines?country=in&category=${category}&q=${waterQuery}&language=en&pageSize=12&apiKey=${API_KEY}`;
        }
      } else if (category && category !== 'general') {
        // Use the `everything` endpoint. If it's a location category, bias toward that location too.
        if (locationKeywords.length) {
          const query = `${category} India OR (${waterKeywords.join(' OR ')}) OR (${locationKeywords.join(' OR ')})`;
          url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&pageSize=12&apiKey=${API_KEY}`;
        } else {
          const query = `${category} India OR (${waterKeywords.join(' OR ')})`;
          url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&pageSize=12&apiKey=${API_KEY}`;
        }
      } else {
        // Fallback to top-headlines general for India, but include water keywords (and location if present)
        if (locationKeywords.length) {
          const combined = `${waterKeywords.join(' OR ')} OR ${locationKeywords.join(' OR ')}`;
          url = `https://newsapi.org/v2/top-headlines?country=in&q=${encodeURIComponent(combined)}&language=en&pageSize=12&apiKey=${API_KEY}`;
        } else {
          url = `https://newsapi.org/v2/top-headlines?country=in&q=${waterQuery}&language=en&pageSize=12&apiKey=${API_KEY}`;
        }
      }

      const response = await fetch(url);
      if (!response.ok) {
        // Try to parse API error message when available
        let apiErr = 'Failed to fetch news';
        try {
          const errData = await response.json();
          apiErr = errData.message || apiErr;
          // If the API explicitly says the key is invalid, provide actionable help
          if (errData.code === 'apiKeyInvalid' || /api key/i.test(apiErr)) {
            apiErr = "Your API key is invalid or incorrect. Check your key, or create a free key at https://newsapi.org and set `REACT_APP_NEWS_API_KEY` in a .env file (restart the dev server after).";
          }
        } catch (e) {
          /* ignore JSON parse errors */
        }
        throw new Error(apiErr);
      }
      const data = await response.json();
      // Helpful debug log when things don't load
      if (data.status && data.status !== 'ok') {
        console.error('NewsAPI response:', data);
        throw new Error(data.message || 'Failed to load news');
      }

      const fetched = data.articles.filter((article: NewsArticle) => article.urlToImage && article.title);

      // Restrict to water-related content only (keyword based filter)
      const matchesWater = (article: NewsArticle) => {
        const hay = `${article.title || ''} ${article.description || ''} ${article.content || ''}`.toLowerCase();
        return waterKeywords.some(k => hay.includes(k));
      };

      const waterArticles = fetched.filter(matchesWater);

      if (replace) {
        setNews(waterArticles);
      } else {
        // Merge new water articles: prepend any fetched articles that are not already present
        setNews((prev) => {
          const existingUrls = new Set(prev.map((a) => a.url));
          const newArticles = waterArticles.filter((a: NewsArticle) => !existingUrls.has(a.url));
          if (newArticles.length === 0) return prev;
          const merged = [...newArticles, ...prev];
          return merged;
        });

        if (waterArticles.length > 0) {
          const prevUrls = new Set(news.map((a) => a.url));
          const added = waterArticles.filter((a: NewsArticle) => !prevUrls.has(a.url)).length;
          if (added > 0) message.success(`${added} new water article${added > 1 ? 's' : ''} added`);
        } else {
          message.info('No new water-related articles found');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      // Log without exposing the API key
      console.error('Error fetching news:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load: replace current list
    fetchNews(selectedCategory, true);

    // Auto-refresh: merge new articles (prepend unseen ones)
    const interval = setInterval(() => {
      fetchNews(selectedCategory, false);
    }, 300000);

    return () => clearInterval(interval);
  }, [selectedCategory]);

  const handleCategoryChange = (categoryId: string): void => {
    setSelectedCategory(categoryId);
  };

  const handleRefresh = (): void => {
    // Manual refresh should merge new articles rather than replace
    fetchNews(selectedCategory, false);
  };

  const openArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
  };

  const closeArticle = () => setSelectedArticle(null);

  const handleShare = async (article: NewsArticle | null) => {
    if (!article) return;
    const shareData = {
      title: article.title,
      text: article.description || article.title,
      url: article.url,
    };

    try {
      if ((navigator as any).share) {
        await (navigator as any).share(shareData);
        message.success('Shared successfully');
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(article.url);
        message.success('Article link copied to clipboard');
      } else {
        // Fallback: open the article in a new tab and instruct the user
        window.open(article.url, '_blank', 'noopener');
        message.info('Opened article in a new tab. Copy the URL to share.');
      }
    } catch (err) {
      console.error('Share failed', err);
      message.error('Unable to share at this time');
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <div className={`news-container ${isDark ? 'dark' : 'light'} min-h-screen py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="news-wrapper max-w-7xl mx-auto">
        {/* Header */}
        <div className="header text-center mb-12">
          <div className="header-icon-wrapper flex items-center justify-center gap-3 mb-4">
            <div className="header-icon bg-gradient-to-r from-blue-500 to-green-500 p-3 rounded-full">
              <Newspaper className="w-8 h-8 text-white" />
            </div>
            <h1 className={`header-title text-4xl font-bold ${isDark ? 'header-title dark' : 'header-title light'}`}>
              Latest News
            </h1>
          </div>
          <p className={`header-subtitle text-lg ${isDark ? 'header-subtitle dark' : 'header-subtitle light'}`}>
            Stay updated with real-time news from around the world
          </p>
          
          {/* Controls */}
          <div className="controls flex items-center justify-center gap-4 mt-6">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`refresh-button flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${loading ? 'loading' : ''}`}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button
              onClick={() => setIsDark(!isDark)}
              className={`theme-toggle px-4 py-2 rounded-lg transition-all ${isDark ? 'theme-toggle dark' : 'theme-toggle light'}`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filter mb-8 overflow-x-auto">
          <div className="category-buttons flex gap-3 justify-center pb-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`category-button ${selectedCategory === cat.id ? 'active' : `inactive ${isDark ? 'dark' : 'light'}`} flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap`}
              >
                <span className="emoji text-lg">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="error-container max-w-2xl mx-auto mb-8">
            <div className="error-box bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
              <AlertCircle className="error-icon w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="error-title text-red-800 font-semibold mb-2">Error Loading News</h3>
                <p className="error-message text-red-600 mb-4">{error}</p>
                <p className="error-help text-sm text-red-500">
                  Please ensure you have added a valid API key from{' '}
                  <a 
                    href="https://newsapi.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="error-link underline font-semibold"
                  >
                    NewsAPI.org
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="news-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`skeleton-card rounded-xl overflow-hidden ${isDark ? 'skeleton-card dark' : 'skeleton-card light'} shadow-lg animate-pulse`}
              >
                <div className={`skeleton-image h-48 ${isDark ? 'skeleton-image dark' : 'skeleton-image light'}`} />
                <div className="skeleton-content p-6">
                  <div className={`skeleton-line ${isDark ? 'skeleton-line dark' : 'skeleton-line light'} rounded mb-3`} />
                  <div className={`skeleton-line shorter ${isDark ? 'skeleton-line dark' : 'skeleton-line light'} rounded mb-3 w-3/4`} />
                  <div className={`skeleton-line short ${isDark ? 'skeleton-line dark' : 'skeleton-line light'} rounded w-1/2`} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* News Grid */}
        {!loading && !error && news.length > 0 && (
          <div className="news-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article, index) => (
              <article
                key={index}
                className={`article-card group rounded-xl overflow-hidden ${isDark ? 'article-card dark' : 'article-card light'} shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
              >
                {/* Image */}
                <div className="article-image-wrapper relative h-48 overflow-hidden">
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="article-image w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x200/1890ff/ffffff?text=News+Image';
                    }}
                  />
                  <div className="absolute top-3 left-3 article-source-badge">
                    <span className="source-tag bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {article.source.name}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="article-content p-6">
                  <h3 className={`article-title text-lg font-bold mb-3 line-clamp-2 ${isDark ? 'article-title dark' : 'article-title light'} group-hover:text-blue-500 transition-colors`}>
                    {article.title}
                  </h3>
                  
                  <p className={`article-description text-sm mb-4 line-clamp-3 ${isDark ? 'article-description dark' : 'article-description light'}`}>
                    {article.description || 'No description available'}
                  </p>

                  <div className="article-footer flex items-center justify-between">
                    <div className="article-time flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {formatTimeAgo(article.publishedAt)}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => openArticle(article)}
                      className="article-link flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm font-semibold transition-colors bg-transparent border-none cursor-pointer"
                    >
                      Read More
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>

                  {article.author && (
                    <div className={`article-author-wrapper mt-4 pt-4 ${isDark ? 'article-author-wrapper dark' : 'article-author-wrapper light'}`}>
                      <p className={`article-author text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        By {article.author}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && news.length === 0 && (
          <div className={`no-results text-center py-12`}>
            <Newspaper className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-lg ${isDark ? 'no-results p dark' : 'no-results p light'}`}>
              No news articles found for this category
            </p>
          </div>
        )}

      
      {/* Article Modal */}
      <Modal
        open={!!selectedArticle}
        onCancel={closeArticle}
        footer={null}
        width={900}
        centered
        maskStyle={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
        bodyStyle={{ padding: 0 }}
        closeIcon={<span style={{ fontSize: 20 }}>×</span>}
      >
        {selectedArticle && (
          <div className={`article-modal ${isDark ? 'article-card dark' : 'article-card light'}`}>
            <div style={{ height: 420, overflow: 'hidden' }}>
              <img
                src={selectedArticle.urlToImage}
                alt={selectedArticle.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = 'https://via.placeholder.com/900x420/1890ff/ffffff?text=News+Image'; }}
              />
            </div>
            <div style={{ padding: 24 }}>
              <h2 style={{ marginBottom: 8 }}>{selectedArticle.title}</h2>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                <Clock className="w-4 h-4" />
                <span style={{ fontSize: 13, color: isDark ? '#9ca3af' : '#6b7280' }}>{formatTimeAgo(selectedArticle.publishedAt)}</span>
                <span style={{ marginLeft: 12, fontSize: 13, color: isDark ? '#9ca3af' : '#6b7280' }}>{selectedArticle.source.name}</span>
                {selectedArticle.author && (
                  <span style={{ marginLeft: 'auto', fontSize: 13, color: isDark ? '#9ca3af' : '#6b7280' }}>
                    By {selectedArticle.author}
                  </span>
                )}
              </div>

              {/* Show the full content when available, otherwise fallback to description */}
              {selectedArticle.content ? (
                <div style={{ marginBottom: 16, color: isDark ? '#d1d5db' : '#374151', whiteSpace: 'pre-wrap' }}>
                  {selectedArticle.content}
                </div>
              ) : (
                <p style={{ marginBottom: 16, color: isDark ? '#d1d5db' : '#374151' }}>{selectedArticle.description || 'No description available'}</p>
              )}

              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <Button type="primary" onClick={() => window.open(selectedArticle.url, '_blank', 'noopener')}>
                  Open Original
                </Button>

                <Button onClick={closeArticle}>Close</Button>

                <Button onClick={() => handleShare(selectedArticle)} icon={<Share2 className="w-4 h-4" />}>
                  Share
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
      </div>
    </div>
  );
};

export default NewsSection;
  