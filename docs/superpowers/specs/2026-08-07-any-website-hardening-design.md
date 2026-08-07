# Any-Website Hardening — Fetch Markdown v4.1 (content.js)

Date: 2026-08-07
Status: Implemented, verified (11/11 jsdom pipeline tests green)

## Goal

Make conversion work on **any** website, not just static HTML pages. Identified five
structural gaps that blocked modern sites; all fixed in `content.js` only (no UI/UX
surface changed, per Option A scope).

## Gaps & fixes

| # | Gap | Fix | New code |
|---|-----|-----|----------|
| 1 | Shadow DOM invisible to `querySelectorAll` (web components: YouTube, Salesforce, Google products) | Shadow-piercing deep clone with slot-aware light-DOM distribution; thin-winner override heuristic | `cloneWithShadowPiercing`, `cloneNodeRec`, `totalShadowRootText` |
| 2 | `svg` in noise list destroyed MathJax/KaTeX/MathML math + Mermaid diagrams | Pre-clean pass converts `<math>` → `$...$` spans (TeX annotation → alttext → linearized MathML) and unprocessed `.mermaid` → ` ```mermaid ` fence; Turndown rules emit math/iframe output | `preserveRichMedia`, `mathToLatex`, `linearizeMathML` |
| 3 | iframes stripped (embeds, docs portals) | Same-origin iframes flattened into the clone (live swap → clone → restore, synchronous, page untouched); cross-origin → `[Embedded content: host](url)`; leftover iframes handled by Turndown rule | `flattenIframesInRoot`, `restoreIframes`, `iframeEmbed` rule |
| 4 | JS-rendered news/blogs empty in DOM | JSON-LD `articleBody` fallback (headline, author/date, paragraphs), used when density scoring finds nothing | `extractJSONLD` |
| 5 | Density scorer too strict (500 chars / 5 periods) → whole-body dump on short pages | Two-tier scoring: strict then relaxed (150 chars / 1 paragraph / 2 periods / link-density 0.6) | `findMainContentByDensity` tiers |

Also removed `iframe` from the universal noise list (was stripping embeds outright).

## Pipeline change (convertPage)

```
extractContent (site-type chain)
  → flattenIframesInRoot(live root)          [NEW — same-origin flatten, cross-origin → link]
  → cloneWithShadowPiercing(live root)       [NEW — shadow roots + slots flattened]
  → restoreIframes (finally)                 [NEW — live page restored untouched]
  → preserveRichMedia(clone)                 [NEW — math → $...$, mermaid → code fence]
  → cleanDOM → applySiteTransforms → unwrapLazyImages → toMarkdown → postProcess
```

## Safety properties

- Live page is mutated only synchronously inside convertPage and restored in
  `finally` — user never sees a change, even if cloning throws (plain clone fallback).
- All new DOM work is try/catch wrapped with non-fatal logging, matching existing
  production hardening style.
- Math fallback chain is honest: TeX annotation → alttext → linearized MathML;
  processed Mermaid (svg-only, source gone) outputs nothing rather than inventing content.
- No new permissions, no network calls, no storage changes.

## Verification

- RED/GREEN: 11 jsdom tests drive the real `content.js` + Turndown through the real
  `chrome.runtime.onMessage` CONVERT path (harness: `/tmp/fm-test`, jsdom only, no
  project files touched):
  T1 shadow capture · T2 KaTeX `$x^2$` · T3 MathML alttext `$$...$$` · T4 mermaid fence ·
  T5 same-origin iframe flatten + live restore · T6 cross-origin → link · T7 JSON-LD ·
  T8 relaxed density · T9 regression (article + code fence) · T10 slot distribution ·
  T11 shadow-rich page override.
- `node --check content.js` clean; `npm run build` regenerates dist with new code.

## Out of scope (Option B, future)

Fetch-raw-HTML mode, scroll-and-capture for infinite scroll, canvas OCR.
