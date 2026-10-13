/**
 * MyKohi client lead reports backend (Google Apps Script)
 *
 * Powers mykohi.com/reports/?c=<code>. Each client has an ads lead spreadsheet and a website
 * lead spreadsheet. This script reads every lead tab in them, drops test leads, and lets the
 * client leave comments on a lead. Clients and comments live in a private "registry" sheet,
 * so no access codes are stored in this file (this repo is publicly served).
 *
 * Setup (one time):
 *  1. Create a new Google Sheet, e.g. "MyKohi Client Reports". Extensions > Apps Script.
 *     Paste this file in as Code.gs and save. Reload the sheet: a "Client Reports" menu appears.
 *  2. Client Reports > Set up tabs. This creates the "Clients" and "Comments" tabs.
 *  3. Add one row per client in "Clients": Client name, Ads sheet URL, Website sheet URL.
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
 * the top), the lowest one wins. New campaign tabs show up without changes here.
 *
 * After editing this file: Deploy > Manage deployments > Edit > Version: New version.
 */

const CLIENTS_TAB = 'Clients';
const COMMENTS_TAB = 'Comments';
const CLIENT_HEADERS = ['Code', 'Client', 'Ads Sheet', 'Website Sheet', 'Logo URL', 'Logo Background', 'Active'];
const COMMENT_HEADERS = ['Timestamp', 'Client Code', 'Client', 'Lead Key', 'Lead', 'Author', 'Comment'];
const SECTIONS = [{ key: 'ads', column: 'Ads Sheet' }, { key: 'website', column: 'Website Sheet' }];
// Normalized header names never sent to the client.
const HIDDEN_COLUMNS = ['id', 'ipaddress', 'leadsource', 'xtwitter', 'company', 'submit', 'recaptchav3token'];
// A lead is a test if its name or email has a word starting with "test" (test@, Testm, test2 — but
// not "greatest" or "contest"), or its status is "Test".
const TEST_PATTERN = /(^|[^a-z])test/i;
const HEADER_SCAN_ROWS = 40;

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Client Reports')
    .addItem('Set up tabs', 'setupTabs')
    .addItem('Fill missing codes', 'fillMissingCodes')
    .addToUi();
}

function setupTabs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  [[CLIENTS_TAB, CLIENT_HEADERS], [COMMENTS_TAB, COMMENT_HEADERS]].forEach(([name, headers]) => {
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

function spreadsheetId_(urlOrId) {
  const s = String(urlOrId || '').trim();
  const m = s.match(/\/d\/([a-zA-Z0-9_-]{20,})/);
  return m ? m[1] : (/^[a-zA-Z0-9_-]{20,}$/.test(s) ? s : '');
}

// ---------- Load ----------

function load_(client) {
  const sections = {};
  SECTIONS.forEach(s => {
    const id = spreadsheetId_(client.sheets[s.key]);
    sections[s.key] = id ? readSpreadsheet_(id) : { connected: false, tabs: [] };
  });
  return {
    ok: true,
    client: { name: client.name, logo: client.logo, logoBg: /^#[0-9a-f]{3,8}$/i.test(client.logoBg) ? client.logoBg : '' },
    sections: sections,
    comments: commentsFor_(client.code),
    updatedAt: new Date().toISOString(),
  };
}

function readSpreadsheet_(id) {
  const ss = SpreadsheetApp.openById(id);
  const tz = ss.getSpreadsheetTimeZone();
  const tabs = ss.getSheets().map(sh => readTab_(sh, tz)).filter(Boolean);
  const labels = tabLabels_(tabs.map(t => t.name));
  tabs.forEach(t => { t.label = labels[t.name]; });
  return { connected: true, tabs: tabs };
}

function readTab_(sh, tz) {
  if (sh.isSheetHidden()) return null;
  const range = sh.getDataRange();
  const values = range.getValues();
  const display = range.getDisplayValues();
  let header = null;
  for (let i = 0; i < Math.min(values.length, HEADER_SCAN_ROWS); i++) {
    const keys = values[i].map(normKey_);
    if (keys.indexOf('email') !== -1 && (keys.indexOf('id') !== -1 || keys.indexOf('leadstatus') !== -1)) {
      header = { row: i, kind: 'form', hasStatus: keys.indexOf('leadstatus') !== -1 };
    } else if (keys.indexOf('callerphonenumber') !== -1) {
      header = { row: i, kind: 'call', hasStatus: false };
    }
  }
  if (!header) return null;
  return {
    name: sh.getName(),
    kind: header.kind,
    hasStatus: header.hasStatus,
    rows: parseRows_(sh.getName(), header.kind, values, display, header.row, tz),
  };
}

function parseRows_(tabName, kind, values, display, headerRow, tz) {
  const headers = values[headerRow].map(h => String(h).trim());
  const keys = headers.map(normKey_);
  const idx = name => keys.indexOf(name);
  const timeCol = kind === 'call' ? idx('starttime') : idx('createdat');
  const out = [];

  for (let r = headerRow + 1; r < values.length; r++) {
    const raw = values[r];
    if (!raw.some(v => v !== '' && v !== null)) continue;
    const text = c => (c === -1 ? '' : String(display[r][c]).trim());
    const when = timeCol === -1 ? null : toDate_(raw[timeCol], tz);

    const row = {
      kind: kind,
      ts: when ? when.getTime() : null,
      when: when ? Utilities.formatDate(when, tz, 'MMM d, yyyy h:mm a') : text(timeCol),
      details: [],
    };

    if (kind === 'form') {
      const first = text(idx('firstname'));
      const last = text(idx('lastname'));
      row.name = [first, last].filter(Boolean).join(' ') || text(idx('name'));
      row.email = text(idx('email'));
      row.phone = text(idx('phone'));
      row.status = normStatus_(text(idx('leadstatus')));
      if (row.status === 'Test' || TEST_PATTERN.test(row.name + ' ' + row.email)) continue;
      const id = text(idx('id'));
      row.key = tabName + '|' + (id || row.ts + '|' + row.email);
    } else {
      row.name = text(idx('callerphonenumber'));
      row.phone = row.name;
      row.status = text(idx('status')) || 'Call';
      row.duration = Number(raw[idx('durationseconds')]) || 0;
      row.campaign = text(idx('campaign'));
      row.key = tabName + '|' + row.ts + '|' + row.phone;
    }

    const shown = ['firstname', 'lastname', 'name', 'email', 'phone', 'leadstatus', 'createdat',
      'starttime', 'callerphonenumber', 'callercountrycode', 'callerareacode', 'durationseconds'];
    // Forms that changed over time leave duplicate columns (Reason_for_inquiry / Reason_for_Inquiry);
    // the first non-empty one wins.
    const seen = {};
    headers.forEach((h, c) => {
      if (!h || seen[keys[c]] || shown.indexOf(keys[c]) !== -1 || HIDDEN_COLUMNS.indexOf(keys[c]) !== -1) return;
      const v = text(c);
      if (!v) return;
      seen[keys[c]] = true;
      row.details.push([prettyHeader_(h), v]);
    });
    out.push(row);
  }
  return out;
}

function normKey_(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
}

function prettyHeader_(h) {
  const s = h.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function normStatus_(s) {
  const k = normKey_(s);
  if (!k) return 'Not reviewed';
  if (k === 'test') return 'Test';
  if (k.indexOf('invalid') === 0) return 'Invalid';
  if (k.indexOf('valid') === 0) return 'Valid';
  if (k.indexOf('existing') === 0) return 'Existing patient';
  if (k.indexOf('outof') === 0) return 'Out of location';
  return s;
}

// Sheet cells hold real dates, date serial numbers, or text like "Sep 01, 2026, 20:40".
function toDate_(v, tz) {
  if (v instanceof Date && !isNaN(v)) return v;
  if (typeof v === 'number' && v > 20000 && v < 80000) {
    const utc = new Date(Math.round((v - 25569) * 86400000));
    return Utilities.parseDate(Utilities.formatDate(utc, 'UTC', 'yyyy-MM-dd HH:mm:ss'), tz, 'yyyy-MM-dd HH:mm:ss');
  }
  const s = String(v || '').trim().replace(/,(\s*\d{1,2}:\d{2})/, ' $1');
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d) ? null : d;
}

// "interpsychaz-g-spravato" -> "Spravato · Google". Drops the prefix all tabs share.
function tabLabels_(names) {
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
    const words = parts.join(' ').split(/\s+/).filter(Boolean).map(w =>
      w.length <= 3 && /^[a-z]+$/i.test(w) && w.toLowerCase() !== 'ads' ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1));
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
