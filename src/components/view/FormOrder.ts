import { IBuyer } from "../../types";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form, TForm} from "./Form";

type TFormOrder = TForm & Pick<IBuyer, 'payment' | 'address'>;



// FormOrder class - только сеттеры
export class FormOrder extends Form<TFormOrder> {
  protected titleForm: HTMLHeadingElement;
  protected buttonsForm: HTMLButtonElement[];
  protected titleLabelElement: HTMLSpanElement;
  protected inputElement: HTMLInputElement;

  constructor(container: HTMLFormElement, protected events: IEvents, private submitEvent: string = 'form:submit') {
    super(container, events);

    this.titleForm = ensureElement<HTMLHeadingElement>('.modal__title', this.container);
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

    // Переопределяем обработчик submit
    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(this.submitEvent);
    });

    // this.buttonsForm.forEach((button) => {
    //   button.addEventListener('click', (event) => {
    //     event.preventDefault();
    //     this.events?.emit('order:change');
    //   });
    // });

    // this.inputElement.addEventListener('input', (event) => {
    //   event.preventDefault();
    //   this.events?.emit('input:change');
    // });
  }

  // Сеттер для способа оплаты
 set payment(value: 'card' | 'cash' | '') {
    this.buttonsForm.forEach(button => {
      if (button.name === value) {
        button.classList.add('button_alt-active');
      } else {
        button.classList.remove('button_alt-active');
      }
    });
  }

  // Сеттер для адреса
  set address(value: string) {
    this.inputElement.value = value;
  }

  
}
















// export class FormOrder extends Form {
//   protected titleForm: HTMLHeadingElement;
//   protected buttonsForm: HTMLButtonElement[];
//   protected titleLabelElement: HTMLSpanElement;
//   protected inputElement: HTMLInputElement;

//   constructor(container: HTMLFormElement, protected events: IEvents) {
//     super(container, events);

//     this.titleForm = ensureElement<HTMLHeadingElement>('.modal__title', this.container);
//     this.buttonsForm = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);
//     this.titleLabelElement = ensureElement<HTMLSpanElement>('.form__label', this.container);
//     this.inputElement = ensureElement<HTMLInputElement>('.form__input', this.container);

//     this.buttonsForm.forEach((button) => {
//       button.addEventListener('click', (event) => {
//         event.preventDefault();
//         this.events?.emit('order:change');
//       });
//     });

//     this.inputElement.addEventListener('input', (event) => {
//       event.preventDefault();
//       this.events?.emit('input:change');
//     });
//   }

//   //  protected handleButtonClick(button: HTMLButtonElement, index: number): void {
//   //   console.log(`Клик по кнопке ${index}:`, button.textContent);
//   //   // Здесь можно добавить логику обработки клика
//   //   // Например, снять выделение с других кнопок и выделить текущую
//   //   this.toggleButtonSelection(button);
//   // }

//   //  protected toggleButtonSelection(selectedButton: HTMLButtonElement): void {
//   //   this.buttonsForm.forEach(button => {
//   //     if (button === selectedButton) {
//   //       button.classList.add('button_active'); // Добавляем класс для выделения
//   //     } else {
//   //       button.classList.remove('button_active'); // Убираем выделение с других
//   //     }
//   //   });
//   // }
// }


