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
      this.close();
    });

    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  set content(element: HTMLElement) {
    this.contentElement.innerHTML = '';
    this.contentElement.appendChild(element);
  }

  open(): void {
    this.container.classList.add('modal_active');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this.events?.emit('modal:close');
  }

   openWithContent(element: HTMLElement): void {
    this.content = element;
    this.open();
  }
}
