import './scss/styles.scss';
import { IBuyer } from './types/index';
import { apiProducts } from './utils/data'
import { ProductCatalog } from './components/models/ProductCatalog'
import { Basket } from './components/models/Basket'
import { Buyer } from './components/models/Buyer'
import { Api } from './components/base/Api'
import { ApiComposition } from './components/connection/ApiComposition'
import { API_URL } from './utils/constants'


// Тестирование работы класса ProductCatalog

const products = new ProductCatalog(apiProducts.items);
products.setArrayProducts(apiProducts.items);
console.log('Массив товаров из каталога: ', products.getArrayProducts());
const product = products.getProduct('c101ab44-ed99-4a54-990d-47aa2bb4e7d9');
console.log('Объект товара с id: c101ab44-ed99-4a54-990d-47aa2bb4e7d9 ', product);
products.setProductForDisplay(product);
console.log('Карточка товара для отображения: ', products.getProductForDisplay('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'));

// Тестирование работы класса Basket

const basket = new Basket();
console.log('Сейчас ничего нет в корзине ', basket.getArrayBasket());
console.log('Добавили товар в коризину: ', basket.addProduct(product));
console.log('Удалили товар из корзины: ', basket.delProduct('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'));
console.log('Стоимость всех товаров: ', basket.getTotalPrice());
console.log('Очистили корзину: ', basket.clearBasket());
console.log('Количество товаров в коризине: ', basket.getItemsCount());
console.log('Проверка наличия товара в корзине: ', basket.hasProduct('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'));

// Тестирование работы класса Buyer

const apiBuyer: IBuyer = {
    "payment": "card",
    "email": "anna@mail.ru",
    "phone": "+7 (949) 949 94 49",
    "address": "пр. Мира"
}
const buyer = new Buyer(apiBuyer);
buyer.saveOrderData(apiBuyer);
console.log('Данные покупателя: ', buyer.getBuyerData());
console.log('Данные покупателя заполнены? ', buyer.validationData());
buyer.clearBuyerData();
console.log('Данные покупателя очистили: ', buyer.getBuyerData());
console.log('Данные покупателя заполнены? ', buyer.validationData());

// Тестирование работы класса ApiComposition

async function loadProducts() {
    try {
        const api = new Api(`${API_URL}`);
        const apiComposition = new ApiComposition(api);
        
        const getApiProducts = await apiComposition.get(`/product/`);
        const targetArray = getApiProducts.items;
        console.log('Каталог товаров:', targetArray);
        
        const productsApi = new ProductCatalog(targetArray);
        productsApi.setArrayProducts(targetArray);
        console.log('Массив товаров из каталога:', productsApi.getArrayProducts());
        
        return productsApi;
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

loadProducts();