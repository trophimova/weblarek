import { IBuyer, TPayment, IErrorsBuyer } from '../../types';

export class Buyer {
  private payment: TPayment | '';
  private address: string;
  private email: string;
  private phone: string;

  constructor() {
    this.payment = '';
    this.address = '';
    this.email = '';
    this.phone = '';
  }

  setBuyerData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }

    if (data.address !== undefined) {
      this.address = data.address;
    }

    if (data.email !== undefined) {
      this.email = data.email;
    }

    if (data.phone !== undefined) {
      this.phone = data.phone;
    }
  }

  getBuyerData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  clearBuyerData(): void {
    this.payment = '';
    this.address = '';
    this.email = '';
    this.phone = '';
  }

  validateBuyerData(): IErrorsBuyer {
    const errors: IErrorsBuyer = {};

    if (!this.payment) {
      errors.payment = 'Не выбран способ оплаты';
    }

    if (!this.address.trim()) {
      errors.address = 'Укажите адрес доставки';
    }

    if (!this.email.trim()) {
      errors.email = 'Укажите email';
    }

    if (!this.phone.trim()) {
      errors.phone = 'Укажите телефон';
    }

    return errors;
  }
}
