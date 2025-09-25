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
    
    this.events.emit('buyer:initialized', {
      buyerData: this.getBuyerData()
    });
  }

  saveOrderData(buyerData: IBuyer): void {
    const oldData = this.getBuyerData();
    
    this.payment = buyerData.payment;
    this.email = buyerData.email || '';
    this.phone = buyerData.phone || '';
    this.address = buyerData.address;

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

    this.events.emit('buyer:data:cleared', {
      oldData,
      newData: this.getBuyerData()
    });
  }

   validateOrder(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!this.payment) errors.push('Выберите способ оплаты');
    if (!this.address?.trim()) errors.push('Введите адрес доставки');
    
    const isValid = errors.length === 0;
    
    this.events.emit('buyer:validation:checked:order', {
      isValid,
      buyerData: this.getBuyerData(),
      validationDetails: {
        hasPayment: !!this.payment,
        hasAddress: !!this.address.trim()
      }
    });
    
    return { isValid, errors };
  }

   validateContacts(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!this.email?.trim()) errors.push('Введите email');
    if (!this.phone?.trim()) errors.push('Введите телефон');
    
    const isValid = errors.length === 0;
    
    this.events.emit('buyer:validation:checked:contacts', {
      isValid,
      buyerData: this.getBuyerData(),
      validationDetails: {
        hasEmail: !!this.email.trim(),
        hasPhone: !!this.phone.trim()
      }
    });
    
    return { isValid, errors };
  }

  private getChangedFields(oldData: IBuyer, newData: IBuyer): string[] {
      const changedFields: string[] = [];
      
      if (oldData.payment !== newData.payment) changedFields.push('payment');
      if (oldData.email !== newData.email) changedFields.push('email');
      if (oldData.phone !== newData.phone) changedFields.push('phone');
      if (oldData.address !== newData.address) changedFields.push('address');
      
      return changedFields;
  }
}
