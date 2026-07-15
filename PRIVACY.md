# Privacy Policy

**Last updated:** 2026-07-14

Fetch Markdown ("the Extension") respects your privacy. This policy describes how the Extension handles data.

## Data Collection

**The Extension does not collect, transmit, or share any personal data whatsoever.**

All data processing happens entirely within your browser. No data is sent to any external server, API, or third party.

## Data Storage

The Extension uses `chrome.storage.local` to store the following data locally on your device only:

| Data | Purpose | Location |
|------|---------|----------|
| Conversion settings | User preferences (YAML template, custom CSS selectors, toggle states) | `chrome.storage.local` — your device only |
| Conversion history | Last 50 converted pages (title, URL, markdown content, timestamp) | `chrome.storage.local` — your device only |
| Theme preference | Light/dark mode choice | `chrome.storage.local` — your device only |

None of this data is synced to your Google account, transmitted to any server, or accessible by any third party.

## Page Content

The Extension reads the DOM of the currently active web page *only* when you explicitly trigger a conversion via:

- Clicking the extension icon and pressing "Convert to Markdown"
- Using a right-click context menu option
- Pressing a keyboard shortcut (`Ctrl+Shift+M` / `Ctrl+Shift+S`)

The page content is processed locally and converted to Markdown text. It is:
- Displayed in the popup for your review
- Stored in your local conversion history if you choose to save it
- Copied to your clipboard if you click "Copy"
- Saved as a `.md` file if you click "Download"

**Page content is never transmitted outside your browser.**

## Permissions

Each permission the Extension requests serves a single, narrow purpose:

- **activeTab** — Access the current tab only when you trigger a conversion
- **scripting** — Inject the content script into pages you interact with
- **clipboardWrite** — Copy Markdown to your clipboard (your action only)
- **contextMenus** — Provide right-click conversion options
- **storage** — Save settings and history locally
- **notifications** — Show a success notification after conversion

## Third Parties

The Extension uses no third-party analytics, tracking, advertising, or external services. The only external resources loaded are:

- **Google Fonts** (Darker Grotesque, JetBrains Mono) — for the extension popup and options UI typography
- No user data is sent as part of these font requests beyond standard browser HTTP headers

## Data Deletion

You can clear all stored data at any time:

1. Open Extension Settings → click **Reset** to clear settings
2. In the popup, click **Clear** under History to delete conversion history
3. Or go to `chrome://extensions` → Fetch Markdown → **Details** → **Clear storage**

## Changes

If this policy changes, the "Last updated" date at the top will be revised.

## Contact

For questions about this privacy policy, open an issue at:
https://github.com/shafiqimtiaz/fetch-markdown
