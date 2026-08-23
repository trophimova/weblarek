import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Basket {
  private items: IProduct[];

  constructor(protected events: IEvents) {
    this.items = [];
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    this.events.emit('basket:changed');
  }

  removeItem(product: IProduct): void {
    this.items = this.items.filter((item) => item.id !== product.id);
    this.events.emit('basket:changed');
  }

  clearBasket(): void {
    this.items = [];
    this.events.emit('basket:changed');
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  getItemsCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
