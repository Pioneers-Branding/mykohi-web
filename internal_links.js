const fs = require('fs');

function addInternalLinks() {
    let tmsFile = 'c:\\Users\\Intel\\Desktop\\MyKohi\\blog-tms-marketing-2026.html';
    let seoFile = 'c:\\Users\\Intel\\Desktop\\MyKohi\\blog-local-seo-mental-health.html';
    
    // Read files
    let tmsHtml = fs.readFileSync(tmsFile, 'utf8');
    let seoHtml = fs.readFileSync(seoFile, 'utf8');
    
    // Update SEO file date
    seoHtml = seoHtml.replace('July 15, 2026', 'July 6, 2026');
    
    // Define links
    const marketingLink = (text) => `<a href="marketing.html" class="text-brand-600 font-semibold hover:underline">${text}</a>`;
    const contactLink = (text) => `<a href="contact.html" class="text-brand-600 font-semibold hover:underline">${text}</a>`;
    const aboutLink = (text) => `<a href="about.html" class="text-brand-600 font-semibold hover:underline">${text}</a>`;
    
    // Add links to TMS Blog (Only replace first occurrences after the header)
    // Finding a safe place in the article to replace
    tmsHtml = tmsHtml.replace('marketing a TMS clinic', marketingLink('marketing a TMS clinic'));
    tmsHtml = tmsHtml.replace('book a consultation', contactLink('book a consultation'));
    tmsHtml = tmsHtml.replace('contact our office manager', contactLink('contact our office manager')); // if exists
    
    // Add links to SEO Blog
    seoHtml = seoHtml.replace('Local Search Engine Optimization (SEO)', marketingLink('Local Search Engine Optimization (SEO)'));
    seoHtml = seoHtml.replace('contact our office manager directly', contactLink('contact our office manager directly'));
    
    // Replace 'mental health clinic' but skip the title/headings if possible. 
    // We'll just replace the first one which is likely the paragraph text.
    let mhcIdx = seoHtml.indexOf('mental health clinic');
    if(mhcIdx !== -1) {
        // Find the second occurrence since the first is probably the title or alt text
        mhcIdx = seoHtml.indexOf('mental health clinic', mhcIdx + 1);
        mhcIdx = seoHtml.indexOf('mental health clinic', mhcIdx + 1); // skip alt text and title
        if(mhcIdx !== -1) {
            seoHtml = seoHtml.substring(0, mhcIdx) + aboutLink('mental health clinic') + seoHtml.substring(mhcIdx + 20);
        }
    }
    
    fs.writeFileSync(tmsFile, tmsHtml, 'utf8');
    fs.writeFileSync(seoFile, seoHtml, 'utf8');
    
    console.log("Internal links and date updated.");
}

addInternalLinks();
