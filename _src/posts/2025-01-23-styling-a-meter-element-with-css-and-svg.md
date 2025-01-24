---
title: "Styling a meter element with CSS and SVG"
description: How to make a fancy rating component.
date: 2025-01-23
thumbnail: rating-example.png
thumbnailAlt: A movie review for Red Rooms with a star rating component.
tags:
  - CSS
  - Web Development
---

I recently had to add a new variation of a rating component for work and thought I'd share my technique here. (Note that this rating is just for displaying a rating, not for inputting a rating.)

The original rating component showed a star rating from 1-5 &mdash; pretty common on a lot of sites. When I worked at Groupon I probably did this in some hacky way, showing a full, half, or empty star icon with each star represented by a list item, and all the stars flexed vertically. But you can achieve the same result in a more semantic way using the `meter` element.

Here's the default `meter`:

<meter min="0" max="5" value="3.5">3.5 out of 5</meter>

And the markup looks like this:

```html
<meter min="0" max="5" value="3.5">3.5 out of 5</meter>
```

Pretty boring, right? Let's _zshush_ it up a little with a star icon.

## Making a star mask

1. Load your star icon in your vector editor of choice.
2. Adjust the width of the icon to a whole number. I made mine 16px wide. Because of the aspect ratio of the star icon, the height was slightly smaller, so I centered it vertically.
3. Adjust the width of the artboard to be 1-2px wider than the icon, depending on your desired spacing between stars. My artboard is 17x16px.
4. Create a rectangle the same size as the artboard and place it beneath the icon.
5. Subtract the icon from the background, leaving you the rectangle with a star shape cut out of it.
6. Set the color of the shape to black (`#000000`).
7. Save your icon as a new SVG.

<figure>
  {% image "rating-icon.png", "A finished star mask in Affinity Designer" %}
  <figcaption>The finished star mask.</figcaption> 
</figure>

8. I like to run the SVG through <a href="https://jakearchibald.github.io/svgomg/">SVGOMG</a> to optimize it.
9. Finally, you can use [this handy tool](https://yoksel.github.io/url-encoder/) to URL-encode your icon into a CSS background image. It should look something like this:

```css
background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 17 16'%3E%3Cpath d='M17 0v16H0V0h17ZM8.87.788a.97.97 0 0 0-1.745 0L5.177 4.796l-4.351.643a.967.967 0 0 0-.779.657.974.974 0 0 0 .24.991l3.157 3.124-.746 4.415a.974.974 0 0 0 1.415 1.018l3.888-2.076 3.887 2.076a.971.971 0 0 0 1.415-1.018l-.748-4.415 3.157-3.124a.968.968 0 0 0-.539-1.648l-4.354-.643L8.87.788Z'/%3E%3C/svg%3E");
```

## Styling the meter

From there, we'll wrap our `meter` in a container with a class of `rating`:

```html
<div class="rating">
  <meter min="0" max="5" value="3.5">3.5 out of 5 stars</meter>
</div>
```

And then add some styles. First we want to style our `.rating` container.

```css
.rating {
  --background-color: #727273;
  --icon-color: #00e054;
  --height: 32px;
  --aspect-ratio: 168/32;
  --background-size: 34px 32px;
  aspect-ratio: var(--aspect-ratio);
  height: var(--height);
  position: relative;
}
```

First we'll set up some custom properties so that we can easily override some defaults in different contexts. Here I've doubled the values of everything just so the finished product is easier to see, but in practice I'll be using a height of 16px. The aspect-ratio is key because we want our container and everything inside of it to be the exact dimensions for the stars to align, so to speak. The height of the aspect ratio should be the same as the height of the star icon and the width of the aspect ratio is calculated as follows:

```text
([number of stars] * [height]) + (([number of stars] - 1) * [space between stars])
```

In this example, 5 stars times 16, plus 4 pixels times 1 = 84. But again, we're doubling all of our values, so the aspect ratio is 168/32.

On our `.rating` container, we're setting the height and aspect ratio with the custom props and adding `position: relative` to position the stars and our `meter` within the container.

Next we add some styles on our `meter`:

```css
.rating meter {
  position: absolute;
  inset: 0;
  background: none;
  background-color: var(--background-color);
  height: var(--height);
  width: auto;
}
```

Here we're setting the position of the meter to `absolute` and using `inset: 0` to stretch it to fit the container. The `background` property is shorthand, so we set it to `none` here to reset the default meter styling across browsers and then just set the `background-color`, which will be the color of unused stars. We're also setting the height to our custom property and the width to `auto`.

Next we have to apply some cross-browser styling to set the color of the meter background and bar:

```css
.rating ::-moz-meter-bar {
  background: none;
  background-color: var(--icon-color);
}
.rating ::-webkit-meter-bar {
  background: var(--background-color);
  border: 0;
  border-radius: 0;
  height: var(--height);
}
.rating ::-webkit-meter-optimum-value {
  background: var(--icon-color);
}
```

It's pretty straightfoward. We're just resetting the colors and removing any borders or radii.

Finally, we'll add our star as a repeating background image on a pseudo-element of our `.rating` container.

```css
.rating:after {
  content: "";
  display: block;
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 17 16'%3E%3Cpath d='M17 0v16H0V0h17ZM8.87.788a.97.97 0 0 0-1.745 0L5.177 4.796l-4.351.643a.967.967 0 0 0-.779.657.974.974 0 0 0 .24.991l3.157 3.124-.746 4.415a.974.974 0 0 0 1.415 1.018l3.888-2.076 3.887 2.076a.971.971 0 0 0 1.415-1.018l-.748-4.415 3.157-3.124a.968.968 0 0 0-.539-1.648l-4.354-.643L8.87.788Z' fill='%231f1f1f'/%3E%3C/svg%3E");
  background-repeat: repeat-x;
  background-size: var(--background-size);
}
```

We set the content of the pseudo-element to empty and the display to `block`, and then position it absolutely to fill the `.rating` container. We can use the background-image from earlier, but you'll note we need to add a `fill` property and set it to the background of our page. (`%23` is `#` URL-encoded.) Then we have our star shape repeat horizontally and set the background size equal to the dimensions of our icon from our custom property.

And here's the finished product:

<div class="rating">
  <meter min="0" max="5" value="3.5">3.5 out of 5 stars</meter>
</div>

I recently built a page that pulls [my last 10 movies watched](/watching/) from Letterboxd and included this star rating component.

## Extending the rating component

Let's say you've built this in a design system and a new designer decides they need a rating component but that stars aren't appropriate. And rather than a 0-5 scale, they need a 0-10 scale. No problem!

Rather than making a new class, we can use the same class but add a data attribute to specify the type of rating.

```html
<div class="rating" data-rating="bar">
  <meter min="0" max="5" value="4">4</meter>
</div>
```

We may need to set some new custom properties to support this style.

```css
.rating[data-rating="bar"] {
  --background-color: #727273;
  --icon-color: dodgerblue;
  --height: 20px;
  --aspect-ratio: 29/10;
  --background-size: 12px 20px;
}
```

And we'll also need a new icon.

```css
.rating[data-rating="bar"]:after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 10'%3E%3Cpath fill='%231f1f1f' d='M0 1V0h1a1 1 0 0 0-1 1Zm4-1h2v10H4a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1ZM1 10H0V9a1 1 0 0 0 1 1Z'/%3E%3C/svg%3E");
  background-size: var(--background-size);
}
```

The rest can just be inherited by the base `.rating` component, and the result looks like this:

<div class="rating" data-rating="bar">
  <meter min="0" max="5" value="4">4</meter>
</div>

But hang on, we needed it to use a 0-10 scale, right? 

We can use the `:has()` selector to set the custom property for the aspect ratio depending on the `max` attribute of the `meter` element, allowing us to support either a 0-5 or 0-10 scale.

Here's the full, updated CSS:

```css
.rating[data-rating="bar"] {
  --background-color: #727273;
  --icon-color: dodgerblue;
  --height: 20px;
  --background-size: 12px 20px;
}
.rating[data-rating="bar"]:has(meter[max="5"]) {
  --aspect-ratio: 29/10;
}
.rating[data-rating="bar"]:has(meter[max="10"]) {
  --aspect-ratio: 59/10;
}
.rating[data-rating="bar"]:after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' fill-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2' clip-rule='evenodd' viewBox='0 0 6 10'%3E%3Cpath fill='%231f1f1f' d='M0 1V0h1a1 1 0 0 0-1 1Zm4-1h2v10H4a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1ZM1 10H0V9a1 1 0 0 0 1 1Z'/%3E%3C/svg%3E");
  background-size: var(--background-size);
  background-repeat: repeat-x;
}
```
And the result:

<div>
  <p><strong>O-5 scale</strong></p>
  <div class="rating" data-rating="bar">
    <meter min="0" max="5" value="4">4</meter>
  </div>

```html
<div class="rating" data-rating="bar">
  <meter min="0" max="5" value="4">4</meter>
</div>
```   
</div>

<div>
  <p><strong>0-10 scale</strong></p>
  <div class="rating" data-rating="bar">
    <meter min="0" max="10" value="8">8</meter>
  </div>

```html
<div class="rating" data-rating="bar">
  <meter min="0" max="10" value="8">8</meter>
</div>
```
</div>

## Wrapping up

So there you go. A versatile rating component in about 60 lines of CSS. Let me know what you think and how you'd improve on it!

<style>
  .rating {
    --background-color:rgb(114, 114, 115);
    --icon-color: #00e054;
    --height: 32px;
    --aspect-ratio: 168/32;
    --background-size: 34px 32px;
    aspect-ratio: var(--aspect-ratio);
    height: var(--height);
    position: relative;
  }
  .rating ::-moz-meter-bar {
    background: none;
    background-color: var(--icon-color);
  }
  .rating ::-webkit-meter-bar {
    background: var(--background-color);
    border: 0;
    border-radius: 0;
    height: var(--height);
  }
  .rating ::-webkit-meter-optimum-value {
    background: var(--icon-color);
  }
  .rating meter {
    position: absolute;
    inset: 0;
    background: none;
    background-color: var(--background-color);
    height: var(--height);
    width: auto;
  }
  .rating:after {
    content: "";
    display: block;
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 17 16'%3E%3Cpath d='M17 0v16H0V0h17ZM8.87.788a.97.97 0 0 0-1.745 0L5.177 4.796l-4.351.643a.967.967 0 0 0-.779.657.974.974 0 0 0 .24.991l3.157 3.124-.746 4.415a.974.974 0 0 0 1.415 1.018l3.888-2.076 3.887 2.076a.971.971 0 0 0 1.415-1.018l-.748-4.415 3.157-3.124a.968.968 0 0 0-.539-1.648l-4.354-.643L8.87.788Z' fill='%231f1f1f'/%3E%3C/svg%3E");
    background-repeat: repeat-x;
    background-size: var(--background-size);
  }
  .rating[data-rating="bar"] {
    --background-color: #727273;
    --icon-color: dodgerblue;
    --height: 20px;
    --background-size: 12px 20px;
  }
  .rating[data-rating="bar"]:has(meter[max="5"]) {
    --aspect-ratio: 29/10;
  }
  .rating[data-rating="bar"]:has(meter[max="10"]) {
    --aspect-ratio: 59/10;
  }
  .rating[data-rating="bar"]:after {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 10'%3E%3Cpath fill='%231f1f1f' d='M0 1V0h1a1 1 0 0 0-1 1Zm4-1h2v10H4a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1ZM1 10H0V9a1 1 0 0 0 1 1Z'/%3E%3C/svg%3E");
    background-size: var(--background-size);
  }
</style>

