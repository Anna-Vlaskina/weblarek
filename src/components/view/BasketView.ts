import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

interface IBasket {
  products: HTMLElement[],
  prise: string
}

export class BasketView extends Component<IBasket> {
  protected titleElement: HTMLElement;
  productsElement: HTMLElement;
  basketButton: HTMLButtonElement;
  protected priseElement: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.modal__title', this.container);
    this.productsElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.priseElement = ensureElement<HTMLElement>('.basket__price', this.container);

    if (this.basketButton) {
      this.basketButton.addEventListener('click', () => {
        events.emit('order:open');
      });
    }
  }

  set products(items: HTMLElement[]) {
    this.productsElement.innerHTML = '';
    items.forEach(item => {
      this.productsElement.appendChild(item);
    });
  }

  set prise(value: string) {
    this.priseElement.textContent = value;
  }
}