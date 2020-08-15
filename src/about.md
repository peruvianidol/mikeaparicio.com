---
title: 'About'
layout: 'layouts/page.html'
---

<figure>

![Photo of Mike](/images/headshot.jpg)

</figure>

I'm Mike Aparicio, a.k.a. Peruvian Idol. I was born and raised in the Chicago area, and aside from a two year stint in California, have lived here my whole life. I started my first website, Mikey's Chicago Bulls Page, after flunking out of the University of Illinois in 1994 and have been making them ever since.

I spent most of my career as a general "web guy" before joining Groupon in 2011. At Groupon, I built in-house CSS frameworks for our internal tools, consumer, and merchant websites and helped build a cross-platform design system. I'm currently the Senior Design Systems Engineer at Provi.

I did the writing and conservatory programs at Second City, which was as close as I'd come to fulfilling my childhood dream of being on Saturday Night Live. I wrote and performed sketch and improv comedy and collaborated on a few short [comedy videos](https://vimeo.com/peruvianidol) with my classmates.

I also enjoy playing video games. Some of my favorites include Destiny, XCOM, and NBA2k. I've participated in Extra Life, a 24-hour gaming marathon, every year since 2014 to support Lurie Children's Hospital in honor of my daughter, [Olivia](http://localhost:8080/posts/2018-08-26-four-years/). To date, we've raised over $19,000 for Lurie. You can occasionally find me streaming on [Twitch](https://twitch.tv/peruvianidol) for one or two viewers.

I live in Oak Park, Illinois, with my wife, two sons and two dogs.

<svg class="icon icon-pi-logo" role="img"><title>Peruvian Idol logo</title><use xlink:href="#icon-pi-logo"/></svg>

## Site Credits

Vector illustrations and logos for the site were created by the incredibly talented [David Schnorr](http://davidschnorr.com/).

Typefaces used are [Alverata Informal](https://www.fonts.com/font/typetogether/alverata/informal-bold), [Montserrat](https://fonts.google.com/specimen/Montserrat), and [Mort Modern](https://mort-modern.losttype.com/).

The site was built with [Eleventy](https://www.11ty.io/), a great static site generator made by [Zach Leatherman](https://www.zachleat.com/).

{% block sidebar %}
  {% include "partials/about-photos.html" %}
{% endblock %}