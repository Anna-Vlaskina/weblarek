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

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const headerContainer = ensureElement<HTMLElement>('.header');
const galleryContainer = ensureElement<HTMLElement>('.page__wrapper');
const modalContainer = ensureElement<HTMLElement>('.modal');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');





const gallery = new Gallery(galleryContainer);
const modal = new Modal(modalContainer, events);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const basketModel = new Basket([], events);
const buyerModel = new Buyer({
  payment: '',
  email: '',
  phone: '',
  address: ''
}, events);
const orderForm = new FormOrder(cloneTemplate(orderTemplate), events);
const contactsForm = new FormContacts(cloneTemplate(contactsTemplate), events);
const successView = new OrderSuccess(cloneTemplate(successTemplate), events);


const productCatalog = new ProductCatalog((await new ApiComposition(new Api(API_URL)).get<IProductResponse>('/product/')).items, events);
const productsArray = productCatalog.getArrayProducts();

// Выводим карточки в галерею 

events.on('catalog:changed', () => {
    const products = productsArray;
    const itemCards = products.map((item) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item), 
        });
        return card.render(item);
    });
    gallery.render({ catalog: itemCards });
});



events.emit('catalog:changed');


// Обработчик выбора карточки - открытие модального окна с превью
events.on('card:select', (item: IProduct) => {
    // Обновляем данные о выбранном продукте
    productCatalog.setProductForDisplay(item);
    
    // Создаем карточку для превью
    const previewCard = new CardPreview(cloneTemplate(previewTemplate), {
        onClick: () => events.emit('preview:add-to-cart', item)
    });
    
    // Рендерим карточку и открываем модальное окно
    const cardElement = previewCard.render(item);
    modal.content = cardElement;
    modalContainer.classList.add('modal_active');
});

// Обработчик закрытия модального окна
events.on('modal:close', () => {
    modalContainer.classList.remove('modal_active');    
});


events.emit('catalog:changed');



// Функция обновления счетчика корзины в заголовке
function updateBasketCounter() {
  const header = new Header(events, headerContainer);
  header.counter = basketModel.getItemsCount();
}

// Функция обновления состояния кнопки в превью карточки
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

// Функция обновления отображения корзины
function updateBasketView() {
  const basketProducts = basketModel.getArrayBasket();
  const totalPrice = basketModel.getTotalPrice() || 0;
  
  // Обновляем общую стоимость
  basketView.prise = `${totalPrice} синапсов`;
  
  // Обновляем состояние кнопки оформления (блокируем если корзина пуста)
  if (basketView.basketButton) {
    basketView.basketButton.disabled = basketProducts.length === 0;
  }
  
  if (basketProducts.length === 0) {
    // Если корзина пуста, показываем пустой список
    basketView.products = [];
    // Создаем элемент с сообщением о пустой корзине
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'basket__empty';
    emptyMessage.textContent = 'Корзина пуста';
    basketView.productsElement.innerHTML = '';
    basketView.productsElement.appendChild(emptyMessage);
  } else {
    // Создаем карточки товаров для корзины
    const basketItems = basketProducts.map((item, index) => {
      const basketCard = new CardBasket(cloneTemplate(cardBasketTemplate), {
        onClick: () => events.emit('basket:remove', item)
      });
      return basketCard.render({...item, index: index + 1});
    });

    basketView.products = basketItems;
  }
}







// Обработчик изменения каталога - рендер карточек в галерею
events.on('catalog:changed', () => {
    const itemCards = productsArray.map((item) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item), 
        });
        return card.render(item);
    });
    gallery.render({ catalog: itemCards });
});







// Обработчик выбора карточки - открытие модального окна с превью
events.on('card:select', (item: IProduct) => {
    productCatalog.setProductForDisplay(item);
    
    const previewCard = new CardPreview(cloneTemplate(previewTemplate), {
        onClick: () => events.emit('preview:add-to-cart', item)
    });
    
    const cardElement = previewCard.render(item);
    
    // Обновляем состояние кнопки после рендера
    const button = cardElement.querySelector('.card__button') as HTMLButtonElement;
    if (button) {
        updatePreviewButton(item, button);
    }
    
    modal.content = cardElement;
    modalContainer.classList.add('modal_active');
});

// Обработчик добавления/удаления товара из корзины
events.on('preview:add-to-cart', (item: IProduct) => {
  if (basketModel.hasProduct(item.id)) {
    basketModel.delProduct(item.id);
  } else {
    basketModel.addProduct(item);
  }
  
  events.emit('modal:close');
});

// Обработчики событий корзины для обновления UI
events.on('basket:product:added', () => {
  updateBasketCounter();
  updateBasketView();
});

events.on('basket:product:removed', () => {
  updateBasketCounter();
  updateBasketView();
});

events.on('basket:cleared', () => {
  updateBasketCounter();
  updateBasketView();
});

// Обработчик открытия корзины
events.on('basket:open', (item) => {
  // Устанавливаем содержимое модального окна
    const basketElement = basketView.render(item);
    modal.content = basketElement;
    updateBasketView();
    modalContainer.classList.add('modal_active');
});

// Обработчик удаления товара из корзины
events.on('basket:remove', (item: IProduct) => {
  basketModel.delProduct(item.id);
});

// Обработчик оформления заказа
events.on('basket:order', () => {
  if (basketModel.getItemsCount() > 0) {
    events.emit('order:open');
    events.emit('modal:close');
  }
});

// Обработчики закрытия модальных окон ДУБЛИРОВАНИЕ
// events.on('basket:close', () => {
//   modalContainer.classList.remove('modal_active');
// });

events.on('modal:close', () => {
  modalContainer.classList.remove('modal_active');
});

// Закрытие по клику на оверлей
modalContainer.addEventListener('click', (event) => {
  if (event.target === modalContainer) {
    events.emit('modal:close');
  }
});

// // Закрытие по Escape ЭТОГО НЕТ В ТЗ!!!
// document.addEventListener('keydown', (event) => {
//   if (event.key === 'Escape') {
//     events.emit('modal:close');
//   }
// });








// Обработчик оформления заказа - открытие первой формы
events.on('basket:order', () => {
  if (basketModel.getItemsCount() > 0) {
    events.emit('order:open');
    events.emit('modal:close');
  }
});

// Обработчик открытия формы заказа
events.on('order:open', () => {
  // Восстанавливаем сохраненные данные покупателя
  const buyerData = buyerModel.getBuyerData();
  
  // Устанавливаем данные в форму через сеттеры
  orderForm.payment = buyerData.payment;
  orderForm.address = buyerData.address;
  
  const orderElement = orderForm.render();
  modal.content = orderElement;
  modalContainer.classList.add('modal_active');
  
  validateOrderForm();
});

// Обработчик изменения способа оплаты
events.on('order:payment:change', (data: { payment: 'card' | 'cash' }) => {
  // Сохраняем в модель покупателя
  const currentData = buyerModel.getBuyerData();
  buyerModel.saveOrderData({
    ...currentData,
    payment: data.payment
  });
  
  // Обновляем UI через сеттер
  orderForm.payment = data.payment;
  
  validateOrderForm();
});

// Обработчик изменения адреса
events.on('order:address:change', (data: { address: string }) => {
  // Сохраняем в модель покупателя
  const currentData = buyerModel.getBuyerData();
  buyerModel.saveOrderData({
    ...currentData,
    address: data.address
  });
  
  validateOrderForm();
});

// // Валидация формы заказа
// function validateOrderForm() {
//   const isValid = buyerModel.validationData();
//   const buyerData = buyerModel.getBuyerData();
  
//   const errors: string[] = [];
//   if (!buyerData.payment) errors.push('Выберите способ оплаты');
//   if (!buyerData.address.trim()) errors.push('Введите адрес доставки');
  
//   orderForm.errors = errors.join('; ');
//   orderForm.valid = isValid;
// }


//  Валидация формы заказа
function validateOrderForm() {
  const buyerData = buyerModel.getBuyerData();
  
  const isValid = !!buyerData.payment && 
                 !!buyerData.address && 
                 buyerData.address.trim() !== '';
  
  // Устанавливаем состояние кнопки через сеттер
  orderForm.valid = isValid;
  
  // Обрабатываем ошибки
  const errors: string[] = [];
  if (!buyerData.payment) errors.push('Выберите способ оплаты');
  if (!buyerData.address || buyerData.address.trim() === '') errors.push('Введите адрес доставки');
  orderForm.errors = errors.join('; ');
}












// Обработчик отправки формы заказа (переход ко второму этапу)
events.on('form:submit', () => {
  if (buyerModel.validationData()) {
    events.emit('contacts:open');
  } else {
    console.log('Данные невалидны, форма не отправляется');
    validateOrderForm(); // Перевалидируем чтобы показать ошибки
  }
});

// Обработчик открытия формы контактов (второй этап)
events.on('contacts:open', () => {
  // Восстанавливаем сохраненные данные покупателя
  const buyerData = buyerModel.getBuyerData();
  
  // Устанавливаем данные в форму
  contactsForm.email = buyerData.email;
  contactsForm.phone = buyerData.phone;
  
  const contactsElement = contactsForm.render();
  modal.content = contactsElement;
  
  // Валидируем форму
  validateContactsForm();
});

// Обработчик изменения ввода в форме контактов
events.on('contacts:input:change', (data: { email?: string; phone?: string }) => {
  // Сохраняем в модель покупателя
  const currentData = buyerModel.getBuyerData();
  buyerModel.saveOrderData({
    ...currentData,
    ...data
  });
  
  validateContactsForm();
});


//  Валидация формы заказа
function validateContactsForm() {
  const buyerData = buyerModel.getBuyerData();
  
  const isValid = buyerData.email.trim() !== '' && 
                 buyerData.phone.trim() !== '';
  
  
  
  // Обрабатываем ошибки
  const errors: string[] = [];
  if (buyerData.email.trim() === '') errors.push('Введите email');
  if (buyerData.phone.trim() === '') errors.push('Введите телефон');
  
  // Устанавливаем состояние кнопки и ошибки
  contactsForm.valid = isValid;
  contactsForm.errors = errors.join('; ');
}





// Обработчик отправки формы контактов (завершение заказа)
events.on('form:submit', async () => {
  if (buyerModel.validationData()) {
    try {
      const buyerData = buyerModel.getBuyerData();
      
      // Формируем данные для отправки
      const orderPayload = {
        payment: buyerData.payment,
        address: buyerData.address,
        email: buyerData.email,
        phone: buyerData.phone,
        items: basketModel.getArrayBasket().map(item => item.id),
        total: basketModel.getTotalPrice()
      };
      
      // Отправляем заказ на сервер
      const api = new ApiComposition(new Api(API_URL));
      const response = await api.post('/order', orderPayload);
      
      // Показываем успешное сообщение
      events.emit('order:success', response);
      
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      contactsForm.errors = 'Произошла ошибка при оформлении заказа. Попробуйте еще раз.';
    }
  }
});

// // Обработчик успешного оформления заказа
// events.on('order:success', (response: any) => {
//   // Очищаем корзину
//   basketModel.clearBasket();
  
//   // Очищаем данные покупателя
//   buyerModel.clearBuyerData();
  
//   /// Устанавливаем сумму заказа через сеттер
//   const total = response?.total || 0;
//   successView.price = `Списано ${total} синапсов`;

//   // Открываем модальное окно с подтверждением
//   events.emit('success:open', { total });
  
//   // // Рендерим компонент (без параметров)
//   // const successElement = successView.render();
//   // modal.content = successElement;
// });


// Обработчик успешного оформления заказа
events.on('order:success', (response: any) => {
  console.log('Заказ успешно оформлен:', response);
  
  // Очищаем корзину
  basketModel.clearBasket();
  
  // Очищаем данные покупателя
  buyerModel.clearBuyerData();
  
  // Открываем модальное окно с подтверждением
  events.emit('success:open', { 
    total: response?.total || 0 
  });
});



// Обработчик открытия модального окна успешного заказа
events.on('success:open', (data: { total: number }) => {
  
  // Устанавливаем цену через сеттер
  successView.price = `Списано ${data.total} синапсов`;
  
  // Рендерим компонент
  const successElement = successView.render();
  
  // Устанавливаем содержимое модального окна
  modal.content = successElement;
  modalContainer.classList.add('modal_active');
});




// Обработчик закрытия успешного сообщения
events.on('success:close', () => {
  events.emit('modal:close');
});

events.on('modal:close', () => {
  modalContainer.classList.remove('modal_active');
});







// Инициализация при загрузке
updateBasketCounter();
updateBasketView();
events.emit('catalog:changed');

