import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export type TCard = Pick<IProduct, 'title' | 'price'>

export abstract class Card<T extends TCard = TCard> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
  }

  set title(value: string) {
    this.setText(this.titleElement, value);
  }

  set price(value: number) {
    this.priceElement.textContent = String(value);
  }
}
