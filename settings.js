// Shared by the content script, popup and options page so every entry
// point (popup, shortcut, context menu) converts with the same settings.
// `var` / function declarations: this file may be injected more than once.
var FM_DEFAULTS = {
  includeTitle: true,
  includeMetadata: false,
  keepLinks: true,
  keepImages: true,
  codeBlocks: true,
  smartExtract: true,
  extraInclude: '',
  extraExclude: '',
  yamlTemplate: '---\ntitle: "{title}"\nsource: "{url}"\ndate: "{date}"\nsite_type: "{site_type}"\nauthor: "{author}"\ndescription: "{description}"\n---',
};

async function fmLoadSettings() {
  const r = await chrome.storage.local.get('settings');
  return { ...FM_DEFAULTS, ...(r.settings || {}) };
}

async function fmSaveSettings(patch) {
  const settings = { ...(await fmLoadSettings()), ...patch };
  await chrome.storage.local.set({ settings });
  return settings;
}
