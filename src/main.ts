import './scss/styles.scss';

import { IProduct, IProductResponse } from './types/index';
import { ProductCatalog } from './components/models/ProductCatalog'
import { Basket } from './components/models/Basket'
import { Buyer } from './components/models/Buyer'
import { Api } from './components/base/Api'
import { ApiComposition } from './components/connection/ApiComposition'
import { API_URL } from './utils/constants'
import { CardCatalog } from './components/view/CardCatalog';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { Modal } from './components/view/Modal';
import { OrderSuccess } from './components/view/OrderSuccess';
import { EventEmitter } from './components/base/Events';
import { CardPreview } from './components/view/CardPreview';
import { BasketView } from './components/view/BasketView';
import { CardBasket } from './components/view/CardBasket';
import { FormOrder } from './components/view/FormOrder';
import { FormContacts } from './components/view/FormContacts';

const events = new EventEmitter();

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
});

// Шаблоны
const templates = {
    headerContainer: ensureElement<HTMLElement>('.header'),
    galleryContainer: ensureElement<HTMLElement>('.page__wrapper'),
    modalContainer: ensureElement<HTMLElement>('.modal'),
    success: ensureElement<HTMLTemplateElement>('#success'),
    cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
    preview: ensureElement<HTMLTemplateElement>('#card-preview'),
    cardBasket: ensureElement<HTMLTemplateElement>('#card-basket'),
    basket: ensureElement<HTMLTemplateElement>('#basket'),
    order: ensureElement<HTMLTemplateElement>('#order'),
    contacts: ensureElement<HTMLTemplateElement>('#contacts')
};

// Инициализация компонентов представления
const gallery = new Gallery(templates.galleryContainer);
const modal = new Modal(templates.modalContainer, events);
const basketView = new BasketView(cloneTemplate(templates.basket), events);
const header = new Header(events, templates.headerContainer);

// Инициализация моделей данных
const basketModel = new Basket([], events);
const buyerModel = new Buyer({
    payment: '',
    email: '',
    phone: '',
    address: ''
}, events);

// Инициализация форм
const orderForm = new FormOrder(cloneTemplate(templates.order), events);
const contactsForm = new FormContacts(cloneTemplate(templates.contacts), events);
const successView = new OrderSuccess(cloneTemplate(templates.success), events);

let productCatalog: ProductCatalog;

// Инициализация каталога товаров
(async function initCatalog() {
    const apiResponse = await new ApiComposition(new Api(API_URL)).get<IProductResponse>('/product/');
    productCatalog = new ProductCatalog(apiResponse.items, events);
    events.emit('catalog:changed');
})();

// Обновление UI состояния
function updateUI() {
    updateBasketCounter();
    updateBasketView();
}

// Обновление счетчика корзины
function updateBasketCounter() {
    header.counter = basketModel.getItemsCount();
}

// Обновление отображения корзины
function updateBasketView() {
    const basketProducts = basketModel.getArrayBasket();
    const totalPrice = basketModel.getTotalPrice() || 0;
    
    basketView.prise = `${totalPrice} синапсов`;
    
    if (basketView.basketButton) {
        basketView.basketButton.disabled = basketProducts.length === 0;
    }
    
    if (basketProducts.length === 0) {
        basketView.products = [];
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'basket__empty';
        emptyMessage.textContent = 'Корзина пуста';
        basketView.productsElement.innerHTML = '';
        basketView.productsElement.appendChild(emptyMessage);
    } else {
        const basketItems = basketProducts.map((item, index) => {
            const basketCard = new CardBasket(cloneTemplate(templates.cardBasket), {
                onClick: () => events.emit('basket:item:delete', item)
            });
            return basketCard.render({...item, index: index + 1});
        });
        basketView.products = basketItems;
    }
}

// Обновление кнопки в превью товара
function updatePreviewButton(item: IProduct, button: HTMLButtonElement) {
    const isInBasket = basketModel.hasProduct(item.id);
    const hasPrice = item.price !== null && item.price !== undefined && item.price > 0;

    if (!hasPrice) {
        button.textContent = 'Недоступно';
        button.disabled = true;
    } else if (isInBasket) {
        button.textContent = 'Удалить из корзины';
        button.disabled = false;
    } else {
        button.textContent = 'Купить';
        button.disabled = false;
    }
}

// Обработчики событий представления

// Каталог товаров
events.on('catalog:changed', () => {
    if (!productCatalog) return;
    
    const productsArray = productCatalog.getArrayProducts();
    const itemCards = productsArray.map((item) => {
        const card = new CardCatalog(cloneTemplate(templates.cardCatalog), {
            onClick: () => events.emit('card:click', item), 
        });
        return card.render(item);
    });
    gallery.catalog = itemCards;
});

// Клик по карточке товара в каталоге
events.on('card:click', (item: IProduct) => {
    productCatalog.setProductForDisplay(item);
    
    const previewCard = new CardPreview(cloneTemplate(templates.preview), {
        onClick: () => events.emit('preview:button:click', item)
    });
    
    const cardElement = previewCard.render(item);
    const button = cardElement.querySelector('.card__button') as HTMLButtonElement;
    
    if (button) {
        updatePreviewButton(item, button);
    }
    
    modal.content = cardElement;
    templates.modalContainer.classList.add('modal_active');
});

// Клик по кнопке в превью товара (добавить/удалить из корзины)
events.on('preview:button:click', (item: IProduct) => {
    if (basketModel.hasProduct(item.id)) {
        basketModel.delProduct(item.id);
    } else {
        basketModel.addProduct(item);
    }
    events.emit('modal:close');
});

// Удаление товара из корзины
events.on('basket:item:delete', (item: IProduct) => {
    basketModel.delProduct(item.id);
});

// Обновление UI при изменениях в корзине
events.on('basket:product:added', updateUI);
events.on('basket:product:removed', updateUI);
events.on('basket:cleared', updateUI);

// Открытие корзины (из хедера)
events.on('basket:open', () => {
    modal.content = basketView.render();
    updateBasketView();
    templates.modalContainer.classList.add('modal_active');
});

// Оформление заказа (из корзины)
events.on('order:open', () => {
    if (basketModel.getItemsCount() > 0) {
        const buyerData = buyerModel.getBuyerData();
        orderForm.payment = buyerData.payment;
        orderForm.address = buyerData.address;
        
        const orderElement = orderForm.render();
        modal.content = orderElement;
        templates.modalContainer.classList.add('modal_active');
        validateOrderForm();
    }
});

// Обработчик изменения способа оплаты
events.on('order:payment:change', (data: { payment: 'card' | 'cash' }) => {
  buyerModel.saveOrderData({ ...buyerModel.getBuyerData(), payment: data.payment });
  orderForm.payment = data.payment;

  validateOrderForm();
});

events.on('order:address:change', (data: { address: string }) => {
  buyerModel.saveOrderData({ ...buyerModel.getBuyerData(), address: data.address });
  orderForm.address = data.address;

  validateOrderForm();
});

// Открытие формы контактов
events.on('contacts:open', () => {
    const buyerData = buyerModel.getBuyerData();
    contactsForm.email = buyerData.email;
    contactsForm.phone = buyerData.phone;
    
    const contactsElement = contactsForm.render();
    modal.content = contactsElement;
    validateContactsForm();
});

// Обновление данных контактов
events.on('contacts:input:change', (data: { email?: string; phone?: string }) => {
    const currentData = buyerModel.getBuyerData();
    buyerModel.saveOrderData({ ...currentData, ...data });
    
    // Обновляем форму контактов
    const contactsElement = contactsForm.render();
    modal.content = contactsElement;
    validateContactsForm();
});

// Обработка отправки форм
events.on('order:form:submit', () => {
    if (validateOrderForm()) {
        events.emit('contacts:open');
    }
});

events.on('contacts:form:submit', async () => {
    if (validateContactsForm()) {
        await submitOrder();
    }
});

// Отправка заказа на сервер
async function submitOrder() {
    try {
        const buyerData = buyerModel.getBuyerData();
        const orderPayload = {
            payment: buyerData.payment,
            address: buyerData.address,
            email: buyerData.email,
            phone: buyerData.phone,
            items: basketModel.getArrayBasket().map(item => item.id),
            total: basketModel.getTotalPrice()
        };
        
        const api = new ApiComposition(new Api(API_URL));
        const response = await api.post('/order', orderPayload);
        events.emit('order:success', response);
        
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
        const contactsElement = contactsForm.render();
        contactsForm.errors = 'Произошла ошибка при оформлении заказа. Попробуйте еще раз.';
        modal.content = contactsElement;
    }
}

// Успешное оформление заказа
events.on('order:success', (response: any) => {
    basketModel.clearBasket();
    buyerModel.clearBuyerData();
    
    successView.price = `Списано ${response?.total || 0} синапсов`;
    modal.content = successView.render();
    templates.modalContainer.classList.add('modal_active');
});

// Закрытие модальных окон
events.on('success:close', () => {
    events.emit('modal:close');
});

events.on('modal:close', () => {
    templates.modalContainer.classList.remove('modal_active');
});

// Закрытие по клику вне модального окна
templates.modalContainer.addEventListener('click', (event) => {
    if (event.target === templates.modalContainer) {
        events.emit('modal:close');
    }
});

// Валидация формы заказа
function validateOrderForm(): boolean {
    const isValid = buyerModel.validateOrder();
    orderForm.valid = isValid;

    const buyerData = buyerModel.getBuyerData();
    const errors: string[] = [];
    if (!buyerData.payment) errors.push('Выберите способ оплаты');
    if (!buyerData.address?.trim()) errors.push('Введите адрес доставки');
    orderForm.errors = errors.join('; ');

    return isValid;
}

// Валидация формы контактов
function validateContactsForm(): boolean {
    const isValid = buyerModel.validateContacts();
    contactsForm.valid = isValid;

    const buyerData = buyerModel.getBuyerData();
    const errors: string[] = [];
    if (!buyerData.email?.trim()) errors.push('Введите email');
    if (!buyerData.phone?.trim()) errors.push('Введите телефон');
    contactsForm.errors = errors.join('; ');

    return isValid;
}

// Инициализация
updateUI();
