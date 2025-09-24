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
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.innerHTML = '';
    items.forEach(item => {
      this.catalogElement.appendChild(item);
    });
  }
}
