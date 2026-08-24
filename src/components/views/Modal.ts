import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButton.addEventListener('click', () => {
      this.close();
    });
    this.container.addEventListener('click', (event) => {
      if (event.target === event.currentTarget) {
        this.close();
      }
    });
  }

  set content(content: HTMLElement) {
    this.contentElement.replaceChildren(content);
  }

  open() {
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
  }
}
