import { Homepage } from './components/homepage.js';
import { PhotographerPage } from './components/photographerPage.js';

const getJSON = async () => {
  try {
    const data = await fetch('public/js/data/fisheyedata.json');
    const json = await data.json();
    return [json, null];
  } catch (error) {
    return [null, error];
  }
};

// renvoie le photographe lié à l'ID en json avec ses médias ajoutés à l'objet
const getPhotographerWithMedias = (json, id) => {
  const photographer = json.photographers.find((photographer) => photographer.id === id);
  const medias = json.media.filter((media) => media.photographerId === id);
  photographer.medias = medias;
  return photographer;
};

// Selon si l'url contient un id de photographe ou non, affiche la page d'accueil ou la page du photographe
const displayPageByURLQuery = (json, URLQuery) => {
  const URLParams = new URLSearchParams(URLQuery);
  const id = parseInt(URLParams.get('id'));

  if (!isFinite(id)) {
    const homepage = new Homepage(json.photographers);
    homepage.getHomepage();
  } else {
    const photographerWithMedias = getPhotographerWithMedias(json, id);
    const photographerPage = new PhotographerPage(photographerWithMedias);
    photographerPage.getPhotographerPage();
  }
};

const onLoad = async () => {
  // fetch le fichier json , si  erreur log erreur
  const [json, error] = await getJSON();
  if (error) {
    console.log('onLoad ~ error', error);
  }
  const URLQuery = window.location.search;

  displayPageByURLQuery(json, URLQuery);
};

document.addEventListener('DOMContentLoaded', onLoad);
