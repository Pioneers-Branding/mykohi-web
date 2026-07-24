const fs = require('fs');

function updateBlog(filename, asideHtml, articleHtml) {
    let html = fs.readFileSync(filename, 'utf8');
    
    // Replace Aside
    const asideStart = html.indexOf('<aside class="hidden lg:block sticky top-28 self-start"></aside>');
    if (asideStart !== -1) {
        html = html.substring(0, asideStart) + asideHtml + html.substring(asideStart + '<aside class="hidden lg:block sticky top-28 self-start"></aside>'.length);
    }
    
    // Replace Article
    const articleStartToken = '<article class="prose prose-slate max-w-[800px] text-slate-700 leading-relaxed space-y-8 text-base md:text-lg">';
    const articleStart = html.indexOf(articleStartToken);
    const articleEnd = html.indexOf('</article>', articleStart);
    if (articleStart !== -1 && articleEnd !== -1) {
        html = html.substring(0, articleStart) + articleHtml + html.substring(articleEnd + '</article>'.length);
    }
    
    fs.writeFileSync(filename, html, 'utf8');
}

// TMS Marketing Blog Content
const tmsAside = `
                <aside class="hidden lg:block sticky top-28 self-start">
                    <nav class="toc-sidebar space-y-4 max-h-[calc(100vh-160px)] overflow-y-auto pr-4 select-none">
                        <span class="text-[10px] font-mono font-bold text-brand-600 uppercase tracking-widest block">On This Page</span>
                        <ul class="relative space-y-1 border-l border-slate-200 pl-4 list-none m-0">
                            <li><a href="#understanding-the-2026-patient" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 text-sm font-bold border-l-2 border-transparent text-slate-700 hover:text-brand-600">Understanding the 2026 Patient</a></li>
                            <li><a href="#1-omnichannel-marketing" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 pl-3 text-xs font-normal border-l-2 border-transparent text-slate-500 hover:text-brand-600">1. Omnichannel Marketing is Non-Negotiable</a></li>
                            <li><a href="#2-the-power-of-video" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 pl-3 text-xs font-normal border-l-2 border-transparent text-slate-500 hover:text-brand-600">2. The Power of Video Content & Social Proof</a></li>
                            <li><a href="#3-advanced-seo-strategies" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 pl-3 text-xs font-normal border-l-2 border-transparent text-slate-500 hover:text-brand-600">3. Advanced SEO Strategies for TMS Clinics</a></li>
                            <li><a href="#4-data-driven-acquisition" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 pl-3 text-xs font-normal border-l-2 border-transparent text-slate-500 hover:text-brand-600">4. Data-Driven Patient Acquisition</a></li>
                            <li><a href="#faqs" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 text-sm font-bold border-l-2 border-transparent text-slate-700 hover:text-brand-600">Frequently Asked Questions (FAQs)</a></li>
                        </ul>
                    </nav>
                </aside>`;

const tmsArticle = `
<article class="prose prose-slate max-w-[800px] text-slate-700 leading-relaxed space-y-8 text-base md:text-lg">
    <!-- Mobile/Tablet Table of Contents (Inline) -->
    <div class="lg:hidden bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8 max-w-md">
        <span class="text-[10px] font-mono font-bold text-brand-600 uppercase tracking-widest block mb-2">On This Page</span>
        <h4 class="font-display font-bold text-slate-900 text-base mb-3">Table of Contents</h4>
        <ul class="space-y-2 border-l-2 border-slate-200 pl-4 list-none m-0">
            <li><a href="#understanding-the-2026-patient" class="block text-slate-600 hover:text-brand-600 transition-colors font-semibold text-sm">Understanding the 2026 Patient</a></li>
            <li><a href="#1-omnichannel-marketing" class="block text-slate-600 hover:text-brand-600 transition-colors pl-4 text-xs font-normal">1. Omnichannel Marketing is Non-Negotiable</a></li>
            <li><a href="#2-the-power-of-video" class="block text-slate-600 hover:text-brand-600 transition-colors pl-4 text-xs font-normal">2. The Power of Video Content & Social Proof</a></li>
            <li><a href="#3-advanced-seo-strategies" class="block text-slate-600 hover:text-brand-600 transition-colors pl-4 text-xs font-normal">3. Advanced SEO Strategies for TMS Clinics</a></li>
            <li><a href="#4-data-driven-acquisition" class="block text-slate-600 hover:text-brand-600 transition-colors pl-4 text-xs font-normal">4. Data-Driven Patient Acquisition</a></li>
            <li><a href="#faqs" class="block text-slate-600 hover:text-brand-600 transition-colors font-semibold text-sm">Frequently Asked Questions (FAQs)</a></li>
        </ul>
    </div>

    <p class='text-slate-600 leading-relaxed text-lg first-letter:float-left first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:text-brand-600 first-letter:mr-3 first-letter:mt-1 first-letter:leading-none'>The landscape of marketing a TMS clinic is rapidly evolving as we head into 2026. By Dr. Karan Narwal</p>
    <p class='text-slate-600 leading-relaxed'>Transcranial Magnetic Stimulation (TMS) therapy is no longer a niche treatment. With growing FDA approvals and mainstream acceptance, competition is fierce. To stand out, you need a marketing strategy that is data-driven, patient-centric, and forward-thinking. Gone are the days when a simple billboard or basic website could fill your patient roster. In 2026, building a reputable and highly profitable clinic means deeply understanding the modern patient journey and intersecting it with cutting-edge digital marketing tools.</p>
    
    <h3 id='understanding-the-2026-patient' class='scroll-mt-24 text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>Understanding the 2026 Patient</h3>
    <p class='text-slate-600 leading-relaxed'>Patients today are highly educated and conduct extensive online research before choosing a clinic. They expect transparency, social proof, and a seamless digital experience. When a patient considers TMS, they are often dealing with treatment-resistant depression or anxiety; they are vulnerable and looking for a beacon of hope. Your marketing must address their pain points directly and build trust from the first interaction.</p>
    
    <h4 id='1-omnichannel-marketing' class='scroll-mt-24 text-xl font-display font-bold text-slate-900 mt-6 mb-3'>1. Omnichannel Marketing is Non-Negotiable</h4>
    <p class='text-slate-600 leading-relaxed'>Relying solely on one channel is a recipe for failure. A successful 2026 strategy integrates SEO, Google Ads, paid social (Facebook/Instagram/TikTok), and physician outreach. Consistency across all touchpoints reinforces your brand authority. When a patient searches for TMS, sees your Google Ad, later notices your educational video on Instagram, and finally gets a referral from their primary care provider, your clinic becomes the undeniable choice.</p>
    
    <h4 id='2-the-power-of-video' class='scroll-mt-24 text-xl font-display font-bold text-slate-900 mt-6 mb-3'>2. The Power of Video Content & Social Proof</h4>
    <p class='text-slate-600 leading-relaxed'>Video remains the most engaging format. Clinics must leverage patient testimonials (with proper HIPAA-compliant consent), educational shorts explaining the science of neuroplasticity, and behind-the-scenes clinic tours. Video humanizes your practice and demystifies the TMS experience for anxious prospects. Seeing the actual TMS chair and hearing a calming voice explaining what the magnetic pulses feel like can drastically reduce patient friction.</p>
    
    <h4 id='3-advanced-seo-strategies' class='scroll-mt-24 text-xl font-display font-bold text-slate-900 mt-6 mb-3'>3. Advanced SEO Strategies for TMS Clinics</h4>
    <p class='text-slate-600 leading-relaxed'>Search Engine Optimization in 2026 goes beyond keyword stuffing. It requires answering the specific, long-tail questions patients are asking (Answer Engine Optimization or AEO). Creating deep, medically accurate content that addresses topics like "does TMS hurt?" or "TMS vs. Ketamine for TRD" establishes topical authority. Furthermore, local SEO ensures you dominate the "near me" searches in your specific geographic radius.</p>
    
    <h4 id='4-data-driven-acquisition' class='scroll-mt-24 text-xl font-display font-bold text-slate-900 mt-6 mb-3'>4. Data-Driven Patient Acquisition</h4>
    <p class='text-slate-600 leading-relaxed'>Finally, what gets measured gets managed. Utilizing advanced CRM tools to track the patient journey from the first click to the final consultation is critical. You must know your Cost Per Acquisition (CPA) for every channel. By implementing robust analytics, you can double down on the campaigns that yield high-quality leads and pause the ones that drain your budget.</p>
    
    <h3 id='faqs' class='scroll-mt-24 text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>Frequently Asked Questions (FAQs)</h3>
    <div class='space-y-4 my-6'>
        <details class="group border border-slate-200 rounded-xl bg-white overflow-hidden">
            <summary class="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-800 hover:text-brand-600">
                What is the most effective marketing channel for TMS?
                <svg class="w-5 h-5 transition-transform group-open:rotate-180 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </summary>
            <div class="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4">
                A combination of local SEO and targeted Google Ads typically yields the highest ROI for patient acquisition. Over time, organic SEO reduces your reliance on paid ads.
            </div>
        </details>
        <details class="group border border-slate-200 rounded-xl bg-white overflow-hidden">
            <summary class="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-800 hover:text-brand-600">
                How much should a new clinic spend on marketing?
                <svg class="w-5 h-5 transition-transform group-open:rotate-180 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </summary>
            <div class="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4">
                It varies by market, but clinics should allocate a dedicated monthly budget (often 10-15% of projected revenue) to ensure consistent lead generation and brand visibility during the startup phase.
            </div>
        </details>
        <details class="group border border-slate-200 rounded-xl bg-white overflow-hidden">
            <summary class="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-800 hover:text-brand-600">
                Does social media actually generate TMS patients?
                <svg class="w-5 h-5 transition-transform group-open:rotate-180 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </summary>
            <div class="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4">
                Yes, especially for brand awareness and retargeting. Platforms like Facebook and Instagram are excellent for sharing educational content and patient success stories that build trust.
            </div>
        </details>
    </div>
</article>
`;

updateBlog('c:\\Users\\Intel\\Desktop\\MyKohi\\blog-tms-marketing-2026.html', tmsAside, tmsArticle);

// Local SEO Blog Content
const seoAside = `
                <aside class="hidden lg:block sticky top-28 self-start">
                    <nav class="toc-sidebar space-y-4 max-h-[calc(100vh-160px)] overflow-y-auto pr-4 select-none">
                        <span class="text-[10px] font-mono font-bold text-brand-600 uppercase tracking-widest block">On This Page</span>
                        <ul class="relative space-y-1 border-l border-slate-200 pl-4 list-none m-0">
                            <li><a href="#the-foundation-of-local-seo" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 text-sm font-bold border-l-2 border-transparent text-slate-700 hover:text-brand-600">The Foundation of Local SEO</a></li>
                            <li><a href="#1-optimizing-gbp" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 pl-3 text-xs font-normal border-l-2 border-transparent text-slate-500 hover:text-brand-600">1. Optimizing Your Google Business Profile</a></li>
                            <li><a href="#2-the-importance-of-reviews" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 pl-3 text-xs font-normal border-l-2 border-transparent text-slate-500 hover:text-brand-600">2. The Importance of Patient Reviews</a></li>
                            <li><a href="#3-local-content-and-backlinks" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 pl-3 text-xs font-normal border-l-2 border-transparent text-slate-500 hover:text-brand-600">3. Local Content and Backlinks</a></li>
                            <li><a href="#4-technical-seo" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 pl-3 text-xs font-normal border-l-2 border-transparent text-slate-500 hover:text-brand-600">4. Technical SEO for Mental Health Websites</a></li>
                            <li><a href="#faqs" class="toc-link block transition-all duration-200 py-1.5 -ml-[17px] pl-4 text-sm font-bold border-l-2 border-transparent text-slate-700 hover:text-brand-600">Frequently Asked Questions (FAQs)</a></li>
                        </ul>
                    </nav>
                </aside>`;

const seoArticle = `
<article class="prose prose-slate max-w-[800px] text-slate-700 leading-relaxed space-y-8 text-base md:text-lg">
    <!-- Mobile/Tablet Table of Contents (Inline) -->
    <div class="lg:hidden bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8 max-w-md">
        <span class="text-[10px] font-mono font-bold text-brand-600 uppercase tracking-widest block mb-2">On This Page</span>
        <h4 class="font-display font-bold text-slate-900 text-base mb-3">Table of Contents</h4>
        <ul class="space-y-2 border-l-2 border-slate-200 pl-4 list-none m-0">
            <li><a href="#the-foundation-of-local-seo" class="block text-slate-600 hover:text-brand-600 transition-colors font-semibold text-sm">The Foundation of Local SEO</a></li>
            <li><a href="#1-optimizing-gbp" class="block text-slate-600 hover:text-brand-600 transition-colors pl-4 text-xs font-normal">1. Optimizing Your Google Business Profile</a></li>
            <li><a href="#2-the-importance-of-reviews" class="block text-slate-600 hover:text-brand-600 transition-colors pl-4 text-xs font-normal">2. The Importance of Patient Reviews</a></li>
            <li><a href="#3-local-content-and-backlinks" class="block text-slate-600 hover:text-brand-600 transition-colors pl-4 text-xs font-normal">3. Local Content and Backlinks</a></li>
            <li><a href="#4-technical-seo" class="block text-slate-600 hover:text-brand-600 transition-colors pl-4 text-xs font-normal">4. Technical SEO for Mental Health Websites</a></li>
            <li><a href="#faqs" class="block text-slate-600 hover:text-brand-600 transition-colors font-semibold text-sm">Frequently Asked Questions (FAQs)</a></li>
        </ul>
    </div>

    <p class='text-slate-600 leading-relaxed text-lg first-letter:float-left first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:text-brand-600 first-letter:mr-3 first-letter:mt-1 first-letter:leading-none'>Local SEO is the backbone of patient acquisition for any brick-and-mortar mental health clinic. By Dr. Karan Narwal</p>
    <p class='text-slate-600 leading-relaxed'>When a potential patient searches for "psychiatrist near me" or "TMS therapy in [City]," you need to appear at the top. Local Search Engine Optimization (SEO) ensures your practice is visible to those actively seeking help in your community. Let's break down the exact strategies you need to implement to rank #1 in the Local Pack and drive high-intent traffic to your website.</p>
    
    <h3 id='the-foundation-of-local-seo' class='scroll-mt-24 text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>The Foundation of Local SEO</h3>
    <p class='text-slate-600 leading-relaxed'>Search engines like Google use a different algorithm for local searches compared to global ones. They prioritize proximity, prominence, and relevance. If your clinic is located in downtown Chicago, your SEO efforts must signal to Google that you are the most prominent and relevant mental health provider in that specific geographic area.</p>
    
    <h4 id='1-optimizing-gbp' class='scroll-mt-24 text-xl font-display font-bold text-slate-900 mt-6 mb-3'>1. Optimizing Your Google Business Profile (GBP)</h4>
    <p class='text-slate-600 leading-relaxed'>Your Google Business Profile (formerly Google My Business) is the most critical element of your local SEO strategy. Ensure your NAP (Name, Address, Phone number) is accurate and consistent everywhere online. Select the correct primary and secondary categories (e.g., Mental Health Clinic, Psychiatrist), and add high-quality photos of your office interior, exterior, and staff. Fill out every single field Google offers, including services, products, and Q&A.</p>
    
    <h4 id='2-the-importance-of-reviews' class='scroll-mt-24 text-xl font-display font-bold text-slate-900 mt-6 mb-3'>2. The Importance of Patient Reviews</h4>
    <p class='text-slate-600 leading-relaxed'>Reviews are a major ranking factor for local SEO. Implement a compliant, automated system to request reviews from satisfied patients. Google looks at the quantity, quality, and velocity of reviews. Furthermore, you must respond to all reviews—positive and negative—professionally and promptly to show that you value patient feedback. Incorporating keywords naturally into your responses can also provide a slight SEO boost.</p>
    
    <h4 id='3-local-content-and-backlinks' class='scroll-mt-24 text-xl font-display font-bold text-slate-900 mt-6 mb-3'>3. Local Content and Backlinks</h4>
    <p class='text-slate-600 leading-relaxed'>Create location-specific pages on your website if you serve multiple areas. Partner with other local health professionals and community organizations to earn local backlinks. A link from the local Chamber of Commerce or a nearby allied health professional's blog signals massive local authority to search engines. Publish blog posts about mental health statistics in your city to further cement local relevance.</p>
    
    <h4 id='4-technical-seo' class='scroll-mt-24 text-xl font-display font-bold text-slate-900 mt-6 mb-3'>4. Technical SEO for Mental Health Websites</h4>
    <p class='text-slate-600 leading-relaxed'>None of this matters if your website is broken. You need blazing-fast loading speeds, mobile responsiveness, and clean schema markup. Implement LocalBusiness and MedicalClinic JSON-LD schema on your site to hand-feed Google exactly who you are, what you do, and where you are located. Ensure your site uses HTTPS to guarantee patient data security, which is heavily scrutinized in healthcare.</p>
    
    <h3 id='faqs' class='scroll-mt-24 text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>Frequently Asked Questions (FAQs)</h3>
    <div class='space-y-4 my-6'>
        <details class="group border border-slate-200 rounded-xl bg-white overflow-hidden">
            <summary class="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-800 hover:text-brand-600">
                How long does local SEO take to work?
                <svg class="w-5 h-5 transition-transform group-open:rotate-180 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </summary>
            <div class="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4">
                It typically takes 3 to 6 months to see significant improvements in local search rankings, depending on market competition and your baseline website authority.
            </div>
        </details>
        <details class="group border border-slate-200 rounded-xl bg-white overflow-hidden">
            <summary class="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-800 hover:text-brand-600">
                Is my website design important for SEO?
                <svg class="w-5 h-5 transition-transform group-open:rotate-180 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </summary>
            <div class="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4">
                Absolutely. A fast, mobile-friendly, and secure website is crucial for retaining visitors and signaling quality to search engines like Google.
            </div>
        </details>
        <details class="group border border-slate-200 rounded-xl bg-white overflow-hidden">
            <summary class="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-800 hover:text-brand-600">
                Do citations still matter for Local SEO?
                <svg class="w-5 h-5 transition-transform group-open:rotate-180 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </summary>
            <div class="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4">
                Yes, consistent citations across platforms like Healthgrades, Psychology Today, Yelp, and Apple Maps validate your business information and build foundational trust.
            </div>
        </details>
    </div>
</article>
`;

updateBlog('c:\\Users\\Intel\\Desktop\\MyKohi\\blog-local-seo-mental-health.html', seoAside, seoArticle);

console.log("Articles updated successfully.");

try {
    require('./generate_sitemap')();
} catch (e) {
    console.error("Failed to generate sitemap:", e);
}
