const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://mykohi.com';
const EXCLUDE_FILES = ['hero-demo.html', 'thank-you.html'];

function generateSitemap() {
    console.log('Generating sitemap...');
    const dir = __dirname;
    const files = fs.readdirSync(dir);

    const htmlFiles = files.filter(file => file.endsWith('.html') && !EXCLUDE_FILES.includes(file));

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    htmlFiles.forEach(file => {
        // Root url vs subpages
        const urlPath = file === 'index.html' ? '' : `/${file}`;
        const loc = `${DOMAIN}${urlPath}`;
        
        let priority = '0.6';
        let changefreq = 'monthly';

        if (file === 'index.html') {
            priority = '1.0';
            changefreq = 'weekly';
        } else if (file === 'blog.html' || file === 'about.html' || file === 'contact.html' || !file.includes('blog-')) {
            priority = '0.8';
        }

        xml += `  <url>\n`;
        xml += `    <loc>${loc}</loc>\n`;
        xml += `    <changefreq>${changefreq}</changefreq>\n`;
        xml += `    <priority>${priority}</priority>\n`;
        xml += `  </url>\n`;
    });

    xml += `</urlset>\n`;

    fs.writeFileSync(path.join(dir, 'sitemap.xml'), xml, 'utf8');
    console.log(`Sitemap generated successfully with ${htmlFiles.length} URLs.`);
}

// Execute if run directly
if (require.main === module) {
    generateSitemap();
}

module.exports = generateSitemap;
