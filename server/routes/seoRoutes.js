const express = require('express');
const router = express.Router();

// Route: /robots.txt
// Instructions for search engine crawlers (Google, Bing, etc.)
router.get('/robots.txt', (req, res) => {
  const robotsTxt = `User-agent: *
Disallow: /admin/
Disallow: /api/admin/
Disallow: /api/enquiries/
Disallow: /uploads/
Allow: /health
Allow: /$

# Sitemap reference
Sitemap: ${req.protocol}://${req.get('host')}/sitemap.xml
`;

  res.header('Content-Type', 'text/plain');
  res.status(200).send(robotsTxt);
});

// Route: /sitemap.xml
// XML sitemap for search engines
router.get('/sitemap.xml', (req, res) => {
  const host = `${req.protocol}://${req.get('host')}`;
  const lastMod = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${host}/</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${host}/health</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.status(200).send(xml);
});

module.exports = router;
