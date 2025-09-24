import { IBuyer } from "../../types";
import { ensureAllElements } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form, TForm } from "./Form";

type TFormContacts = TForm & Pick<IBuyer, 'email' | 'phone'>;

export class FormContacts extends Form<TFormContacts> {
  protected titleLabelElement: HTMLSpanElement[];
  protected inputElement: HTMLInputElement[];

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events);

    this.titleLabelElement = ensureAllElements<HTMLSpanElement>('.form__label', this.container);
    this.inputElement = ensureAllElements<HTMLInputElement>('.form__input', this.container);

    
    this.inputElement.forEach((input) => {
      input.addEventListener('input', (event) => {
        event.preventDefault();
        console.log('Input change:', input.name, input.value);
        
        const data: { email?: string; phone?: string } = {};
        if (input.name === 'email') data.email = input.value;
        if (input.name === 'phone') data.phone = input.value;
        
        this.events?.emit('contacts:input:change', data);
      });
    });

  }

  set email(value: string) {
    const emailInput = this.inputElement.find(input => input.name === 'email');
    if (emailInput) emailInput.value = value;
  }

  set phone(value: string) {
    const phoneInput = this.inputElement.find(input => input.name === 'phone');
    if (phoneInput) phoneInput.value = value;
  }
}
