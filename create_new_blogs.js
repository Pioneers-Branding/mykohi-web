const fs = require('fs');

function createBlog(templatePath, newPath, title, date, image, content, description) {
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
                  `<img src="${image}" alt="${title}" class="w-full h-auto">`);
    
    // Replace Article Body completely
    let articleStart = html.indexOf('<article');
    let articleEnd = html.indexOf('</article>') + '</article>'.length;
    
    let newArticle = `<article class="prose prose-slate max-w-[800px] text-slate-700 leading-relaxed space-y-8 text-base md:text-lg">\n${content}\n</article>`;
    
    if (articleStart !== -1 && articleEnd !== -1) {
        html = html.substring(0, articleStart) + newArticle + html.substring(articleEnd);
    }
    
    // Remove TOC
    let tocStart = html.indexOf('<aside class="hidden lg:block sticky top-28 self-start">');
    let tocEnd = html.indexOf('</aside>') + '</aside>'.length;
    if (tocStart !== -1) {
        html = html.substring(0, tocStart) + html.substring(tocEnd);
    }
        
    fs.writeFileSync(newPath, html, 'utf8');
}


// Content for Blog 1
const content1 = `
<p class='text-slate-600 leading-relaxed text-lg first-letter:float-left first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:text-brand-600 first-letter:mr-3 first-letter:mt-1 first-letter:leading-none'>Attracting new patients to your mental health practice can often feel more challenging than the clinical work itself.</p>
<p class='text-slate-600 leading-relaxed'>Whether you are launching a new clinic or looking to scale an existing one, patient acquisition requires a multifaceted approach. In today's digital-first world, simply relying on word of mouth or insurance directories is not enough. You must actively position your practice as the premier choice in your local market.</p>
<h3 class='text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>1. Optimize Your Google Business Profile</h3>
<p class='text-slate-600 leading-relaxed'>Your Google Business Profile (GBP) is often the first interaction a patient has with your practice. Ensure it is completely filled out, accurate, and regularly updated. Add high-quality photos of your clinic, staff, and waiting room. Consistently post updates and respond to all reviews (always maintaining HIPAA compliance by never confirming a patient relationship in your response).</p>
<h3 class='text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>2. Build a High-Converting Website</h3>
<p class='text-slate-600 leading-relaxed'>Your website is your digital storefront. It needs to be fast, mobile-friendly, and easy to navigate. Most importantly, it must clearly communicate your unique value proposition. Use strong calls-to-action (CTAs) like 'Schedule a Consultation' or 'Book an Appointment' prominently on every page.</p>
<h3 class='text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>3. Leverage Local SEO</h3>
<p class='text-slate-600 leading-relaxed'>When someone searches for a psychiatrist or therapist, they usually add 'near me' or their city name. Local SEO ensures your practice shows up in these searches. Use location-based keywords throughout your website content, meta descriptions, and title tags.</p>
<h3 class='text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>4. Develop a Strong Referral Network</h3>
<p class='text-slate-600 leading-relaxed'>Referrals from other healthcare providers (primary care physicians, OB/GYNs, neurologists) are incredibly valuable. Invest time in meeting local doctors. Send them brief, informative updates about your practice's services, especially if you offer specialized treatments like TMS or Ketamine therapy.</p>
<h3 class='text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>5. Invest in Paid Advertising (Google Ads)</h3>
<p class='text-slate-600 leading-relaxed'>While SEO is a long-term strategy, Google Ads can generate immediate patient inquiries. Target high-intent keywords like 'anxiety treatment [city]' or 'TMS clinic near me'. Ensure your ads direct users to dedicated landing pages optimized for conversions, rather than just your homepage.</p>
<h3 class='text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>6. Utilize Content Marketing</h3>
<p class='text-slate-600 leading-relaxed'>Create informative blog posts, videos, or infographics that address common mental health questions or concerns. This not only helps with SEO by keeping your website fresh but also establishes you as an authority in your field.</p>
<h3 class='text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>7. Engage on Social Media</h3>
<p class='text-slate-600 leading-relaxed'>Social media platforms like Instagram and Facebook are excellent for brand awareness. Share mental health tips, behind-the-scenes glimpses of your clinic, and updates. Remember, the goal is engagement and education, not hard selling.</p>
<h3 class='text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>8. Offer Telehealth Services</h3>
<p class='text-slate-600 leading-relaxed'>The demand for telehealth has skyrocketed. Offering virtual appointments removes geographic and logistical barriers, significantly expanding your potential patient pool. Make sure this option is prominently advertised on your website and GBP.</p>
<h3 class='text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>9. Streamline the Intake Process</h3>
<p class='text-slate-600 leading-relaxed'>If a patient decides to book an appointment, the process must be frictionless. Utilize online booking systems and digital intake forms. If they have to call and leave a voicemail, or fill out a stack of paper forms in the waiting room, you risk losing them to a competitor with a more modernized process.</p>
<h3 class='text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>10. Focus on Patient Retention</h3>
<p class='text-slate-600 leading-relaxed'>Getting new patients is important, but retaining them is crucial for sustainable growth. Provide exceptional clinical care, ensure your front desk staff is empathetic and helpful, and follow up with patients after their appointments. A satisfied patient is your best marketing asset.</p>
<h3 class='text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>Conclusion</h3>
<p class='text-slate-600 leading-relaxed'>Growing your mental health practice requires a consistent, strategic approach. By combining digital marketing tactics with traditional networking and a focus on the patient experience, you can build a thriving, sustainable practice.</p>
`;

// Content for Blog 2
const content2 = `
<p class='text-slate-600 leading-relaxed text-lg first-letter:float-left first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:text-brand-600 first-letter:mr-3 first-letter:mt-1 first-letter:leading-none'>For TMS clinics, Search Engine Optimization (SEO) is not just a marketing tactic; it is the most valuable channel for sustainable patient acquisition.</p>
<p class='text-slate-600 leading-relaxed'>While paid advertising can turn on the tap for new leads quickly, organic search builds a long-term asset that continually drives high-intent patients to your practice without the recurring cost per click.</p>
<h3 class='text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>The Power of High-Intent Searches</h3>
<p class='text-slate-600 leading-relaxed'>When a patient searches for 'TMS therapy near me' or 'treatment for severe depression', they are actively seeking a solution. They have high intent. Showing up at the top of the organic search results for these queries positions your clinic as the most credible authority in your area.</p>
<p class='text-slate-600 leading-relaxed'>Patients trust Google. If Google ranks your clinic #1, patients inherently view you as the top provider. This trust translates to higher conversion rates compared to traffic generated from social media or even paid ads.</p>
<h3 class='text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>Building Topical Authority</h3>
<p class='text-slate-600 leading-relaxed'>To dominate organic search, you must build topical authority. This means your website needs comprehensive content covering all aspects of TMS therapy. You need a main 'TMS Therapy' page, but you also need supporting pages that answer specific questions:</p>
<ul class="list-disc pl-6 space-y-3 text-slate-600 marker:text-brand-500 mb-6">
    <li>Does TMS hurt?</li>
    <li>TMS vs. Ketamine for depression</li>
    <li>Is TMS covered by insurance?</li>
    <li>What to expect during a TMS session</li>
</ul>
<p class='text-slate-600 leading-relaxed'>By creating a web of interconnected, highly relevant content, you signal to Google that your site is the ultimate resource for TMS information in your region.</p>
<h3 class='text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>Local SEO: The Foundation for Clinics</h3>
<p class='text-slate-600 leading-relaxed'>Because TMS requires patients to visit your clinic daily for several weeks, they will inherently search for local providers. Local SEO is paramount.</p>
<p class='text-slate-600 leading-relaxed'>Ensure your Google Business Profile is fully optimized. Consistency in your Name, Address, and Phone number (NAP) across the web is crucial. Generate regular, authentic patient reviews, as review volume and sentiment are strong ranking factors for local search.</p>
<h3 class='text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>Technical SEO Matters</h3>
<p class='text-slate-600 leading-relaxed'>Great content won't rank if Google can't crawl or understand your website. Technical SEO ensures your site structure is sound. This includes:</p>
<ul class="list-disc pl-6 space-y-3 text-slate-600 marker:text-brand-500 mb-6">
    <li><strong>Site Speed:</strong> A slow website frustrates users and hurts rankings.</li>
    <li><strong>Mobile Responsiveness:</strong> The majority of local health searches happen on mobile devices.</li>
    <li><strong>Schema Markup:</strong> Use MedicalClinic and FAQ schema to help search engines understand your content better and display rich snippets in the search results.</li>
</ul>
<h3 class='text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>The ROI of Organic Search</h3>
<p class='text-slate-600 leading-relaxed'>SEO is an investment. It takes time—often 3 to 6 months—to see significant results. However, once you achieve top rankings, the return on investment (ROI) is unmatched. You will receive a steady stream of inquiries without having to pay for every single click.</p>
<p class='text-slate-600 leading-relaxed'>Furthermore, organic traffic compounds over time. An article you write today about 'TMS side effects' can continue to drive traffic and patients to your clinic for years to come.</p>
<h3 class='text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>Conclusion</h3>
<p class='text-slate-600 leading-relaxed'>For a TMS clinic looking to establish a dominant local presence and build a sustainable lead generation engine, SEO is indispensable. By focusing on topical authority, local optimization, and technical soundness, you can turn organic search into your most valuable patient acquisition channel.</p>
`;

createBlog('c:/Users/Intel/Desktop/MyKohi/blog-tms-marketing-2026.html', 
            'c:/Users/Intel/Desktop/MyKohi/blog-get-more-patients.html', 
            'How to Get More Patients for Your Mental Health Practice (10 Proven Strategies)', 
            'August 19, 2026', 
            'img/mental_health_patients.png', 
            content1, 
            'Discover 10 proven strategies to get more patients for your mental health practice. Learn how to optimize your website, utilize SEO, and build referral networks.');

createBlog('c:/Users/Intel/Desktop/MyKohi/blog-tms-marketing-2026.html', 
            'c:/Users/Intel/Desktop/MyKohi/blog-tms-clinic-seo.html', 
            'TMS Clinic SEO: Why Organic Search is Your Most Valuable Patient Channel', 
            'August 7, 2026', 
            'img/tms_clinic_seo.png', 
            content2, 
            'Learn why SEO and organic search are the most valuable patient acquisition channels for your TMS clinic. Maximize your reach and build topical authority.');

console.log("Successfully generated blogs.");
