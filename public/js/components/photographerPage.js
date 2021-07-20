import * as utils from '../utils.js';
import { ContactModal } from './contactModal.js';
import { Dropdown } from './dropdown.js';
import { LightboxModal } from './lightboxModal.js';
import { MediaList } from './mediaList.js';

export class PhotographerPage {
  /* constructeur du photographe */
  constructor(photographer) {
    this.photographer = photographer;
    this.container = document.getElementById('js-container');
    this.totalLikesDOM = this.createTotalLikesElement();
    this.contactModal = new ContactModal(this.photographer.name);
    this.lightboxModal = new LightboxModal();
  }
/* ses méthodes */
  createHeader() {
    const header = document.createElement('header');
    header.setAttribute('role', 'banner');
    header.appendChild(utils.createLogo()).setAttribute('tabindex', '1');
    return header;
  }

  createTotalLikesElement() {
    const span = document.createElement('span');
    span.setAttribute('tabindex', '-1');

    const medias = this.photographer.medias;
    const mediaLikes = medias.map((media) => media.likes);
    const totalLikes = mediaLikes.reduce((total, likes) => total + likes);

    span.appendChild(document.createTextNode(totalLikes));
    return span;
  }

  createContactBtn() {
    const btn = document.createElement('button');
    btn.classList.add('button');
    btn.id = 'js-contactForm';
    btn.setAttribute('aria-expanded', 'false');
    btn.appendChild(document.createTextNode('Contactez-moi'));

    btn.addEventListener('click', () => {
      this.container.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'true');
      this.contactModal.openModal();

      // callback au contact modal pour fermer
      const giveBtnFocus = () => {
        btn.focus();
      };

      const removeARIAHiddenFromContainer = () => {
        this.container.removeAttribute('aria-hidden');
      };
      this.contactModal.closingCallbacks.push(giveBtnFocus);
      this.contactModal.closingCallbacks.push(removeARIAHiddenFromContainer);
    });

    return btn;
  }

  createPhotographerInfosSection() {
    const BEMname = 'photograph-header';
    const childBEMName = `${BEMname}__infos`;
    const { name, portrait, city, country, tagline, price, tags } = this.photographer;

    const section = document.createElement('section');
    section.classList.add(BEMname);

    const div = document.createElement('div');
    div.classList.add(childBEMName);

    const title = document.createElement('h1');
    title.setAttribute('tabindex', '1');
    title.appendChild(document.createTextNode(name));

    const paragraph = document.createElement('p');

    const localisation = document.createElement('span');
    localisation.classList.add(`${childBEMName}__localisation`);
    localisation.setAttribute('tabindex', '1');
    localisation.appendChild(document.createTextNode(`${city}, ${country}`));

    const slogan = document.createElement('span');
    slogan.classList.add(`${childBEMName}__slogan`);
    slogan.setAttribute('tabindex', '1');
    slogan.appendChild(document.createTextNode(tagline));

    paragraph.append(localisation, slogan);

    const likesAndPriceDiv = document.createElement('div');
    likesAndPriceDiv.classList.add('meta-infos');

    const likesDiv = document.createElement('div');
    likesDiv.classList.add('meta-infos__likes');

    const span = this.totalLikesDOM;

    const img = utils.createIMG('like-icon-black.svg', 'likes');
    likesDiv.append(span, img);

    const priceSpan = document.createElement('span');
    priceSpan.setAttribute('tabindex', -1);
    priceSpan.appendChild(document.createTextNode(`${price}€ / jour`));
    likesAndPriceDiv.append(likesDiv, priceSpan);

    const ul = utils.createTagList(tags);

    const btn = this.createContactBtn();

    div.append(title, paragraph, likesAndPriceDiv, ul, btn);

    const thumbnail = utils.createIMG(`thumbnails/${portrait}`, name);
    thumbnail.classList.add('thumbnail');

    section.append(div, thumbnail);
    return section;
  }

  initSelect() {
    const options = [
      {
        value: 'popularity',
        label: 'Popularité',
      },
      {
        value: 'date',
        label: 'Date',
      },
      {
        value: 'title',
        label: 'Titre',
      },
    ];
    const dropdown = new Dropdown(options);
    return dropdown;
  }

  initMediaList() {
    // filtre des médias selon la popularité
    const sortedMedias = this.photographer.medias.sort(utils.sortMediaByPopularity);
    const mediaList = new MediaList(sortedMedias);
    return mediaList;
  }

  insertModalsInDOM() {
    const scriptDOM = document.querySelector('script');

    document.body.insertBefore(this.contactModal.modal, scriptDOM);
    document.body.insertBefore(this.lightboxModal.modal, scriptDOM);
  }

  getPhotographerPage() {
    // initialisation du liste déroulante
    const select = this.initSelect();
    const selectOptions = select.selectOptions;
    const sortMethods = [
      {
        value: 'popularity',
        figureSort: utils.sortFigureByPopularity,
        mediaSort: utils.sortMediaByPopularity,
      },
      {
        value: 'date',
        figureSort: utils.sortFigureByDate,
        mediaSort: utils.sortMediaByDate,
      },
      {
        value: 'title',
        figureSort: utils.sortFigureByTitle,
        mediaSort: utils.sortMediaByTitle,
      },
    ];

    // initialisation du medialist
    const mediaList = this.initMediaList();
    const figuresContainer = mediaList.getMediaList();

   // Ajoute le nom du photographe au titre de la page
    document.title += ` - ${this.photographer.name}`;

    // elements du dom
    const header = this.createHeader();
    const main = document.createElement('main');
    main.id = 'js-main';
    const photographerInfosSection = this.createPhotographerInfosSection();

    main.append(photographerInfosSection, select.getDropdown(), figuresContainer);
    this.container.append(header, main);

    // ajoute modal dans le DOM
    this.insertModalsInDOM();

    // EVENEMENTS DU DOM
    // Lorsque vous cliquez sur l'option de sélection, trie les chiffres dans DOM + medias dans mediasList
    selectOptions.forEach((option) => {
      option.addEventListener('click', () => {
        const sortMethod = sortMethods.find((method) => method.value === option.id);
        select.onChange(option);
        mediaList.sortFigures(sortMethod.figureSort);
        mediaList.sortMedias(sortMethod.mediaSort);
      });
    });
   // Lorsque vous cliquez sur une figure, ouvrez la lightbox et ajoutez des médias
    const figures = figuresContainer.querySelectorAll('figure a');
    figures.forEach((figure) => {
      figure.addEventListener('click', (e) => {
        e.preventDefault();

        // // callback donné au lightbox pour fermer
        const giveFigureFocus = () => {
          figure.focus();
        };
        const removeARIAHiddenFromContainer = () => {
          this.container.removeAttribute('aria-hidden');
        };
        this.lightboxModal.closingCallbacks.push(giveFigureFocus);
        this.lightboxModal.closingCallbacks.push(removeARIAHiddenFromContainer);

        this.container.setAttribute('aria-hidden', 'true');
        this.lightboxModal.openModal();
        this.lightboxModal.populateMedias(this.photographer.medias, e);
      });
    });
  }
}
