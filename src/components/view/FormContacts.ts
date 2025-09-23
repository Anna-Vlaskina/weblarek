import { IBuyer } from "../../types";
import { ensureAllElements } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form, TForm } from "./Form";


type TFormContacts = TForm & Pick<IBuyer, 'email' | 'phone'>;

//  FormContacts class - только сеттеры
export class FormContacts extends Form<TFormContacts> {
  protected titleLabelElement: HTMLSpanElement[];
  protected inputElement: HTMLInputElement[];

  constructor(container: HTMLFormElement, protected events: IEvents, private submitEvent: string = 'form:submit') {
    super(container, events);

    this.titleLabelElement = ensureAllElements<HTMLSpanElement>('.form__label', this.container);
    this.inputElement = ensureAllElements<HTMLInputElement>('.form__input', this.container);

    // this.inputElement.forEach((input) => {
    //   input.addEventListener('input', (event) => {
    //     event.preventDefault();
    //     const field = input.name as 'email' | 'phone';
    //     this.events?.emit('contacts:field:change', { 
    //       field,
    //       value: input.value 
    //     });
    //   });
    // });

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


    // Переопределяем обработчик submit
    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(this.submitEvent);
    });

  }

   // Сеттер для email
  set email(value: string) {
    const emailInput = this.inputElement.find(input => input.name === 'email');
    if (emailInput) emailInput.value = value;
  }

  // Сеттер для телефона
  set phone(value: string) {
    const phoneInput = this.inputElement.find(input => input.name === 'phone');
    if (phoneInput) phoneInput.value = value;
  }

  
}










// export class FormContacts extends Form {
//   protected titleLabelElement: HTMLSpanElement[];
//   protected inputElement: HTMLInputElement[];

//   constructor(container: HTMLFormElement, protected events: IEvents) {
//     super(container, events);

//     this.titleLabelElement = ensureAllElements<HTMLSpanElement>('.form__label', this.container);
//     this.inputElement = ensureAllElements<HTMLInputElement>('.form__input', this.container);

//     this.inputElement.forEach((input) => {
//       input.addEventListener('input', (event) => {
//         event.preventDefault();
//         this.events?.emit('input:change');
//       });
//     });
//   }
// }


