const fs = require('fs');

let html = fs.readFileSync('c:/Users/Intel/Desktop/MyKohi/blog.html', 'utf8');

const newArticles = `
                <!-- Article -->
                <article
                    class="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-100 transition-all duration-500 section-reveal"
                    style="animation-delay: 0.0s;">
                    <div class="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                        <img src="img/mental_health_patients.png"
                            alt="How to Get More Patients for Your Mental Health Practice (10 Proven Strategies)"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ">
                    </div>
                    <div class="p-6">
                        <div class="flex items-center gap-3 mb-3">
                            <span class="text-slate-400 text-sm">August 19, 2026</span>
                        </div>
                        <h3
                            class="text-xl font-display font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">
                            How to Get More Patients for Your Mental Health Practice (10 Proven Strategies)
                        </h3>
                        <p class="text-slate-500 text-sm leading-relaxed mb-4">
                            Discover 10 proven strategies to get more patients for your mental health practice. Learn how to optimize your website, utilize SEO, and build referral networks.
                        </p>
                        <a href="blog-get-more-patients.html"
                            class="inline-flex items-center gap-2 text-brand-600 font-medium text-sm hover:gap-3 transition-all">
                            Read More
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    </div>
                </article>

                <!-- Article -->
                <article
                    class="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-100 transition-all duration-500 section-reveal"
                    style="animation-delay: 0.1s;">
                    <div class="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                        <img src="img/tms_clinic_seo.png"
                            alt="TMS Clinic SEO: Why Organic Search is Your Most Valuable Patient Channel"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ">
                    </div>
                    <div class="p-6">
                        <div class="flex items-center gap-3 mb-3">
                            <span class="text-slate-400 text-sm">August 7, 2026</span>
                        </div>
                        <h3
                            class="text-xl font-display font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">
                            TMS Clinic SEO: Why Organic Search is Your Most Valuable Patient Channel
                        </h3>
                        <p class="text-slate-500 text-sm leading-relaxed mb-4">
                            Learn why SEO and organic search are the most valuable patient acquisition channels for your TMS clinic. Maximize your reach and build topical authority.
                        </p>
                        <a href="blog-tms-clinic-seo.html"
                            class="inline-flex items-center gap-2 text-brand-600 font-medium text-sm hover:gap-3 transition-all">
                            Read More
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    </div>
                </article>
`;

let insertIndex = html.indexOf('<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">');
if (insertIndex !== -1) {
    let insertAfter = insertIndex + '<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">'.length;
    html = html.substring(0, insertAfter) + '\\n' + newArticles + html.substring(insertAfter);
    fs.writeFileSync('c:/Users/Intel/Desktop/MyKohi/blog.html', html, 'utf8');
}
