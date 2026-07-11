export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;
  title: string;
  image: string;
  category: string;
  price: number | null;
  description: string;
}

export type TPayment = 'online' | 'offline';

export interface IBuyer {
  payment: TPayment | '';
  address: string;
  email: string;
  phone: string;
}

export interface IBuyerErrors {
  payment?: string;
  address?: string;
  email?: string;
  phone?: string;
}

export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

export interface IOrder extends Omit<IBuyer, 'payment'> {
  payment: TPayment;
  total: number;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}
