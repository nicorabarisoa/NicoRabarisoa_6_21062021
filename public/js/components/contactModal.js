export class ContactModal {
  constructor(name) {
    this.name = name;
    this.modal = this.createModal();
    this.closingCallbacks = [];
  }

  /* crée la squelette de la modale */
  createModalSkeleton() {
    const div = document.createElement('div');
    div.id = 'contact-modal';
    div.classList.add('modal-window', 'contact-modal');
    return div;
  }
/* crée le header  de la modale */
  createModalHeader() {
    const title = document.createElement('h1');
    title.id = 'modal-title';
    title.appendChild(document.createTextNode('Contactez-moi'));

    const span = document.createElement('span');
    span.appendChild(document.createTextNode(this.name));
    title.appendChild(span);

    return title;
  }

  /* crée les entrées du formulaire */
  createFormLabel(id, text, type = 'text') {
    const label = document.createElement('label');
    label.setAttribute('for', id);

    const input = document.createElement('input');
    input.setAttribute('type', type);
    input.id = id;
    input.classList.add('js-focusable', 'js-input');
    input.required = true;

    label.append(document.createTextNode(text), input);
    return label;
  }
/* crée le formulaire */
  createForm() {
    const form = document.createElement('form');

    const firstNameInput = this.createFormLabel('formfirstName', 'Prénom');
    const lastNameInput = this.createFormLabel('formLastName', 'Nom');
    const emailInput = this.createFormLabel('formEmail', 'Email', 'email');

    const textAreaLabel = document.createElement('label');
    textAreaLabel.setAttribute('for', 'formMessage');

    const textArea = document.createElement('textarea');
    textArea.id = 'formMessage';
    textArea.classList.add('js-focusable', 'js-input');
    textArea.required = true;

    textAreaLabel.append(document.createTextNode('Votre message'), textArea);

    const button = document.createElement('button');
    button.id = 'js-submit';
    button.classList.add('js-focusable');
    button.appendChild(document.createTextNode('Envoyer'));

    form.append(firstNameInput, lastNameInput, emailInput, textAreaLabel, button);

    const inputs = form.querySelectorAll('.js-input');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      inputs.forEach((input) => {
        console.log(input.value);
      });
      this.closeModal();
    });

    return form;
  }
/* crée le bouton fermer */
  createCloseBtn() {
    const btn = document.createElement('button');
    btn.classList.add('close', 'js-focusable');

    btn.addEventListener('click', () => {
      this.closeModal();
    });

    return btn;
  }

  contactModalKeyEvents(e) {
    const modalFocusableElements = Array.from(this.modal.querySelectorAll('.js-focusable'));
    const firstFocusElement = modalFocusableElements[0];
    const lastFocusElement = modalFocusableElements[modalFocusableElements.length - 1];
    const isTabPressed = e.key === 'Tab' || e.code === 'Tab';
    const isEscapePressed = e.key === 'Escape' || e.code === 'Escape';
    const activeElement = document.activeElement;

    // ferme la modale quand on appuie sur echap 
    // La touche de tabulation parcourt les entrées et les boutons 
    if (!(isTabPressed || isEscapePressed)) {
      return;
    }
    if (isEscapePressed) {
      this.closeModal();
    }
    if (isTabPressed) {
      if (e.shiftKey) {
        if (activeElement === firstFocusElement) {
          e.preventDefault();
          lastFocusElement.focus();
          return;
        }
      } else {
        if (activeElement === lastFocusElement) {
          e.preventDefault();
          firstFocusElement.focus();
          return;
        }
      }
      if (!modalFocusableElements.includes(activeElement)) {
        e.preventDefault();
        firstFocusElement.focus();
        return;
      }
    }
  }

  createModal() {
    const div = this.createModalSkeleton();
    const section = document.createElement('section');
    const title = this.createModalHeader();
    div.setAttribute('aria-labelledBy', title.id);

    const form = this.createForm();

    const closeBtn = this.createCloseBtn();

    section.append(title, form, closeBtn);
    div.appendChild(section);

    // Events Listeners
    //ferme la modale en cliquant en dehors
    window.addEventListener('click', (e) => {
      if (this.modal.classList.contains('open')) {
        if (e.target.closest('section') === null) {
          this.closeModal();
        }
      }
    });

    window.addEventListener('keydown', (e) => {
      if (this.modal.classList.contains('open')) {
        this.contactModalKeyEvents(e);
      }
    });
    return div;
  }

  openModal() {
    this.modal.classList.add('open');
  }

  closeModal() {
    // déclenche les callbacks lors de l'ouverture du modal pour le fermer
    // modifie les aria et le focus dans la page en dehors du modal
    this.modal.classList.remove('open');
    while (this.closingCallbacks.length > 0) {
      this.closingCallbacks[0].call();
      this.closingCallbacks.shift();
    }
  }
}
