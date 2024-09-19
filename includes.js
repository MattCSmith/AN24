const cards = [
  { projectName: "SomeArt-Matt", authorName: "SomeArt-Matt", url: "./Art/SomeArt-Matt/index.html" },
];

/* Shuffles cards' order */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/** Creates cards from the array above
 *  You don't need to modify this
 *  */
const getCardContents = (cardList) => {
  return shuffle(cardList).map((c) => {
    return `
      <li class="card">
        <a href='${c.url}'>
          <img class="art-image" src='${c.url}' alt='${c.projectName}' />
        </a>
        <div class="flex-content">
          <a href='${c.url}'><h3 class="art-title">${c.projectName}</h3></a>
          <p class='author'>
            <a href="${c.githubLink}" target="_blank">
              <i class="fab fa-github"></i> ${c.authorName}
            </a>
          </p>
        </div>
      </li>
    `;
  }).join('');
};

/* Injects cards list HTML into the DOM */
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
  if (timeoutId) clearTimeout(timeoutId);

  const value = event.target.value.toLowerCase();
  let filteredCards;
  if (value) {
    filteredCards = cards.filter(({ projectName, githubLink, authorName }) => {
      const _projectName = projectName.toLowerCase();
      const _githubLink = githubLink.toLowerCase();
      const _authorName = authorName.toLowerCase();
      return [_projectName, _githubLink, _authorName].some(detail => detail.includes(value));
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
