import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

interface IBasket {
  products: HTMLElement[],
  price: number
}

export class BasketView extends Component<IBasket> {
  protected titleElement: HTMLElement;
  productsElement: HTMLElement;
  basketButton: HTMLButtonElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.modal__title', this.container);
    this.productsElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);

    if (this.basketButton) {
      this.basketButton.addEventListener('click', () => {
        events.emit('order:open');
      });
    }
  }

  set products(items: HTMLElement[]) {
    this.productsElement.innerHTML = '';

    if (this.basketButton) {
      this.basketButton.disabled = items.length === 0;
    }
    
    if (items.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'basket__empty';
      emptyMessage.textContent = 'Корзина пуста';
      this.productsElement.appendChild(emptyMessage);
    } else {
      items.forEach(item => {
        this.productsElement.appendChild(item);
      });
    }
  }

  set price(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }
}