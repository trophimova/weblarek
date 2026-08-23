import { IProduct } from '../../types';
import { Card, ICard } from './Card';
import { ensureElement } from "../../utils/utils";
import { categoryMap, CDN_URL } from '../../utils/constants';

type ICardPreview = ICard & Pick<IProduct, 'image' | 'category' | 'description'> &
{
  buttonText: string;
  buttonDisabled: boolean;
};

interface ICardPreviewActions {
  onClick: () => void;
}

export class CardPreview extends Card<ICardPreview> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected actionButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: ICardPreviewActions) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>(".card__image", this.container);
    this.categoryElement = ensureElement<HTMLElement>(".card__category", this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.actionButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.actionButton.addEventListener('click', actions.onClick);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.classList.remove(...Object.values(categoryMap));

    const categoryClass = categoryMap[value as keyof typeof categoryMap];

    if (categoryClass) {
      this.categoryElement.classList.add(categoryClass);
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, CDN_URL + value);
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.actionButton.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.actionButton.disabled = value;
  }
}
