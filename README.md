# Markdown This Page

> Turn any web page into clean Markdown with one click.

[![Chrome](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)](https://github.com/shafiqimtiaz/markify)
[![License](https://img.shields.io/badge/License-MIT-green)]()

**Markdown This Page** (MTP) is a Chrome extension that converts any web page to clean, structured Markdown. It doesn't just blindly strip HTML — it detects what kind of page you're on (blog, docs, GitHub, Wikipedia, news, etc.) and adapts its extraction strategy for the best results.

## Features

- **Smart site detection** — automatically identifies 15+ site types (GitHub repos, Stack Overflow, Reddit, Wikipedia, blogs, docs, news, product pages, academic papers, forums, and more) and applies tailored extraction rules for each.
- **Right-click anywhere** — context menu options for converting the full page, a text selection, or even individual links and images to Markdown.
- **Keyboard shortcuts** — `Ctrl+Shift+M` (page) and `Ctrl+Shift+S` (selection). Customizable at `chrome://extensions/shortcuts`.
- **Rich popup UI** — converts with a single click, shows character/word/line/heading stats, provides a live preview of the rendered Markdown, and one-click copy or download as `.md`.
- **YAML front matter** — optionally prepends metadata (title, URL, date, author, etc.) as YAML front matter.
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
- **YAML template** — customize the front matter template with placeholders like `{title}`, `{url}`, `{date}`, `{author}`, `{description}`, `{site_type}`.

## Detected site types

The extension identifies these site categories and selects the most appropriate extraction strategy for each:

```
GitHub · GitHub Issue/PR · GitHub Wiki · Stack Overflow · Reddit
Twitter / X · Wikipedia · Blog · News · Documentation
Product Page · Academic Paper · Forum · Generic
```

## How it works

1. **User triggers** a conversion via popup, context menu, or keyboard shortcut.
2. **Site detection** runs a series of URL and DOM heuristics to classify the page type.
3. **Content extraction** selects the main content area using site-specific strategies (e.g., `article` for blogs, `#readme` for GitHub, `#mw-content-text` for Wikipedia).
4. **HTML-to-Markdown conversion** uses [Turndown](https://github.com/mixmark-io/turndown) with GFM plugins for tables, strikethrough, task lists, and fenced code blocks.
5. **Optional YAML front matter** is prepended if enabled.
6. **Output** is displayed in the popup editor with stats, ready to copy or download.

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
├── manifest.json           # Extension manifest (MV3)
├── background.js           # Service worker — context menus, shortcuts
├── content.js              # Content script — site detection, extraction, conversion
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
