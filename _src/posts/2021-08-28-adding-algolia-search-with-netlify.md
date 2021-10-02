---
title: Adding Algolia search to an Eleventy site with Netlify
description: After months of struggles I finally found a relatively easy solution.
image: search-butt.png
alt: A search for 'butt' using Algolia
tags: ['eleventy', 'web development']
date: 2021-08-29
---

I was looking for a way to incorporate search into the documentation site for Provi's design system, Fizz, which is built on Eleventy and hosted on Netlify. After lots of Googling and frustrating starts and stops with various solutions, I discovered Algolia's search plugin for Netlify.

With it, I was able to set up a pretty robust search feature with autocomplete in a matter of minutes. (Aside from the hour it took to solve one issue which I'll tell you how to fix below!)

Okay, so this isn't specific to Eleventy. Algolia's Netlify plugin will work for any site hosted on Netlify. But since pretty much all my sites are built with Eleventy and I've heard a lot of people in the community wanting a search solution, this was the best/easiest thing I could find!

### Steps

1. [Sign up for an Algolia account](https://www.algolia.com/users/sign_up). The free plan provides a generous 10k searches/month, which should be plenty for most small sites.

2. Check out Algolia's [Quick Start guide](https://www.algolia.com/doc/tools/crawler/netlify-plugin/quick-start/) for their Netlify plugin.

3. Follow the instructions to sign into Algolia with Netlify.

4. Install the site you want to crawl.

5. Index your site by triggering a deploy either via commit or manually in the Netlify app. The Algolia crawler will re-index your site automatically on each build.

6. Add the front end bundle to your layout, replacing the search api key with the one found in your dashboard (linked on the frontend bundle page). You can also check the docs for additional options you can add, like changing the placeholder on the search input: `placeholder: 'Search Fizz',`
7. Add an empty HTML element that matches the `selector` value in your frontend bundle's config options. The default is `<div id="search"></div>`
8. Fire up the site locally and test it out!

{% image "search-butt.png", "Searching 'butt' on the Fizz documentation site", "Tee hee!" %}

### Notes

* The frontend bundle includes a default CSS theme for the search, including responsive styles. It's not bad, but you can remove the link to the CSS and create your own, or copy that file and tweak it as needed.

* I experienced an issue where the URL in the results was omitting the domain and using a double slash before the path, which resulted in broken links. It took me a good hour to troubleshoot, but adding a canonical URL to the `<head>` fixed it.

```html
<link rel="canonical" href="{% raw %}{{site.url}}{{page.url}}{% endraw %}">
```

### Some other options I looked at:

Phil Hawksworth has a great article, [Adding Search to a Jamstack Site](https://www.hawksworx.com/blog/adding-search-to-a-jamstack-site/), which is a relatively simple solution for adding search to an Eleventy site. For my particular use case, I wanted to be able to search within code examples as well as provide some context about the page rather than just the title. But if you're not on Netlify, this might work for you.

I landed on Algolia largely thanks to [this episode of Learn with Jason](https://www.learnwithjason.dev/javascript-autocomplete) with Sarah Dayan. It was a little more technical than what I'm comfortable with, but it led me to stumble upon the Netlify plugin solution.

### Final thoughts

I'm really thrilled with how quickly I was able to put this together. Algolia offers a pretty good amount of customization, which I imagine is even better on a paid plan. For now, all I need to do is do a little customization to the CSS and it's pretty much good to go.
