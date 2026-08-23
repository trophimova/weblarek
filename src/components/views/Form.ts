import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export interface IForm {
  valid: boolean;
  errors: string;
}

export class Form<T extends IForm> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLFormElement) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('input', (event) => {
      const target = event.target;

      if (target instanceof HTMLInputElement) {
        this.events.emit('form:change', {
          field: target.name,
          value: target.value
        });
      }
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}
