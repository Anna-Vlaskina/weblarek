import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModal {
  content: HTMLElement
}

export class Modal extends Component<IModal> {
  protected modalButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(container: HTMLElement, protected events?: IEvents) {
    super(container);

    this.modalButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);

    this.modalButton.addEventListener('click', () => {
      this.events?.emit('modal:close');
    });
  }

  set content(element: HTMLElement) {
    this.contentElement.innerHTML = '';
    this.contentElement.appendChild(element);
  }
}
