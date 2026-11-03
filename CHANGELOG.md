# Changelog

## 4.3.0 (2026-11-03)

### Features

* **popup:** single-screen popup that converts on open (selection when text is selected), persisted option toggles, Copy as the primary action, word/char/token stats, history behind a header button ([cce2985](https://github.com/shafiqimtiaz/fetch-markdown/commit/cce2985))
* **settings:** one shared settings object, so popup, keyboard shortcut and context menu convert identically and the options page defaults apply; YAML front matter is now off by default ([cce2985](https://github.com/shafiqimtiaz/fetch-markdown/commit/cce2985))

### Bug Fixes

* **convert:** code fences no longer glued to the preceding line; space before inline code kept; header-less and layout tables convert to Markdown instead of raw HTML; highlighter code keeps its line breaks; ad/hidden-element filters no longer delete real content; duplicate title removed; Hacker News, arXiv and GitHub issue extraction rebuilt ([83257a6](https://github.com/shafiqimtiaz/fetch-markdown/commit/83257a6))
* **preview:** raw HTML is escaped and links open in a new tab ([cce2985](https://github.com/shafiqimtiaz/fetch-markdown/commit/cce2985))

## 4.2.0 (2026-08-07)

### Features

* green check badge + notification toast + save to history on shortcut/right-click ([6ca6edb](https://github.com/shafiqimtiaz/fetch-markdown/commit/6ca6edb9cc3adf18cb93a46f9b235099ac272fb4))
* **ui:** update README and popup logo to use new icon ([d24df4d](https://github.com/shafiqimtiaz/fetch-markdown/commit/d24df4d90676721defc5b4f77022f350d2ceba8e))

### Bug Fixes

* move inline border-radius on logo img to CSS to comply with CSP style-src ([3545f5c](https://github.com/shafiqimtiaz/fetch-markdown/commit/3545f5c7ef889f740e61b6596146c36ac4e4b33a))
* pass DOM node to Turndown instead of re-parsed HTML string — fixes Gmail 'parentNode' crash ([8f96f3d](https://github.com/shafiqimtiaz/fetch-markdown/commit/8f96f3df5b200eda4d45a3198ff3403ed8e98543))
* remove tab.url guard — undefined in MV3 without 'tabs' permission, causing silent fail on shortcuts/context menu ([21f008f](https://github.com/shafiqimtiaz/fetch-markdown/commit/21f008f2ac71ab499a14e574278ff4089b47cd5f))
* route clipboard writes through content script isolated world to fix shortcuts/right-click ([114a127](https://github.com/shafiqimtiaz/fetch-markdown/commit/114a12704b5cfbf4c6932d90bf989c9cb0744270))

### Reverts

* Revert "remove footer hint about right-click/shortcuts" ([57bbbca](https://github.com/shafiqimtiaz/fetch-markdown/commit/57bbbcadd0c0c16a7cfd7e2da750ca7ed9aaeaf1))
* Revert "remove keyboard shortcuts section from options page" ([aa1ece1](https://github.com/shafiqimtiaz/fetch-markdown/commit/aa1ece157282d8e9b28bbacc4c729872e707947b))

All notable changes to **Fetch Markdown** are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Release pipeline: release-it with conventional changelog, version sync, ZIP artifact, and GitHub releases.
