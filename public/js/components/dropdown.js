export class Dropdown {
  constructor(options) {
    this.options = options;
    this.selectBtn = this.createSelectBtn();
    this.selectList = this.createSelectList();
    this.selectOptions = Array.from(this.selectList.childNodes);
  }

  expandListBox() {
    this.selectBtn.setAttribute('aria-expanded', 'true');
    this.selectList.classList.add('open');
  }

  collapseListBox() {
    this.selectBtn.setAttribute('aria-expanded', 'false');
    this.selectList.classList.remove('open');
  }

  createSelectLabel() {
    const label = document.createElement('label');
    label.setAttribute('for', 'js-sort');
    label.id = 'ariaLabel';
    label.appendChild(document.createTextNode('Trier par'));
    return label;
  }

  createSelectBtn() {
    const btn = document.createElement('button');
    btn.id = 'js-sort';
    btn.setAttribute('role', 'button');
    btn.classList.add('btn', 'js-sort');
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-labelledBy', 'ariaLabel');
    btn.appendChild(document.createTextNode(this.options[0].label));
    return btn;
  }

  createSelectListItem(option) {
    const li = document.createElement('li');
    li.id = option.value;
    li.setAttribute('role', 'option');
    li.setAttribute('data-sort', option.value);
    li.setAttribute('aria-labelledBy', `${option.value}Btn`);

    const button = document.createElement('button');
    button.id = `${option.value}Btn`;
    button.appendChild(document.createTextNode(option.label));

    li.appendChild(button);
    return li;
  }

  createSelectList() {
    const ul = document.createElement('ul');
    ul.classList.add('js-select');
    ul.setAttribute('role', 'listbox');

    this.options.forEach((option) => {
      ul.appendChild(this.createSelectListItem(option));
    });

    ul.firstElementChild.setAttribute('aria-selected', 'true');
    ul.setAttribute('aria-activedescendant', ul.firstElementChild.getAttribute('id'));

    return ul;
  }

  getDropdown() {
    // éléments du dom
    const select = document.createElement('div');
    select.id = 'js-sortContainer';
    select.classList.add('select-group');

    const label = this.createSelectLabel();
    const divSelect = document.createElement('div');
    divSelect.classList.add('select');
    divSelect.append(this.selectBtn, this.selectList);
    select.append(label, divSelect);

    // évenement du dom
    this.selectBtn.addEventListener('mouseenter', () => {
      this.expandListBox();
    });
    this.selectBtn.addEventListener('click', () => {
      this.expandListBox();
    });
  
    this.selectBtn.addEventListener('focus', () => {
      this.expandListBox();
    });
    this.selectList.addEventListener('mouseleave', () => {
      this.collapseListBox();
    });
    this.selectList.childNodes.forEach((listItem) => {
      listItem.addEventListener('focusout', () => {
        if (listItem === this.selectList.lastChild) {
          this.collapseListBox();
        }
      });
    });

    return select;
  }

  onChange(option) {
    // Recherche une option déjà sélectionnée
    const selectedOption = this.selectOptions.find(
      (option) => option.getAttribute('aria-selected') === 'true',
    );

    selectedOption.removeAttribute('aria-selected');
    option.setAttribute('aria-selected', 'true');
    this.selectList.setAttribute('aria-activedescendant', option.id);

    this.selectBtn.innerText = option.innerText;
    this.collapseListBox();
  }
}
