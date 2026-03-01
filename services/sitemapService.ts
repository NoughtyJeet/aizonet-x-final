import { supabaseService } from './supabaseService';
import { comparisonService } from './comparisonService';

export const sitemapService = {
  async generateSitemap() {
    try {
      const [tools, posts, comparisons] = await Promise.all([
        supabaseService.getTools(),
        supabaseService.getPosts(),
        comparisonService.getComparisons()
      ]);

      const publishedComparisons = comparisons.filter(c => c.status === 'published');
      
      const baseUrl = 'https://aizonet.in';
      const urls = [
        { loc: `${baseUrl}/`, priority: '1.0' },
        { loc: `${baseUrl}/tools`, priority: '0.9' },
        { loc: `${baseUrl}/blog`, priority: '0.8' },
        { loc: `${baseUrl}/categories`, priority: '0.8' },
        { loc: `${baseUrl}/about`, priority: '0.5' },
        { loc: `${baseUrl}/contact`, priority: '0.5' },
      ];

      tools.forEach(tool => {
        urls.push({ loc: `${baseUrl}/tools/${tool.slug}`, priority: '0.7' });
      });

      posts.forEach(post => {
        urls.push({ loc: `${baseUrl}/blog/${post.slug}`, priority: '0.6' });
      });

      publishedComparisons.forEach(comp => {
        urls.push({ loc: `${baseUrl}/compare/${comp.slug}`, priority: '0.8' });
      });

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <priority>${u.priority}</priority>
    <changefreq>weekly</changefreq>
  </url>`).join('\n')}
</urlset>`;

      return sitemap;
    } catch (err) {
      console.error('Sitemap generation failed:', err);
      return '';
    }
  }
};
