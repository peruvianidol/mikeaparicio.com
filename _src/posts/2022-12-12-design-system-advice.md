---
title: Design System Advice
description: 5 tips for working on design systems.
date: 2022-12-12
thumbnail: clarity-2022.jpg
thumbnailAlt: A bunch of awesome design systems folks standing in front of a flaming fountain in New Orleans.
tags:
  - Design Systems
---

I've been talking with a lot of people about design systems recently. First at [Clarity Conference](https://www.clarityconf.com/event/2022), in New Orleans, where I met a bunch of folks working on design systems big and small. In all of those conversations the one thing that struck me is that none of us have this design systems thing figured out. We're all just kind of stumbling around in the dark, learning from each other's mistakes and successes.

<figure>
  {% image "clarity-2022.jpg", "A bunch of awesome design systems folks standing in front of a flaming fountain in New Orleans." %}
  <figcaption>
    Hanging out with some lovely design systems people at Clarity Conf 2022 in New Orleans.
  </figcaption>
</figure>

Recently I started [mentoring on ADPList](https://adplist.org/mentors/mike-aparicio) and so far my mentees fall into two categories: people trying to get into design systems and people working on design systems that are facing various challenges. A lot of common themes have come up and talking about them has helped me better articulate my approach to design systems, so I thought I'd share some of that advice here!

## Get in where you fit in

It's tough out there right now in tech. So many companies are laying people off, freezing their hiring, and/or rescinding offers. Beyond that, they're reprioritizing the efforts of their remaining employees. Unfortunately, this sometimes means that design systems work, which to management doesn't directly drive revenue, often gets the short shrift.

If you're a recent grad or trying to pivot your career into a design systems role, now is honestly not a great time. Your best bet is to look for any role you can get hired for, but once you're in, look for opportunities to work on design systems or whatever else you might be interested in.

Find the people in the company who are doing that work and offer to help, even if they're not on your team. Not only is it a great opportunity to expand your skills and influence, but as other people doing the work move on, you'll become the de facto go-to person for whatever you're interested in.

In short, **don't let your employer define your role**. Find opportunities to work on what you're interested in and make yourself indispensable for that thing.

## Adopt a service mentality

Working on design systems, your customers are not your company's customers. Your customers are designers, engineers and product managers. Your job is to help make their jobs easier.

Look for opportunities to connect with these customers. 

* Establish regular office hours where people can drop in and ask questions, pair on solutions or just hang out and get to know you. 

* Make a dedicated Slack channel where people can ask questions and get support. Even if you're a solo design system team, having people ask in a channel rather than a DM allows other people who might know the answer to help out and is easier to reference than private conversations.

* Make yourself available for questions and 1:1 sessions.

* Get feedback via surveys and/or quarterly retrospectives. Soliciting feedback can be challenging, but it's important to give people that opportunity, even if they don't take advantage of it.

* Evangelize the system through brown bags, lunch and learns, company all-hands &mdash; any opportunity to address large groups in the company who might not be familiar with you or the work you do.

* Let people know that you're there to make their jobs easier. They love that!

<figure>
  <img src="/images/deal-with-designers.gif" alt="Tom from Office Space animatedly telling the Bobs: I deal with the goddamn designers so the engineers don't have to!">
  <figcaption>
    My job, in a nutshell.
  </figcaption>
</figure>

## Let the roadmap inform the system

I've talked to a lot of folks who have taken a "if you build it, they will come" approach to design systems and then struggle with adoption. They have this whole list of things they want the system to have and then they spend months working on those things. Meanwhile the product and its needs are constantly evolving and you end up with a lot of one-offs. Trying to get design system work on the product roadmap becomes extremely difficult.

Instead, look at the roadmap and let that inform what goes in your system. Whatever the next feature is, provide everything that feature needs &mdash; and *just* what that feature needs &mdash; to ship.

Each successive feature you work on will build on the work of the previous features, making it possible to ship things faster and faster. As a result, your system won't be cluttered with a bunch of components you *might* need someday. It will include the minimum you need to support the features built with it.

## Learn where the system ends and the product begins

I recently wrote about [reframing your thinking](/posts/2022-11-26-reframing-design-systems/) around supporting product features with your design system. It's crucial, particularly if your design system team is small, to keep product decisions out of the system as much as possible. Things become extremely hard to maintain when the system becomes responsible for keeping track of product decisions. 

Think about how you might create a feature while removing all product context from it. Create the atoms and some utilites to compose them into larger molecules and organisms. The smaller you can keep your system, the easier it will be to maintain and the more flexible it will be for your users.

## Sell the results, not the system

Many people still struggle with "selling" the importance of design systems to stakeholders. It can be an uphill battle, particularly in times like this where companies are tightening their belts. 

Ten years ago, we were selling the idea of responsive design. As ridiculous as that sounds now, we had to convince people that making our websites responsive was worth the investment. Today it's just become the way we make websites.

Design systems are on a similar path. Dan Mall noted in his Clarity talk that his early clients were asking him to build a system, while more recently they are asking him to help with their existing systems. At some point in the near future, we won't have to "sell" design systems. It will just be how we make websites.

In the meantime, make design systems part of your process. Let the roadmap inform the system instead of trying to get design system work on the roadmap. The results will do the selling for you.