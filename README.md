# FionViber Text Counter

[GitHub Pages](https://fionviber.github.io/TextCounter/) · [Cloudflare Pages](https://text-counter-738.pages.dev/)

A browser-based multilingual text counter with three independent views of the text:

- Word-compatible counts for plain text
- Unicode default word boundaries
- Linguistic segmentation when `Intl.Segmenter` is available

It also reports grapheme clusters, Han characters, sentences, paragraphs and explicit text lines. Counting runs locally in the browser. The project has no account, server or network dependency.

The interface supports English, Simplified Chinese and Traditional Chinese. The directory link switches automatically to the GitHub or Cloudflare portfolio based on the site address.

## Run locally

Open `index.html` directly or serve the folder with any static HTTP server. Keep `count-engine.js`, `ui.js`, the `assets` folder and the Unicode licence notice together.

## Attribution

Unicode property data is distributed under the Unicode Terms of Use. See `licenses/Unicode.txt`.
