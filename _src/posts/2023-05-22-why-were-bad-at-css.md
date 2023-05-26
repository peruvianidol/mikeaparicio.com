---
title: "Why we're bad at CSS"
description: And how we can improve with a practical example.
date: 2023-05-22
thumbnail: pain-box.png
thumbnailAlt: A hand going into the pain box from Dune, overlaid with CSS in the font Impact.
tags:
  - CSS
  - Web Development
  - Design Systems
---

When many devs think of CSS they think of Peter Griffin trying to open window blinds. But for others CSS is more like putting their hand in [the pain box from Dune](https://youtu.be/mbTp1vlRqYA) while some product manager has a _gom jabbar_ to their neck, daring them to pull their hand out.

<figure>
  <video poster="/images/pain-box.png" src="/images/pain-box.mp4" loop autoplay muted playsinline>
</figure>

There's a few reasons why tech continues to struggle with CSS.

1. **We're bad at teaching CSS.** While there are a ton of great CSS practitioners out there sharing their knowledge ([Stephanie Eckles](https://thinkdobecreate.com/), [Kevin Powell](https://www.kevinpowell.co/), and [Adam Argyle](https://nerdy.dev/), to name a few), a lot of people learn HTML and CSS in college or bootcamps from people who are perhaps not as knowledgeable, use outdated techniques or gloss over the basics in favor of frameworks like Bootstrap or Tailwind. As a result, you end up with a lot of folks who don't have a deep knowledge of HTML and CSS, which are the basic building blocks of the web.

2. **We're bad at hiring for CSS.** Just about every job listing for a full stack or frontend engineer lists HTML, CSS and JavaScript proficiency as a prerequisite, but when they interview candidates, they're rarely testing for anything other than JavaScript skills. If companies end up hiring people with CSS skills, it's usually by accident. And if you don't have people with those skills you can't vet other people for those skills and the problem perpetuates itself.

3. **We're bad at writing CSS.** Without deep knowledge of CSS and with an inability to hire people with that knowledge, people go to great lengths to avoid writing CSS, whether by relying on Bootstrap/Tailwind or trying to do everything in JavaScript. They end up over-complicating things to the point where their CSS is extremely hard to maintain. 

As I wrote in [Reframing Design Systems](/posts/2022-11-26-reframing-design-systems/), even people who are good at CSS often approach it in the context of a product feature. If you look at just about any site's CSS, you'll find a ton of instances of the same borders, margin, padding, background colors, etc. being declared dozens of times in different contexts.

<figure>
  <blockquote class="ma-blockquote">
  Writing CSS is applying the same set of visual styles in a bunch of <strong>different contexts</strong> over and over again until you die*
  </blockquote>
  <figcaption class="ma-text-small">* or, you know, quit tech and start a Peruvian food truck business, which goes great until your spouse divorces you because you took such a massive pay cut and you're working all the time, never see the kids, and come home smelling like ceviche. Hypothetically.</figcaption>
</figure>

Despite the latest advancements in CSS, many are  still stuck in this kind of [BEM](https://en.bem.info/methodology/) mindset, trying to perfectly encapsulate everything so we don't end up with unexpected results when we make changes.

Take this example from the BEM documentation:

```css
.page__header {
  padding: 20px;
}

.page__footer {
  padding: 50px;
}
```

This really isn't a whole lot different from using a utility class from a framework like Tailwind, except you wouldn't use `page__header` in any other context to add 20 pixels of padding to an element.

With Tailwind's "utility-first" approach, you need to apply a class for every individual design decision, resulting in markup like [this example](https://tailwindcss.com/) from their website:

```html
<figure class="md:flex bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800">
  <img class="w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto" src="/sarah-dayan.jpg" alt="" width="384" height="512">
  <div class="pt-6 md:p-8 text-center md:text-left space-y-4">
    <blockquote>
      <p class="text-lg font-medium">
        “Tailwind CSS is the only framework that I've seen scale
        on large teams. It’s easy to customize, adapts to any design,
        and the build size is tiny.”
      </p>
    </blockquote>
    <figcaption class="font-medium">
      <div class="text-sky-500 dark:text-sky-400">
        Sarah Dayan
      </div>
      <div class="text-slate-700 dark:text-slate-500">
        Staff Engineer, Algolia
      </div>
    </figcaption>
  </div>
</figure>
```

We're basically offloading those same contextual design decisions (in this case, what this card looks like) into class names in the markup, rather than than adding new class names to our CSS.

## So, what's the answer?

We want our styles to be generic enough to reuse in different contexts but not so generic that we have to constantly repeat ourselves in those contexts.

I took a stab at trying to articulate this with [COOL CSS](/posts/2021-03-25-cool-css/), a silly name I came up with for my own methodology that has served me well in writing CSS to support design systems at three different companies now.

In short, the idea is to style individual **components** with a single class, use **utility** classes to compose or modify them in different contexts, and provide **layouts** to keep things consistent between and within pages. 

* Component
* Utility (OO)
* Layout

Cool. 😎

## What Cool looks like

Let's refactor the card example from the Tailwind site.

<figure style="width: 75%; margin-inline: auto">
{% image "tailwindcss-card.png", "A card with a woman's photo on the left and a blockquote on the right." %}
</figure>

### The card

This card contains a testimonial, but we might want to use this card pattern in a different context. Our card should not care what's inside of it. That is, we're not going to scope all of the content in this particular card example with `.card-`. These styles only dictate what the card container looks like.

```css
/* /scss/components/_card.scss */
.cool-card {
  border-radius: $radius-medium;
  background-color: $color-surface-brand-light;
  overflow: hidden;
}

@media (prefers-color-scheme: dark) {
  .cool-card {
    background-color: $color-surface-brand;
    color: $color-text-inverse;
  }
}
```

Yes, I'm using SCSS variables instead of CSS custom properties for tokens. I love custom props but &mdash; **controversial opinion alert** &mdash; not for tokens.

Our design system not only defines the specific values we use (colors, type, spacing) but also the contexts in which we use them. Instead of giving developers utility classes that allow them to apply **any** color (e.g. `.bg-slate-100`), we only want to use certain colors in specific contexts.

I cringe anytime I see a mixin that goes through every color in the palette and makes a background color utility class for each one. You're never going to use _every_ color and if you provide that option you're going to end up with some color combinations that lack sufficient contrast.

That's why I use a separate layer of tokens to define contexts. `$color-surface-brand-light` might point to `$slate-100`. If we ever want to change the value where our brand color is used for backgrounds, we can change a single token to apply it across different components without having to find and replace every instance of `$slate-100` with a different color.

Rather than giving our developers access to all of the tokens, we can abstract them into our classes and they can use the appropriate class for each context.

Also, since we're using SCSS, we can be more verbose with our token names, since they will compile to smaller values anyway.

### Flexin'

The content within this particular card includes an image and a blockquote, arranged horizontally using flexbox. Let's add a flex utility.

```css
/* /scss/utilities/_flex.scss */
.cool-flex {
  --flex-align: center;
  --flex-gap: $spacing-16;
  display: flex;
  align-items: var(--flex-align);
  gap: var(--flex-gap);
}
```

Here we're using CSS custom properties inside our flex utility to provide some common defaults from *our* design system. This way we don't need to provide a bunch of additional utility classes to support every possible value for each flex property.

If a developer runs into an instance where they need to override the defaults, they can do so by declaring them in the `style` attribute. In this case, we don't want a gap between the image and the blockquote, since that will be handled by the padding.

```html
<figure class="cool-card cool-flex" style="--flex-gap: 0">
  ...
</figure>
```

Sure, there are other flex properties we might want to use down the line, but I'm a firm believer in adding things as you need it rather than trying to account for every possible use case. For the purposes of this card, this is more than sufficient.

In this design, flex is only applied above a certain viewport width, so we could create another flex utility that only applies above a certain breakpoint. 

```css
/* /scss/utilities/_flex.scss */
@media (width >= $breakpoint-medium) {
  .cool-flex-responsive {
    --flex-align: center;
    --flex-gap: $spacing-16;
    display: flex;
    align-items: var(--flex-align);
    gap: var(--flex-gap);    
  }
}
```

I've never really worked on a system that required more than one breakpoint (maybe some layouts but not individual components as much), so I tend to use `-responsive` to indicate things that should only happen above a certain breakpoint. With component queries gaining wider support, viewport-based media queries might soon be unnecessary in contexts like this.

We can now also use the new [range syntax](https://caniuse.com/?search=media%20range) for our media queries in evergreen browsers! Instead of `max-width: $breakpoint-medium` we can write `width >= $breakpoint-medium`.

### The image

It kinda drives me nuts when designers have an entirely different design between large and small screens. I do my best to make it work.

Here, our image goes from a small circle to a full-sized image on larger screens. This might require a unique component.

```css
/* /scss/components/_avatar.scss */
.cool-avatar {
  width: $avatar-medium;
  height: $avatar-medium;
  border-radius: $radius-round;
  object-fit: cover;
}

@media (width >= $breakpoint-medium) {
  .cool-avatar {
    --width: 100%;
    max-width: var(--width);
    width: auto;
    height: auto;
    border-radius: 0;
  }
}
```

We're adding a token for the rounded avatar size on small screens and setting `object-fit` to account for images that don't have a square aspect ratio. On large screens, we use a custom property to allow overriding the image's width.

We actually have to override the `--flex-align` of `.cool-flex` back to the default `stretch` to support instances where the text of the blockquote is taller than the image. So our `--width` prop is actually setting the max width while the width and height are set to auto, dictated by the aspect ratio of the image. To compensate for this I added an `align-self: center` inline to the text container. (This is a whole lot to consider for one very specific design choice, but it happens.)

We also need to accommodate for the positioning of the avatar on small screens. This necessitates a couple of utility classes that only appear on small screens. Yes, these class names are a little verbose, but I find them clearer than `md:h-auto` and it also takes advantage of [logical properties](https://web.dev/learn/css/logical-properties/).

```css
/* /scss/utilities/_spacing.scss */
@media (width < $breakpoint-medium) {
  .cool-margin-auto-on-small {
    margin-inline: auto;
  }

  .cool-margin-block-start-on-small {
    --size: $spacing-32;
    margin-block-start: var(--size);
  }
}
```

### The text container

The container with our blockquote and figcaption has some padding applied as well as margin between elements and the text is centered on small screens. Time for some more utilities!

```css
/* /scss/utilities/_spacing.scss */
:where(.cool-flow) {
  --flow-size: $spacing-16;
  & > :not(:last-child) {
    margin-block-end: var(--flow-size);
  }
}

.cool-inset-square-32 {
  padding: $spacing-32;
}

/* /scss/utilities/_text.scss */
@media (width < $breakpoint-medium) {
  .cool-text-center-on-small {
    text-align: center;
  }
}
```

The flow utility is adapted from [Andy Bell's favourite 3 lines of CSS](https://andy-bell.co.uk/my-favourite-3-lines-of-css/). When you place it on a container, all direct children receive a bottom margin of `--flow-size`.

I've included it in a `:where()` [pseudo-class function](https://css-tricks.com/almanac/selectors/w/where/) to reduce its specificity to zero so that you could override the bottom margin of any of the children with another utility class if needed.

For padding utilities, I've adopted the naming conventions Nathan Curtis outlines in [Space in Design Systems](https://medium.com/eightshapes-llc/space-in-design-systems-188bcbae0d62).

**Inset** refers to padding and **square** indicates the same padding value on all four sides.

Finally, I added another utility class that centers text on small screens only.

### The text

In Tailwind's version of this they're applying `.text-medium` to set the font weight of both the text of the blockquote and the figcaption below it. We could use a similar class and apply it just once to the whole container, but in this case we can just let the font weight inherit from the `body`.

We then need a text style for large text as well as what I refer to as **subdued text** &mdash; text that uses a lower contrast color to indicate reduced importance rather than adjusting the font size or font weight.

There's also some blue text that looks like a link but isn't. I'm assuming in practice that this would actually be a link, in which case we would apply the `.cool-text-interactive` styles to links in our global styles so that we could just use an `<a>` without a class.

```css
/* /scss/components/_text.scss */
.cool-text-large {
  font-size: $text-large-font-size;
  line-height: $text-large-line-height;
}

/* /scss/utilities/_text.scss */
.cool-text-interactive {
  color: $color-text-interactive;
}
.cool-text-subdued {
  color: $color-text-subdued;
}
@media (prefers-color-scheme: dark) {
  .cool-text-interactive {
    color: $color-text-interactive-inverse;
  }
  .cool-text-subdued {
    color: $color-text-subdued-inverse;
  }
}
```

## The finished markup

Here's what we end up with for our refactored markup.

```html
<figure class="cool-card cool-flex-responsive" style="--flex-gap: 0; --flex-align: stretch">
  <img class="cool-avatar cool-margin-auto-on-small cool-margin-block-start-on-small" style="--width: 12rem" src="https://assets.codepen.io/281/sarah-dayan_1.jpg" alt="" width="384" height="512">
  <div class="cool-flow cool-text-center-on-small cool-inset-square-32" style="align-self: center">
    <blockquote class="cool-text-large">
      <p>
        “Tailwind CSS is the only framework that I've seen scale
        on large teams. It’s easy to customize, adapts to any design,
        and the build size is tiny.”
      </p>
    </blockquote>
    <figcaption>
      <div class="cool-text-interactive">
        Sarah Dayan
      </div>
      <div class="cool-text-subdued">
        Staff Engineer, Algolia
      </div>
    </figcaption>
  </div>
</figure>
```

At a glance this doesn't look much more concise than the Tailwind example, until you actually view the source on the Tailwind example and see all of the utility classes and inline styles they actually used that they don't show in the code sample. Here's just the image element, for example:

```html
<img src="/_next/static/media/sarah-dayan.de9b3815.jpg" decoding="async" alt="" class="absolute max-w-none object-cover bg-slate-100 rounded-full" style="width: 100%; height: 100%; left: 0px; top: 0px; transform-origin: 50% 50% 0px;">
```

The end code, however, results in fewer classes overall, is easier to parse what the classes are doing and allows for less repetition when reusing these styles in different contexts.

You can find the final example on [CodePen](https://codepen.io/peruvianidol/pen/VwEqERR?editors=1100).

## Wrapping up

I actually started this post as part two of my [Design System Diary](/posts/2023-02-17-design-system-diary-part-1/) series, but it became this epic preamble before I even got to talking about building Turquoise Health's CSS framework. I ended up breaking it off into its own thing and adding a practical example so the article wasn't just me complaining about CSS frameworks that I didn't write (an integral part of my personal brand).

In the next Design System Diary I'll go into more detail about how our CSS framework is organized and some of the other techniques I use to keep the framework light and hopefully meet our goal of our devs never having to write CSS.

I should also say that if this post doesn't resonate with you and your current method of writing CSS is working out for you, congratulations! [It's your website.](/posts/2021-11-24-its-your-website/)