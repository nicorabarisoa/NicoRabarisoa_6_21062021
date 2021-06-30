const openContactModal = (modal, btn) => {
  const wrapper = document.getElementById('js-container');

  modal.classList.add('open');
  wrapper.setAttribute('aria-hidden', 'true');
  btn.setAttribute('aria-expanded', 'true');
  window.addEventListener('keydown', contactModalKeyEvents);
};

const closeContactModal = (modal, btn) => {
  const wrapper = document.getElementById('js-container');

  modal.classList.remove('open');
  wrapper.setAttribute('aria-hidden', 'false');
  btn.setAttribute('aria-expanded', 'false');
  window.removeEventListener('keydown', contactModalKeyEvents);

  btn.focus();
};

const contactModalKeyEvents = (e) => {
  const modal = document.getElementById('contact-modal');
  const contactBtn = document.getElementById('js-contactForm');

  // prends la liste des elements focusable dans un modal
  const modalFocusableElements = Array.from(modal.querySelectorAll('.js-focusable'));
  // garde le premier et dernier élement focusable
  const firstFocusElement = modalFocusableElements[0];
  const lastFocusElement = modalFocusableElements[modalFocusableElements.length - 1];

  const isTabPressed = e.key === 'Tab' || e.code === 'Tab';
  const isEscapePressed = e.key === 'escape' || e.code === 'Escape';

  if (!(isTabPressed || isEscapePressed)) {
    return;
  }
  // bouton echap pour quitter la modale si on est dedans
  if (isEscapePressed) {
    closeContactModal(modal, contactBtn);
    return;
  }
  // tabulation
  if (isTabPressed) {
    if (e.shiftKey) {
      if (document.activeElement === firstFocusElement) {
        e.preventDefault();
        lastFocusElement.focus();
        return;
      }
    } else {
      if (document.activeElement === lastFocusElement) {
        e.preventDefault();
        firstFocusElement.focus();
        return;
      }
    }
  }
  if (!modalFocusableElements.includes(document.activeElement)) {
    e.preventDefault();
    firstFocusElement.focus();
  }
};

export const attachContactModalEventListeners = () => {
  const contactBtn = document.getElementById('js-contactForm');
  const modal = document.getElementById('contact-modal');
  const closeBtn = modal.querySelector('.close');
  const form = modal.querySelector('form');
  const inputs = modal.querySelectorAll('.js-input');

  window.addEventListener('click', (e) => {
    if (modal.classList.contains('open')) {
      if (e.target === modal) {
        if (e.target.closest('section') === null) {
          closeContactModal(modal, contactBtn);
        }
      }
    }
  });

  // cliquer pour ouvrir la modale
  contactBtn.addEventListener('click', () => {
    openContactModal(modal, contactBtn);
  });

  // cliquer pour fermer la modale
  closeBtn.addEventListener('click', () => {
    closeContactModal(modal, contactBtn);
  });

  // fermer la modale
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    inputs.forEach((input) => {
      console.log(input.value);
    });
    closeContactModal(modal, contactBtn);
  });
};
