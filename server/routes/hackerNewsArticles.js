const express = require('express');
const router = express.Router();
const axios = require('axios');
const xml2js = require('xml2js');

// Keywords to filter crypto-related articles
const CRYPTO_KEYWORDS = [
  'cryptography',
  'encryption',
  'crypto',
  'cipher',
  'cryptanalysis',
  'quantum cryptography',
  'blockchain',
  'cryptocurrency',
  'cybersecurity'
];

/**
 * Route to fetch crypto-related articles from The Hacker News
 * @route GET /api/news/hackernews
 * @returns {Array} Array of crypto-related articles sorted by publication date
 */
router.get('/hackernews', async (req, res) => {
  try {
    console.log('Fetching Hacker News articles...');
    const response = await axios.get('https://thehackernews.com/news-sitemap.xml', {
      headers: {
        'User-Agent': 'Cryptography-Resource-Manager/1.0',
        'Accept': 'application/xml, text/xml, */*'
      },
      timeout: 15001 // 15 second timeout
    });
    
    const parser = new xml2js.Parser();
    
    parser.parseString(response.data, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        return res.status(500).json({ error: 'Failed to parse news data' });
      }

      if (!result.urlset || !result.urlset.url) {
        console.error('Invalid sitemap structure');
        return res.status(500).json({ error: 'Invalid sitemap structure' });
      }

      const articles = result.urlset.url.map(url => ({
        title: url['news:news'][0]['news:title'][0],
        link: url.loc[0],
        pubDate: new Date(url['news:news'][0]['news:publication_date'][0]),
        source: 'The Hacker News',
        keywords: url['news:news'][0]['news:keywords'] ? 
                 url['news:news'][0]['news:keywords'][0].split(',') : []
      }));

      // Filter crypto-related articles
      const cryptoArticles = articles.filter(article => {
        const text = `${article.title} ${article.keywords.join(' ')}`.toLowerCase();
        return CRYPTO_KEYWORDS.some(keyword => text.includes(keyword));
      });

      // Sort by publication date (newest first)
      cryptoArticles.sort((a, b) => b.pubDate - a.pubDate);

      // Format the response to match the application's expected structure
      const formattedArticles = cryptoArticles.map((article, index) => ({
        id: `hn-${index}`,
        title: article.title,
        type: 'news',
        description: article.keywords.join(', '),
        publishedAt: article.pubDate.toISOString(),
        url: article.link,
        source: article.source,
        content: article.keywords.join(', '),
        category: detectCategory(article.title + ' ' + article.keywords.join(' '))
      }));

      res.json({
        items: formattedArticles,
        total: formattedArticles.length,
        page: 1,
        pageSize: formattedArticles.length,
        hasMore: false
      });
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

/**
 * Detects the category of an article based on its content
 * @param {string} text - The text to analyze
 * @returns {string} The detected category
 */
function detectCategory(text) {
  text = text.toLowerCase();
  
  const CATEGORIES = {
    cryptography: ['cryptography', 'encryption', 'cipher', 'cryptosystem', 'key exchange'],
    cryptanalysis: ['cryptanalysis', 'attack', 'vulnerability', 'break', 'crack', 'weakness'],
    security: ['cybersecurity', 'security', 'protection', 'defense', 'threat', 'privacy'],
    blockchain: ['blockchain', 'bitcoin', 'cryptocurrency', 'ethereum', 'smart contract']
  };
  
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }
  
  return 'cryptography'; // Default category
}

module.exports = router;