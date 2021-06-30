export const createIMG = (path, alt = '') => {
  const img = document.createElement('img');
  img.setAttribute('src', `public/img/${path}`);
  img.setAttribute('alt', alt);
  img.setAttribute('loading', 'lazy');
  return img;
};

export const createLogo = () => {
  const logo = document.createElement('a');
  logo.href = 'index.html';
  logo.appendChild(createIMG('logo.svg', 'FishEye Home Page'));
  return logo;
};

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

export const createTagList = (tags) => {
  const ul = document.createElement('ul');
  ul.classList.add('tag-list');

  for (const tag of tags) {
    ul.appendChild(createTag(tag));
  }

  return ul;
};

export const uppercaseFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getPhotographerFromList = (id, photographerList) => {
  const photographer = photographerList.photographers.find(
    (photographer) => photographer.infos.id === id
  );

  return photographer;
};

export const getPhotographTagSet = (photographers) => {
  const tagSet = new Set();
  photographers.forEach((photographer) => {
    photographer.infos.tags.forEach((tag) => {
      tagSet.add(uppercaseFirstLetter(tag));
    });
  });
  return tagSet;
};

export const isSameTagText = (tag, tagClicked) => {
  return tag.textContent.toLowerCase() === tagClicked.textContent.toLowerCase();
};

export const getMediaLikes = (medias) => {
  const mediaLikes = medias.map((media) => media.likes);

  return mediaLikes.reduce((acc, curr) => acc + curr);
};

export const isImage = (media) => media.image !== undefined;

export const sortByPopularity = (a, b) => {
  return parseInt(b.getAttribute('data-likes')) - parseInt(a.getAttribute('data-likes'));
};

export const sortByDate = (a, b) => {
  const firstDate = new Date(a.getAttribute('data-date'));
  const secondDate = new Date(b.getAttribute('data-date'));

  return firstDate - secondDate;
};

export const sortByTitle = (a, b) => {
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
