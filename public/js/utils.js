//Fonctions utilitaires généralement utilisées dans plusieurs classes


/* crée image */
export const createIMG = (path, alt = '') => {
  const img = document.createElement('img');
  img.setAttribute('src', `public/img/${path}`);
  img.setAttribute('alt', alt);
  img.setAttribute('loading', 'lazy');
  return img;
};

/* crée video */
export const createVideo = (media) => {
  const { photographerId, video, description } = media;

  const mediaElement = document.createElement('video');
  mediaElement.setAttribute('title', description);

  const source = document.createElement('source');
  source.setAttribute('src', `public/img/${photographerId}/${video}`);
  source.setAttribute('type', 'video/mp4');

  mediaElement.appendChild(source);
  return mediaElement;
};

/* crée logo */
export const createLogo = () => {
  const logo = document.createElement('a');
  logo.href = 'index.html';
  logo.appendChild(createIMG('logo.svg', 'FishEye Home Page'));
  return logo;
};

/* crée tag */
const createTag = (tagText) => {
  const li = document.createElement('li');

  const link = document.createElement('a');
  link.classList.add('tag');
  link.setAttribute('href', '#');
  link.setAttribute('aria-label', 'tag');

  const span = document.createElement('span');
  span.appendChild(document.createTextNode(tagText));

  link.append(document.createTextNode('#'), span);
  li.appendChild(link);

  return li;
};
/* crée taglist */
export const createTagList = (tags) => {
  const ul = document.createElement('ul');
  ul.classList.add('tag-list');

  for (const tag of tags) {
    ul.appendChild(createTag(tag));
  }

  return ul;
};
/* prends les likes d'une image */
export const getFigureLikes = (figures) => {
  const figureLikes = figures.map((figure) => parseInt(figure.getAttribute('data-likes')));
  return figureLikes.reduce((total, likes) => total + likes);
};
/* test si c'est un image */
export const isImage = (media) => media.image !== undefined;

/* fonction qui tire par nombre de like */
export const sortFigureByPopularity = (a, b) => {
  return parseInt(b.getAttribute('data-likes')) - parseInt(a.getAttribute('data-likes'));
};

export const sortMediaByPopularity = (a, b) => {
  return b.likes - a.likes;
};

/* tri par date */
export const sortFigureByDate = (a, b) => {
  const firstDate = new Date(a.getAttribute('data-date'));
  const secondDate = new Date(b.getAttribute('data-date'));

  return secondDate - firstDate;
};

export const sortMediaByDate = (a, b) => {
  const firstDate = new Date(a.date);
  const secondDate = new Date(b.date);

  return secondDate - firstDate;
};

/* par lettre */
export const sortFigureByTitle = (a, b) => {
  const firstTitle = a.getAttribute('data-title').toLowerCase();
  const secondTitle = b.getAttribute('data-title').toLowerCase();

  if (firstTitle < secondTitle) {
    return -1;
  }
  if (firstTitle > secondTitle) {
    return 1;
  }
  return 0;
};

export const sortMediaByTitle = (a, b) => {
  const firstTitle = a.title.toLowerCase();
  const secondTitle = b.title.toLowerCase();

  if (firstTitle < secondTitle) {
    return -1;
  }
  if (firstTitle > secondTitle) {
    return 1;
  }
  return 0;
};
