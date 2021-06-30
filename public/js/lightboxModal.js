const constructLightBoxMedias = (activeLink) => {
  const links = Array.from(document.querySelectorAll('figure a'));
  const modal = document.querySelector('.gallery-modal');
  const mediaBlock = modal.querySelector('.medias');

  while (mediaBlock.firstChild) mediaBlock.removeChild(mediaBlock.firstChild);

  // for each, crée un media dans la modale
  for (const link of links) {
    const isVideo = link.firstElementChild.tagName.toLowerCase() === 'video';

    const div = document.createElement('div');
    div.classList.add('media');
    div.setAttribute('data-id', links.indexOf(link));

    if (link.pathname === activeLink) {
      div.classList.add('visible');
    }

    // si vidéo0 crée une video, sinon cée une img
    if (isVideo) {
      const title = link.querySelector('video').getAttribute('title');
      const video = document.createElement('video');
      video.setAttribute('title', title);
      video.controls = true;

      const source = document.createElement('source');
      source.setAttribute('src', link.pathname);
      source.setAttribute('type', 'video/mp4');
      video.appendChild(source);

      div.appendChild(video);
    } else {
      const alt = link.querySelector('img').getAttribute('alt');

      const img = document.createElement('img');
      img.setAttribute('src', link.pathname);
      img.setAttribute('alt', alt);

      div.appendChild(img);
    }

    const title = document.createElement('h2');
    title.setAttribute('tabindex', '0');
    title.classList.add('js-focusable');
    title.appendChild(
      document.createTextNode(link.parentElement.getAttribute('data-title'))
    );

    div.appendChild(title);

    mediaBlock.appendChild(div);
  }
};

const openLightBoxModal = () => {
  const wrapper = document.getElementById('js-container');
  const modal = document.querySelector('.gallery-modal');

  wrapper.setAttribute('aria-hidden', 'true');
  modal.classList.add('open');
};

const closeLightBoxModal = (links, activeLink) => {
  const modal = document.querySelector('.gallery-modal');
  const wrapper = document.getElementById('js-container');

  modal.classList.remove('open');
  wrapper.setAttribute('aria-hidden', 'false');
  // quand la modale ferme, focus sur la media initiale
  links.find((link) => link.pathname === activeLink).focus();
};

const changeMedia = (id, direction) => {
  const medias = Array.from(document.querySelectorAll('.gallery-modal .media'));
  let currentMedia = medias.find((media) => media.getAttribute('data-id') === `${id}`);
  const previousMedia = medias[medias.indexOf(currentMedia) - 1];
  const nextMedia = medias[medias.indexOf(currentMedia) + 1];
  let newMedia;
  const animationClassNames = ['outRight', 'outLeft', 'nextMedia', 'prevMedia'];

  const animationRunning = animationClassNames.some((animationClassNames) =>
    medias.find((media) => media.classList.contains(animationClassNames))
  );

  if (animationRunning) {
    for (const media of medias) {
      media.classList.remove(
        'visible',
        'outRight',
        'outLeft',
        'nextMedia',
        'previousMedia'
      );
    }
  }

  if (direction === 'next') {
    nextMedia === undefined ? (newMedia = medias[0]) : (newMedia = nextMedia);
    currentMedia.classList.add('outLeft');
    newMedia.classList.add('visible', 'nextMedia');
    newMedia.addEventListener('animationend', () => {
      if (currentMedia.classList.contains('outLeft')) {
        currentMedia.classList.remove('visible');
      }
      currentMedia.classList.remove('outLeft');
      newMedia.classList.remove('nextMedia');
    });
  } else {
    previousMedia === undefined
      ? (newMedia = medias[medias.length - 1])
      : (newMedia = previousMedia);
    currentMedia.classList.add('outRight');
    newMedia.classList.add('visible', 'previousMedia');
    newMedia.addEventListener('animationend', () => {
      if (currentMedia.classList.contains('outRight')) {
        currentMedia.classList.remove('visible');
      }
      currentMedia.classList.remove('outRight');
      newMedia.classList.remove('previousMedia');
    });
  }
};

export const attachGalleryModalEventListeners = () => {
  const links = Array.from(document.querySelectorAll('.figure a'));
  const modal = document.querySelector('.gallery-modal');
  const closeBtn = modal.querySelector('.close');
  const prevBtn = document.getElementById('js-prev');
  const nextBtn = document.getElementById('js-next');
  let activeLink;
  let mediaId;

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      activeLink = link.pathname;
      constructLightBoxMedias(activeLink);
      openLightBoxModal();
      mediaId = links.indexOf(link);
    });
  });

  //  ferme la modale quand on  clique le bouton fermer
  closeBtn.addEventListener('click', () => {
    closeLightBoxModal(links, activeLink);
  });

  // prends le bouton espace pour fermer la modale
  window.addEventListener('keydown', (e) => {
    const isEscapePressed = e.key === 'Escape' || e.code === 'Escape';

    if (modal.classList.contains('open')) {
      if (isEscapePressed) {
        closeLightBoxModal(links, activeLink);
      }
    }
  });

  // cliquer pour voir le media precedent
  prevBtn.addEventListener('click', () => {
    changeMedia(mediaId, 'previous');
    mediaId - 1 < 0 ? (mediaId = links.length - 1) : mediaId--;
  });

  // Media suivant
  nextBtn.addEventListener('click', () => {
    changeMedia(mediaId, 'next');
    mediaId + 1 > links.length - 1 ? (mediaId = 0) : mediaId++;
  });

  // fleches du clavier pour naviguer entre les media
  window.addEventListener('keydown', (e) => {
    const modalFocusableElements = Array.from(modal.querySelectorAll('.js-focusable'));
    if (modal.classList.contains('open')) {
      // media précedent
      if (e.key === 'ArrowLeft' || e.code === 'ArrowLeft') {
        changeMedia(mediaId, 'previous');
        mediaId - 1 < 0 ? (mediaId = links.length - 1) : mediaId--;
        return;
      }
      // Media suivant
      if (e.key === 'ArrowRight' || e.code === 'ArrowRight') {
        changeMedia(mediaId, 'next');
        mediaId + 1 > links.length - 1 ? (mediaId = 0) : mediaId++;
        return;
      }
      // Tabulation
      if (e.key === 'Tab' || e.code === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === modalFocusableElements[0]) {
            e.preventDefault();
            modalFocusableElements[modalFocusableElements.length - 1].focus();
            return;
          }
        } else {
          if (!modalFocusableElements.includes(document.activeElement)) {
            e.preventDefault();
            modalFocusableElements[0].focus();
            return;
          }
          if (
            document.activeElement ===
            modalFocusableElements[modalFocusableElements.length - 1]
          ) {
            e.preventDefault();
            modalFocusableElements[0].focus();
            return;
          }
        }
      }
    }
  });
};
