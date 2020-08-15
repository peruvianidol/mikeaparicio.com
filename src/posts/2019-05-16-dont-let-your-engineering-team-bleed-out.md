---
title: Don't Let Your Engineering Team Bleed Out
description: Thoughts on being a CSS medic.
date: 2019-05-16
thumbnail: /images/is-this-a-div.jpg
thumbnailAlt: "Butterfly man meme. React devs looking at literally every layer
  of a Sketch file: Is this a DIV?"
tags:
  - CSS
  - Web Development
---
Recently, I was tasked with taking a very data-heavy site designed for desktop and making it responsive. I love challenges like this because it gives me the opportunity to show people who think that not every site/app works on mobile that they are wrong. (And what's more fun than showing people they're wrong?)

It also reminded me of the old CSS Zen Garden, since I couldn't update the markup and had to rely on targeting existing classes. This turned out to be somewhat challenging given that it was a React app and for some reason (in my experience, at least), React apps tend to have a ton of nested div elements. It prompted me to make a meme:

<figure>

![(Butterfly man meme) React Devs looking at literally every layer in a Sketch file and asking, is this a div?](/images/is-this-a-div.jpg)

<figcaption>
Oh, Butterfly Man.
</figcaption>
</figure>

Not being a React expert, I don't know if this is due to the nature of React, lack of HTML knowledge by the developers or a combination of the two. I've talked about my beef with the term "Full-Stack Developer" before and this tweet by Robin Rendle a few weeks ago struck a nerve with me.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Hey maybe the reason why accessibility is getting worse and the web is breaking is because folks still think that writing CSS and HTML is “lite” coding.<br><br>Hey maybe the way we fix the web is by paying front-end engineers the same as full-stack engineers.</p>&mdash; Robin Rendle (@robinrendle) <a href="https://twitter.com/robinrendle/status/1126616315458772992?ref_src=twsrc%5Etfw">May 9, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

I responded, "It doesn't help that front-end has become a euphemism for JavaScript."

JavaScript has taken over the front end and companies spend a lot of time asking candidates to whiteboard sorting algorithms and very little time asking if they know the difference between an inline element and a block element. As a result, you get a lot of devs that are competent with JS but not so much with HTML/CSS.

The longer this goes on for, the more people you have that are competent at HTML/CSS move on and then you're left with few to no people to vet new candidates for those skills.

As far as I know, I'm the only person left at Groupon with the title of UI Engineer, and I work on the design team, not in engineering. As one of the very few CSS specialists left at the company, I sometimes feel like a combat medic on the beaches of Normandy.

<figure>

![A scene from Saving Private Ryan where medics work to save a soldier on Omaha beach.](/images/omaha-beach.gif)

<figcaption>
I never noticed the guy on the left gets shot in the canteen and the water turns red.
</figcaption>
</figure>

"Corpsman!" someone will shout out when their app doesn't look like comp, and I'll come running over to patch them up. Meanwhile, other devs will soldier on, missing limbs, bleeding profusely.

"Hey, let me fix you up with a tourniquet or at least give you some morphine," I'll say. But they just continue dragging their mutilated body towards the bunkers, determined to ship their feature on time.

Okay, this metaphor is pretty strained but the point is, you can train a solider to administer a morphine injection or patch up a wound. But there's something to be said for having a trained medic with you in battle.

Similarly, if your site is janky and your designs call for more than what Twitter Bootstrap provides, maybe consider hiring people that are good at HTML/CSS and, if and when you have those people, make sure you take care of them so they'll stick around. Otherwise, like Twitter, you're going to be overrun by Nazis.