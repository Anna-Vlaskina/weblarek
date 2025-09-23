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
  
  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);
    
    this.submitElement = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit('form:submit');
    });



    // Дополнительный обработчик нажатия на кнопку
    this.submitElement.addEventListener('click', (event) => {
      event.preventDefault();
        this.events.emit('contacts:open');
    });
  }


  

  set errors(value: string) {
    this.setText(this.errorsElement, value);
  }


  // // Сеттер для валидности формы
  // set valid(value: boolean) {
  //   this.submitElement.disabled = !value;
  // }

  set valid(value: boolean) {
    if (value) {
      // Убираем disabled - кнопка активна
      this.submitElement.removeAttribute('disabled');
    } else {
      // Добавляем disabled - кнопка неактивна
      this.submitElement.setAttribute('disabled', 'disabled');
    }
  }

}