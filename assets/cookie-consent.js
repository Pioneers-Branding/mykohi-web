/*
 * MyKohi cookie consent.
 *
 * Shows a banner until the visitor picks "Accept all" or "Essential only", and remembers the
 * choice for 12 months. Anything that sets non-essential cookies waits for "Accept all":
 *   - iframes:  <iframe data-consent-src="https://..."> (src is filled in after consent; until
 *               then a "Show map" style button lets the visitor load that one embed)
 *   - scripts:  <script type="text/plain" data-consent="analytics" data-src="https://...">
 *               (or inline code) runs only after consent, e.g. a future GA4 or Meta tag.
 * Any element with [data-cookie-settings] reopens the banner.
 * Other code can listen:  window.addEventListener('mykohi:consent', e => e.detail.choice)
 */
(function () {
  'use strict';
  var KEY = 'mykohi_cookie_consent';
  var VERSION = 1;
  var MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!v || v.v !== VERSION || (v.choice !== 'all' && v.choice !== 'essential')) return null;
      if (Date.now() - new Date(v.at).getTime() > MAX_AGE_MS) return null;
      return v.choice;
    } catch (e) { return null; }
  }

  function write(choice) {
    try { localStorage.setItem(KEY, JSON.stringify({ v: VERSION, choice: choice, at: new Date().toISOString() })); } catch (e) { }
  }

  var css = [
    '#mk-cc{position:fixed;z-index:2147483000;left:16px;right:16px;bottom:16px;max-width:440px;background:#fff;color:#0f172a;',
    'border:1px solid #e2e8f0;border-radius:20px;box-shadow:0 20px 50px rgba(15,23,42,.18);padding:20px 22px;',
    'font:400 14px/1.5 Inter,system-ui,-apple-system,"Segoe UI",sans-serif;transform:translateY(20px);opacity:0;',
    'transition:opacity .25s ease,transform .25s ease}',
    '#mk-cc.mk-show{transform:none;opacity:1}',
    '#mk-cc h2{margin:0 0 6px;font:700 17px/1.3 Syne,Inter,sans-serif;color:#0c4a6e}',
    '#mk-cc p{margin:0;color:#475569}',
    '#mk-cc .mk-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}',
    '#mk-cc button{flex:1 1 140px;cursor:pointer;border-radius:9999px;padding:10px 18px;font:600 14px/1.2 Inter,system-ui,sans-serif;',
    'border:1.5px solid #0284c7;transition:background .15s,color .15s}',
    '#mk-cc .mk-yes{background:#0284c7;color:#fff}',
    '#mk-cc .mk-yes:hover{background:#0369a1;border-color:#0369a1}',
    '#mk-cc .mk-no{background:#fff;color:#0369a1}',
    '#mk-cc .mk-no:hover{background:#f0f9ff}',
    '#mk-cc button:focus-visible,.mk-embed-btn:focus-visible{outline:3px solid #7dd3fc;outline-offset:2px}',
    '.mk-embed-wrap{position:relative}',
    '.mk-embed-ph{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;',
    'padding:24px;text-align:center;background:#f1f5f9;color:#475569;font:400 14px/1.5 Inter,system-ui,sans-serif}',
    '.mk-embed-btn{cursor:pointer;border:0;border-radius:9999px;background:#0284c7;color:#fff;padding:10px 20px;',
    'font:600 14px/1.2 Inter,system-ui,sans-serif}',
    '.mk-embed-btn:hover{background:#0369a1}',
    '@media (min-width:640px){#mk-cc{right:auto;left:24px;bottom:24px}}',
    '@media (prefers-reduced-motion:reduce){#mk-cc{transition:none}}',
    '@media print{#mk-cc{display:none}}'
  ].join('');

  function addStyle() {
    if (document.getElementById('mk-cc-style')) return;
    var s = document.createElement('style');
    s.id = 'mk-cc-style';
    s.textContent = css;
    document.head.appendChild(s);
  }

  // ---- Embeds and scripts held until consent ----

  function loadEmbed(frame) {
    var src = frame.getAttribute('data-consent-src');
    if (!src || frame.getAttribute('src')) return;
    frame.setAttribute('src', src);
    var ph = frame.parentNode && frame.parentNode.querySelector('.mk-embed-ph');
    if (ph) ph.remove();
  }

  function placeholder(frame) {
    if (frame.getAttribute('src') || frame.parentNode.querySelector('.mk-embed-ph')) return;
    frame.parentNode.classList.add('mk-embed-wrap');
    var label = frame.getAttribute('data-consent-label') || 'this content';
    var ph = document.createElement('div');
    ph.className = 'mk-embed-ph';
    var msg = document.createElement('p');
    msg.textContent = 'To show ' + label + ', we need to load a Google service that sets its own cookies.';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mk-embed-btn';
    btn.textContent = 'Show ' + label;
    btn.addEventListener('click', function () { loadEmbed(frame); });
    ph.appendChild(msg);
    ph.appendChild(btn);
    frame.parentNode.appendChild(ph);
  }

  function runScripts() {
    var list = document.querySelectorAll('script[type="text/plain"][data-consent]');
    for (var i = 0; i < list.length; i++) {
      var old = list[i];
      var s = document.createElement('script');
      for (var j = 0; j < old.attributes.length; j++) {
        var a = old.attributes[j];
        if (a.name !== 'type' && a.name !== 'data-src' && a.name !== 'data-consent') s.setAttribute(a.name, a.value);
      }
      if (old.getAttribute('data-src')) s.src = old.getAttribute('data-src');
      else s.text = old.text;
      old.parentNode.replaceChild(s, old);
    }
  }

  function apply(choice) {
    var frames = document.querySelectorAll('iframe[data-consent-src]');
    for (var i = 0; i < frames.length; i++) {
      if (choice === 'all') loadEmbed(frames[i]); else placeholder(frames[i]);
    }
    if (choice === 'all') runScripts();
  }

  // ---- Banner ----

  var banner = null;
  var lastFocus = null;

  function close() {
    if (!banner) return;
    var b = banner;
    banner = null;
    b.classList.remove('mk-show');
    setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 260);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function choose(choice) {
    write(choice);
    apply(choice);
    close();
    try { window.dispatchEvent(new CustomEvent('mykohi:consent', { detail: { choice: choice } })); } catch (e) { }
  }

  function open() {
    if (banner) return;
    addStyle();
    lastFocus = document.activeElement;
    banner = document.createElement('div');
    banner.id = 'mk-cc';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'false');
    banner.setAttribute('aria-labelledby', 'mk-cc-title');
    banner.setAttribute('aria-describedby', 'mk-cc-text');
    banner.innerHTML =
      '<h2 id="mk-cc-title">Cookies on MyKohi</h2>' +
      '<p id="mk-cc-text">We use essential cookies to run this site, including Google reCAPTCHA to keep our forms free of spam. ' +
      'With your permission we also load services such as Google Maps, which set their own cookies. ' +
      'You can change your choice any time from "Cookie settings" in the footer.</p>' +
      '<div class="mk-row"><button type="button" class="mk-no">Essential only</button>' +
      '<button type="button" class="mk-yes">Accept all</button></div>';
    banner.querySelector('.mk-yes').addEventListener('click', function () { choose('all'); });
    banner.querySelector('.mk-no').addEventListener('click', function () { choose('essential'); });
    banner.addEventListener('keydown', function (e) { if (e.key === 'Escape') choose('essential'); });
    document.body.appendChild(banner);
    requestAnimationFrame(function () { if (banner) banner.classList.add('mk-show'); });
    if (lastFocus && lastFocus !== document.body) banner.querySelector('.mk-no').focus();
  }

  function init() {
    addStyle();
    var choice = read();
    apply(choice || 'essential');
    if (!choice) open();
    document.addEventListener('click', function (e) {
      var t = e.target && e.target.closest && e.target.closest('[data-cookie-settings]');
      if (t) { e.preventDefault(); open(); if (banner) banner.querySelector('.mk-no').focus(); }
    });
  }

  window.MyKohiConsent = { get: read, open: open, set: choose };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
