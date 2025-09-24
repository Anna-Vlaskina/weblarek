import { IProduct } from '../../types/index.ts'
import { IEvents } from '../base/Events.ts';

export class Basket {
  arrayProducts: IProduct[];

  constructor(selectedProducts: IProduct[] = [], protected events: IEvents) {
    this.arrayProducts = selectedProducts;
    
    this.events.emit('basket:initialized', {
      products: this.getArrayBasket(),
      totalPrice: this.getTotalPrice(),
      itemsCount: this.getItemsCount()
    });
  }

  getArrayBasket(): IProduct[] {
    return [...this.arrayProducts];
  }

  addProduct(product: IProduct): IProduct[] {
    const oldProducts = this.getArrayBasket();
    this.arrayProducts = this.arrayProducts.concat(product);
    
    this.events.emit('basket:product:added', {
      product,
      products: this.getArrayBasket(),
      totalPrice: this.getTotalPrice(),
      itemsCount: this.getItemsCount(),
      oldProducts
    });

    return this.arrayProducts;
  }

  delProduct(id: string): IProduct[] {
    const oldProducts = this.getArrayBasket();
    const removedProduct = this.arrayProducts.find(item => item.id === id);
    
    this.arrayProducts = this.arrayProducts.filter(item => item.id !== id);
    
    if (removedProduct) {
      this.events.emit('basket:product:removed', {
        product: removedProduct,
        productId: id,
        products: this.getArrayBasket(),
        totalPrice: this.getTotalPrice(),
        itemsCount: this.getItemsCount(),
        oldProducts
      });
    }

    return this.arrayProducts;
  }
  
  clearBasket(): void {
    const oldProducts = this.getArrayBasket();
    
    this.arrayProducts = [];

    this.events.emit('basket:cleared', {
      oldProducts,
      products: this.getArrayBasket(),
      totalPrice: this.getTotalPrice(),
      itemsCount: this.getItemsCount()
    });
  }

  getTotalPrice(): number | null {
    const total = this.arrayProducts.reduce((total, product) => {
      return total + (product.price ?? 0);
    }, 0);
    
    return total;
  }

  getItemsCount(): number {
    return this.arrayProducts.length;
  }

  hasProduct(id: string): boolean {
    return this.arrayProducts.some(item => item.id === id);
  }
}