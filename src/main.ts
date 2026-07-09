import './scss/styles.scss';

import { apiProducts } from './utils/data';
import { ProductCatalog } from './components/models/ProductCatalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';

import { Api } from './components/base/Api';
import { WebLarekApi } from './components/base/WebLarekApi';

// Проверка модели каталога товаров
const productCatalog = new ProductCatalog();

productCatalog.setProducts(apiProducts.items);

console.log('Массив товаров из каталога:', productCatalog.getProducts());

const firstProduct = productCatalog.getProducts()[0];
const secondProduct = productCatalog.getProducts()[1];

if (firstProduct) {
  console.log('Первый товар из каталога:', firstProduct);

  console.log(
    'Получение товара по id:',
    productCatalog.getProductById(firstProduct.id)
  );

  productCatalog.setPreview(firstProduct);

  console.log(
    'Товар для подробного отображения:',
    productCatalog.getPreview()
  );
}

// Проверка модели корзины
const basket = new Basket();

console.log('Корзина при создании:', basket.getItems());

if (firstProduct) {
  basket.addItem(firstProduct);
  console.log('Корзина после добавления первого товара:', basket.getItems());
}

if (secondProduct) {
  basket.addItem(secondProduct);
  console.log('Корзина после добавления второго товара:', basket.getItems());
}

console.log('Количество товаров в корзине:', basket.getItemsCount());
console.log('Стоимость товаров в корзине:', basket.getTotalPrice());

if (firstProduct) {
  console.log(
    'Проверка наличия первого товара в корзине:',
    basket.hasItem(firstProduct.id)
  );
}

if (firstProduct) {
  basket.removeItem(firstProduct);
  console.log('Корзина после удаления первого товара:', basket.getItems());
}

console.log('Количество товаров после удаления:', basket.getItemsCount());
console.log('Стоимость товаров после удаления:', basket.getTotalPrice());

basket.clearBasket();
console.log('Корзина после очистки:', basket.getItems());

// Проверка модели покупателя
const buyer = new Buyer();

console.log('Данные покупателя при создании:', buyer.getBuyerData());
console.log('Ошибки валидации пустых данных:', buyer.validateBuyerData());

buyer.setBuyerData({ address: 'Москва, ул. Тестовая, 1' });
console.log('Данные покупателя после заполнения адреса:', buyer.getBuyerData());
console.log('Ошибки после заполнения адреса:', buyer.validateBuyerData());

buyer.setBuyerData({
  payment: 'online',
  email: 'test@example.com',
  phone: '+79999999999',
});

console.log('Данные покупателя после заполнения всех полей:', buyer.getBuyerData());
console.log('Ошибки после заполнения всех полей:', buyer.validateBuyerData());

buyer.clearBuyerData();
console.log('Данные покупателя после очистки:', buyer.getBuyerData());

const api = new Api(`${import.meta.env.VITE_API_ORIGIN}/api/weblarek`);
const webLarekApi = new WebLarekApi(api);

webLarekApi
  .getProducts()
  .then((productsResponse) => {
    productCatalog.setProducts(productsResponse.items);

    console.log(
      'Каталог товаров, полученный с сервера и сохранённый в модели:',
      productCatalog.getProducts()
    );
  })
  .catch((error) => {
    console.error('Ошибка при загрузке товаров с сервера:', error);
  });
  