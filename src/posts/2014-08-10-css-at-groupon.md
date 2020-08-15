---
title: CSS at Groupon
description: A look at our CSS frameworks at Groupon.
date: 2014-08-10
tags:
  - CSS
  - Design Systems
  - Web Development
---
This post was inspired by the recent wave of people sharing info about their CSS: [Mark Otto at Github](http://markdotto.com/2014/07/23/githubs-css/), [Ian Feather at Lonely Planet](http://ianfeather.co.uk/css-at-lonely-planet/) and [Chris Coyier at Codepen](http://codepen.io/chriscoyier/blog/codepens-css).

About two years ago I was working on a redesign of Groupon's consumer website (which was later scrapped) when I was asked if I wanted to work on our internal tools team. "You won't have to support Internet Explorer," they said.

**\* Cue chorus of angels \***

As Groupon had been experiencing exponential growth, many of our "internal tools" consisted of a bunch of Google Docs and things scribbled on cocktail napkins. The internal tools team was tasked with streamlining those processes. We had a half dozen or so dev teams working on different tools supported by just two designers. The challenge we faced was how to quickly crank out designs for these tools without having a horrible mishmash of CSS.

At first we debated the merits of using Twitter Bootstrap, which had just started gaining popularity at the time. We also looked at Zurb's Foundation. Eventually we decided that we would roll our own CSS framework in order to keep things light and consistent with our designs. We called it [Toolstrap](https://speakerdeck.com/peruvianidol/toolstrap-a-css-framework-for-groupon-internal-tools) (Bootstrap for Internal Tools).

## Style Guide

We began by looking at a lot of common elements in our design and started abstracting them out into reusable components. We documented these in a style guide that helped us keep track of which components needed to be styled and later served as a handy reference of what was in the framework for developers.

## SMACCS

Next we decided that [Scalable Modular Architecture for CSS](https://smacss.com/) would be a great way to organize our code. Most of the company was already using SASS, and the use of variables and mixins made organizing our code quite simple. Here's a general overview:

* **Base** - In this folder we have [normalize.css](http://necolas.github.io/normalize.css/) as well as base styles of all our elements, broken down by global styles (box-sizing, body styles), typography, forms, lists and tables.
* **Layout** - This included our grid (borrowed liberally from Foundation 2) as well as styles to support several different layouts that our different apps required.
* **Module** - This included pretty much every variation of elements and groups of elements that were specified by classes. (Think Brad Frost's [Atomic Design](http://bradfrostweb.com/blog/post/atomic-web-design/).) This includes things like buttons, form inputs, lists, navigation, header styles and little custom widgets.
* **State** - This folder would normally include styles that are triggered by JavaScript but, for the most part, we just put styles here for entire modules that have on/off states, such as accordions, modals and tooltips.
* **Theme** - Here we have variations on styles for headers, tables and forms, as well as classes to apply color themes to any element.

## Toolstrap in action

Teams embraced Toolstrap pretty quickly as they were able to get a majority of the design for their app from the framework without having to fiddle around in CSS trying to interpret a PSD. They could simply layer on some app-specific overrides to layout their components.

As more teams used Toolstrap, however, we ran into a few issues.

1. The first version of Toolstrap was heavily dependent on Rails (which most teams were using at the time), JUI, SASS and Compass. Around that time, teams were starting to create apps using various JavaScript frameworks which made using Toolstrap difficult.
2. Versioning of Toolstrap was constantly in flux as we added new modules and removed things that were only being used by a single app. One of the tricky things about maintaining a framework used by multiple apps is determining which styles should be in the framework and which should be included in the app-specific styles.
3. We had a number of image assets included with the framework, including icon sprites, logos and background patterns. This added a lot of bloat to the framework.

To solve these issues, we created Toolstrap 2. Toolstrap 2 included just a single CSS and JS file, rather than all the pre-compiled assets. We decided that we didn't particularly need every project to have access to the individual SASS files. Rather than require JUI, we simply included styles for their markup patterns for things like datepickers. This freed people to use Toolstrap on any project just by including the CSS and JS on each page.

We worked on DRYing up our code and pulling out a lot of things that we included "just in case." Teams were free to add these things to their app-specific styles.

We put all of our icons into an icon font using [Icomoon](https://icomoon.io/), which reduced the overhead of assets and also gave us a lot of flexibility for high-resolution displays. Chris Coyier has a great demo that shows why [Icon Fonts are Awesome](http://css-tricks.com/examples/IconFont/).

## Toolstrap for Consumers

Eventually the product side of the company got wind of Toolstrap and its success and decided it would be a good idea to implement in their latest redesign efforts. We had already begun creating a style guide for the new design in earnest, known as the Groupon Interface Guidelines. The new framework took on this unfortunate name, shortened to GIG.

Our existing site was a massive Rails app and the CSS was just a huge, huge file with all of the styles for every page on the site, including some that no longer existed. I want to say the CSS weighed in at close to 1 MB.

## A quick word about the dangers of SASS

While SASS can be a powerful tool in the right hands, in the wrong hands you can end up with selectors like this:

`body.getaways-gallery-gig .page_header #filters #categories_filter .pane .categories_container .categories ul li.selectBox-selected a {
color: #333;
}`

Yes, this was an actual selector in production code. Because of the ease of nesting in preprocessors like SASS, inexperienced devs will often nest like crazy without understanding the ramifications on the compiled code. This adds a ton of unnecessary specificity that requires the same selector to override or worse, using !important. (Often times devs will even resort to inline styles! Ewww.)

## Building GIG

As we moved from Rails to Node.js, one of the biggest challenges in creating GIG was supporting two different designs. We needed to support styles for both the existing design (referred to as OG, or Original Groupon) and the new design (known as Prom Night). Rather than create two separate frameworks, we decided to abstract out common styles between the two designs and then use SMACSS's Themes folder to apply design-specific code scoped to a single body class.

The initial phase of the redesign was simply a re-skinning of the site. All of the markup would would stay the same and only the CSS would change. Later, we would drop support for the old styles and begin iterating on the markup and styles until we got to the finished redesign.

With the common styles abstracted out, our Themes folder looked like this:

* /theme

  * /og

    * /base
    * /module
    * /state
  * /prom-night

    * /base
    * /module
    * /state

All of the styles were nested under an **og** or **prom-night** class that could be toggled on the body element. This allowed us to A/B test the new design pretty easily and also allowed for a staggered rollout across our international sites as we began the process of getting them all onto a single platform.

There's a great post on our transition from Rails to Node.js on the Groupon Engineering Blog: [I-Tier: Dismantling the Monoliths](https://engineering.groupon.com/2013/misc/i-tier-dismantling-the-monoliths/)

## Benefits of Custom Frameworks

There are a bunch of benefits to having your own in-house framework.

* While many people complain that sites using frameworks all look the same, in Groupon's case, that's exactly what we're going for. Having Toolstrap and GIG allows our developers to concentrate on how their apps work and not so much on what they look like. Toolstrap's motto is *Push Code, Not Pixels*. Designers also love our frameworks because they can have consistent design across our products without all of the back and forth that goes on when developers are forced to interpret a PSD.
* Custom frameworks allow for rapid prototyping. Every quarter or so we have an internal hackfest known as [Geekon](https://engineering.groupon.com/2013/misc/bottoms-up-innovation-groupon-hosts-geekon-first-internal-tech-conference/), where designers and developers have just a few days to put together a fully-realized product. With Toolstrap and GIG, teams are able to get an app up and running quickly that looks like our other internal apps. We can also prototype new products throughout the year and get high-fidelity prototypes in front of users in a very short period of time.
* With Toolstrap and GIG, it's very easy for developers to move between teams - even from product to internal tools - and not have to spend time learning new styles.

## Many Thanks!

Groupon's CSS frameworks would not be possible without the efforts of the ton of talented developers we have, as well as the influence of people like [Brad Frost](http://bradfrostweb.com/), [Chris Coyier](http://chriscoyier.net/), [Jonathan Snook](http://snook.ca/), [Luke Wroblewski](http://www.lukew.com/), [Ethan Marcotte](http://ethanmarcotte.com/), [Keyamoon](http://keyamoon.com/) and countless others.