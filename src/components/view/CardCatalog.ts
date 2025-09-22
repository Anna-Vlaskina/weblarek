import { ICardActions, IProduct } from "../../types";
import { categoryMap, CDN_URL } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { TCard, Card } from "./Card";

type CategoryKey = keyof typeof categoryMap;

type TCardCatalog = TCard & Pick<IProduct, 'image' | 'category' | 'title' | 'price'>;

export class CardCatalog extends Card<TCardCatalog> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
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
}











// export class CardCatalog extends Card {
//   protected categoryElement: HTMLElement;
//   protected imageElement: HTMLImageElement;
  
//   constructor(container: HTMLElement, 
//     // actions?: ICardActions
//   ) {
//     super(container);

//     this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
//     this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

//     // if (actions?.onClick) {
//     //   this.container.addEventListener('click', actions.onClick);
//     // }
//   }

//   set category(value: string) {
//     this.categoryElement.textContent = value;
//   }

//   set image(value: string) {
//     this.setImage(this.imageElement, value, this.title);
//   }
// }