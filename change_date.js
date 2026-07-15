const fs = require('fs');

const file = 'c:\\Users\\Intel\\Desktop\\MyKohi\\blog.html';
let html = fs.readFileSync(file, 'utf8');

// The Local SEO blog and TMS Marketing blog were both injected with the date 'July 15, 2026' in blog.html.
// We will change the date to 'July 6, 2026' everywhere in blog.html.
html = html.replace(/July 15, 2026/g, 'July 6, 2026');

fs.writeFileSync(file, html, 'utf8');
console.log("Updated dates in blog.html to July 6");
