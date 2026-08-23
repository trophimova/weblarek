import { ensureElement } from '../../utils/utils';
import { Form, IForm } from './Form';
import { IEvents } from '../base/Events';
import { IBuyer, TPayment } from '../../types';

type IOrderForm = IForm & Pick<IBuyer, 'address' | 'payment'>;

const paymentMap: Record<TPayment, string> = {
  online: 'card',
  offline: 'cash'
};

export class Order extends Form<IOrderForm> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLFormElement) {
    super(events, container);

    this.paymentButtons = Array.from(
      this.container.querySelectorAll<HTMLButtonElement>('.order__buttons .button_alt')
    );
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const payment = (Object.keys(paymentMap) as TPayment[])
          .find((key) => paymentMap[key] === button.name);

        if (payment) {
          this.events.emit('form:change', {
            field: 'payment',
            value: payment
          });
        }
      });
    });

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('order:submit');
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set payment(value: TPayment | '') {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle(
        'button_alt-active',
        value !== '' && button.name === paymentMap[value]
      );
    });
  }
}
