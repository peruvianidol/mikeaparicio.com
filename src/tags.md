---
title: 'Tags'
layout: 'layouts/archive.html'
pagination:
  data: collections
  size: 1
  alias: tag
  filter: ['all', 'nav', 'posts', 'rss']
permalink: '/tag/{{ tag | slugify }}/'
---