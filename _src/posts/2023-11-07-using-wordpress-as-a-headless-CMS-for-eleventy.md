---
title: "Using Wordpress as a headless CMS for Eleventy"
description: How I avoided having to re-learn PHP and love Eleventy.
date: 2023-11-07
thumbnail: headless-horseman.jpg
thumbnailAlt: An illustration of the headless horseman, atop his horse, with no head, natch.
tags:
  - Eleventy
  - Web Development
---

Many years ago, before I started specializing in CSS and design systems, I held the job title of **Webmaster** &mdash; managing all aspects of a company's website. So when the Turquoise marketing team asked me to help them build a new website, I was happy to help them out.

The challenge was that they wanted it to be a Wordpress site, and I haven't touched Wordpress (or PHP, for that matter) in over a decade. I use Eleventy exclusively to build everything these days and I love it. But one thing about Eleventy is that it's not easy for non-technical folks to make changes without incorporating some kind of CMS.

I had heard of people using Wordpress as a "headless" CMS for Eleventy &mdash; meaning users manage content with Wordpress but then the content is pulled into another site using the Wordpress API. If I could get it to work, it'd be the ideal setup. Marketing could make their updates in Wordpress and I could build the site with Eleventy.

I had no idea where to start, so I just Googled "Wordpress Eleventy" and found [this great, comprehensive article](https://danabyerly.com/articles/wordpress-and-eleventy-part-one-wordpress/) by **Dana Byerly** that set me in the right direction.

Along the way I ran into a bunch of issues so I thought I'd document them here. In the end, I was able to do pretty much everything I set out to and this is probably going to be my go-to setup when I need to make Eleventy sites that require a CMS.

## Pulling in the content

The first stumbling block I ran into was that Dana's setup used self-hosted Wordpress rather than Wordpress' own managed hosting. Not a big deal, right? Except there's apparently an [entirely different API](https://developer.wordpress.com/docs/api/) for some reason.

Once I figured this out, I made a file in Eleventy called `_src/_data/posts.js` that used `node-fetch` to query the API, where `{$URL}` is the Wordpress.com subdomain (e.g. yoursite.wordpress.com):

```js
const fetch = require("node-fetch");
const postsURL = https://developer.wordpress.com/docs/api/1.1/get/sites/{$URL}/posts/;

module.exports = async function () {
  console.log("Fetching posts...");

  return fetch(postsURL)
    .then((res) => res.json())
    .then((json) => json);
};
```

Unfortunately that gave me an error, which after much Googling I discovered [this Stack Overflow answer](https://stackoverflow.com/questions/69087292/requirenode-fetch-gives-err-require-esm) that suggested using the second version of node-fetch rather than the latest third version. I don't know what any of that means, but it worked! So when installing node-fetch in Eleventy, use:

```html
npm install node-fetch@2
```

Now it was working, except the marketing team had entered the content as pages rather than posts. No problem, just update `/posts/` to `/pages/` on the endpoint, right? No, that would be too obvious. You actually need to use `/posts/?type=page`. 

<figure>
  <img src="/images/michael-bolton.gif" alt="Michael from Office Space shooting a disappointed look at the camera.">
</figure>

As it turned out, we needed to be able to categorize or tag each page, which is only possible with posts, so we ended up just moving all the content to posts anyway. I used [this handy plugin](https://wordpress.org/plugins/post-type-transfer/) to change the type without having to re-enter all the content.

## Working with the content in Eleventy

Now that we've successfully pulled all the content into an Eleventy data file, we can use Eleventy to display that content in different ways.

### Listing categories

We want to list the categories and descriptions of those categories on the homepage. First we need the category data, which we can get by making a new data file, `categories.js`, which is exactly the same as the posts data file above but the endpoint is `/categories/` instead of `/posts/`.

On our homepage we can create a list and iterate over the categories, making each their own list item.

```js
{%- raw -%}
{% for category in categories.categories %}
  {% if category.name !== "Uncategorized" %}
    <li>
      <a href="/tqu/categories/{{ category.name | slug }}">
        <h2>{{ category.name }}</h2>
        <p>{{ category.description }}</p>
      </a>
    </li>
  {% endif %}
{% endfor %}
{% endraw %}
```

And this is the result:

<figure>
{% image "tqu-categories.png", "An example of the output of the above code, showing four cards with categories and descriptions." %}
</figure>

Similarly, we can iterate through the categories for our navigation:

```js
{%- raw -%}
{% for category in categories.categories %}
  {% if category.name !== "Uncategorized" %}
    <li><a href="/tqu/categories/{{ category.name | slug }}/"{% if category.name == title %} aria-current="page" {% endif %}>{{ category.name }}</a></li>
  {% endif %}
{% endfor %}
{% endraw %}
```

### Posts within a category

For our category page, which lists all of the posts under a specific category, we can use Eleventy's pagination feature. The front matter looks like this:

```js
{%- raw -%}
---
pagination:
  data: categories.categories
  size: 1
  alias: category
permalink: "tqu/categories/{{ category.name | slug }}/"
layout: page.njk
classes: tqu-layout-main
eleventyComputed: 
  title: "{{ category.name }}"
  description: "{{ category.description }}"
---
{% endraw %}
```

There's some extra stuff in there specific to this project, but basically in the `pagination` we're specifying where the data is coming from, setting the `size` to 1 to get one category page for each category, and then giving the data an alias so we can reference it elsewhere as `category` instead of `categories.categories`. (The data file is called "categories" and then within that JSON the data lives inside `categories`.)

Next we define the URL for the category pages, and then in `eleventyComputed` we can assign the page title and description for each category page so we can access those elsewhere.

Fortunately, the data has a field called `post_count`, which equals the number of posts in a particular category, so we can conditionally show a list of posts in each category:

```js
{%- raw -%}
{% if category.post_count > 0 %}
  <ul>
    {%- for item in posts.posts %}
      {% for key, value in item.categories %}
        {% if key == category.name %}
        <li>
          <a href="/tqu/{{ item.slug }}">
            <h2>{{ item.title }}</h2>
            <p>{{ item.excerpt | safe }}</p>
          </a>
        </li>
        {% endif %}
      {% endfor %}
    {% endfor -%}
  </ul>
{% else %}
  <p>There are no articles in this category.</p>
{% endif %}
{% endraw %}
```

Here we're looking in the `posts` data file for all the posts that match the current category and displaying the title and a brief excerpt.

### Pages

Similar to our category pages, we can use Eleventy pagination to make a page for each post. Here's the front matter:

```js
{%- raw -%}
---
pagination:
  data: posts.posts
  size: 1
  alias: post
permalink: "tqu/{{ post.slug }}/"
layout: page.njk
classes: tqu-layout-main
eleventyComputed: 
  title: "{{ post.title }}"
  description: "{{ post.excerpt | stripHTML }}"
---
{% endraw %}
```

This is almost identical to the front matter for categories, except for the description I'm taking the `excerpt` data and applying a filter to it, which strips any HTML that might be added by WordPress. This filter is adapted from Stephanie Eckles `excerpt` filter over at [11ty Rocks!](https://11ty.rocks/eleventyjs/content/), which is an invaluable resource for all things Eleventy.

In the body we can include the post title and content:

```js
{%- raw -%}
<h1>{{ post.title }}</h1>

{{ post.content | safe }}
{% endraw %}
```

And that's pretty much all you need to pull in content from WordPress!

## Updating the Eleventy site automatically

This setup is great and everything, but the problem with it is that in its current state, I'd need to manually run a build any time someone in marketing makes an edit. Who wants to do that?

Fortunately, there's a plugin called [WP Jamstack Deployments](https://wordpress.org/plugins/wp-jamstack-deployments/) that will run a build hook on Netlify any time someone makes an update. In the plugin you can specify which updates should trigger a build.

You can find build hooks on Netlify under **Site Configuration -> Build & Deploy -> Continuous Deployment** under "Build hooks".

Now when someone makes a change to the site, it triggers a Netlify build and the live site is updated within about 30 seconds. Sweet!

**Update:** Several people brought to my attention the fact that only Wordpress' Business tier ($25/mo) and above support plugins.

## Adding custom CSS

While our design system's CSS framework handles most of the styles for the site, it's unlikely the marketing team wants to be bothered adding CSS classes to things like headings and tables. So I added a few site-specific styles that help style all of the content that comes from Wordpress. There was a bit of redundancy, but in the end it's worth it to have the content look good without the author having to think about it.

(I omitted all of the classes from the examples here for the sake of brevity.)

## Adding search with Pagefind

I wanted to add search to the site without having to sign up for some third-party service and then configure a bunch of stuff on the Eleventy side. This article, [Using PageFind with Eleventy for Search](https://rknight.me/using-pagefind-with-eleventy-for-search/) by **Robb Knight**, made it super easy. 

I ended up making a dedicated search page because as far as I could tell, I couldn't add a search bar to the global nav that would take you to a results page for that search. Pagefind kind of shows the results inline. You can see this in [Robb's demo](https://rknightuk.github.io/eleventy-pagefind-demo/).

## Four hundos

You know I had to get four hundos on Lighthouse. Thanks to Zach Leatherman for gamifying performance and best practices with the [Eleventy Leaderboard](https://www.11ty.dev/speedlify/). This could quickly go out the window as marketing adds images and tracking scripts, but at least we started from a good place.

<figure>
{% image "tqu-lighthouse.png", "A screenshot of Lighthouse for TQU with four 100 scores" %}
</figure>

## Wrapping Up

I was honestly surprised how relatively easy this all was. It took a lot of trial and error to get my specific setup working, but now that I figured it out it would be pretty trivial to spin up another one of these if the need arises. Big thanks to everyone whose articles I linked to above. It made it my life so much easier.

One thing I love about the Eleventy community is how willing folks are to share their knowledge. ♥️

If you have any suggestions on how to improve on this setup, [let me know](/contact)!

You can see the finished product at **[TQU](https://turquoise.health/tqu)** and learn everything there is to know about price transparency in health care.