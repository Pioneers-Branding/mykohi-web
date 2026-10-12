/**
 * MyKohi Onboarding dashboard backend (Google Apps Script)
 *
 * Formester writes each onboarding submission into a Google Sheet. This script lets
 * admin-dashboard.html read those rows and track a status/notes for each one.
 * It never edits Formester's rows: status and notes live in a separate "Tracking" tab.
 *
 * Setup:
 *  1. Open the Google Sheet that Formester writes to. Extensions > Apps Script.
 *     Paste this file in as Code.gs.
 *  2. Check SOURCES below: the tab names Formester writes each form into.
 *     For a form that writes to a different spreadsheet, also set its spreadsheetId
 *     (the long ID in that spreadsheet's URL, between /d/ and /edit) and optionally gid.
 *  3. Project Settings > Script Properties > add ADMIN_KEY = a long random password.
 *     This is the password for admin-dashboard.html.
 *  4. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
 *  5. Copy the Web app URL into SCRIPT_URL in admin-dashboard.html.
 *
 * After editing this file: Deploy > Manage deployments > Edit > Version: New version
 * so the same URL serves the new code.
 */

// One entry per form shown on the dashboard.
const SOURCES = {
  // Practice onboarding (onboarding.html). Falls back to the first tab if the name doesn't match.
  onboarding: { sheet: 'my-kohi-website-onboarding-form', spreadsheetId: '', fallbackToFirstTab: true },
  // Access & brand assets (access-onboarding.html). `gid` is the number after "gid=" in the tab's URL
  // and keeps working if the tab is renamed.
  access: { sheet: 'mykohi-onboarding-new', spreadsheetId: '1qYsZKqMm2MxRXWUGjtH__N3eaTpvVa953VZ-PCWC2NE', gid: 1417064006 },
};
const TRACKING_SHEET = 'Tracking';
const STATUSES = ['New', 'Contacted', 'In Progress', 'Onboarded', 'Not a Fit'];

function doPost(e) {
  try {
    const body = JSON.parse((e.postData && e.postData.contents) || '{}');
    requireAdmin_(body.key);
    switch (body.action) {
      case 'login': return json({ ok: true });
      case 'list': return json(Object.assign({ ok: true, statuses: STATUSES }, list_(body.source || 'onboarding')));
      case 'update': return json(update_(body.rowKey, body.changes || {}));
      default: return json({ ok: false, error: 'Unknown action' });
    }
  } catch (err) {
    return json({ ok: false, error: String(err.message || err) });
  }
}

function doGet() {
  return json({ ok: true, service: 'mykohi-onboarding-dashboard' });
}

function sourceSheet_(name) {
  const cfg = SOURCES[name];
  if (!cfg) throw new Error('Unknown source: ' + name);
  const ss = cfg.spreadsheetId ? SpreadsheetApp.openById(cfg.spreadsheetId) : SpreadsheetApp.getActiveSpreadsheet();
  const byGid = cfg.gid !== undefined ? ss.getSheets().find(sh => sh.getSheetId() === cfg.gid) : null;
  const named = byGid || ss.getSheetByName(cfg.sheet);
  if (named || !cfg.fallbackToFirstTab) return named;
  // First tab that isn't the tracking tab or another source's tab.
  const others = Object.keys(SOURCES).map(k => SOURCES[k].sheet).concat(TRACKING_SHEET);
  return ss.getSheets().find(sh => others.indexOf(sh.getName()) === -1) || null;
}

function list_(name) {
  const source = sourceSheet_(name);
  if (!source) return { rows: [], connected: false };

  const values = source.getDataRange().getValues();
  if (values.length < 2) return { rows: [], connected: true };
  const headers = values.shift().map(String);
  const tracking = trackingMap_();
  // Onboarding keys stay unsalted so statuses saved before multi-source support still match.
  const salt = name === 'onboarding' ? '' : name + ':';

  const rows = values
    .filter(row => row.some(v => v !== ''))
    .map(row => {
      const fields = {};
      headers.forEach((h, i) => {
        if (!h) return;
        const v = row[i];
        fields[h] = v instanceof Date ? v.toISOString() : String(v);
      });
      const rowKey = rowKey_(row, salt);
      const t = tracking[rowKey] || {};
      return { rowKey: rowKey, fields: fields, status: t.status || 'New', adminNotes: t.adminNotes || '' };
    })
    .reverse();
  return { rows: rows, connected: true };
}

function update_(rowKey, changes) {
  if (!rowKey) throw new Error('Missing rowKey');
  if (changes.status && STATUSES.indexOf(changes.status) === -1) throw new Error('Invalid status');

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getTrackingSheet_();
    const values = sheet.getDataRange().getValues();
    let r = values.findIndex((row, i) => i > 0 && row[0] === rowKey);
    if (r === -1) {
      sheet.appendRow([rowKey, 'New', '', '']);
      r = sheet.getLastRow() - 1;
    }
    const row = r + 1;
    if ('status' in changes) sheet.getRange(row, 2).setValue(changes.status);
    if ('adminNotes' in changes) sheet.getRange(row, 3).setValue("'" + String(changes.adminNotes).slice(0, 5000));
    sheet.getRange(row, 4).setValue(new Date());
  } finally {
    lock.releaseLock();
  }
  return { ok: true };
}

function trackingMap_() {
  const values = getTrackingSheet_().getDataRange().getValues();
  const map = {};
  values.slice(1).forEach(row => {
    map[row[0]] = { status: String(row[1] || 'New'), adminNotes: String(row[2] || '') };
  });
  return map;
}

function getTrackingSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(TRACKING_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(TRACKING_SHEET);
    sheet.appendRow(['rowKey', 'status', 'adminNotes', 'updatedAt']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Stable ID for a submission row, derived from its contents (Formester rows are append-only).
function rowKey_(row, salt) {
  const raw = (salt || '') + row.map(v => v instanceof Date ? v.toISOString() : String(v)).join('␟');
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, raw, Utilities.Charset.UTF_8);
  // "k" prefix stops Sheets from reading keys like "1e40..." as numbers.
  return 'k' + digest.map(b => ((b + 256) % 256).toString(16).padStart(2, '0')).join('').slice(0, 16);
}

function requireAdmin_(key) {
  const adminKey = PropertiesService.getScriptProperties().getProperty('ADMIN_KEY');
  if (!adminKey) throw new Error('ADMIN_KEY is not configured in Script Properties');
  if (!key || key !== adminKey) {
    Utilities.sleep(800); // slow down guessing
    throw new Error('Unauthorized');
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
