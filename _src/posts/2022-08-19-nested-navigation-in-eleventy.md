---
title: Nested navigation in Eleventy
description: Building a no-JS navigation menu with the details element.
date: 2022-08-19
thumbnail: nav-demo.png
thumbnailAlt: A sample design system website with a nested navigation.
tags:
  - Web Development
  - CSS
  - Eleventy
---

I'm currently working on a design systems documentation project that has some pretty extensive navigation requirements. The site is built with Eleventy and I wanted to be able to handle the nav menu without needing to update it manually each time I add a new page.

It turns out Eleventy has a helpful [navigation plugin](https://www.11ty.dev/docs/plugins/navigation/) that's capable of generating a nested list based on the front matter of your pages. By default it creates a simple nested list, like so:

* [Home](#)
* [Changelog](#)
* [Visual Style](#)
  - [Color](#)
  - [Typography](#)
  - [Spacing](#)
  - [Icons](#)
* [Components](#)
  - [Accordion](#)
  - [Alert](#)
  - [Avatar](#)

As the number of pages increases, this could get noisy pretty quickly. So I decided to use the `details` element to toggle all of the sub-sections (**without JavaScript!**) and then add a little style to it.

<style>
  .nav-list-demo :where([role="list"]) {
    list-style: none;
    padding-inline-start: 0;
  }
  .nav-list {
    background-color: #1F1E25;
    color: #8F94A6;
    padding: 2rem;
    user-select: none;
  }
  .nav-list-demo .nav-list a {
    color: inherit;
    text-decoration: none;
    display: block;
  }
  .nav-list-demo .nav-list summary {
    cursor: pointer;
    display: block;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 512'%3E%3Cpath d='M118.6 105.4l128 127.1C252.9 239.6 256 247.8 256 255.1s-3.125 16.38-9.375 22.63l-128 127.1c-9.156 9.156-22.91 11.9-34.88 6.943S64 396.9 64 383.1V128c0-12.94 7.781-24.62 19.75-29.58S109.5 96.23 118.6 105.4z' fill='%236A89FE'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right center;
    background-size: 1.125em 1.125em;
  }
  .nav-list-demo .nav-list details[open] > summary {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'%3E%3Cpath d='M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z' fill='%236A89FE'/%3E%3C/svg%3E");
  }
  .nav-list-demo .nav-list summary::-webkit-details-marker {
    display: none;
  }
  .nav-list-demo .nav-list details > [role="list"] {
    padding-inline-start: .75rem;
  }
  .nav-list-demo .nav-list a,
  .nav-list-demo summary {
    padding-block: .375rem;
    transition: color .1s ease-in-out;
  }
  .nav-list-demo .nav-list a:hover,
  .nav-list-demo .nav-list a[aria-current="page"],
  .nav-list-demo .nav-list summary:hover,
  .nav-list-demo .nav-list .is-active summary {
    color: #FDFDFE;
  }
  .nav-list-demo .nav-list > li,
  .nav-list-demo .nav-list .is-active summary {
    position: relative;
  }
  .nav-list-demo .nav-list > li > a[aria-current="page"]:before,
  .nav-list-demo .nav-list .is-active summary:before {
    content: "";
    display: block;
    width: 4px;
    height: 100%;
    background-color: #6A89FE;
    position: absolute;
    inset-inline-start: -2rem;
    inset-block-start: 0;
    inset-block-end: 0;
  }
  /* override site styles */
  .nav-list-demo .nav-list a:hover {
    border-bottom: none;
  }
  .demo-layout {
    display: grid;
    grid-template-columns: minmax(0, 240px) 1fr;
    outline: 2px solid #212836;
    outline-offset: 1px;
  }
  .demo-layout > [data-grid-area="nav"] {
    background-color: #1F1E25;
  }
  .demo-layout > [data-grid-area="main"] {
    background-color: #16151A;
    min-height: 526px;
    padding: 2rem;
  }
  .demo-layout > [data-grid-area="main"] > :not(:last-child) {
    margin-bottom: 1.5rem;
  }
  @media (max-width: 599px) {
    .demo-layout > [data-grid-area="main"] {
      display: none;
    }
    .demo-layout {
      display: grid;
      grid-template-columns: 1fr;
      max-width: 240px;
    }
  }
</style>

<section class="demo-layout">
  <nav class="nav-list-demo" id="example" data-grid-area="nav">
    <ul role="list" class="nav-list">
      <li><a href="#">Home</a></li>
      <li><a href="#">Changelog</a></li>
      <li>
        <details class="is-active" open>
          <summary>Visual Style</summary>
          <ul role="list">
            <li><a href="#" aria-current="page">Color</a></li>
            <li><a href="#">Typography</a></li>
            <li><a href="#">Spacing</a></li>
            <li><a href="#">Icons</a></li>
          </ul>
        </details>
      </li>
      <li>
        <details>
          <summary>Components</summary>
          <ul role="list">
            <li><a href="#">Accordion</a></li>
            <li><a href="#">Alert</a></li>
            <li><a href="#">Avatar</a></li>
          </ul>
        </details>
      </li>
    </ul>
  </nav>
  <div data-grid-area="main">
    <p class="ma-heading-1">Color</p>

Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus ab temporibus sapiente commodi? Accusamus qui quidem praesentium nesciunt quasi beatae, deserunt deleniti, aut veniam blanditiis provident fugiat incidunt consequatur natus.

Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui consequatur necessitatibus possimus, ut magnam magni enim distinctio iste explicabo debitis eum reprehenderit ea facilis numquam unde ipsam minus. Iusto, magni.

  </div>
</section>

## Setting up the plugin

In your Eleventy project, install the plugin:

```js
npm install @11ty/eleventy-navigation --save-dev
```

Next, add the plugin to your Eleventy config file:

```js
// .eleventy.js
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
};
```

Assuming you already have `module.exports`, you can just add the `const` and `addPlugin()`.

## Front Matter

In each page's front matter, add the `eleventyNavigation` object and assign a unique `key`:

```js
// _src/index.md
---
eleventyNavigation:
  key: Home
---
```

You can nest a page within the navigation by setting another page as its parent:

```js
// _src/visual-style/color.md
---
eleventyNavigation:
  key: Color
  parent: Visual Style
---
```

In my example, I don't actually have a page for Visual Style, so I created an empty index page and set `permalink` to `false` so that it wouldn't be generated. I also wanted it to appear before Components, so I also added an `order`:

```js
// _src/visual-style/index.md
---
title: Visual Style
permalink: false
eleventyNavigation:
  key: Visual Style
  order: 1
---
```

## Rendering the navigation

The plugin documentation has [a snippet for a Nunjucks macro](https://www.11ty.dev/docs/plugins/navigation/#bring-your-own-html-render-the-menu-items-manually) that will recursively render the menu with unlimited child levels. In this case, I only needed it to go down one level, but I wanted it to use the `details` element instead of a link for sections with children:

```js
// _includes/partials/nav-list.njk
{%- raw -%}
{% set navPages = collections.all | eleventyNavigation %}

{% macro renderNavListItem(entry) %}
  {% if entry.children.length %}
    <li>
      <details
        {%- for child in entry.children %}
          {% if child.parent == entry.title and child.url == page.url %}
            class="is-active"
            open
          {% endif %}
        {% endfor %}
      >
        <summary>{{ entry.title }}</summary>
        <ul role="list">
          {%- for child in entry.children %}{{ renderNavListItem(child) }}{% endfor -%}
        </ul>
      </details>
    </li>
  {% else %}
    <li>
      <a href="{{ entry.url }}"{% if entry.url == page.url %} aria-current="page" {% endif %}>{{ entry.title }}</a>
    </li>
  {%- endif -%}
{%- endmacro %}

<ul class="nav-list" role="list">
{%- for entry in navPages %}{{ renderNavListItem(entry) }}{%- endfor -%}
</ul>
{% endraw %}

```
 
Okay, there's a lot going on here, so let's break it down.

First, we're adding our collections to `navPages` and applying the `eleventyNavigation` filter:

```js
{%- raw -%}
{% set navPages = collections.all | eleventyNavigation %}
{% endraw %}
```

Next, we're creating a Nunjucks macro called `renderNavListItem` that takes `entry`, an individual item in `navPages`, as an arguement.

```js
{%- raw -%}
{% macro renderNavListItem(entry) %}
  ...
{% endmacro %}
{% endraw %}
```

Inside the macro, if an item has children, we'll show it as a `details` element inside a list item. If one of its children is the current page, we'll add a class of `.is-active` and also add an attribute of `open` to expand the `details` element by default. (If you want all of them to be expanded by default, you can move `open` ouside of the `for` loop and before the closing bracket of `details`.) Below the `summary`, we're using the `renderNavListItem` macro recursively to show children of the item in a list.

```js
{%- raw -%}
{% if entry.children.length %}
    <li>
      <details
        {%- for child in entry.children %}
          {% if child.parent == entry.title and child.url == page.url %}
            class="is-active"
            open
          {% endif %}
        {% endfor %}
      >
        <summary>{{ entry.title }}</summary>
        <ul role="list">
          {%- for child in entry.children %}{{ renderNavListItem(child) }}{% endfor -%}
        </ul>
      </details>
    </li>
{% endraw %}
```

If the item doesn't have children, we're displaying it as a list item linking to the page and setting `aria-current="page"` if the item matches the current page.

```js
{%- raw -%}
{% else %}
  <li>
    <a href="{{ entry.url }}"{% if entry.url == page.url %} aria-current="page" {% endif %}>{{ entry.title }}</a>
  </li>
{%- endif -%}
{% endraw %}
```

Finally, we call our macro inside of our `.nav-list`:

```js
{%- raw -%}
<ul class="nav-list" role="list">
{%- for entry in navPages %}{{ renderNavListItem(entry) }}{%- endfor -%}
</ul>
{% endraw %}
```

In our layout, we can insert the include that displays the nav list:

```js
// _src/_includes/base.njk
{%- raw -%}
{% include "partials/nav-list.njk" %}
{% endraw %}
```

## Styling the navigation

I styled this a little differently within the context of the design system, but I'll break it down here so that it works on its own.

First, a quick reset on lists where we set the `role` attribute to `list`. We're basically saying this should act like a list, even if we're stripping it of the default list styles. I picked this up from [Andy Bell's Modern CSS Reset](https://piccalil.li/blog/a-modern-css-reset/).

```scss
:where([role="list"]) {
  list-style: none;
  padding-inline-start: 0;
}
```

Note that I've enclosed the rule inside of a `:where()` selector, which is [supported in modern browsers](https://caniuse.com/?search=%3Awhere) and reduces its specificity to zero.

Next, we set some basic styles on the `.nav-list` itself:

```scss
.nav-list {
  background-color: #1F1E25;
  color: #8F94A6;
  user-select: none;
}
```

In the [above example](#example), I also set a max-width and a left margin, but in the context of a full page, those would probably be dictated by your layout.

Also note that I'm setting `user-select` to `none` here to prevent the user (read: me) from accidentally selecting text while clicking around the navigation.

Next, some link styles:

```scss
.nav-list a {
  color: inherit;
  text-decoration: none;
  display: block;
}
```

We're setting the color of our links to inherit the text color we previously set on `.nav-list`, instead of our default link color, and removing the underline. We also set `display: block` so that the link takes up the full width of the list, giving it a larger clickable surface.

Next, we want the `summary` of our `details` element to be largely indistinguishable from a link, except for the arrow indicator. For the arrow, we'll replace the default native indicator with a custom SVG, which we'll URL encode as a background image so that we don't need any external assets.

```scss
.nav-list summary {
  cursor: pointer;
  display: block;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 512'%3E%3Cpath d='M118.6 105.4l128 127.1C252.9 239.6 256 247.8 256 255.1s-3.125 16.38-9.375 22.63l-128 127.1c-9.156 9.156-22.91 11.9-34.88 6.943S64 396.9 64 383.1V128c0-12.94 7.781-24.62 19.75-29.58S109.5 96.23 118.6 105.4z' fill='%236A89FE'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right center;
  background-size: 1.125em 1.125em;
}
```

We're setting the background size using `em` so that the arrow is always proportionate to the size of the text. You could also use `rem` or `px` here, if you prefer.

When the list is open, we want to change the direction of the indicator arrow, so we'll use a different SVG:

```scss
.nav-list details[open] > summary {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'%3E%3Cpath d='M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z' fill='%236A89FE'/%3E%3C/svg%3E");
}
```

Whoopsie! Safari still shows the native arrow on the left. We can remove it like so:

```scss
.nav-list summary::-webkit-details-marker {
  display: none;
}
```

Let's give our link and summary elements some vertical padding using the [logical property](https://web.dev/learn/css/logical-properties/) `padding-block`. We'll also add a subtle transition on the color when it changes on hover.

```scss
.nav-list a,
summary {
  padding-block: .375rem;
  transition: color .1s ease-in-out;
}
```

Speaking of which, let's increase the contrast on a link or summary if it's hovered over or if it's the current page.

```scss
.nav-list a:hover,
.nav-list a[aria-current="page"],
.nav-list summary:hover,
.nav-list .is-active summary {
  color: #FDFDFE;
}
```

Note the use of `[aria-current="page"]` here. This is a great way to ensure that you're exposing the fact that the page is current to assistive devices and not just visually by using a class.

Ben Myers has an excellent article about [using stateful, semantic selectors](https://benmyers.dev/blog/semantic-selectors/) like this.

Next, for lists inside of a `details` element, we'll add some padding to indent the text.

```scss
.nav-list details > [role="list"] {
  padding-inline-start: .75rem;
}
```

Finally, we'll add some styles to highlight the active top-level page or section:

```scss
.nav-list > li,
.nav-list .is-active summary {
  position: relative;
}

.nav-list > li > a[aria-current="page"]:before,
.nav-list .is-active summary:before {
  content: "";
  display: block;
  width: 4px;
  height: 100%;
  background-color: #6A89FE;
  position: absolute;
  inset-inline-start: -2rem;
  inset-block-start: 0;
  inset-block-end: 0;
}
```

Here we're positioning a thin pseudo-element with a background color on the left edge of the list. Again we're using logical properties to position the pseudo-element.

## Wrapping up

So there you have it! A complex nav menu made slightly less complex, thanks to the `details` element, Eleventy's navigation plugin, and a little CSS. And we didn't need JavaScript or any additional assets.

Feel free to [reach out to me on Twitter](https://twitter.com/peruvianidol) if you have any questions or feedback!