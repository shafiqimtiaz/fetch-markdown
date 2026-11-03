/* Fetch Markdown — Popup */
const $ = (id) => document.getElementById(id);
const CONTENT_FILES = ['settings.js', 'turndown.js', 'turndown-plugin-gfm.js', 'content.js'];
const SITE_LABELS = {
  'github': 'GitHub', 'github-issue': 'GitHub Issue', 'github-wiki': 'GitHub Wiki', 'gitlab': 'GitLab',
  'bitbucket': 'Bitbucket', 'stackoverflow': 'Stack Overflow', 'reddit': 'Reddit', 'twitter': 'X / Twitter',
  'linkedin': 'LinkedIn', 'youtube': 'YouTube', 'wiki': 'Wiki', 'notion': 'Notion', 'confluence': 'Confluence',
  'discourse': 'Discourse', 'hackernews': 'Hacker News', 'blog': 'Blog', 'news': 'News', 'docs': 'Docs',
  'product': 'Product', 'academic': 'Paper', 'forum': 'Forum', 'webmail': 'Webmail', 'chatgpt': 'AI chat',
  'generic': 'Web page',
};

// Raw HTML in page-derived Markdown must never render in the extension page.
marked.use({ renderer: { html: (html) => escHtml(typeof html === 'string' ? html : html.text || '') } });

let tab = null;
let mode = 'page';
let markdown = '';
let title = '';

document.addEventListener('DOMContentLoaded', async () => {
  $('version').textContent = 'v' + chrome.runtime.getManifest().version;
  chrome.storage.local.get('theme', (r) => { if (r.theme === 'dark') document.body.dataset.theme = 'dark'; });
  setupControls();
  await renderOptions();

  [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  title = tab?.title || 'Untitled';
  $('pageTitle').textContent = title;
  try { $('pageHost').textContent = new URL(tab.url).hostname; } catch (_) {}

  if (!tab?.url?.startsWith('http')) {
    return showMessage("This page can't be converted. Browser pages and the Chrome Web Store block extensions.");
  }
  try {
    await ensureContentScript();
    const det = await chrome.tabs.sendMessage(tab.id, { type: 'DETECT' });
    if (det?.siteType) {
      $('siteType').textContent = SITE_LABELS[det.siteType] || det.siteType;
      $('siteType').hidden = false;
    }
    if (det?.hasSelection) {
      document.querySelector('[data-mode="selection"]').disabled = false;
      setMode('selection');
    }
  } catch (_) {
    return showMessage('Could not read this page. Reload it and try again.');
  }
  convert();
});

async function ensureContentScript() {
  try { await chrome.tabs.sendMessage(tab.id, { type: 'PING' }); }
  catch { await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: CONTENT_FILES }); }
}

async function convert() {
  showMessage(mode === 'page' ? 'Converting…' : 'Converting selection…', true);
  try {
    const resp = await chrome.tabs.sendMessage(tab.id, { type: mode === 'page' ? 'CONVERT' : 'CONVERT_SELECTION' });
    if (!resp?.result) {
      return showMessage(resp?.error === 'No text selected'
        ? 'The selection is gone. Select text again, or convert the page.'
        : 'Nothing could be extracted from this page.');
    }
    setMarkdown(resp.result);
    $('overlay').hidden = true;
    if (mode === 'page') saveToHistory(tab.title, tab.url, resp.result);
  } catch (_) {
    showMessage('Conversion failed. Reload the page and try again.');
  }
}

function setMarkdown(md) {
  markdown = md;
  $('editor').value = md;
  if (!$('preview').hidden) $('preview').innerHTML = marked.parse(md);
  updateStats();
  $('copyBtn').disabled = $('downloadBtn').disabled = !md.trim();
}

function showMessage(text, busy = false) {
  $('overlayText').textContent = text;
  $('overlay').classList.toggle('busy', busy);
  $('overlay').hidden = false;
}

function updateStats() {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  const tokens = Math.round(markdown.length / 4);
  $('stats').textContent = words.toLocaleString() + ' words · ' +
    markdown.length.toLocaleString() + ' chars · ~' + tokens.toLocaleString() + ' tokens';
}

function setMode(next) {
  mode = next;
  document.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('active', b.dataset.mode === next));
}

function setView(next) {
  const preview = next === 'preview';
  document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === next));
  if (preview) $('preview').innerHTML = marked.parse(markdown);
  $('preview').hidden = !preview;
  $('editor').hidden = preview;
}

async function renderOptions() {
  const s = await fmLoadSettings();
  document.querySelectorAll('[data-opt]').forEach(cb => { cb.checked = !!s[cb.dataset.opt]; });
}

function setupControls() {
  document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.mode === mode) return;
    setMode(b.dataset.mode);
    convert();
  }));
  document.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));
  document.querySelectorAll('[data-opt]').forEach(cb => cb.addEventListener('change', async () => {
    await fmSaveSettings({ [cb.dataset.opt]: cb.checked });
    if (tab?.url?.startsWith('http')) convert();
  }));
  // Links in the preview open in a tab; navigating the popup would lose the output.
  $('preview').addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    e.preventDefault();
    if (/^https?:/.test(a.href)) chrome.tabs.create({ url: a.href });
  });
  $('editor').addEventListener('input', (e) => { markdown = e.target.value; updateStats(); });
  $('copyBtn').addEventListener('click', () => copyText(markdown, $('copyBtn')));
  $('downloadBtn').addEventListener('click', () => download(title, markdown));
  $('historyBtn').addEventListener('click', toggleHistory);
  $('settingsBtn').addEventListener('click', () => chrome.runtime.openOptionsPage());
  $('themeToggle').addEventListener('click', () => {
    const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    document.body.dataset.theme = next;
    chrome.storage.local.set({ theme: next });
  });
  $('historyList').addEventListener('click', onHistoryClick);
  $('clearHistoryBtn').addEventListener('click', async () => {
    await chrome.storage.local.set({ history: [] });
    renderHistory();
  });
}

async function copyText(text, btn) {
  const label = btn.querySelector('span');
  const orig = label.textContent;
  try {
    await navigator.clipboard.writeText(text);
    btn.classList.add('copied');
    label.textContent = 'Copied';
  } catch (_) {
    label.textContent = 'Copy failed';
  }
  setTimeout(() => { btn.classList.remove('copied'); label.textContent = orig; }, 1500);
}

function download(name0, text) {
  const name = (name0 || 'page').replace(/[^a-zA-Z0-9\s\-_.]/g, '').trim().replace(/\s+/g, '-').substring(0, 80).toLowerCase() || 'page';
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }));
  a.download = name + '.md';
  a.click();
}

/* ---- History ---- */
function toggleHistory() {
  const open = $('historyView').hidden;
  $('historyView').hidden = !open;
  $('mainView').hidden = open;
  $('historyBtn').setAttribute('aria-pressed', String(open));
  if (open) renderHistory();
}

function saveToHistory(title, url, content) {
  chrome.storage.local.get('history', (r) => {
    // Re-converting the same page replaces its entry instead of stacking copies.
    const h = (r.history || []).filter(item => item.url !== url);
    h.unshift({ title: title || 'Untitled', url: url || '', length: content.length, content, time: Date.now() });
    chrome.storage.local.set({ history: h.slice(0, 30) });
  });
}

function renderHistory() {
  chrome.storage.local.get('history', (r) => {
    const h = r.history || [];
    $('clearHistoryBtn').hidden = !h.length;
    if (!h.length) {
      $('historyList').innerHTML = '<div class="history-empty">No conversions yet</div>';
      return;
    }
    $('historyList').innerHTML = h.map((item, i) => {
      const d = new Date(item.time);
      const when = d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let host = '';
      try { host = new URL(item.url).hostname; } catch (_) {}
      return '<div class="history-item">' +
        '<button class="history-open" data-act="open" data-idx="' + i + '" title="Open">' +
          '<span class="history-item-title">' + escHtml(item.title) + '</span>' +
          '<span class="history-item-meta">' + escHtml(host) + ' · ' + when + ' · ' + item.length.toLocaleString() + ' chars</span>' +
        '</button>' +
        '<button class="btn-sm" data-act="copy" data-idx="' + i + '"><span>Copy</span></button>' +
        '<button class="btn-sm btn-danger" data-act="delete" data-idx="' + i + '" aria-label="Delete">&times;</button>' +
      '</div>';
    }).join('');
  });
}

async function onHistoryClick(e) {
  const btn = e.target.closest('[data-act]');
  if (!btn) return;
  const { history = [] } = await chrome.storage.local.get('history');
  const idx = +btn.dataset.idx;
  const item = history[idx];
  if (!item) return;
  if (btn.dataset.act === 'copy') return copyText(item.content, btn);
  if (btn.dataset.act === 'delete') {
    history.splice(idx, 1);
    await chrome.storage.local.set({ history });
    return renderHistory();
  }
  toggleHistory();
  title = item.title;
  $('pageTitle').textContent = title;
  try { $('pageHost').textContent = new URL(item.url).hostname; } catch (_) {}
  $('siteType').hidden = true;
  setMarkdown(item.content);
  $('overlay').hidden = true;
}

function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
