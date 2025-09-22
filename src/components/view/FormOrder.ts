// import { IBuyer } from "../../types";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form} from "./Form";

// type TFormOrder = TForm & Pick<IBuyer, >

export abstract class FormOrder extends Form {
  protected titleForm: HTMLHeadingElement;
  protected buttonsForm: HTMLButtonElement[];
  protected titleLabelElement: HTMLSpanElement;
  protected inputElement: HTMLInputElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events);

    this.titleForm = ensureElement<HTMLHeadingElement>('.modal__title', this.container);
    this.buttonsForm = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);
    this.titleLabelElement = ensureElement<HTMLSpanElement>('.form__label', this.container);
    this.inputElement = ensureElement<HTMLInputElement>('.form__input', this.container);

    this.buttonsForm.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        this.events?.emit('order:change');
      });
    });

    this.inputElement.addEventListener('input', (event) => {
      event.preventDefault();
      this.events?.emit('input:change');
    });
  }

  //  protected handleButtonClick(button: HTMLButtonElement, index: number): void {
  //   console.log(`Клик по кнопке ${index}:`, button.textContent);
  //   // Здесь можно добавить логику обработки клика
  //   // Например, снять выделение с других кнопок и выделить текущую
  //   this.toggleButtonSelection(button);
  // }

  //  protected toggleButtonSelection(selectedButton: HTMLButtonElement): void {
  //   this.buttonsForm.forEach(button => {
  //     if (button === selectedButton) {
  //       button.classList.add('button_active'); // Добавляем класс для выделения
  //     } else {
  //       button.classList.remove('button_active'); // Убираем выделение с других
  //     }
  //   });
  // }
}


