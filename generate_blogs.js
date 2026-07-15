const fs = require('fs');

const baseFile = 'c:\\Users\\Intel\\Desktop\\MyKohi\\blog-future-of-mental-health.html';
let html = fs.readFileSync(baseFile, 'utf8');

// Blog 1
let blog1_html = html;
blog1_html = blog1_html.replace(/<title>.*?<\/title>/s, '<title>The Complete Guide to Marketing a TMS Clinic in 2026 | MyKohi Blog</title>');
blog1_html = blog1_html.replace(/<meta name="description" content=".*?">/s, '<meta name="description" content="Discover the ultimate strategies for marketing your TMS clinic in 2026. Learn omnichannel approaches, video marketing, and SEO tactics.">');

const schema1 = `
    <!-- Schema Markup -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://mykohi.com/blog-tms-marketing-2026.html"
      },
      "headline": "The Complete Guide to Marketing a TMS Clinic in 2026",
      "description": "Discover the ultimate strategies for marketing your TMS clinic in 2026. Learn omnichannel approaches, video marketing, and SEO tactics.",
      "image": "https://mykohi.com/img/tms_marketing_2026.png",  
      "author": {
        "@type": "Person",
        "name": "Dr. Karan Narwal"
      },  
      "publisher": {
        "@type": "Organization",
        "name": "MyKohi",
        "logo": {
          "@type": "ImageObject",
          "url": "https://img1.wsimg.com/isteam/ip/f791d9b9-2f6c-4539-b9b3-61b4c8a8a446/Blue%20Minimalist%20Brain%20Bulb%20Logo%20Transparent.png"
        }
      },
      "datePublished": "2026-07-15",
      "dateModified": "2026-07-15"
    }
    </script>
`;
blog1_html = blog1_html.replace('</head>', schema1 + '\n</head>');
blog1_html = blog1_html.replace(/<h1.*?>.*?<\/h1>/s, '<h1 class="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">The Complete Guide to Marketing a TMS Clinic in 2026</h1>');
blog1_html = blog1_html.replace('February 25, 2025', 'July 15, 2026');
blog1_html = blog1_html.replace(/<img src="img\/the-future-of-mental-health-treatment\.webp".*?>/s, '<img src="img/tms_marketing_2026.png" alt="Marketing a TMS Clinic in 2026" class="w-full h-full object-cover">');

const blog1_content = `
                        <p class='text-slate-600 leading-relaxed text-lg first-letter:float-left first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:text-brand-600 first-letter:mr-3 first-letter:mt-1 first-letter:leading-none'>The landscape of marketing a TMS clinic is rapidly evolving as we head into 2026. By Dr. Karan Narwal</p>
<p class='text-slate-600 leading-relaxed'>Transcranial Magnetic Stimulation (TMS) therapy is no longer a niche treatment. With growing FDA approvals and mainstream acceptance, competition is fierce. To stand out, you need a marketing strategy that is data-driven, patient-centric, and forward-thinking.</p>
<h3 id='understanding-the-2026-patient' class='scroll-mt-24 text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>Understanding the 2026 Patient</h3>
<p class='text-slate-600 leading-relaxed'>Patients today are highly educated and conduct extensive online research before choosing a clinic. They expect transparency, social proof, and a seamless digital experience. Your marketing must address their pain points directly and build trust from the first interaction.</p>
<h4 id='omnichannel-marketing-is-non-negotiable' class='scroll-mt-24 text-xl font-display font-bold text-slate-900 mt-6 mb-3'>1. Omnichannel Marketing is Non-Negotiable</h4>
<p class='text-slate-600 leading-relaxed'>Relying solely on one channel is a recipe for failure. A successful 2026 strategy integrates SEO, Google Ads, paid social (Facebook/Instagram/TikTok), and physician outreach. Consistency across all touchpoints reinforces your brand authority.</p>
<h4 id='the-power-of-video-content' class='scroll-mt-24 text-xl font-display font-bold text-slate-900 mt-6 mb-3'>2. The Power of Video Content</h4>
<p class='text-slate-600 leading-relaxed'>Video remains the most engaging format. Clinics must leverage patient testimonials (with proper consent), educational shorts, and behind-the-scenes clinic tours. Video humanizes your practice and demystifies the TMS experience for anxious prospects.</p>
<h3 id='faqs' class='scroll-mt-24 text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>Frequently Asked Questions (FAQs)</h3>
<div class='space-y-4 my-6'>
    <details class="group border border-slate-200 rounded-xl bg-white overflow-hidden">
        <summary class="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-800 hover:text-brand-600">
            What is the most effective marketing channel for TMS?
            <svg class="w-5 h-5 transition-transform group-open:rotate-180 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </summary>
        <div class="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4">
            A combination of local SEO and targeted Google Ads typically yields the highest ROI for patient acquisition.
        </div>
    </details>
    <details class="group border border-slate-200 rounded-xl bg-white overflow-hidden">
        <summary class="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-800 hover:text-brand-600">
            How much should a new clinic spend on marketing?
            <svg class="w-5 h-5 transition-transform group-open:rotate-180 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </summary>
        <div class="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4">
            It varies by market, but clinics should allocate a dedicated monthly budget to ensure consistent lead generation and brand visibility.
        </div>
    </details>
</div>
`;

const new_article1 = `
<article class="prose prose-slate max-w-[800px] text-slate-700 leading-relaxed space-y-8 text-base md:text-lg">
    ${blog1_content}
</article>
`;
blog1_html = blog1_html.replace(/<article.*?<\/article>/s, new_article1);
blog1_html = blog1_html.replace(/<aside.*?<\/aside>/s, '<aside class="hidden lg:block sticky top-28 self-start"></aside>');


// Blog 2
let blog2_html = html;
blog2_html = blog2_html.replace(/<title>.*?<\/title>/s, '<title>Local SEO for Mental Health Clinics: How to Rank #1 | MyKohi Blog</title>');
blog2_html = blog2_html.replace(/<meta name="description" content=".*?">/s, '<meta name="description" content="Learn how to dominate local search results and rank #1 in your city for your mental health clinic. Expert local SEO strategies.">');

const schema2 = `
    <!-- Schema Markup -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://mykohi.com/blog-local-seo-mental-health.html"
      },
      "headline": "Local SEO for Mental Health Clinics: How to Rank #1 in Your City",
      "description": "Learn how to dominate local search results and rank #1 in your city for your mental health clinic. Expert local SEO strategies.",
      "image": "https://mykohi.com/img/local_seo_mental_health.png",  
      "author": {
        "@type": "Person",
        "name": "Dr. Karan Narwal"
      },  
      "publisher": {
        "@type": "Organization",
        "name": "MyKohi",
        "logo": {
          "@type": "ImageObject",
          "url": "https://img1.wsimg.com/isteam/ip/f791d9b9-2f6c-4539-b9b3-61b4c8a8a446/Blue%20Minimalist%20Brain%20Bulb%20Logo%20Transparent.png"
        }
      },
      "datePublished": "2026-07-15",
      "dateModified": "2026-07-15"
    }
    </script>
`;
blog2_html = blog2_html.replace('</head>', schema2 + '\n</head>');
blog2_html = blog2_html.replace(/<h1.*?>.*?<\/h1>/s, '<h1 class="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">Local SEO for Mental Health Clinics: How to Rank #1 in Your City</h1>');
blog2_html = blog2_html.replace('February 25, 2025', 'July 15, 2026');
blog2_html = blog2_html.replace(/<img src="img\/the-future-of-mental-health-treatment\.webp".*?>/s, '<img src="img/local_seo_mental_health.png" alt="Local SEO for Mental Health Clinics" class="w-full h-full object-cover">');

const blog2_content = `
                        <p class='text-slate-600 leading-relaxed text-lg first-letter:float-left first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:text-brand-600 first-letter:mr-3 first-letter:mt-1 first-letter:leading-none'>Local SEO is the backbone of patient acquisition for any brick-and-mortar mental health clinic. By Dr. Karan Narwal</p>
<p class='text-slate-600 leading-relaxed'>When a potential patient searches for "psychiatrist near me" or "TMS therapy in [City]," you need to appear at the top. Local Search Engine Optimization (SEO) ensures your practice is visible to those actively seeking help in your community.</p>
<h3 id='optimizing-your-google-business-profile' class='scroll-mt-24 text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>Optimizing Your Google Business Profile (GBP)</h3>
<p class='text-slate-600 leading-relaxed'>Your GBP is often the first impression a patient has of your clinic. Ensure your NAP (Name, Address, Phone number) is accurate and consistent everywhere online. Select the correct primary and secondary categories (e.g., Mental Health Clinic, Psychiatrist), and add high-quality photos of your office interior, exterior, and staff.</p>
<h4 id='the-importance-of-reviews' class='scroll-mt-24 text-xl font-display font-bold text-slate-900 mt-6 mb-3'>1. The Importance of Reviews</h4>
<p class='text-slate-600 leading-relaxed'>Reviews are a major ranking factor for local SEO. Implement a compliant, automated system to request reviews from satisfied patients. Respond to all reviews—positive and negative—professionally and promptly to show that you value patient feedback.</p>
<h4 id='local-content-and-backlinks' class='scroll-mt-24 text-xl font-display font-bold text-slate-900 mt-6 mb-3'>2. Local Content and Backlinks</h4>
<p class='text-slate-600 leading-relaxed'>Create location-specific pages on your website if you serve multiple areas. Partner with other local health professionals and community organizations to earn local backlinks, which signal authority and relevance to search engines.</p>
<h3 id='faqs' class='scroll-mt-24 text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>Frequently Asked Questions (FAQs)</h3>
<div class='space-y-4 my-6'>
    <details class="group border border-slate-200 rounded-xl bg-white overflow-hidden">
        <summary class="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-800 hover:text-brand-600">
            How long does local SEO take to work?
            <svg class="w-5 h-5 transition-transform group-open:rotate-180 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </summary>
        <div class="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4">
            It typically takes 3 to 6 months to see significant improvements in local search rankings, depending on market competition.
        </div>
    </details>
    <details class="group border border-slate-200 rounded-xl bg-white overflow-hidden">
        <summary class="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-800 hover:text-brand-600">
            Is my website design important for SEO?
            <svg class="w-5 h-5 transition-transform group-open:rotate-180 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </summary>
        <div class="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4">
            Absolutely. A fast, mobile-friendly, and secure website is crucial for retaining visitors and signaling quality to search engines.
        </div>
    </details>
</div>
`;

const new_article2 = `
<article class="prose prose-slate max-w-[800px] text-slate-700 leading-relaxed space-y-8 text-base md:text-lg">
    ${blog2_content}
</article>
`;
blog2_html = blog2_html.replace(/<article.*?<\/article>/s, new_article2);
blog2_html = blog2_html.replace(/<aside.*?<\/aside>/s, '<aside class="hidden lg:block sticky top-28 self-start"></aside>');

fs.writeFileSync('c:\\Users\\Intel\\Desktop\\MyKohi\\blog-tms-marketing-2026.html', blog1_html, 'utf8');
fs.writeFileSync('c:\\Users\\Intel\\Desktop\\MyKohi\\blog-local-seo-mental-health.html', blog2_html, 'utf8');
