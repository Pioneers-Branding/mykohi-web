const fs = require('fs');
let blogFile = 'c:\\Users\\Intel\\Desktop\\MyKohi\\blog.html';
let blogHtml = fs.readFileSync(blogFile, 'utf8');

// I need to find the specific block for the TMS blog and change its date to July 15, 2026.
const tmsTitleMatch = 'The Complete Guide to Marketing a TMS Clinic in 2026';
let tmsIndex = blogHtml.indexOf(tmsTitleMatch);

if (tmsIndex !== -1) {
    let dateIdx = blogHtml.lastIndexOf('July 6, 2026', tmsIndex);
    if(dateIdx !== -1 && tmsIndex - dateIdx < 1000) {
        blogHtml = blogHtml.substring(0, dateIdx) + 'July 15, 2026' + blogHtml.substring(dateIdx + 12);
        fs.writeFileSync(blogFile, blogHtml, 'utf8');
        console.log("Updated blog.html");
    } else {
        console.log("Date not found near TMS title in blog.html");
    }
} else {
    console.log("TMS title not found in blog.html");
}
