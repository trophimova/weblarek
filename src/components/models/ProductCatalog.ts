import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class ProductCatalog {
  private products: IProduct[];
  private preview: IProduct | null;

  constructor(protected events: IEvents) {
    this.products = [];
    this.preview = null;
  }

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit('catalog:changed');
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  setPreview(product: IProduct): void {
    this.preview = product;
    this.events.emit('preview:changed');
  }

  getPreview(): IProduct | null {
    return this.preview;
  }
}
