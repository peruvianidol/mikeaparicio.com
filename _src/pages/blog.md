---
title: Blog
---

{% for post in collections.posts | reverse %}
<figure>
  {% image post.data.image, post.data.alt %}
  <figcaption>
  <p>{{ post.date | postDate }}</p>
  <p><a href="{{ post.url }}">{{ post.data.title }}</a></p>
  <p>{{ post.data.description }}</p>
  </figcaption>
</figure>
{% endfor %}