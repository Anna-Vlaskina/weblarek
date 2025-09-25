import { IBuyer } from "../../types";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form, TForm} from "./Form";

type TFormOrder = TForm & Pick<IBuyer, 'payment' | 'address'>;

export class FormOrder extends Form<TFormOrder> {
  protected titleForm: HTMLHeadingElement;
  protected buttonsForm: HTMLButtonElement[];
  protected titleLabelElement: HTMLSpanElement;
  protected inputElement: HTMLInputElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events);

    this.titleForm = ensureElement<HTMLHeadingElement>('h2.modal__title', this.container);
    this.buttonsForm = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);
    this.titleLabelElement = ensureElement<HTMLSpanElement>('.form__label', this.container);
    this.inputElement = ensureElement<HTMLInputElement>('.form__input', this.container);

    this.buttonsForm.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      this.events?.emit('order:payment:change', { 
          payment: button.name as 'card' | 'cash' 
        });
      });
    });

    this.inputElement.addEventListener('input', (event) => {
      event.preventDefault();
      this.events?.emit('order:address:change', { 
        address: this.inputElement.value 
      });
    });
  }

 set payment(value: 'card' | 'cash' | '') {
    this.buttonsForm.forEach(button => {
      if (button.name === value) {
        button.classList.add('button_alt-active');
      } else {
        button.classList.remove('button_alt-active');
      }
    });
  }

  set address(value: string) {
    this.inputElement.value = value;
  }
}
