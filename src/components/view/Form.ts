import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export type TForm = {
  valid: boolean,
  errors: string
}

export abstract class Form<T extends TForm> extends Component<T> {
  protected submitElement: HTMLButtonElement;
  protected errorsElement: HTMLElement;
  
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    
    this.submitElement = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit(`${this.container.getAttribute('name')}:form:submit`);
    });
  }

  set errors(value: string) {
    this.setText(this.errorsElement, value);
  }

  set valid(isValid: boolean) {
    this.submitElement.disabled = !isValid;
  }
}
