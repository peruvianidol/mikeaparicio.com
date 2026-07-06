# Sass + Eleventy Setup

How to set up Sass in an Eleventy project the way I like it.

## Install

```bash
npm install --save-dev sass npm-run-all2
```

Note: the package is `npm-run-all2` (maintained fork), but the binaries are still `npm-run-all`, `run-s`, and `run-p`.

## package.json scripts

```json
"watch:sass": "sass --watch --poll _src/assets/scss:_site/assets/css --style=compressed --no-source-map -q --silence-deprecation=import",
"build:sass": "sass _src/assets/scss:_site/assets/css --no-source-map -q --silence-deprecation=import",
"watch:eleventy": "npx @11ty/eleventy --serve",
"build:eleventy": "npx @11ty/eleventy",
"start": "npm-run-all build:sass --parallel watch:*",
"build": "npm-run-all build:*"
```

- `start` runs a one-time Sass build first, then watches both Sass and Eleventy in parallel. This prevents a flash of unstyled content when the dev server starts.
- `--silence-deprecation=import` keeps `@import` working in newer Sass versions without warnings. Prefer `@import` over `@use`.
- The Sass folder-to-folder syntax (`_src/assets/scss:_site/assets/css`) compiles all non-partial `.scss` files to the output directory. Partials (prefixed with `_`) are ignored.

## eleventy.config.mjs

Remove the CSS passthrough copy — Sass writes directly to `_site/assets/css`, so Eleventy doesn't need to handle it:

```js
// Remove this line:
eleventyConfig.addPassthroughCopy("./_src/assets/css/**/*");
```

Add a watch target so Eleventy's dev server triggers a browser reload when any SCSS file changes:

```js
eleventyConfig.addWatchTarget("./_src/assets/scss/");
```

## SCSS directory structure

```
_src/assets/scss/
├── abstracts/
│   └── _tokens.scss       # CSS custom properties, color palette, spacing scale
├── base/
│   ├── _reset.scss        # Box-sizing, margin resets
│   └── _global.scss       # Body, typography, img, a, h1-h4, etc.
├── components/            # One partial per component
├── layouts/               # Page layout partials
├── utilities/             # Single-purpose helper classes
├── vendor/                # Third-party CSS (e.g. syntax highlighting themes)
└── site.scss              # Main entry — @imports only, no styles
```

`site.scss` example:

```scss
@import 'abstracts/tokens';

@import 'base/reset';
@import 'base/global';

@import 'components/foo';

@import 'utilities/flex';
@import 'utilities/spacing';

@import 'vendor/syntax';
```

Add a `components/`, `layouts/`, `utilities/`, or `vendor/` partial and `@import` it in `site.scss` when ready.
