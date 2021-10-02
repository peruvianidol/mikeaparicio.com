---
permalink: /
layout: base
---

> Hi! I'm **Mike Aparicio**, a Chicago-based web developer interested in helping companies large and small improve collaboration between design and engineering through the use of design systems.

## Writing

{% for post in collections.posts | reverse %}
  {% if loop.index0 <= 2 %}
<figure>
  {% image post.data.image, post.data.alt %}
  <figcaption>
  <p>{{ post.date | postDate }}</p>
  <p><a href="{{ post.url }}">{{ post.data.title }}</a></p>
  <p>{{ post.data.description }}</p>
  </figcaption>
</figure>
  {% endif %}
{% endfor %}

## Working

I have over 25 years experience making websites for individual entrepreneurs to large companies and everything in between. I'm currently the Senior Design Systems Engineer at [Provi](https://provi.com).

[Read more about the work I've done](/work/) at Groupon, The American Association of Oral and Maxillofacial Surgeons and elsewhere.

## Speaking

{% for event in speaking %}
- {{ event.description }} [Link]({{ event.link }})
{% endfor %}

## Streaming

Every Friday from 1-3pm Central time I stream **Office Hours** on Twitch, where you can ask me questions about CSS, design systems and Eleventy. I sometimes also work on projects and catch up on dev-related articles in one of my many open tabs. Stop by and hang out!

[peruvianidol.live](https://peruvianidol.live)