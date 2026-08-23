import { IProduct } from '../../types';
import { Card, ICard } from './Card';
import { ensureElement } from '../../utils/utils';
import { categoryMap, CDN_URL } from '../../utils/constants';

type ICardCatalog = ICard & Pick<IProduct, 'image' | 'category'>;

interface ICardCatalogActions {
  onClick: () => void;
}

export class CardCatalog extends Card<ICardCatalog> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions: ICardCatalogActions) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.container.addEventListener('click', actions.onClick);
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
}
