import './scss/styles.scss';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL } from './utils/constants';

import { ProductCatalog } from './components/models/ProductCatalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';

import { Api } from './components/base/Api';
import { WebLarekApi } from './components/service/WebLarekApi';
import { EventEmitter } from './components/base/Events';

import { Gallery } from './components/views/Gallery';
import { CardCatalog } from './components/views/CardCatalog';
import { CardPreview } from './components/views/CardPreview';
import { Modal } from './components/views/Modal';
import { Header } from './components/views/Header';
import { BasketView } from './components/views/BasketView';
import { CardBasket } from './components/views/CardBasket';
import { Order } from './components/views/Order';
import { IBuyer, IOrder } from './types';
import { Contacts } from './components/views/Contacts';
import { Success } from './components/views/Success';

const eventEmitter = new EventEmitter();

const productCatalog = new ProductCatalog(eventEmitter);
const basket = new Basket(eventEmitter);
const buyer = new Buyer(eventEmitter);

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

webLarekApi
  .getProducts()
  .then((productsResponse) => {
    productCatalog.setProducts(productsResponse.items);
  })
  .catch((error) => {
    console.error('Ошибка при загрузке товаров с сервера:', error);
  });

const galleryElement = ensureElement<HTMLElement>('.gallery');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

const gallery = new Gallery(galleryElement);

const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardPreviewElement = cloneTemplate<HTMLElement>(cardPreviewTemplate);
const cardPreview = new CardPreview(cardPreviewElement,
  {
    onClick: () => {
      eventEmitter.emit('product:action');
    }
  }
);

const modalElement = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(modalElement);

const headerElement = ensureElement<HTMLElement>('.header');
const header = new Header(eventEmitter, headerElement);

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketElement = cloneTemplate<HTMLElement>(basketTemplate);
const basketView = new BasketView(eventEmitter, basketElement);

const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderElement = cloneTemplate<HTMLFormElement>(orderTemplate);
const orderView = new Order(eventEmitter, orderElement);

const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const contactsElement = cloneTemplate<HTMLFormElement>(contactsTemplate);
const contactsView = new Contacts(eventEmitter, contactsElement);

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const successElement = cloneTemplate<HTMLElement>(successTemplate);
const successView = new Success(eventEmitter, successElement);

eventEmitter.on('catalog:changed', () => {
  const products = productCatalog.getProducts();
  const cards = products.map((product) => {
    const cardElement = cloneTemplate<HTMLElement>(cardCatalogTemplate);
    const card = new CardCatalog(cardElement,
      {
        onClick: () => {
          eventEmitter.emit('product:select', {
            id: product.id
          });
        }
      }
    );

    return card.render({
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category
    });
  });

  gallery.render({
    catalog: cards
  });
});

eventEmitter.on<{ id: string }>('product:select', ({ id }) => {
  const product = productCatalog.getProductById(id);

  if (product) {
    productCatalog.setPreview(product);
  }
});

eventEmitter.on('preview:changed', () => {
  const product = productCatalog.getPreview();

  if (!product) {
    return;
  }

  const inBasket = basket.hasItem(product.id);
  let buttonText: string;
  let buttonDisabled: boolean;

  if (product.price === null) {
    buttonText = 'Недоступно';
    buttonDisabled = true;
  } else if (inBasket) {
    buttonText = 'Удалить из корзины';
    buttonDisabled = false;
  } else {
    buttonText = 'Купить';
    buttonDisabled = false;
  }

  const previewElement = cardPreview.render({
    title: product.title,
    price: product.price,
    image: product.image,
    category: product.category,
    description: product.description,
    buttonText,
    buttonDisabled
  });

  modal.render({
    content: previewElement
  });

  modal.open();
});

eventEmitter.on('product:action', () => {
  const product = productCatalog.getPreview();

  if (!product) {
    return;
  }

  if (basket.hasItem(product.id)) {
    basket.removeItem(product);
  } else {
    basket.addItem(product);
  }

  modal.close();
});

eventEmitter.on<{ id: string }>('basket:remove', ({ id }) => {
  const product = productCatalog.getProductById(id);

  if (product) {
    basket.removeItem(product);
  }
});

eventEmitter.on('basket:changed', () => {
  const items = basket.getItems();

  const cards = items.map((product, index) => {
    const cardElement = cloneTemplate<HTMLElement>(cardBasketTemplate);
    const card = new CardBasket(cardElement,
      {
        onDelete: () => {
          eventEmitter.emit('basket:remove', {
            id: product.id
          });
        }
      }
    );

    return card.render({
      title: product.title,
      price: product.price,
      index: index + 1
    });
  });

  const total = basket.getTotalPrice();
  const count = basket.getItemsCount();

  header.render({
    counter: count
  });

  basketView.render({
    items: cards,
    total,
    buttonDisabled: items.length === 0
  });
});

eventEmitter.on('basket:open', () => {
  modal.render({
    content: basketView.render()
  });

  modal.open();
});

eventEmitter.on('order:open', () => {
  modal.render({
    content: orderView.render()
  });

  modal.open();
});

eventEmitter.on<{ field: keyof IBuyer; value: string }>('form:change',
  ({ field, value }) => {
    buyer.setBuyerData({ [field]: value });
  }
);

eventEmitter.on('buyer:changed', () => {
  const buyerData = buyer.getBuyerData();
  const errors = buyer.validateBuyerData();

  const orderErrors = [errors.payment, errors.address]
    .filter(Boolean)
    .join(', ');

  orderView.render({
    payment: buyerData.payment,
    address: buyerData.address,
    valid: !errors.payment && !errors.address,
    errors: orderErrors
  });

  const contactsErrors = [errors.email, errors.phone]
    .filter(Boolean)
    .join(', ');

  contactsView.render({
    email: buyerData.email,
    phone: buyerData.phone,
    valid: !errors.email && !errors.phone,
    errors: contactsErrors
  });
});

eventEmitter.on('order:submit', () => {
  modal.render({
    content: contactsView.render()
  });
});

eventEmitter.on('contacts:submit', () => {
  const buyerData = buyer.getBuyerData();

  if (!buyerData.payment) {
    return;
  }

  const orderData: IOrder = {
    payment: buyerData.payment,
    address: buyerData.address,
    email: buyerData.email,
    phone: buyerData.phone,
    total: basket.getTotalPrice(),
    items: basket.getItems().map((product) => product.id)
  };

  webLarekApi
    .sendOrder(orderData)
    .then((result) => {
      basket.clearBasket();
      buyer.clearBuyerData();

      const successElement = successView.render({
        total: result.total
      });

      modal.render({
        content: successElement
      });

      modal.open();
    })
    .catch((error) => {
      console.error('Ошибка при оформлении заказа:', error);
    });
});

eventEmitter.on('success:close', () => {
  modal.close();
});
