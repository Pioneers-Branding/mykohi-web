const fs = require('fs');

function updateBlog(filename, rawTxtFile) {
    let html = fs.readFileSync(filename, 'utf8');
    const rawContent = fs.readFileSync(rawTxtFile, 'utf8');
    
    const startToken = '<!-- Left Column: Sticky TOC (Desktop only) -->';
    const endToken = '</article>';
    
    const startIdx = html.indexOf(startToken);
    const endIdx = html.indexOf(endToken, startIdx);
    
    if (startIdx !== -1 && endIdx !== -1) {
        html = html.substring(0, startIdx) + rawContent + html.substring(endIdx + endToken.length);
        fs.writeFileSync(filename, html, 'utf8');
        console.log("Successfully updated " + filename);
    } else {
        console.error("Tokens not found in " + filename);
    }
}

updateBlog('c:\\Users\\Intel\\Desktop\\MyKohi\\blog-tms-marketing-2026.html', 'c:\\Users\\Intel\\Desktop\\MyKohi\\blog1_raw.txt');
updateBlog('c:\\Users\\Intel\\Desktop\\MyKohi\\blog-local-seo-mental-health.html', 'c:\\Users\\Intel\\Desktop\\MyKohi\\blog2_raw.txt');
