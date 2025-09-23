import { ICardActions } from "../../types";
import { ensureElement } from "../../utils/utils";
import { TCard, Card } from "./Card";

type TCardBasket = TCard & {
  index: number
}

export class CardBasket extends Card<TCardBasket> {
  protected indexElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if (actions?.onClick) {
      this.buttonElement.addEventListener('click', actions.onClick);
    }
  }

  set index(value: number) {
    this.setText(this.indexElement, String(value));
  }
}

