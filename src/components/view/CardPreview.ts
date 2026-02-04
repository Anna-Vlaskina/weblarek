import { ICardActions, IProduct } from "../../types";
import { categoryMap, CDN_URL } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { TCard, Card } from "./Card";

type CategoryKey = keyof typeof categoryMap;

export type TCardPreview = TCard & Pick<IProduct, 'image' | 'category' | 'description'>;

export class CardPreview extends Card<TCardPreview> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLParagraphElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.descriptionElement = ensureElement<HTMLParagraphElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (actions?.onClick) {
      this.buttonElement.addEventListener('click', actions.onClick);
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
  
    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(categoryMap[key as CategoryKey], key === value);
    }
  }
  
  set image(value: string) {
    const fullImageUrl = `${CDN_URL}${value}`;
    this.setImage(this.imageElement, fullImageUrl, this.title);
  }

  set description(value: string) {
    this.setText(this.descriptionElement, value)
  }

  updateButtonState(isInBasket: boolean, hasPrice: boolean) {
    if (!hasPrice) {
      this.buttonElement.textContent = 'Недоступно';
      this.buttonElement.disabled = true;
    } else if (isInBasket) {
      this.buttonElement.textContent = 'Удалить из корзины';
      this.buttonElement.disabled = false;
    } else {
      this.buttonElement.textContent = 'Купить';
      this.buttonElement.disabled = false;
    }
  }
}
