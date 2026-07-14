<p align="center">
  <img src="icons/icon128.png" width="80" alt="Markify icon">
</p>

# Markify

> Turn any web page into clean Markdown with one click.

[![Chrome](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)](https://github.com/shafiqimtiaz/markify)
[![Version](https://img.shields.io/badge/Version-4.0-blue)]()
[![License](https://img.shields.io/badge/License-MIT-green)]()

**Markify** is a Chrome extension that converts any web page to clean, structured Markdown. It doesn't just blindly strip HTML — it detects what kind of page you're on (blog, docs, GitHub, Wikipedia, news, etc.) and adapts its extraction strategy for the best results.

## What's new in v4.0 (production-grade)

The detection, formatting, and conversion algorithm has been rewritten to production quality:

- **Confidence-scored site detection** — Instead of a single hard-coded if/else chain, the new detector builds a detection context once and scores 25+ candidate site types in parallel. The highest-scoring candidate wins, which means multiple weak signals can combine to correctly identify sites we've never seen before.
- **25+ site types** — GitHub (repo / issue / wiki), GitLab, Bitbucket, Stack Overflow, Reddit, Twitter/X, LinkedIn, YouTube, Wikipedia, Notion, Confluence, Discourse, Hacker News, blogs, news, docs, product, academic, forums, webmail, ChatGPT/Claude, and generic.
- **Readability-style fallback** — When no site-specific extractor matches, a content-density scorer walks the DOM, scores each candidate by text length, paragraph count, comma/period density, and link density (penalty), then picks the densest content node. This is the same approach Mozilla Readability uses.
- **Code-aware post-processing** — All punctuation cleanup, whitespace normalization, and heading hierarchy fixes are applied **only to non-code segments**. Fenced code blocks and inline code spans are split out, left untouched, then reassembled. Your code samples come out exactly as they were on the page.
- **Heading hierarchy normalization** — If a document jumps from `<h1>` to `<h3>` (skipping `<h2>`), the levels are remapped to a contiguous 1..N hierarchy so the Markdown structure makes sense.
- **Lazy-load image unwrapping** — Many modern sites hide real image URLs behind `data-src`, `data-original`, `data-lazy-src`, or `srcset` attributes (with a tiny placeholder in `src`). Markify unwraps these so the real image URL ends up in the Markdown.
- **Tracking-param stripping** — Common tracking parameters (`utm_source`, `utm_medium`, `utm_campaign`, `fbclid`, `gclid`, `mc_eid`, etc.) are stripped from link URLs automatically.
- **Extended inline-element rules** — `<kbd>` → inline code, `<mark>` → bold, `<sub>`/`<sup>` → HTML tags, `<abbr title="...">` → `ABBR (expansion)`, `<details>`/`<summary>` → blockquote, `<figure>`/`<figcaption>` → image with italic caption.
- **Proper YAML escaping** — Front-matter values are now escaped per the YAML 1.2 spec (backslashes and double quotes are escaped, booleans/null are quoted, numbers are bare). The user-defined YAML template from Settings is finally wired through.
- **Production error handling** — Every external call (querySelector, Turndown, clipboard) is wrapped in try/catch with structured fallbacks. A crash in one extractor no longer kills the whole conversion — it falls back to the generic extractor, then to plain text.

## Features

- **Smart site detection** — automatically identifies 25+ site types and applies tailored extraction rules for each.
- **Right-click anywhere** — context menu options for converting the full page, a text selection, or even individual links and images to Markdown.
- **Keyboard shortcuts** — `Ctrl+Shift+M` (page) and `Ctrl+Shift+S` (selection). Customizable at `chrome://extensions/shortcuts`.
- **Rich popup UI** — converts with a single click, shows character/word/line/heading stats, provides a live preview of the rendered Markdown, and one-click copy or download as `.md`.
- **YAML front matter** — optionally prepends metadata (title, URL, date, author, etc.) as YAML front matter, using either the built-in template or a user-defined template.
- **Conversion history** — remembers your last 50 conversions with quick copy/download per entry.
- **Custom selectors** — define extra include/exclude CSS selectors to override content extraction.
- **Dark mode** — toggle between light and dark themes.
- **Privacy-first** — no data sent anywhere. Everything runs locally in your browser.

## Installation

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode** (top right).
3. Click **Load unpacked** and select the `markify` directory.
4. Pin the extension for quick access.

> **Note:** This is an unpacked extension. Packaged distribution via the Chrome Web Store is planned.

## Usage

### Popup
Click the extension icon in the toolbar, then **Convert to Markdown**. The popup shows an editable preview with stats, copy, download, and rendered preview options.

### Context menu
Right-click any page, selection, link, or image:

| Context | Action |
|---------|--------|
| Right-click page | Convert page to Markdown |
| Right-click page | Convert page & copy to clipboard |
| Right-click selection | Convert selected text to Markdown |
| Right-click link | Copy link as `[text](url)` |
| Right-click image | Copy image as `![alt](url)` |

### Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd` + `Shift` + `M` | Convert current page |
| `Ctrl/Cmd` + `Shift` + `S` | Convert selected text |

Customize these at `chrome://extensions/shortcuts`.

## Configuration

Open extension **Settings** from the popup gear icon to configure:

- **Conversion defaults** — toggle title headings, YAML front matter, links, images, fenced code blocks, and smart extraction.
- **Custom CSS selectors** — add extra include/exclude selectors to fine-tune content extraction on specific sites.
- **YAML template** — customize the front matter template with placeholders like `{title}`, `{url}`, `{date}`, `{author}`, `{description}`, `{site_type}`, `{keywords}`, `{source}`.

## Detected site types

The extension identifies these site categories and selects the most appropriate extraction strategy for each:

```
GitHub · GitHub Issue/PR · GitHub Wiki · GitLab · Bitbucket
Stack Overflow · Reddit · Twitter/X · LinkedIn · YouTube
Wikipedia · Notion · Confluence · Discourse · Hacker News
Blog · News · Documentation · Product Page · Academic Paper
Forum · Webmail · ChatGPT/Claude · Generic
```

## How it works

1. **User triggers** a conversion via popup, context menu, or keyboard shortcut.
2. **Site detection** builds a detection context (host, URL, meta tags, DOM probes) and scores 25+ candidate site types. The highest-scoring candidate wins; low-confidence detections fall through to a Readability-style scorer.
3. **Content extraction** selects the main content area using site-specific strategies (e.g., `article` for blogs, `#readme` for GitHub, `#mw-content-text` + page title for Wikipedia). Generic fallback uses density scoring.
4. **DOM cleaning** strips noise (nav, ads, cookie banners, paywalls, modals, popups, hidden elements) using universal + site-specific selectors, then unwraps lazy-load image attributes.
5. **Site-specific transforms** convert Wikipedia infoboxes to definition lists, GitHub task-list items to `[x]` syntax, etc.
6. **HTML-to-Markdown conversion** uses [Turndown](https://github.com/mixmark-io/turndown) with GFM plugins and custom rules for `<kbd>`, `<mark>`, `<sub>`, `<sup>`, `<abbr>`, `<details>`, `<figure>`, and more.
7. **Code-aware post-processing** splits the output into code-span / code-fence / text segments, applies cleanups (punctuation, whitespace, heading hierarchy) to non-code segments only, then reassembles.
8. **Optional YAML front matter** is prepended if enabled, using either the default template or the user-defined template from Settings.
9. **Output** is displayed in the popup editor with stats, ready to copy or download.

## Tech stack

| Component | Library |
|-----------|---------|
| HTML→Markdown | [Turndown](https://github.com/mixmark-io/turndown) + [turndown-plugin-gfm](https://github.com/mixmark-io/turndown-plugin-gfm) |
| Markdown preview | [Marked](https://github.com/markedjs/marked) |
| Extension API | Manifest V3 |
| Storage | `chrome.storage.local` |
| Fonts | Darker Grotesque + JetBrains Mono |

## Project structure

```
markify/
├── manifest.json           # Extension manifest (MV3, v4.0)
├── background.js           # Service worker — context menus, shortcuts
├── content.js              # Content script — detection, extraction, conversion (v4.0)
├── popup.html              # Popup UI
├── popup.css               # Popup styles (brutalism design)
├── popup.js                # Popup logic — convert, preview, copy, history
├── options.html            # Settings page
├── options.css             # Settings styles
├── options.js              # Settings logic
├── turndown.js             # Turndown HTML→Markdown converter
├── turndown-plugin-gfm.js  # GFM plugin for Turndown
├── marked.min.js           # Marked Markdown renderer
└── icons/                  # Extension icons (16, 32, 48, 128)
```

## License

MIT

