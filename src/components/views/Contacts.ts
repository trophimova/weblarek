import { Form, IForm } from './Form';
import { IEvents } from '../base/Events';
import { IBuyer } from '../../types';
import { ensureElement } from '../../utils/utils';

type IContactsForm = IForm & Pick<IBuyer, 'email' | 'phone'>;

export class Contacts extends Form<IContactsForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLFormElement) {
    super(events, container);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('contacts:submit');
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
