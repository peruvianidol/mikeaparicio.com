---
title: Reframing Design Systems
description: 
date: 2022-11-26
thumbnail: atoms-and-molecules.png
thumbnailAlt: Atoms and Molecules from Brad Frost's Atomic Design
tags:
  - Web Development
  - CSS
  - Design Systems
---

Dan Mall tweeted some great advice for struggling design systems teams:

<blockquote class="twitter-tweet" data-conversation="none" data-theme="dark"><p lang="en" dir="ltr">Do less.<br><br>Almost every team I work with tries to make their design system do everything. They stress themselves out, trying to tackle too much and end up accomplishing nothing.<br><br>Pick a handful of things, and do them really well.</p>&mdash; Dan Mall (@danmall) <a href="https://twitter.com/danmall/status/1596540918810939393?ref_src=twsrc%5Etfw">November 26, 2022</a></blockquote> 

While attending Clarity Conference a few weeks ago, a common theme that came up in talking to folks struggling with their design systems was scope. The root of the problem is similar to why people struggle with CSS: we tend to look at a pattern in the context of a product feature.

Take the following set of patterns.

<figure>
  {% image "patterns.png", "A set of common design patterns" %}
</figure>

You might look at these and see:

1. A subscription form
2. A navigation menu
3. A button group
4. A card grid

If you were to write the CSS for these, you'd see that all of these are groups of atomic components (text, buttons, inputs, images) composed with flexbox. Rather than adding new classes to support each of these feature contexts, we can use a utility class.

```scss
.flex {
  --flex-align: center;
  --flex-gap: .5rem;

  display: flex;
  align-items: var(--flex-align);
  gap: var(--flex-gap);
}
```

In this basic example, we can use CSS custom properties to provide defaults which can be overridden to support different contexts without having to make utility classes for every possible combination of flexbox properties.

In order to keep things managagable, particularly when your design system team is maybe fortunate enough to have a single person working on it full-time, it's critical to keep the system separate from "product decisions."

It's simply not possible to build and mantain a design system while also being included in every product meeting and keeping the system in sync with decisions made in those meetings.

Therefore, your best bet is to keep things small and provide designers and engineers with the building blocks to compose whatever they can imagine using the system.

<figure>
  {% image "atomic-design.png", "A diagram from Brad Frost's Atomic Design showing Atoms (components) and Molecules (composition) as part of your design system, while Organisms, Templates and Pages are Product Decisions." %}
  <figcaption>
    from Brad Frost's <a href="https://bradfrost.com/blog/post/atomic-web-design/">Atomic Design</a>
  </figcaption>
</figure>

In Atomic Design terms, your system's components should largely consist of Atoms, while you can apply utility classes (like a flexbox utility) to compose those atoms into larger Molecules. When you start getting into Organisms you're in full on Product Decision Land.

LEGO analogies in design systems are cliché, but think of yourself as designing the individual bricks and making sure designers and engineers have the pieces they need and let them decide if they're building Star Wars or Avengers or Harry Potter.