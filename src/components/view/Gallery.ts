import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IGallery {
  catalog: HTMLElement[]
}

export class Gallery extends Component<IGallery> {
  protected catalogElement: HTMLElement;

  constructor(container: HTMLElement, protected events?: IEvents) {
    super(container);

    this.catalogElement = ensureElement<HTMLElement>('.gallery', this.container);

    this.container.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.closest('.gallery__item') || target.closest('.gallery')) {
        this.events?.emit('gallery:open');
      }
    });
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.innerHTML = '';
    items.forEach(item => {
      this.catalogElement.appendChild(item);
    });
  }
}