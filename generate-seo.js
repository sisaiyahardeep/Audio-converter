import fs from 'fs';
import path from 'path';

const AUDIO_FORMATS = ['mp3', 'flac', 'wav', 'aiff', 'aac'];
const DOMAIN = 'https://converter.sisaiyarecords.in';
const DIST_DIR = path.resolve(process.cwd(), 'dist');

if (!fs.existsSync(DIST_DIR)) {
  console.error('dist directory not found');
  process.exit(1);
}

const indexHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8');

const pairs = [];
AUDIO_FORMATS.forEach((from) => {
  AUDIO_FORMATS.forEach((to) => {
    if (from !== to) {
      pairs.push(`${from}-to-${to}`);
    }
  });
});

// Create 404 fallback
fs.writeFileSync(path.join(DIST_DIR, '404.html'), indexHtml);

// Generate directories and HTML files
pairs.forEach((pair) => {
  const dirPath = path.join(DIST_DIR, pair);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(path.join(dirPath, 'index.html'), indexHtml);
});

// Generate Sitemap
const currentDate = new Date().toISOString().split('T')[0];
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

pairs.forEach((pair) => {
  sitemap += `  <url>
    <loc>${DOMAIN}/${pair}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
});
sitemap += `</urlset>`;

fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemap);

// Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${DOMAIN}/sitemap.xml
`;
fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt);

console.log('SEO structure, sitemap, and 404 fallback generated successfully!');
