---
title: 'Groupon'
layout: 'layouts/page.html'
notitle: true
---

<svg role="img"><title>Groupon</title><use xlink:href="#icon-groupon"/></svg>

**Senior UI Engineer**  
October 2011—July 2020

I was excited to join Groupon in 2011, one month before the IPO, for an opportunity to move from being the sole person responsible for a website to being on a team where I could collaborate with people with complementary skills.

## Scottsdale (2011)

In my first role I was one of several UI engineers hired to the design team to work on a redesign project known as Scottsdale. Scottsdale was an attempt to change the perception of Groupon as a daily deal site and expose new verticals like Goods and Getaways.

As our small team continued to iterate on the design, the rest of the company was moving forward on the live site, and it felt like we were constantly playing catch-up. Our A/B testing was not showing significant lift with the new design and ultimately the project was scrapped.

Scottsdale was an incredibly challenging project to work on, but I learned a lot in a short period of time. I became incredibly proficient at working with designers to turn their comps into pixel-perfect markup and styles.

## Internal Tools (2012)

As Scottsdale was winding down, an opportunity arose on our Internal Tools team, which I jumped at. I was tasked with supporting two designers and a half dozen engineering teams who were working to build out a new suite of tools to support our sales and customer service teams.

The biggest challenge we faced was how to consistently translate and scale designs for multiple projects with just two designers. Initially we thought about using Twitter Bootstrap which, at that time, was just starting to become widely used. After careful consideration, we decided against it, as we didn't want to have to create a bunch of overrides to achieve the design we were looking for, and we were worried about relying on a third-party framework. So I built our own CSS framework, called Toolstrap (Bootstrap for Internal Tools).

Toolstrap greatly reduced the amount of time teams spent implementing designs since it took care of a lot of the CSS, which the engineers loved. It also helped the engineers reproduce design specs consistenly and reduced the amount of time designers spent going back and forth with engineers to make sure the finished product matched the comp. Product managers loved the increased velocity at which teams were able to get things from concept to production. Everyone was happy and there was much rejoicing.

## Groupon Interface Guidelines (2013)

About a year later, a new redesign effort was underway on the consumer side and word had spread about the success of Toolstrap. So I was asked to make a new framework for Groupon.com, called Groupon Interface Guidelines (GIG). We initially considered expanding on Toolstrap, but because internal tools and the Groupon website were so different (task-based vs. e-commerce), there wasn't much overlap in patterns and we didn't want to unneccessarily load a bunch of CSS in either context that wasn't being used.

## Groupon Icon Library (2013)

The existing Groupon website used a bunch of different image sprites for its icons, with each team maintaining one or more different sprite files. This led to a lot of duplicate and inconsistent icons. While building out GIG, we also brought over the icon font built for Internal Tools to the consumer side. As time went on, we streamlined the icon font to eliminate icons that were used only on internal tools. Eventually we would start to move away from the icon font and use SVG icons.

## Responsive Design (2014)

I have always been a huge proponent of Responsive Design, and after building GIG I had an opportunity to help make a few sections of Groupon.com responsive. In order to enable responsive, I built a responsive header and footer so that any team could decide on its own whether it wanted to go responsive or lock the page at a particular width. The two projects we made responsive were Groupon to Go (GTG), a food delivery service, and Merchant Place Pages (MPP).

## Project Gumby (2015)

Shortly after GTG and MPP launched, I was tasked with exploring how we might make all of Groupon.com responsive. I built several prototypes and researched the performance implications of a responsive design. Ultimately, product and engineering leaders had their own ideas about responsive and we ended up maintaining separate mobile and desktop sites.

## Mixer (2016)

Frustrated with consumer's reluctance to go responsive, I took an opportunity to create yet another CSS framework — this time for Groupon's merchant-facing products — called Mixer. Mixer built on everything I learned from building Toolstrap and GIG and was quite a bit lighter and easier to use than previous frameworks. It included a fully SVG icon library.

## Groupon Design System (2019)

There were a number of challenges with having all these different frameworks. For one thing, they only worked on web and over half of our revenue was generated by our mobile apps, which had no use for a CSS framework. It was also incredibly challenging keeping our design tools and our frameworks in sync with the latest patterns. This led to a lot of teams creating one-offs that would end up not getting back into the framework for other teams to leverage. Not to mention we had **three different frameworks** to maintain and no full-time support for them.

I teamed with several designers to create a design system that would work across web, iOS and Android. The designers worked to make a Sketch UI kit that was more robust than previous efforts while I developed a design token system that would allow us to change visual style properties through a single text file across every platform. Unfortunately, when the COVID-19 pandemic hit, the engineering implementation of the system was largely put on hold.

## GeekOn Projects

Groupon held regular hackathons known as GeekOn, where designers, developers and product managers could team up to create new and interesting features or products. It was a great opportunity to try new technologies or take on new roles in the development of a product. I was fortnuate to work on some really cool projects for GeekOn, many of which were awarded as finalists. This basically meant that we would be allowed 20% time to work more on the products, but the reality was we didn't have 20% less day-to-day work to do, so it wasn't really feasible to continue working on them.

For a couple of projects I put my video production and comedy writing training to use to create fun informercials for the products to help them stand out in a sea of Keynote slides and Google Sheets.

### Grouptivate

A web-based app for showing deals closed by sales rep on a map in real-time and providing useful info and stats to be displayed on monitors throughout Groupon. I used viewport units to scale everything and maintain a 16:9 aspect ratio. My favorite part was modifying [Raptorize](https://zurb.com/playground/jquery-raptorize) to display a picture of then CEO Andrew Mason's head superimposed on Fonzi's body when a particular sales criteria was met.

### Protoshop

Protoshop was a very early attempt to make a web-based prototyping tool for our CSS framework which would allow designers to build pages in the browser and export all of the markup rather than delivering static images to engineers. It was perhaps a little too ambitious for a hackathon, but we made some pretty good progress on it over a week. Shortly after, similar services like [Macaw](http://macaw.co/) began to pop up and we felt like we were pretty ahead of the curve.

### G-Stack

G-Stack was essentially an in-house version of Stack Overflow, where people could ask technical questions and get answers which could be voted up or down by others. It was a pretty simple app that got a lot of use the first few years but slowly started to lose relevance as most the team that built it moved on.

### Greenscreen

Probably my favorite GeekOn project, [Greenscreen](https://github.com/groupon/greenscreen) was an app that allowed you to customize the content of multiple displays running Chromecasts. This was one of three projects I worked on where I was named an inventor on a patent while at Groupon. Rather than the usual Keynote presentation, we shot [a short infomercial](https://vimeo.com/98705196) to promote our project, which really helped us stand out in the voting.

### G on G

G on G was an app that was designed to help facilitate 1:1 meetings. Essentially it was just a to do app, but [we made another video](https://vimeo.com/134432234) and it was voted as a finalist. So I guess the lesson here is that you can make any app successful with the right marketing.

## Simple Groupon

Simple Groupon was a one-day hackathon where the theme was to work on projects that simplified our processes and tools internally or simplfied the customer experience. I used it as an opportunity to demonstrate the power of our design system to the larger product and engineering organization. I wrote [an in-depth post about it](/posts/2020-07-06-simple-groupon/) in July 2020.

## Talks and Workshops

I did a lot of internal talks and workshops over the years on everything from CSS and HTML to responsive design to design systems to a 10-minute rant on "[full-stack developers](https://fullstackoverflow.dev/)." You can find [the slides from most of my talks](https://speakerdeck.com/peruvianidol) on Speakerdeck.

[My biggest talk](/webcon/) was at University of Illinois' WebCon in 2019 where I talked about the evolution of our design system at Groupon. I'm hoping to pursue more speaking opportunities in the future.

In July 2020, [I wrote about leaving Groupon](/posts/2020-07-23-goodbye-groupon/) after almost nine years.