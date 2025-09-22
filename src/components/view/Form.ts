import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export type TForm = {
  errors: string
}

export abstract class Form extends Component<TForm> {
  protected submitElement: HTMLButtonElement;
  protected errorsElement: HTMLElement;
  
  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);
    
    this.submitElement = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit('form:submit');
    });
  }

  set errors(value: string) {
    this.setText(this.errorsElement, value);
  }
}