const fs = require('fs');

function fixThumbnail(file) {
    let html = fs.readFileSync(file, 'utf8');
    
    // Replace the wrapper div (removing aspect-[16/9])
    html = html.replace(
        '<div class="mb-8 rounded-2xl overflow-hidden aspect-[16/9] shadow-lg border border-slate-100 relative">',
        '<div class="mb-8 rounded-2xl overflow-hidden shadow-lg border border-slate-100 relative">'
    );
    
    // Replace the image class (changing h-full object-cover to h-auto)
    html = html.replace(
        'class="w-full h-full object-cover">',
        'class="w-full h-auto">'
    );
    
    fs.writeFileSync(file, html, 'utf8');
    console.log("Fixed " + file);
}

fixThumbnail('c:\\Users\\Intel\\Desktop\\MyKohi\\blog-local-seo-mental-health.html');
fixThumbnail('c:\\Users\\Intel\\Desktop\\MyKohi\\blog-tms-marketing-2026.html');
