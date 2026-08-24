import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface IBasketViewData {
  items: HTMLElement[];
  total: number;
  buttonDisabled: boolean;
}

export class BasketView extends Component<IBasketViewData> {
  protected listElement: HTMLElement;
  protected checkoutButton: HTMLButtonElement;
  protected priceElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.checkoutButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.checkoutButton.disabled = true;

    this.checkoutButton.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }

  set items(value: HTMLElement[]) {
    this.listElement.replaceChildren(...value);
  }

  set total(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }

  set buttonDisabled(value: boolean) {
    this.checkoutButton.disabled = value;
  }
}
