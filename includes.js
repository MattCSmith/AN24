const cards = require("./cards.json");

/* Shuffles cards' order */
function shuffle(o) {
  for (
    let j, x, i = o.length;
    i;
    j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
  );
  return o;
}

/** Creates cards from the array above
 *  You don't need to modify this
 *  */
const getCardContents = (cardList) => {
  return shuffle(cardList).map((c) => [
    `<li class="card">` +
      `<a href='${c.pageLink}'>` +
      `<img class="art-image" src='${c.imageLink}' alt='${c.artName}' />` +
      `</a>` +
      `<div class="flex-content">` +
      `<a href='${c.pageLink}'><h3 class="art-title">${c.artName}</h3></a>` +
      `<p class='author'><a href="${c.githubLink}" target="_blank"><i class="fab fa-github"></i> ${c.author}</a> </p>` +
      `</div>` +
      `</li>`
  ]);
};

/* Injects cards list html into the DOM */
let contents = getCardContents(cards);
document.getElementById('cards').innerHTML = contents;

/* Adds scroll to top arrow button */
document.addEventListener('DOMContentLoaded', function () {
  const goToTopBtn = document.querySelector('.go-to-top');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 100) {
      goToTopBtn.classList.add('active');
    } else {
      goToTopBtn.classList.remove('active');
    }
  });

  goToTopBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});

/* Search filter - by author or by name - update displayed cards */
function searchCard(event) {
  let timeoutId = null;
  !!timeoutId && clearTimeout(timeoutId);

  const value = event.target.value.toLowerCase();
  let filteredCards;
  if (!!value) {
    filteredCards = cards.filter(({ artName, githubLink, author }) => {
      const _artName = artName.toLowerCase();
      const _githubLink = githubLink.toLowerCase();
      const _author = author.toLowerCase();
      return [_artName, _githubLink, _author].some((detail) =>
        detail.includes(value)
      );
    });
    contents = getCardContents(filteredCards);
  } else {
    contents = getCardContents(cards);
  }
  timeoutId = setTimeout(() => {
    document.getElementById('cards').innerHTML = contents;
  }, 200);
}
document.getElementById('search-bar').addEventListener('keyup', searchCard);