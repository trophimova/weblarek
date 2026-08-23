import { Card, ICard } from './Card';
import { ensureElement } from '../../utils/utils';

type ICardBasket = ICard &
{
  index: number;
};

interface ICardBasketActions {
  onDelete: () => void;
}

export class CardBasket extends Card<ICardBasket> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: ICardBasketActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.deleteButton.addEventListener('click', actions.onDelete);
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
