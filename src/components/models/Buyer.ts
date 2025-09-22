import { IBuyer } from '../../types/index.ts'
import { IEvents } from '../base/Events.ts';

export class Buyer implements IBuyer {
  payment: 'card' | 'cash' | '';
  email: string;
  phone: string;
  address: string;

  constructor(buyerData: IBuyer, protected events: IEvents) {
    this.payment = buyerData.payment;
    this.email = buyerData.email;
    this.phone = buyerData.phone;
    this.address = buyerData.address;
    
    // Генерируем событие инициализации покупателя
    this.events.emit('buyer:initialized', {
      buyerData: this.getBuyerData()
    });
  }

  saveOrderData(buyerData: IBuyer): void {
    const oldData = this.getBuyerData();
    
    this.payment = buyerData.payment;
    this.email = buyerData.email;
    this.phone = buyerData.phone;
    this.address = buyerData.address;

    // Генерируем событие сохранения данных покупателя
    this.events.emit('buyer:data:saved', {
      oldData,
      newData: this.getBuyerData(),
      changes: this.getChangedFields(oldData, buyerData)
    });
  }

  getBuyerData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    }
  }

  clearBuyerData(): void {
    const oldData = this.getBuyerData();
    
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';

    // Генерируем событие очистки данных покупателя
    this.events.emit('buyer:data:cleared', {
      oldData,
      newData: this.getBuyerData()
    });
  }

  validationData(): boolean {
    const isValid = !!(this.payment && 
                      this.email.trim() && 
                      this.phone.trim() && 
                      this.address.trim());

    // Генерируем событие валидации
    this.events.emit('buyer:validation:checked', {
      isValid,
      buyerData: this.getBuyerData(),
      validationDetails: {
        hasPayment: !!this.payment,
        hasEmail: !!this.email.trim(),
        hasPhone: !!this.phone.trim(),
        hasAddress: !!this.address.trim()
      }
    });

    return isValid;
  }


  

  // Вспомогательный метод для определения измененных полей
  private getChangedFields(oldData: IBuyer, newData: IBuyer): string[] {
    const changedFields: string[] = [];
    
    if (oldData.payment !== newData.payment) changedFields.push('payment');
    if (oldData.email !== newData.email) changedFields.push('email');
    if (oldData.phone !== newData.phone) changedFields.push('phone');
    if (oldData.address !== newData.address) changedFields.push('address');
    
    return changedFields;
  }


}







































// export class Buyer implements IBuyer {
//   payment: 'card' | 'cash' | '';
//   email: string;
//   phone: string;
//   address: string;

//   constructor(buyerData: IBuyer) {
//     this.payment = buyerData.payment;
//     this.email = buyerData.email;
//     this.phone = buyerData.phone;
//     this.address = buyerData.address;
//   }

//   saveOrderData(buyerData: IBuyer): void {
//     this.payment = buyerData.payment;
//     this.email = buyerData.email;
//     this.phone = buyerData.phone;
//     this.address = buyerData.address;
//   }

//   getBuyerData(): IBuyer {
//     return {
//       payment: this.payment,
//       email: this.email,
//       phone: this.phone,
//       address: this.address
//     }
//   }

//   clearBuyerData(): void {
//     this.payment = '';
//     this.email = '';
//     this.phone = '';
//     this.address = '';
//   }

//   validationData(): boolean {
//     if(!this.payment) {
//       return false;
//     }
//     if(!this.email.trim()) {
//       return false;
//     }
//     if(!this.phone.trim()) {
//       return false;
//     }
//     if(!this.address.trim()) {
//       return false;
//     }
//     return true;
//   }
// }
