import { ensureAllElements } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";


export abstract class FormContacts extends Form {
  protected titleLabelElement: HTMLSpanElement[];
  protected inputElement: HTMLInputElement[];

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events);

    this.titleLabelElement = ensureAllElements<HTMLSpanElement>('.form__label', this.container);
    this.inputElement = ensureAllElements<HTMLInputElement>('.form__input', this.container);

    this.inputElement.forEach((input) => {
      input.addEventListener('input', (event) => {
        event.preventDefault();
        this.events?.emit('input:change');
      });
    });
  }
}


