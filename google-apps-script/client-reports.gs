/**
 * MyKohi client lead reports backend (Google Apps Script)
 *
 * Powers mykohi.com/reports/?c=<code>. Each client has an ads lead spreadsheet and a website
 * lead spreadsheet. This script reads every lead tab in them, drops test leads, and lets the
 * client leave comments on a lead and set its status. Clients, comments and status changes live in
 * a private "registry" sheet, so no access codes are stored in this file (this repo is publicly served).
 *
 * Status changes: when the lead's tab has a "Lead Status" column, the new status is written straight
 * into it. Otherwise (no such column, or the cell rejects the value) it is kept in the "Statuses" tab
 * and applied on top of the sheet. Every change is logged in "Statuses" either way.
 *
 * Setup (one time):
 *  1. Create a new Google Sheet, e.g. "MyKohi Client Reports". Extensions > Apps Script.
 *     Paste this file in as Code.gs and save. Reload the sheet: a "Client Reports" menu appears.
 *  2. Client Reports > Set up tabs. This creates the "Clients", "Comments" and "Statuses" tabs.
 *  3. Add one row per client in "Clients": Client name, Ads sheet URL, Website sheet URL.
 *     A cell can hold several sheets, one per line, each optionally labelled:
 *       Meta Ads: https://docs.google.com/spreadsheets/d/...
 *       Google Ads: https://docs.google.com/spreadsheets/d/...
 *     Leave Code blank and run Client Reports > Fill missing codes. Logo URL is optional; for a white
 *     logo, set Logo Background to a dark color such as #0f172a.
 *     Set Active to FALSE to switch a client's link off.
 *  4. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
 *     Approve access to your spreadsheets when asked.
 *  5. Copy the Web app URL into SCRIPT_URL in reports/index.html.
 *  6. The client's link is https://mykohi.com/reports/?c=<their code>
 *
 * Lead tabs are found automatically: any tab with a header row containing "Email" plus "ID" or
 * "Lead Status" is a form-lead tab, and any tab with "Caller phone number" is a call tab. The
 * header row can sit below a summary block; when a tab has more than one (an old header left at
 * the top), the lowest one wins. A pasted Google Ads call export with no header row is also
 * recognised (see CALL_EXPORT_COLUMNS). New campaign tabs show up without changes here.
 *
 * After editing this file: Deploy > Manage deployments > Edit > Version: New version.
 */

const CLIENTS_TAB = 'Clients';
const COMMENTS_TAB = 'Comments';
const CLIENT_HEADERS = ['Code', 'Client', 'Ads Sheet', 'Website Sheet', 'Logo URL', 'Logo Background', 'Active'];
const COMMENT_HEADERS = ['Timestamp', 'Client Code', 'Client', 'Lead Key', 'Lead', 'Author', 'Comment'];
const STATUSES_TAB = 'Statuses';
const STATUS_HEADERS = ['Timestamp', 'Client Code', 'Client', 'Lead Key', 'Lead', 'Status', 'Changed By', 'Written To Sheet'];
// Statuses a client can pick, and how each is written into a sheet's Lead Status column.
const SHEET_STATUS_LABELS = {
  'Not reviewed': '', 'Client contacted': 'Client Contacted', 'Valid': 'Valid',
  'Invalid': 'Invalid', 'Existing patient': 'Existing Patient',
};
const SECTIONS = [{ key: 'ads', column: 'Ads Sheet' }, { key: 'website', column: 'Website Sheet' }];
// Normalized header names never sent to the client.
const HIDDEN_COLUMNS = ['id', 'ipaddress', 'leadsource', 'leadform', 'xtwitter', 'company', 'submit', 'recaptchav3token',
  'hipaa', 'consent', 'adid', 'adname', 'adsetid', 'adsetname', 'campaignid', 'formid', 'formname', 'isorganic',
  'quizanswersjson', 'neutralcount', 'negativecount', 'positivecount', 'question1answer', 'question2answer',
  'question3answer', 'question4answer', 'question5answer', 'question6answer'];
// A lead is a test if its name or email has a word starting with "test" (test@, Testm, test2 — but
// not "greatest" or "contest"), or its status is "Test".
const TEST_PATTERN = /(^|[^a-z])test|@(mailinator|example)\./i;
// Contact-form spam: bot names where the last name is the first name plus two capitals
// ("AndrewMom" / "AndrewMomCX"), or a link alongside crypto / lottery bait. Hidden like test leads.
const SPAM_TEXT = /\b(btc|bitcoin|crypto|jackpot|promo code|withdraw|casino)\b/i;
const HEADER_SCAN_ROWS = 40;
// Column order of a Google Ads "call details" export, for call tabs pasted without their header row.
const CALL_EXPORT_COLUMNS = ['Start time', 'Duration (seconds)', 'Caller country code', 'Caller area code',
  'Caller phone number', 'Status', 'Call source', 'Call type', 'Campaign'];

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Client Reports')
    .addItem('Set up tabs', 'setupTabs')
    .addItem('Fill missing codes', 'fillMissingCodes')
    .addToUi();
}

function setupTabs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  [[CLIENTS_TAB, CLIENT_HEADERS], [COMMENTS_TAB, COMMENT_HEADERS], [STATUSES_TAB, STATUS_HEADERS]].forEach(([name, headers]) => {
    const sh = ss.getSheetByName(name) || ss.insertSheet(name);
    if (sh.getLastRow() === 0) sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  });
}

function fillMissingCodes() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CLIENTS_TAB);
  if (!sh || sh.getLastRow() < 2) return;
  const range = sh.getRange(2, 1, sh.getLastRow() - 1, 2);
  const values = range.getValues();
  values.forEach(row => {
    if (!row[0] && row[1]) {
      const slug = String(row[1]).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24);
      row[0] = slug + '-' + Utilities.getUuid().replace(/-/g, '').slice(0, 12);
    }
  });
  range.setValues(values);
}

function doPost(e) {
  try {
    const body = JSON.parse((e.postData && e.postData.contents) || '{}');
    const client = clientFor_(body.code);
    switch (body.action) {
      case 'load': return json(load_(client));
      case 'comment': return json(addComment_(client, body));
      case 'status': return json(setStatus_(client, body));
      default: return json({ ok: false, error: 'Unknown action' });
    }
  } catch (err) {
    return json({ ok: false, error: String(err.message || err) });
  }
}

function doGet() {
  return json({ ok: true, service: 'mykohi-client-reports' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// ---------- Clients ----------

function clientFor_(code) {
  code = String(code || '').trim();
  if (code.length < 8) throw new Error('Invalid link');
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CLIENTS_TAB);
  if (!sh) throw new Error('Reports are not set up yet');
  const values = sh.getDataRange().getValues();
  const headers = values.shift().map(String);
  const col = name => headers.indexOf(name);
  const row = values.find(r => String(r[col('Code')]).trim() === code);
  const active = row && (col('Active') === -1 || !/^(false|no|0)$/i.test(String(row[col('Active')]).trim()));
  if (!active) throw new Error('Invalid link');
  return {
    code: code,
    name: String(row[col('Client')] || ''),
    logo: col('Logo URL') === -1 ? '' : String(row[col('Logo URL')] || ''),
    logoBg: col('Logo Background') === -1 ? '' : String(row[col('Logo Background')] || '').trim(),
    sheets: SECTIONS.reduce((acc, s) => {
      acc[s.key] = col(s.column) === -1 ? '' : String(row[col(s.column)] || '');
      return acc;
    }, {}),
  };
}

// Every sheet listed in a cell, one per line: "Meta Ads: https://docs.google.com/..." or a bare link/ID.
function sources_(cell) {
  return String(cell || '').split(/[\n\r]+/).map(line => {
    const id = spreadsheetId_(line.replace(/^[^:]*:\s*(?=https?:)/, ''));
    const m = line.match(/^\s*(.*?)\s*[:|\-–]?\s*https?:/);
    return id ? { id: id, label: m ? m[1].trim() : '' } : null;
  }).filter(Boolean);
}

function spreadsheetId_(urlOrId) {
  const s = String(urlOrId || '').trim();
  const m = s.match(/\/d\/([a-zA-Z0-9_-]{20,})/);
  return m ? m[1] : (/^[a-zA-Z0-9_-]{20,}$/.test(s) ? s : '');
}

// ---------- Load ----------

function load_(client) {
  const sections = {};
  const overrides = statusOverrides_(client.code);
  SECTIONS.forEach(s => {
    const list = sources_(client.sheets[s.key]);
    sections[s.key] = list.length ? readSources_(list, client.name) : { connected: false, tabs: [] };
    sections[s.key].tabs.forEach(t => t.rows.forEach(r => {
      if (overrides[r.key]) r.status = overrides[r.key];
    }));
  });
  return {
    ok: true,
    client: { name: client.name, logo: client.logo, logoBg: /^#[0-9a-f]{3,8}$/i.test(client.logoBg) ? client.logoBg : '' },
    sections: sections,
    comments: commentsFor_(client.code),
    updatedAt: new Date().toISOString(),
  };
}

// Reads every lead tab across the section's sheets. Tab names are made unique across files (a
// second "Sheet1" becomes "Sheet1 (2)"), and a label written in front of a link in the Clients tab
// replaces the label made from the tab name.
function readSources_(list, clientName) {
  const found = [];
  list.forEach(src => {
    const ss = SpreadsheetApp.openById(src.id);
    const sheets = ss.getSheets().filter(sh => !sh.isSheetHidden());
    sheets.forEach(sh => found.push({ sh: sh, src: src }));
  });
  const used = {};
  const tabs = [];
  found.forEach(f => {
    let name = f.sh.getName();
    for (let n = 2; used[name]; n++) name = f.sh.getName() + ' (' + n + ')';
    const tab = readTab_(f.sh, name);
    if (!tab) return;
    used[name] = true;
    tab.src = f.src;
    tab.autoName = f.sh.getName();
    tabs.push(tab);
  });
  const labels = tabLabels_(tabs.map(t => t.autoName), clientName);
  tabs.forEach(t => {
    const auto = labels[t.autoName];
    const siblings = tabs.filter(o => o.src === t.src).length;
    t.label = t.src.label ? (siblings > 1 ? t.src.label + ' · ' + auto : t.src.label) : auto;
    delete t.src;
    delete t.autoName;
  });
  return { connected: true, tabs: tabs };
}

function readTab_(sh, tabName) {
  if (sh.isSheetHidden()) return null;
  const range = sh.getDataRange();
  const values = range.getValues();
  const display = range.getDisplayValues();
  let header = null;
  for (let i = 0; i < Math.min(values.length, HEADER_SCAN_ROWS); i++) {
    const keys = values[i].map(normKey_);
    // A data row holding header text (Meta rows shifted by a broken append) is not a header.
    if (display[i].some(v => /@/.test(v))) continue;
    if (keys.indexOf('email') !== -1 && (keys.indexOf('id') !== -1 || keys.indexOf('leadstatus') !== -1)) {
      header = { row: i, kind: 'form', hasStatus: keys.indexOf('leadstatus') !== -1 };
    } else if (keys.indexOf('callerphonenumber') !== -1) {
      header = { row: i, kind: 'call', hasStatus: false };
    }
  }
  if (!header) header = headerlessCallExport_(values, display);
  if (!header) return null;
  return {
    name: tabName || sh.getName(),
    kind: header.kind,
    hasStatus: header.hasStatus,
    rows: parseRows_(tabName || sh.getName(), header.kind, values, display, header.row),
  };
}

// A call export pasted without its header: first column is a date, a later one says "click-to-call"
// or holds a ###-###-#### number. The row above the first such row becomes the header, using the
// export's column names and keeping any titles the team added past them (e.g. "Notes from Sandra").
function headerlessCallExport_(values, display) {
  const first = display.findIndex(row => DATE_TEXT.test(cleanText_(row[0])) &&
    row.some(v => /click-to-call|^\d{3}-\d{3}-\d{4}$/i.test(cleanText_(v))));
  if (first === -1 || first > HEADER_SCAN_ROWS) return null;
  const above = first > 0 ? values[first - 1] : [];
  const width = values[first].length;
  const names = [];
  for (let c = 0; c < width; c++) names.push(CALL_EXPORT_COLUMNS[c] || String(above[c] || '').trim());
  if (first > 0) {
    values[first - 1] = names;
    display[first - 1] = names;
  } else {
    values.unshift(names);
    display.unshift(names);
  }
  return { row: first > 0 ? first - 1 : 0, kind: 'call', hasStatus: false };
}

function parseRows_(tabName, kind, values, display, headerRow) {
  const headers = values[headerRow].map(h => String(h).trim());
  const keys = headers.map(normKey_);
  const idx = name => keys.indexOf(name);
  const timeCol = kind === 'call' ? idx('starttime') : (idx('createdat') !== -1 ? idx('createdat') : idx('createdtime'));
  const out = [];
  const submitted = {}; // signature -> timestamps, for dropping repeat submissions

  for (let r = headerRow + 1; r < values.length; r++) {
    const raw = values[r];
    if (!raw.some(v => v !== '' && v !== null)) continue;
    const text = c => (c === -1 ? '' : cleanText_(display[r][c]));
    // Some rows have the date in another column (older form versions) or none in the date column;
    // fall back to the first other cell that looks like a date.
    let dateCol = timeCol;
    let when = timeCol === -1 ? null : toDate_(raw[timeCol]);
    for (let c = 0; !when && c < raw.length; c++) {
      if (c === timeCol || !(raw[c] instanceof Date || DATE_TEXT.test(text(c)))) continue;
      when = toDate_(raw[c]);
      if (when) dateCol = c;
    }

    const row = {
      kind: kind,
      ts: when ? when.getTime() : null,
      // Dates show as they appear in the sheet; only bare serial numbers get formatted.
      when: !when ? '' : typeof raw[dateCol] === 'number' ? Utilities.formatDate(when, 'UTC', 'MMM dd, yyyy, HH:mm') : isoAsWritten_(text(dateCol)),
      details: [],
    };

    if (kind === 'form') {
      const first = text(idx('firstname'));
      const last = text(idx('lastname'));
      row.name = [first, last].filter(Boolean).join(' ') || text(idx('name')) || text(idx('fullname'));
      row.email = text(idx('email'));
      row.phone = prettyValue_('phone', text(idx('phone') !== -1 ? idx('phone') : idx('phonenumber')));
      row.status = normStatus_(text(idx('leadstatus')));
      if (row.status === 'Test' || TEST_PATTERN.test(row.name + ' ' + row.email)) continue;
      if (!row.name && !row.email && !row.phone) continue;
      if (isSpam_(first, last, text(idx('message')) + ' ' + text(idx('comments')))) continue;
      const id = text(idx('id'));
      row.key = tabName + '|' + (id || row.ts + '|' + row.email);
    } else {
      row.name = text(idx('callerphonenumber'));
      row.phone = row.name;
      row.status = 'Not reviewed';
      row.duration = Number(raw[idx('durationseconds')]) || 0;
      row.campaign = text(idx('campaign'));
      row.key = tabName + '|' + row.ts + '|' + row.phone;
    }

    const shown = ['firstname', 'lastname', 'name', 'fullname', 'email', 'phone', 'phonenumber', 'leadstatus',
      'createdat', 'createdtime', 'starttime', 'callerphonenumber', 'callercountrycode', 'callerareacode', 'durationseconds'];
    // Forms that changed over time leave duplicate columns (Reason_for_inquiry / Reason_for_Inquiry);
    // the first non-empty one wins.
    const seen = {};
    headers.forEach((h, c) => {
      if (!h || seen[keys[c]] || shown.indexOf(keys[c]) !== -1 || HIDDEN_COLUMNS.indexOf(keys[c]) !== -1) return;
      const v = prettyValue_(keys[c], text(c));
      if (!v) return;
      seen[keys[c]] = true;
      row.details.push([prettyHeader_(h), v]);
    });
    // Forms often fire several times for one person (double clicks, retries): an identical
    // submission within an hour of another counts once.
    const signature = [row.name, row.email, row.phone, JSON.stringify(row.details)].join('|').toLowerCase();
    const times = submitted[signature] || (submitted[signature] = []);
    if (row.ts !== null && times.some(t => Math.abs(t - row.ts) < 3600000)) continue;
    if (row.ts !== null) times.push(row.ts);
    out.push(row);
  }
  return out;
}

// Meta exports dates as "2026-08-28T00:51:39+05:30"; show them as written ("Aug 28, 2026, 00:51").
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function isoAsWritten_(s) {
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  return m ? MONTHS[Number(m[2]) - 1] + ' ' + m[3] + ', ' + m[1] + ', ' + m[4] + ':' + m[5] : s;
}

// Form tools export choices as codes ("blue_cross_blue_shield", "tms-neurology", "— Select a service —")
// and Meta prefixes phone and zip values ("p:+1732…", "z:07726"). Turn those into readable text.
function prettyValue_(key, v) {
  v = v.replace(/^[pz]:(?=[+\d<])/, '').replace(/^_+|_+$/g, '');
  if (/^[—-]+\s*select\b/i.test(v)) return '';
  if (key === 'platform') return { fb: 'Facebook', ig: 'Instagram', an: 'Audience Network', msg: 'Messenger' }[v.toLowerCase()] || v;
  if (/^[a-z]+$/.test(v)) return ACRONYMS.indexOf(v) !== -1 ? v.toUpperCase() : v.charAt(0).toUpperCase() + v.slice(1);
  // Needs a letter, so phone numbers and zip+4 ("732-853-1725") stay as they are.
  if (/[a-z]/.test(v) && /^[a-z0-9–]+(?:[_-]+[a-z0-9–\/]+)+$/.test(v)) {
    const t = v.split(/[_-]+/).map(w => (ACRONYMS.indexOf(w) !== -1 ? w.toUpperCase() : w)).join(' ').replace(/\s*\/\s*/g, ' / ');
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
  return v;
}

function isSpam_(first, last, message) {
  if (first && last && last.length === first.length + 2 && last.indexOf(first) === 0 && /^[A-Z]{2}$/.test(last.slice(-2))) return true;
  // Same made-up word as first and last name, with capitals mid-word ("JosephBEala JosephBEala").
  if (first && first === last && /[a-z][A-Z]/.test(first)) return true;
  // Forum-style link markup is never typed by a patient.
  if (/\[url=/i.test(message)) return true;
  return /https?:\/\//i.test(message) && SPAM_TEXT.test(message);
}

function normKey_(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
}

function prettyHeader_(h) {
  // Meta lead forms use the question as the header: drop its "(e.g., ...)" hint.
  const s = h.replace(/_/g, ' ').replace(/\s+/g, ' ').replace(/\s*\(e\.g\.[^)]*\)?\s*$/i, '').replace(/:$/, '').trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function normStatus_(s) {
  const k = normKey_(s);
  if (!k) return 'Not reviewed';
  if (k === 'test') return 'Test';
  if (k.indexOf('contacted') !== -1) return 'Client contacted';
  if (k.indexOf('invalid') === 0) return 'Invalid';
  if (k.indexOf('valid') === 0) return 'Valid';
  if (k.indexOf('existing') === 0) return 'Existing patient';
  if (k.indexOf('outof') === 0) return 'Out of location';
  if (k === 'good') return 'Valid';
  if (k === 'created' || k === 'new') return 'Not reviewed';
  if (k === 'bad' || k === 'junk' || k === 'spam') return 'Invalid';
  // Anything long or with digits is a stray value (e.g. an address pasted into the column).
  if (s.length > 30 || /\d/.test(s)) return 'Not reviewed';
  return s;
}

// Sheet cells hold real dates, date serial numbers, or text like "Sep 01, 2026, 20:40".
// Text like "Sep 25, 2026, 1:00:00 PM".
const DATE_TEXT = /^[A-Z][a-z]{2,8}\.? \d{1,2}, \d{4}/;

// Exports can leave non-breaking spaces and mis-encoded punctuation ("â€¯", "â€“") inside values.
const MOJIBAKE = { 'â€¯': ' ', 'â€“': '–', 'â€”': '—', 'â€™': '’', 'â€˜': '‘', 'â€œ': '“', 'â€\u009d': '”' };
function cleanText_(v) {
  return String(v === null || v === undefined ? '' : v)
    .replace(/â€[¯“”™˜œ\u009d]/g, m => MOJIBAKE[m] || m)
    .replace(/[\u202f\u00a0]/g, ' ')
    .trim();
}

function toDate_(v) {
  if (v instanceof Date && !isNaN(v)) return v;
  if (typeof v === 'number' && v > 20000 && v < 80000) {
    return new Date(Math.round((v - 25569) * 86400000));
  }
  const s = cleanText_(v).replace(/,(\s*\d{1,2}:\d{2})/, ' $1');
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d) ? null : d;
}

// "interpsychaz-g-spravato" -> "Spravato · Google". Drops the prefix all tabs share, the client's
// own name ("Anew Era Google Ads Lead Sheet" -> "Google Ads") and a trailing "Lead Sheet".
const ACRONYMS = ['tms', 'ect', 'iv', 'lp', 'ocd', 'ptsd', 'adhd', 'ppc', 'seo', 'az', 'tx', 'nj', 'ny', 'bcbs', 'gad', 'mdd', 'lp'];
function tabLabels_(names, clientName) {
  const client = normKey_(clientName || '');
  const clientWords = String(clientName || '').split(/\s+/).map(normKey_);
  const hyphenated = names.filter(n => n.indexOf('-') !== -1);
  const firsts = hyphenated.map(n => n.split('-')[0].toLowerCase());
  const shared = hyphenated.length > 1 && firsts.every(f => f === firsts[0]) ? firsts[0] : '';
  const platforms = { g: 'Google', google: 'Google', meta: 'Meta', fb: 'Meta', facebook: 'Meta', bing: 'Bing' };
  const labels = {};
  names.forEach(n => {
    let parts = n.split(/[-_]/).map(p => p.trim()).filter(Boolean);
    if (shared && parts[0].toLowerCase() === shared && parts.length > 1) parts = parts.slice(1);
    let platform = '';
    parts = parts.filter(p => {
      const pl = platforms[p.toLowerCase()];
      if (pl) { platform = pl; return false; }
      return true;
    });
    let words = parts.join(' ').replace(/\s*\b(leads?\s+)?sheet$/i, '').split(/\s+/).filter(Boolean);
    // Drop leading words that are part of the client's name ("Anew Era ...", "Interpsychaz ...",
    // "ritesh website form" for Dr Ritesh Amin, "PA Quiz" for Options PA).
    while (client && words.length > 1 && (normKey_(words[0]).length >= 3 && client.indexOf(normKey_(words[0])) !== -1 ||
      clientWords.indexOf(normKey_(words[0])) !== -1)) {
      words = words.slice(1);
    }
    if (/^sheet\d*$/i.test(words.join(''))) words = ['Leads'];
    words = words.map(w => ACRONYMS.indexOf(w.toLowerCase()) !== -1 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1));
    labels[n] = (words.join(' ') || n) + (platform ? ' · ' + platform : '');
  });
  return labels;
}

// ---------- Comments ----------

function commentsSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(COMMENTS_TAB);
  if (!sh) {
    sh = ss.insertSheet(COMMENTS_TAB);
    sh.appendRow(COMMENT_HEADERS);
  }
  return sh;
}

function commentsFor_(code) {
  const values = commentsSheet_().getDataRange().getValues();
  values.shift();
  return values
    .filter(r => String(r[1]) === code)
    .map(r => ({
      at: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
      leadKey: String(r[3]),
      author: String(r[5]),
      text: String(r[6]),
    }));
}

function addComment_(client, body) {
  const text = String(body.text || '').trim().slice(0, 2000);
  const author = String(body.author || '').trim().slice(0, 80) || 'Client';
  const leadKey = String(body.leadKey || '').slice(0, 300);
  if (!text || !leadKey) throw new Error('Comment is empty');
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const now = new Date();
    // A leading = + - @ would make Sheets treat the text as a formula.
    const cell = s => (/^[=+\-@]/.test(s) ? "'" + s : s);
    commentsSheet_().appendRow([now, client.code, client.name, cell(leadKey), cell(String(body.leadName || '').slice(0, 120)), cell(author), cell(text)]);
    return { ok: true, comment: { at: now.toISOString(), leadKey: leadKey, author: author, text: text } };
  } finally {
    lock.releaseLock();
  }
}

// ---------- Statuses ----------

function statusesSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(STATUSES_TAB);
  if (!sh) {
    sh = ss.insertSheet(STATUSES_TAB);
    sh.appendRow(STATUS_HEADERS);
  }
  return sh;
}

// Latest status per lead that could not be written into the lead's own sheet. Statuses that were
// written to the sheet are left to the sheet, so later edits by the team there still win.
function statusOverrides_(code) {
  const values = statusesSheet_().getDataRange().getValues();
  values.shift();
  const out = {};
  values.forEach(r => {
    if (String(r[1]) !== code) return;
    if (r[7] === true || String(r[7]).toUpperCase() === 'TRUE') delete out[String(r[3])];
    else out[String(r[3])] = String(r[5]);
  });
  return out;
}

function setStatus_(client, body) {
  const status = String(body.status || '');
  if (!Object.prototype.hasOwnProperty.call(SHEET_STATUS_LABELS, status)) throw new Error('Unknown status');
  const leadKey = String(body.leadKey || '').slice(0, 300);
  const section = SECTIONS.find(s => s.key === body.section);
  if (!leadKey || !section) throw new Error('Missing lead');
  const author = String(body.author || '').trim().slice(0, 80) || 'Client';

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const written = sources_(client.sheets[section.key])
      .some(src => writeStatusToSheet_(src.id, leadKey, SHEET_STATUS_LABELS[status]));
    const cell = s => (/^[=+\-@]/.test(s) ? "'" + s : s);
    statusesSheet_().appendRow([new Date(), client.code, client.name, cell(leadKey),
      cell(String(body.leadName || '').slice(0, 120)), status, cell(author), written]);
    return { ok: true, status: status, writtenToSheet: written };
  } finally {
    lock.releaseLock();
  }
}

// Writes into the lead's "Lead Status" cell, found by tab name + ID. Returns false when the tab has
// no such column, the lead has no ID, or the cell refuses the value (e.g. strict data validation).
function writeStatusToSheet_(spreadsheetId, leadKey, label) {
  const sep = leadKey.indexOf('|');
  if (!spreadsheetId || sep === -1) return false;
  const tabName = leadKey.slice(0, sep);
  const leadId = leadKey.slice(sep + 1);
  try {
    const sh = SpreadsheetApp.openById(spreadsheetId).getSheetByName(tabName);
    if (!sh) return false;
    const values = sh.getDataRange().getDisplayValues();
    let header = -1;
    for (let i = 0; i < Math.min(values.length, HEADER_SCAN_ROWS); i++) {
      const keys = values[i].map(normKey_);
      if (keys.indexOf('leadstatus') !== -1 && keys.indexOf('id') !== -1) header = i;
    }
    if (header === -1) return false;
    const keys = values[header].map(normKey_);
    const idCol = keys.indexOf('id');
    const statusCol = keys.indexOf('leadstatus');
    for (let r = header + 1; r < values.length; r++) {
      if (String(values[r][idCol]).trim() === leadId) {
        sh.getRange(r + 1, statusCol + 1).setValue(label);
        SpreadsheetApp.flush();
        return true;
      }
    }
    return false;
  } catch (err) {
    return false;
  }
}
