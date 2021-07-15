var link = document.querySelector('#search-link');

if (link) {
  link.addEventListener('click', function(event) {
    event.preventDefault();

    let searchIndex;
    fetch('/search.json').then(function(response) {
      return response.json();
    }).then(function(response) {
      searchIndex = response.search;
    });

    var results = [];

    for(var item in searchIndex ) {
      var found = searchIndex[item].text.indexOf(searchString);
      if(found != -1 ) {
        results.push(searchIndex[item]);
      }
    }

  }, false);
}