import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

type TOrderSuccess = Pick<IProduct, 'price'>;

export class OrderSuccess extends Component<TOrderSuccess> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected successButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.order-success__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.successButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this.successButton.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  set price(value: string) {
    this.priceElement.textContent = value;
  }
}
