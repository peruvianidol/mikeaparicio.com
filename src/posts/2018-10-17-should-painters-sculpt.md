---
title: Should Painters Sculpt?
description: In which I ponder that age old question.
date: 2018-10-17
thumbnail: /images/ronaldo-and-bust.png
thumbnailAlt: A photo of Ronaldo and a bust of him that looks horribly disfigured.
tags:
  - Web Development
---
I've spent the last month stressing over what to write here. Would it be another four years before I wrote another post? Should I write about how obsessed I've been with Destiny lately? My love/hate relationship with NBA 2k? Something about the Bulls? "Oh, I know - HOW ABOUT NOTHING?," my brain responds.

But then this tweet yesterday inspired me.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I shared some principles behind my process:<br>1. Words, not wireframes<br>2. Skip wireframe, sketch mobile UI<br>3. Shift point of production downstream<br>4. Code commits, not redlines<br>5. Cultivate trust outside documentation<br>6. The product is the common workspace<br><a href="https://t.co/a5og9Chy1A">https://t.co/a5og9Chy1A</a></p>&mdash; Josh Clark (@bigmediumjosh) <a href="https://twitter.com/bigmediumjosh/status/1052256117575815168?ref_src=twsrc%5Etfw">October 16, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

One of the things that has puzzled me since moving from a one-man web team to a big company with dozens of designers and hundreds of developers is how little overlap there is in skills. I could probably do an hour talk just on this subject alone.

But basically (and I have found this problem is not unique to Groupon) you have design hiring for visual design skills and engineering hiring for computer science skills. Designers have their portfolio rigorously dissected while engineers run a gauntlet of whiteboard interviews and live coding exercises in which they attempt to write a program to make change from a given number or some such bullshit they will never actually have to do on the job. As a result, people whose skills lie somewhere in the middle tend to get weeded out.

Despite HTML and CSS typically being one of the prerequisites for a design OR engineering position, and all the emphasis on "[full-stack developers](https://mikeaparicio.com/img/fullstackdeveloper.gif)" (hoo boy, don't even get me started), often times if you get someone who is exceptionally skilled at HTML and CSS, it's by dumb luck. I wish I had a dollar for every candidate I interviewed who, when asked "what is your experience with CSS?" responds simply, "oh, I just use Bootstrap."

And when you're not thoroughly vetting people for certain skills, you end up not having people with those skills to vet other people for those skills and the problem perpetuates itself.

*Yes, but Mike, what the hell does this have to do with the tweet you mentioned?*

Huh? What? Oh yeah.

In his article, "[Only One Deliverable Matters](https://bigmedium.com/ideas/only-one-deliverable-matters.html)", Josh Clark writes:

> Too many designers get precious about those documents—I know I’ve been guilty of it. Somewhere along the way, detailed wireframes, high-fidelity comps, and motion prototypes all got enshrined as critical deliverables. Those design artifacts are unimportant. **Only one deliverable matters: the product itself. Everything else gets thrown away when you ship.**

When I started at Groupon seven years ago, we were delivering Photoshop files to engineering with "redlines" indicating that this should be this size and that should be such-and-such color. We've since moved on to exporting Sketch files to Zeplin, but at the end of the day we're still delivering pictures of websites. (Maybe you're using something like InVision and delivering movies of websites!)

I've always equated this to a painter toiling away for hours on a piece before handing it off to a sculptor and saying, "make me a statue of this."

The sculptor looks at the painting and is like, "How big is this supposed to be? What does the back of this thing look like? How am I supposed to sculpt the sky?" before going to [reddit.com/r/sculpting](https://www.reddit.com/r/sculpting/) to post a snarky meme about painters.

As a result, the finished product tends to look a bit... off. Maybe it's due to your process or your hiring practices. If you give a picture of a website to 10 different developers you're going to get 10 different websites.

<figure>

![Photo of Ronaldo and a bust of him that looks horribly disfigured.](/images/ronaldo-and-bust.png)

<figcaption>
Mmmm... not quite.
</figcaption>
</figure>

The jist of Josh's article is: what a colossal waste of fucking time and resources this is! (Before detailing a process for avoiding such waste.)

This conversation always seems to come down to:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">┓┏┓┏┓┃<br>┛┗┛┗┛┃<br>┓┏┓┏┓┃<br>┛┗┛┗┛┃＼○／<br>┓┏┓┏┓┃ / SHOULD<br>┛┗┛┗┛┃ノ)<br>┓┏┓┏┓┃ DESIGNERS<br>┛┗┛┗┛┃<br>┓┏┓┏┓┃ CODE?<br>┛┗┛┗┛┃<br>┓┏┓┏┓┃<br>┛┗┛┗┛┃<br>┓┏┓┏┓┃<br>┃┃┃┃┃┃<br>┻┻┻┻┻┻</p>&mdash; Mike Aparicio (@peruvianidol) <a href="https://twitter.com/peruvianidol/status/1052576483166818304?ref_src=twsrc%5Etfw">October 17, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

*Oh no. This whole article was basically the design/dev equivalent of a Rickroll.*

Sorry. :(

Should a painter sculpt? Not necessarily. But at the very least, they should understand the constraints of the medium they're designing for. Should a general contractor know how to hang drywall? I suppose, if they want to earn more business. Should a podiatrist know what a liver is? Geez, I would hope so.

Anyway, this is all to say that this topic was stewing in my brain all night and I woke up energized. I've been working on a talk about lessons learned from building a design system at Groupon, but I realized that for many people this isn't applicable. They are working on a smaller scale and wonder if they even need a design system. (The answer is yes. Yes you do.)

So I'm going to start a series here about creating a design system for any size team, including a team of one. Look forward to the first part of that series soon!