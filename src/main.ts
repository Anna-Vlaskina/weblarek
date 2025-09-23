import './scss/styles.scss';

import { IProduct, IProductResponse } from './types/index';
import { ProductCatalog } from './components/models/ProductCatalog'
import { Basket } from './components/models/Basket'
// import { Buyer } from './components/models/Buyer'
import { Api } from './components/base/Api'
import { ApiComposition } from './components/connection/ApiComposition'
import { API_URL } from './utils/constants'
import { CardCatalog } from './components/view/CardCatalog';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { Modal } from './components/view/Modal';
// import { OrderSuccess } from './components/view/OrderSuccess';
import { EventEmitter } from './components/base/Events';
import { CardPreview } from './components/view/CardPreview';
import { BasketView } from './components/view/BasketView';
import { CardBasket } from './components/view/CardBasket';

const events = new EventEmitter();

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const headerContainer = ensureElement<HTMLElement>('.header');
const galleryContainer = ensureElement<HTMLElement>('.page__wrapper');
const modalContainer = ensureElement<HTMLElement>('.modal');
// const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
// const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
// const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');


const gallery = new Gallery(galleryContainer);
const modal = new Modal(modalContainer, events);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const basketModel = new Basket([], events);


const productCatalog = new ProductCatalog((await new ApiComposition(new Api(API_URL)).get<IProductResponse>('/product/')).items, events);
const productsArray = productCatalog.getArrayProducts();
console.log(productsArray);

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

// Обработчики закрытия модальных окон
events.on('basket:close', () => {
  modalContainer.classList.remove('modal_active');
});

events.on('modal:close', () => {
  modalContainer.classList.remove('modal_active');
});

// Закрытие по клику на оверлей
modalContainer.addEventListener('click', (event) => {
  if (event.target === modalContainer) {
    events.emit('modal:close');
  }
});

// Закрытие по Escape
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    events.emit('modal:close');
  }
});

// Инициализация при загрузке
updateBasketCounter();
updateBasketView();
events.emit('catalog:changed');