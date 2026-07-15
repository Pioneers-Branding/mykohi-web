const fs = require('fs');

const file = 'c:\\Users\\Intel\\Desktop\\MyKohi\\blog-is-tms-legitimate.html';
let html = fs.readFileSync(file, 'utf8');

const newArticle = `
<article class="prose prose-slate max-w-[800px] text-slate-700 leading-relaxed space-y-8 text-base md:text-lg">
    <!-- Mobile/Tablet Table of Contents (Inline) -->
    <div class="lg:hidden bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8 max-w-md">
        <span class="text-[10px] font-mono font-bold text-brand-600 uppercase tracking-widest block mb-2">On This Page</span>
        <h4 class="font-display font-bold text-slate-900 text-base mb-3">Table of Contents</h4>
        <ul class="space-y-2 border-l-2 border-slate-200 pl-4 list-none m-0">
            <li><a href="#youre-not-alone" class="block text-slate-600 hover:text-brand-600 transition-colors font-semibold text-sm">You're not alone</a></li>
            <li><a href="#so-whats-the-science-behind-the-magic" class="block text-slate-600 hover:text-brand-600 transition-colors font-semibold text-sm">So What’s The Science Behind the “Magic”?</a></li>
            <li><a href="#medication-management-vs-magnetic-mastery" class="block text-slate-600 hover:text-brand-600 transition-colors font-semibold text-sm">Medication Management vs. Magnetic Mastery</a></li>
            <li><a href="#what-do-the-experts-say" class="block text-slate-600 hover:text-brand-600 transition-colors font-semibold text-sm">What Do the Experts Say?</a></li>
            <li><a href="#so-is-tms-legit-or-just-hype" class="block text-slate-600 hover:text-brand-600 transition-colors font-semibold text-sm">So, Is TMS Legit? Or Just Hype?</a></li>
        </ul>
    </div>

    <p class='text-slate-600 leading-relaxed text-lg first-letter:float-left first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:text-brand-600 first-letter:mr-3 first-letter:mt-1 first-letter:leading-none'>By Dr. Karan Narwal</p>
    
    <p class='text-slate-600 leading-relaxed'>Just imagine if you’ve gone through years of <a href="clinical-advisory.html" class="text-brand-600 font-semibold hover:underline">psychotherapy</a>. You’ve been told that you need to eat well, so you only shop at Whole Foods. You’ve been told exercise helps, so you’ve been keeping the gym routine going for over a year. Your last visit with your doctor resulted in a dosage increase with your Lexapro and you’ve been given something to help you sleep. This has been a battle for 6 years.</p>
    <p class='text-slate-600 leading-relaxed'><strong>Medication after medication</strong>, routine after routine. But that lack of interest in things you love is still existent, perhaps worse. Your therapist says they want to help you but right now feel that your symptoms are making it difficult to benefit from using the skills you're taught in therapy. They turn you to a <a href="clinic-assessment.html" class="text-brand-600 font-semibold hover:underline">TMS clinic</a> nearby. Mention something about <strong>magnets</strong>. This sounds crazy. This sounds completely out of a movie. It’s voodoo. You’ve been Googling "TMS therapy near me" or <strong>is TMS legitimate</strong>? You’ve been reading forums, asking friends and even searching YouTube.</p>
    
    <h3 id='youre-not-alone' class='scroll-mt-24 text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>You're not alone</h3>
    <p class='text-slate-600 leading-relaxed'>Transcranial Magnetic Stimulation (TMS) often gets lumped in with other so-called "alternative" treatments, right alongside kale cleanses and essential oils promising to heal your childhood trauma. But here’s the thing, TMS is not the traditional golden goose that big Pharma loves. They know it works, they know it helps and they know it brings revenue.</p>
    <div class="bg-brand-50 border-l-4 border-brand-500 rounded-r-xl p-6 my-6">
        <p class="text-brand-900 font-bold m-0">TMS is real. TMS is happening. TMS is an FDA-approved, scientifically backed, and highly effective treatment for depression and other mental health conditions.</p>
    </div>
    
    <h3 id='so-whats-the-science-behind-the-magic' class='scroll-mt-24 text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>So What’s The Science Behind the “Magic”?</h3>
    <p class='text-slate-600 leading-relaxed'>Let’s cut to the chase. TMS is a non-invasive procedure that uses magnetic pulses to stimulate areas of the brain associated with mood regulation, most specifically, the prefrontal cortex. Now if you’re thinking, “Magnetic pulses? Sounds like sci-fi,” well, so did MRIs once upon a time. But just like how an MRI doesn’t teleport you to another dimension, TMS therapy is not pseudoscience; it’s innovative psychiatry at its finest. It’s the use of energy, literally, to create an anti-depressant effect.</p>
    
    <ul class="list-disc pl-6 space-y-3 text-slate-600 marker:text-brand-500 mb-6">
        <li><strong>Proven by NIMH:</strong> The National Institute of Mental Health confirms that TMS is an effective alternative for individuals who have tried conventional medication management without success.</li>
        <li><strong>High Success Rates:</strong> According to a study published in <em>The American Journal of Psychiatry</em>, approximately <strong>50-60% of patients with treatment-resistant depression</strong> respond to TMS.</li>
        <li><strong>Full Remission:</strong> About <strong>30-40% achieve full remission</strong>—as in, depression packs its bags and leaves the premises.</li>
    </ul>
    
    <p class='text-slate-600 leading-relaxed'>Compare that to standard antidepressant medications, which, according to STAR*D trials, have about a <strong>27.5% success rate</strong> for those who fail their first prescription. If antidepressants were a batting average, they wouldn’t even make the minor leagues.</p>
    
    <h3 id='medication-management-vs-magnetic-mastery' class='scroll-mt-24 text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>Medication Management vs. Magnetic Mastery</h3>
    <p class='text-slate-600 leading-relaxed'>We’re not here to bash medication. Antidepressants and other psychiatric medications are a crucial part of comprehensive mental health care. But let’s be real, <strong>not everyone responds to meds the same way.</strong></p>
    
    <div class="grid md:grid-cols-2 gap-4 my-6">
        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <strong class="text-brand-600 block mb-2">The SSRI Reality</strong>
            <p class="text-sm text-slate-600">For some, selective serotonin reuptake inhibitors work wonders. For others, they come with a side of insomnia, weight gain, and an overwhelming urge to numb the side effects.</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <strong class="text-brand-600 block mb-2">The TMS Advantage</strong>
            <p class="text-sm text-slate-600">TMS is completely <strong>non-systemic</strong>, meaning no weight gain, no nausea, and no emotional zombification. The only side effect? A slight tapping sensation on your head.</p>
        </div>
    </div>
    
    <h3 id='what-do-the-experts-say' class='scroll-mt-24 text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>What Do the Experts Say?</h3>
    <p class='text-slate-600 leading-relaxed'>If you’re still skeptical, you’re in good company—so were medical professionals, until mountains of data shut down the doubts. Elite institutions have all endorsed TMS as a legitimate, effective option for treating depression, OCD, and even PTSD.</p>
    <ul class="list-disc pl-6 space-y-3 text-slate-600 marker:text-brand-500 mb-6">
        <li><strong>Harvard Medical School:</strong> Harvard Health Publishing reports that TMS therapy “appears to be effective and safe” for treatment-resistant depression, with notable long-term benefits.</li>
        <li><strong>Mayo Clinic:</strong> A Mayo Clinic study found that TMS provides “significant improvement” for patients who struggle with conventional psychiatric treatment options.</li>
        <li><strong>Johns Hopkins:</strong> Similarly endorses the use of TMS for patients with severe treatment-resistant symptoms.</li>
    </ul>
    
    <h3 id='so-is-tms-legit-or-just-hype' class='scroll-mt-24 text-2xl font-display font-bold text-slate-900 mt-8 mb-4'>So, Is TMS Legit? Or Just Hype?</h3>
    <p class='text-slate-600 leading-relaxed'>In short, Yes, TMS is the real deal. It’s not a cure-all, and it’s not for everyone, but for <strong>millions of individuals</strong> struggling with depression, anxiety, and other mental health disorders, it’s a beacon of hope that doesn’t require another pill bottle. It’s innovative psychiatry at its peak, offering a <strong>customized care</strong> approach that goes beyond the “here, try this prescription and call me in six weeks” model.</p>
    <p class='text-slate-600 leading-relaxed'>At <a href="index.html" class="text-brand-600 font-semibold hover:underline">MyKohi</a>, we specialize in helping clinics and providers grow, expand and resourcefully provide quality mental health treatment like TMS Therapy and Ketamine. The goal is to provide mental health treatment and comprehensive mental health care through guidance and support. Our services include <a href="marketing.html" class="text-brand-600 font-semibold hover:underline">marketing and consulting efforts</a> in order to maximize your digital presence and visibility with operational guidance and support.</p>
    <p class='text-slate-600 leading-relaxed font-semibold italic text-brand-700 text-center mt-6'>And yes, TMS is legitimate, and no, it won’t turn you into Magneto. But it just might help you finally feel like yourself again.</p>
</article>
`;

const startToken = '<article class="prose prose-slate';
const endToken = '</article>';
const startIdx = html.indexOf(startToken);
const endIdx = html.indexOf(endToken, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    html = html.substring(0, startIdx) + newArticle + html.substring(endIdx + endToken.length);
    fs.writeFileSync(file, html, 'utf8');
    console.log("Successfully updated blog-is-tms-legitimate.html");
} else {
    console.error("Could not find article bounds");
}
