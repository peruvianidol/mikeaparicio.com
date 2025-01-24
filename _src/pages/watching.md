---
title: Watching
---

<style>
  .reviews {
    margin-block-start: 3rem;
    list-style: none;
    padding: 0;
    img {
      max-width: 150px;
    }
    li {
      margin-block-end: 2rem;
    }
    figure {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }
    h2 {
      margin: 0;
      font-size: 1.5rem;
    }
    time {
      font-size: 1rem;
      opacity: .7;
    }
  }
</style>

<p>My last 10 watched from <a href="https://letterboxd.com/peruvianidol">Letterboxd</a>.</p>

<ul class="reviews">
{% for movie in movies | limit(10) %}
<li>
  <figure>
    <img src="{{ movie.posterUrl }}" alt="Poster for {{ movie.filmTitle }}">
    <figcaption>
      <h2><a href="{{ movie.link }}">{{ movie.filmTitle }}</a></h2>
      <div class="rating">
        <meter min="0" max="5" value="{{ movie.memberRating }}">{{ movie.memberRating }} out of 5 stars</meter>
      </div>
      <p>{{ movie.reviewText }}</p>
      <p><time datetime="{{ movie.pubDate }}">{{ movie.pubDate | postDate }}</time></p>
    </figcaption>
  </figure>
</li>
{% endfor %}
</ul>

<style>
  .rating {
    --background-color:rgb(114, 114, 115);
    --icon-color: #00e054;
    --height: 32px;
    --aspect-ratio: 168/32;
    --background-size: 34px 32px;
    aspect-ratio: var(--aspect-ratio);
    height: var(--height);
    position: relative;
  }
  .rating ::-moz-meter-bar {
    background: none;
    background-color: var(--icon-color);
  }
  .rating ::-webkit-meter-bar {
    background: var(--background-color);
    border: 0;
    border-radius: 0;
    height: var(--height);
  }
  .rating ::-webkit-meter-optimum-value {
    background: var(--icon-color);
  }
  .rating meter {
    position: absolute;
    inset: 0;
    background: none;
    background-color: var(--background-color);
    height: var(--height);
    width: auto;
  }
  .rating:after {
    content: "";
    display: block;
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 17 16'%3E%3Cpath d='M17 0v16H0V0h17ZM8.87.788a.97.97 0 0 0-1.745 0L5.177 4.796l-4.351.643a.967.967 0 0 0-.779.657.974.974 0 0 0 .24.991l3.157 3.124-.746 4.415a.974.974 0 0 0 1.415 1.018l3.888-2.076 3.887 2.076a.971.971 0 0 0 1.415-1.018l-.748-4.415 3.157-3.124a.968.968 0 0 0-.539-1.648l-4.354-.643L8.87.788Z' fill='%231f1f1f'/%3E%3C/svg%3E");
    background-repeat: repeat-x;
    background-size: var(--background-size);
  }
</style>