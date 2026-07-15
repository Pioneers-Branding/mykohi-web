const fs = require('fs');

const file = 'c:\\Users\\Intel\\Desktop\\MyKohi\\blog.html';
let html = fs.readFileSync(file, 'utf8');

const newArticles = `
                <!-- Article -->
                <article
                    class="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-100 transition-all duration-500 section-reveal"
                    style="animation-delay: 0.0s;">
                    <div class="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                        <img src="img/tms_marketing_2026.png"
                            alt="Marketing a TMS Clinic in 2026"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ">
                    </div>
                    <div class="p-6">
                        <div class="flex items-center gap-3 mb-3">
                            <span class="text-slate-400 text-sm">July 15, 2026</span>
                        </div>
                        <h3
                            class="text-xl font-display font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">
                            The Complete Guide to Marketing a TMS Clinic in 2026
                        </h3>
                        <p class="text-slate-500 text-sm leading-relaxed mb-4">
                            Discover the ultimate strategies for marketing your TMS clinic in 2026. Learn omnichannel approaches, video marketing, and SEO tactics.
                        </p>
                        <a href="blog-tms-marketing-2026.html"
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
                        <img src="img/local_seo_mental_health.png"
                            alt="Local SEO for Mental Health Clinics"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ">
                    </div>
                    <div class="p-6">
                        <div class="flex items-center gap-3 mb-3">
                            <span class="text-slate-400 text-sm">July 15, 2026</span>
                        </div>
                        <h3
                            class="text-xl font-display font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">
                            Local SEO for Mental Health Clinics: How to Rank #1 in Your City
                        </h3>
                        <p class="text-slate-500 text-sm leading-relaxed mb-4">
                            Learn how to dominate local search results and rank #1 in your city for your mental health clinic. Expert local SEO strategies.
                        </p>
                        <a href="blog-local-seo-mental-health.html"
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

html = html.replace('<!-- Article -->', newArticles + '                <!-- Article -->');
fs.writeFileSync(file, html, 'utf8');
