const fs = require('fs');

function createBlog(templatePath, newPath, title, date, image, content, description, tocHtml, faqsHtml) {
    let html = fs.readFileSync(templatePath, 'utf8');
    
    // Replace title
    html = html.replace(/<title>.*?<\/title>/s, `<title>${title} | MyKohi Blog</title>`);
    
    // Replace description
    html = html.replace(/<meta name="description" content=".*?">/s, `<meta name="description" content="${description}">`);
    
    // Replace schema image
    html = html.replace(/"image": "https:\/\/mykohi\.com\/img\/.*?"/g, `"image": "https://mykohi.com/${image}"`);
    
    // Replace headline in schema
    html = html.replace(/"headline": ".*?"/g, `"headline": "${title}"`);
    
    // Replace date published
    let dateFormatted = date.includes("19") ? "2026-08-19" : "2026-08-07";
    html = html.replace(/"datePublished": ".*?"/g, `"datePublished": "${dateFormatted}"`);
    html = html.replace(/"dateModified": ".*?"/g, `"dateModified": "${dateFormatted}"`);
    
    // Replace h1 title
    html = html.replace(/<h1 class="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">.*?<\/h1>/s,
                  `<h1 class="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">${title}</h1>`);
    
    // Replace Date in hero
    html = html.replace(/<span>July 15, 2026<\/span>/g, `<span>${date}</span>`);
    
    // Replace Thumbnail Image
    html = html.replace(/<img src="img\/tms_marketing_2026\.png" alt="Marketing a TMS Clinic in 2026" class="w-full h-auto">/g,
                  `<img src="${image}" alt="${title}" class="w-full h-64 lg:h-96 object-cover">`);
    
    // Replace TOC list
    let tocStart = html.indexOf('<ul class="relative space-y-1 border-l border-slate-200 pl-4 list-none m-0">');
    let tocEnd = html.indexOf('</ul>', tocStart);
    if (tocStart !== -1 && tocEnd !== -1) {
        html = html.substring(0, tocStart) + '<ul class="relative space-y-1 border-l border-slate-200 pl-4 list-none m-0">\n' + tocHtml + html.substring(tocEnd);
    }
    
    // Replace mobile TOC list
    let mobTocStart = html.indexOf('<ul class="space-y-2 border-l-2 border-slate-200 pl-4 list-none m-0">');
    let mobTocEnd = html.indexOf('</ul>', mobTocStart);
    if (mobTocStart !== -1 && mobTocEnd !== -1) {
        // Strip classes and re-add for mobile
        let mobileTocHtml = tocHtml.replace(/toc-link /g, '').replace(/py-1\.5 -ml-\[17px\] pl-4 text-sm font-bold border-l-2 border-transparent text-slate-700 hover:text-brand-600/g, 'block text-slate-600 hover:text-brand-600 transition-colors font-semibold text-sm').replace(/pl-3 text-xs font-normal border-l-2 border-transparent text-slate-500 hover:text-brand-600/g, 'block text-slate-600 hover:text-brand-600 transition-colors pl-4 text-xs font-normal');
        html = html.substring(0, mobTocStart) + '<ul class="space-y-2 border-l-2 border-slate-200 pl-4 list-none m-0">\n' + mobileTocHtml + html.substring(mobTocEnd);
    }

    // Replace Article Body completely (from after mobile TOC to the end of the <article> tag)
    // Actually we can replace everything between mobile TOC </div> and <h3 id='faqs'
    let articleContentStart = html.indexOf('</div>', mobTocEnd) + '</div>'.length;
    let faqsStart = html.indexOf("<h3 id='faqs'", articleContentStart);
    if (faqsStart === -1) faqsStart = html.indexOf('<h3 id="faqs"', articleContentStart);
    
    if (articleContentStart !== -1 && faqsStart !== -1) {
        html = html.substring(0, articleContentStart) + '\n' + content + '\n' + html.substring(faqsStart);
    }
    
    // Replace FAQs content
    let faqsContainerStart = html.indexOf("<div class='space-y-4 my-6'>");
    if (faqsContainerStart === -1) faqsContainerStart = html.indexOf('<div class="space-y-4 my-6">');
    let faqsContainerEnd = html.indexOf("</article>", faqsContainerStart);
    
    if (faqsContainerStart !== -1 && faqsContainerEnd !== -1) {
        // Find the last </div> before </article>
        let lastDivEnd = html.lastIndexOf('</div>', faqsContainerEnd);
        html = html.substring(0, faqsContainerStart) + "<div class='space-y-4 my-6'>\n" + faqsHtml + "\n    </div>\n" + html.substring(lastDivEnd + '</div>'.length);
    }
    
    fs.writeFileSync(newPath, html, 'utf8');
}


// CONTENT FOR BLOG 1 (Get More Patients)
const tocHtml1 = `
<li><a href="#optimize-gbp" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 text-sm font-bold border-l-2 border-transparent text-slate-700 hover:text-brand-600">1. Optimize Your Google Business Profile</a></li>
<li><a href="#build-website" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 text-sm font-bold border-l-2 border-transparent text-slate-700 hover:text-brand-600">2. Build a High-Converting Website</a></li>
<li><a href="#local-seo" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 text-sm font-bold border-l-2 border-transparent text-slate-700 hover:text-brand-600">3. Leverage Local SEO</a></li>
<li><a href="#referral-network" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 text-sm font-bold border-l-2 border-transparent text-slate-700 hover:text-brand-600">4. Develop a Referral Network</a></li>
<li><a href="#paid-ads" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 text-sm font-bold border-l-2 border-transparent text-slate-700 hover:text-brand-600">5. Invest in Paid Advertising</a></li>
<li><a href="#faqs" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 text-sm font-bold border-l-2 border-transparent text-slate-700 hover:text-brand-600">Frequently Asked Questions (FAQs)</a></li>
`;

const content1 = `
<p class='text-slate-600 leading-relaxed text-lg first-letter:float-left first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:text-brand-600 first-letter:mr-3 first-letter:mt-1 first-letter:leading-none'>Attracting new patients to your mental health practice can often feel more challenging than the clinical work itself.</p>
<p class='text-slate-600 leading-relaxed'>Whether you are launching a new clinic or looking to scale an existing one, patient acquisition requires a multifaceted approach. In today's digital-first world, simply relying on word of mouth or insurance directories is not enough. You must actively position your practice as the premier choice in your local market.</p>

<h3 id='optimize-gbp' class='scroll-mt-24 text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>1. Optimize Your Google Business Profile</h3>
<p class='text-slate-600 leading-relaxed'>Your Google Business Profile (GBP) is often the first interaction a patient has with your practice. Ensure it is completely filled out, accurate, and regularly updated. Add high-quality photos of your clinic, staff, and waiting room. Consistently post updates and respond to all reviews (always maintaining HIPAA compliance).</p>

<div class="bg-brand-50 border-l-4 border-brand-500 rounded-r-xl p-6 my-6">
    <h4 class="font-display font-bold text-brand-900 text-lg mb-3">Want to uncover hidden growth opportunities?</h4>
    <p class="text-brand-800 mb-4">Our proprietary practice assessment uncovers exactly where your clinic is losing patients and money.</p>
    <a href="practice-assessment.html" class="inline-block px-6 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition-colors">Take the Free Assessment</a>
</div>

<h3 id='build-website' class='scroll-mt-24 text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>2. Build a High-Converting Website</h3>
<p class='text-slate-600 leading-relaxed'>Your website is your digital storefront. It needs to be fast, mobile-friendly, and easy to navigate. Most importantly, it must clearly communicate your unique value proposition. Incorporate professional <a href="marketing.html" class="text-brand-600 font-semibold hover:underline">marketing services</a> to ensure your site is tailored for patient conversion.</p>

<h3 id='local-seo' class='scroll-mt-24 text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>3. Leverage Local SEO</h3>
<p class='text-slate-600 leading-relaxed'>When someone searches for a psychiatrist or therapist, they usually add 'near me' or their city name. Local SEO ensures your practice shows up in these searches. Use location-based keywords throughout your website content, meta descriptions, and title tags.</p>

<h3 id='referral-network' class='scroll-mt-24 text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>4. Develop a Strong Referral Network</h3>
<p class='text-slate-600 leading-relaxed'>Referrals from other healthcare providers are incredibly valuable. Invest time in meeting local doctors. Our <a href="practice-development.html" class="text-brand-600 font-semibold hover:underline">practice development strategies</a> often focus heavily on establishing strong, automated B2B referral networks.</p>

<div class="bg-slate-900 text-white rounded-xl p-6 my-6 shadow-xl">
    <h5 class="font-bold text-lg mb-3">Struggling with Patient Volume?</h5>
    <p class="text-slate-300 text-sm mb-4">You shouldn't have to navigate marketing alone while trying to treat patients. Let our experts handle patient acquisition for you.</p>
    <a href="contact.html" class="inline-block px-6 py-2 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100 transition-colors">Contact Our Growth Team</a>
</div>

<h3 id='paid-ads' class='scroll-mt-24 text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>5. Invest in Paid Advertising</h3>
<p class='text-slate-600 leading-relaxed'>While SEO is a long-term strategy, Google Ads can generate immediate patient inquiries. Target high-intent keywords like 'anxiety treatment [city]'. Ensure your ads direct users to dedicated landing pages optimized for conversions, rather than just your homepage.</p>
`;

const faqsHtml1 = `
<details class="group border border-slate-200 rounded-xl bg-white overflow-hidden">
    <summary class="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-800 hover:text-brand-600">
        How long does SEO take for a new clinic?
        <svg class="w-5 h-5 transition-transform group-open:rotate-180 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
    </summary>
    <div class="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4">
        Typically, a brand new website will take 3 to 6 months to start seeing significant traction in local organic search results.
    </div>
</details>
<details class="group border border-slate-200 rounded-xl bg-white overflow-hidden">
    <summary class="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-800 hover:text-brand-600">
        Should I focus on Google Ads or SEO first?
        <svg class="w-5 h-5 transition-transform group-open:rotate-180 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
    </summary>
    <div class="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4">
        We recommend doing both simultaneously. Google Ads provide immediate patient flow while your SEO foundation is being built for long-term sustainability.
    </div>
</details>
<details class="group border border-slate-200 rounded-xl bg-white overflow-hidden">
    <summary class="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-800 hover:text-brand-600">
        Do I really need to use social media for my mental health practice?
        <svg class="w-5 h-5 transition-transform group-open:rotate-180 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
    </summary>
    <div class="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4">
        While not mandatory for immediate lead generation, social media builds trust and brand awareness. It's a great platform for sharing educational content and connecting with your community.
    </div>
</details>
<details class="group border border-slate-200 rounded-xl bg-white overflow-hidden">
    <summary class="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-800 hover:text-brand-600">
        What is the most cost-effective way to get new patients quickly?
        <svg class="w-5 h-5 transition-transform group-open:rotate-180 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
    </summary>
    <div class="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4">
        Optimizing your Google Business Profile (GBP) is completely free and yields the highest return on investment. Combined with targeted Google Ads, you can generate immediate patient inquiries.
    </div>
</details>
<details class="group border border-slate-200 rounded-xl bg-white overflow-hidden">
    <summary class="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-800 hover:text-brand-600">
        How can I improve my clinic's local search rankings?
        <svg class="w-5 h-5 transition-transform group-open:rotate-180 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
    </summary>
    <div class="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4">
        Ensure consistent Name, Address, and Phone number (NAP) across all online directories, actively gather patient reviews, and create localized content on your website.
    </div>
</details>
<details class="group border border-slate-200 rounded-xl bg-white overflow-hidden">
    <summary class="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-800 hover:text-brand-600">
        Why are patient reviews so important for my clinic's marketing?
        <svg class="w-5 h-5 transition-transform group-open:rotate-180 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
    </summary>
    <div class="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4">
        Reviews act as powerful social proof. Prospective patients heavily rely on them when choosing a mental health provider. Additionally, a high volume of positive reviews strongly boosts your local SEO rankings.
    </div>
</details>
`;


// CONTENT FOR BLOG 2 (TMS Clinic SEO)
const tocHtml2 = `
<li><a href="#high-intent" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 text-sm font-bold border-l-2 border-transparent text-slate-700 hover:text-brand-600">The Power of High-Intent Searches</a></li>
<li><a href="#topical-authority" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 text-sm font-bold border-l-2 border-transparent text-slate-700 hover:text-brand-600">Building Topical Authority</a></li>
<li><a href="#local-seo" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 text-sm font-bold border-l-2 border-transparent text-slate-700 hover:text-brand-600">Local SEO for Clinics</a></li>
<li><a href="#technical-seo" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 text-sm font-bold border-l-2 border-transparent text-slate-700 hover:text-brand-600">Technical SEO Matters</a></li>
<li><a href="#roi" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 text-sm font-bold border-l-2 border-transparent text-slate-700 hover:text-brand-600">The ROI of Organic Search</a></li>
<li><a href="#faqs" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 text-sm font-bold border-l-2 border-transparent text-slate-700 hover:text-brand-600">Frequently Asked Questions (FAQs)</a></li>
`;

const content2 = `
<p class='text-slate-600 leading-relaxed text-lg first-letter:float-left first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:text-brand-600 first-letter:mr-3 first-letter:mt-1 first-letter:leading-none'>For TMS clinics, Search Engine Optimization (SEO) is not just a marketing tactic; it is the most valuable channel for sustainable patient acquisition.</p>
<p class='text-slate-600 leading-relaxed'>While paid advertising can turn on the tap for new leads quickly, organic search builds a long-term asset that continually drives high-intent patients to your practice without the recurring cost per click. To understand the broader scope of how this fits into your strategy, check out our <a href="marketing.html" class="text-brand-600 font-semibold hover:underline">comprehensive marketing services</a>.</p>

<h3 id='high-intent' class='scroll-mt-24 text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>The Power of High-Intent Searches</h3>
<p class='text-slate-600 leading-relaxed'>When a patient searches for 'TMS therapy near me' or 'treatment for severe depression', they are actively seeking a solution. They have high intent. Showing up at the top of the organic search results for these queries positions your clinic as the most credible authority in your area.</p>

<div class="bg-brand-50 border-l-4 border-brand-500 rounded-r-xl p-6 my-6">
    <h4 class="font-display font-bold text-brand-900 text-lg mb-3">Curious about your clinic's current SEO health?</h4>
    <p class="text-brand-800 mb-4">Find out how you stack up against competitors with a complete marketing and operational audit.</p>
    <a href="practice-assessment.html" class="inline-block px-6 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition-colors">Get Your Practice Assessment</a>
</div>

<h3 id='topical-authority' class='scroll-mt-24 text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>Building Topical Authority</h3>
<p class='text-slate-600 leading-relaxed'>To dominate organic search, you must build topical authority. This means your website needs comprehensive content covering all aspects of TMS therapy. You need a main 'TMS Therapy' page, but you also need supporting pages that answer specific questions.</p>
<p class='text-slate-600 leading-relaxed'>By creating a web of interconnected, highly relevant content, you signal to Google that your site is the ultimate resource for TMS information in your region. Learn more about how to structure these operations in our <a href="practice-development.html" class="text-brand-600 font-semibold hover:underline">Practice Development guide</a>.</p>

<h3 id='local-seo' class='scroll-mt-24 text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>Local SEO: The Foundation for Clinics</h3>
<p class='text-slate-600 leading-relaxed'>Because TMS requires patients to visit your clinic daily for several weeks, they will inherently search for local providers. Local SEO is paramount. Ensure your Google Business Profile is fully optimized. Consistency in your Name, Address, and Phone number (NAP) across the web is crucial.</p>

<div class="bg-slate-900 text-white rounded-xl p-6 my-6 shadow-xl">
    <h5 class="font-bold text-lg mb-3">Want to Dominate Your Local Market?</h5>
    <p class="text-slate-300 text-sm mb-4">Our specialized SEO team knows exactly what it takes to rank TMS clinics at the top of Google Maps.</p>
    <a href="contact.html" class="inline-block px-6 py-2 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100 transition-colors">Speak to an SEO Expert</a>
</div>

<h3 id='technical-seo' class='scroll-mt-24 text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>Technical SEO Matters</h3>
<p class='text-slate-600 leading-relaxed'>Great content won't rank if Google can't crawl or understand your website. Technical SEO ensures your site structure is sound. This includes site speed, mobile responsiveness, and proper schema markup (like MedicalClinic and FAQ schemas).</p>

<h3 id='roi' class='scroll-mt-24 text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>The ROI of Organic Search</h3>
<p class='text-slate-600 leading-relaxed'>SEO is an investment. It takes time to see significant results. However, once you achieve top rankings, the return on investment (ROI) is unmatched. You will receive a steady stream of inquiries without having to pay for every single click.</p>
`;

const faqsHtml2 = `
<details class="group border border-slate-200 rounded-xl bg-white overflow-hidden">
    <summary class="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-800 hover:text-brand-600">
        Why is my clinic not showing up on Google Maps?
        <svg class="w-5 h-5 transition-transform group-open:rotate-180 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
    </summary>
    <div class="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4">
        This is usually due to a lack of local SEO optimization, inconsistent NAP (Name, Address, Phone) citations, or simply having fewer reviews than your local competitors.
    </div>
</details>
<details class="group border border-slate-200 rounded-xl bg-white overflow-hidden">
    <summary class="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-800 hover:text-brand-600">
        How many blog posts should I write per month for SEO?
        <svg class="w-5 h-5 transition-transform group-open:rotate-180 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
    </summary>
    <div class="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4">
        Quality matters more than quantity. 2-4 highly optimized, long-form (1,500+ words) articles per month are far better than 10 short, low-quality posts.
    </div>
</details>
<details class="group border border-slate-200 rounded-xl bg-white overflow-hidden">
    <summary class="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-800 hover:text-brand-600">
        Is it worth paying an agency for TMS SEO?
        <svg class="w-5 h-5 transition-transform group-open:rotate-180 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
    </summary>
    <div class="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4">
        Yes. TMS is a highly competitive and specialized niche. A dedicated agency understands the specific medical terminology, patient intent, and HIPAA compliance requirements necessary to rank effectively without putting your practice at risk.
    </div>
</details>
<details class="group border border-slate-200 rounded-xl bg-white overflow-hidden">
    <summary class="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-800 hover:text-brand-600">
        What are the best keywords to target for a TMS clinic?
        <svg class="w-5 h-5 transition-transform group-open:rotate-180 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
    </summary>
    <div class="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4">
        Start with localized, high-intent keywords like "TMS therapy [your city]", "Treatment resistant depression [your city]", and "Neurostar/BrainsWay doctor near me".
    </div>
</details>
<details class="group border border-slate-200 rounded-xl bg-white overflow-hidden">
    <summary class="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-800 hover:text-brand-600">
        How does topical authority affect my search rankings?
        <svg class="w-5 h-5 transition-transform group-open:rotate-180 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
    </summary>
    <div class="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4">
        Google prioritizes websites that comprehensively cover a specific subject. By interlinking articles about TMS benefits, side effects, and costs, you prove to search engines that your site is an authoritative resource on TMS therapy.
    </div>
</details>
<details class="group border border-slate-200 rounded-xl bg-white overflow-hidden">
    <summary class="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-800 hover:text-brand-600">
        Can SEO help me get out-of-state patients for specialized treatments?
        <svg class="w-5 h-5 transition-transform group-open:rotate-180 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
    </summary>
    <div class="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4">
        Yes. While local SEO focuses on your immediate area, national SEO strategies can capture patients traveling for highly specialized protocols (like accelerated TMS or Ketamine) if your content outranks competitors nationwide.
    </div>
</details>
`;

createBlog('c:/Users/Intel/Desktop/MyKohi/blog-tms-marketing-2026.html', 
            'c:/Users/Intel/Desktop/MyKohi/blog-get-more-patients.html', 
            'How to Get More Patients for Your Mental Health Practice (10 Proven Strategies)', 
            'August 19, 2026', 
            'img/mental_health_patients.png', 
            content1, 
            'Discover 10 proven strategies to get more patients for your mental health practice. Learn how to optimize your website, utilize SEO, and build referral networks.',
            tocHtml1, faqsHtml1);

createBlog('c:/Users/Intel/Desktop/MyKohi/blog-tms-marketing-2026.html', 
            'c:/Users/Intel/Desktop/MyKohi/blog-tms-clinic-seo.html', 
            'TMS Clinic SEO: Why Organic Search is Your Most Valuable Patient Channel', 
            'August 7, 2026', 
            'img/tms_clinic_seo.png', 
            content2, 
            'Learn why SEO and organic search are the most valuable patient acquisition channels for your TMS clinic. Maximize your reach and build topical authority.',
            tocHtml2, faqsHtml2);

console.log("Successfully generated fixed layout blogs.");
