const fs = require('fs');

// Fix the TMS Marketing blog file date
let tmsFile = 'c:\\Users\\Intel\\Desktop\\MyKohi\\blog-tms-marketing-2026.html';
let tmsHtml = fs.readFileSync(tmsFile, 'utf8');
tmsHtml = tmsHtml.replace('July 6, 2026', 'July 15, 2026'); // If it was changed or already was something else
tmsHtml = tmsHtml.replace('July 15, 2025', 'July 15, 2026'); // Fallback
fs.writeFileSync(tmsFile, tmsHtml, 'utf8');

// Fix the blog.html listing page
let blogFile = 'c:\\Users\\Intel\\Desktop\\MyKohi\\blog.html';
let blogHtml = fs.readFileSync(blogFile, 'utf8');

// blog.html has a structure where each <article> has a title and a date.
// We need to carefully replace the date for the TMS Marketing article specifically.
// Let's find the start of the TMS marketing article title and replace the date preceding it.
const tmsTitle = 'Marketing a TMS Clinic in 2026';
let tmsIndex = blogHtml.indexOf(tmsTitle);

if(tmsIndex !== -1) {
    // Look backwards for the date 'July 6, 2026' within a reasonable window before the title
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

console.log("Finished date fix.");
