import { IProduct } from '../../types/index.ts'
import { IEvents } from '../base/Events.ts';

export class ProductCatalog {
  arrayProducts: IProduct[];
  cardProduct!: IProduct;

  constructor(initialProducts: IProduct[], protected events: IEvents) {
    this.events = events;
    this.arrayProducts = initialProducts;
  }

  setArrayProducts(arrayProducts: IProduct[]): void {
    const oldProducts = [...this.arrayProducts];
    this.arrayProducts = [...arrayProducts];
    
    this.events?.emit('products:changed', {
      oldProducts,
      newProducts: this.arrayProducts,
      action: 'replace'
    });
  }

  getArrayProducts(): IProduct[] {
    return [...this.arrayProducts];
  }

  getProduct(id: string): IProduct {
    const product = this.arrayProducts.find(item => item.id === id);
    
    if (!product) {
      throw new Error(`Товар с ID ${id} не найден`);
    }

    return {
      id: product.id,
      description: product.description,
      image: product.image,
      title: product.title,
      category: product.category,
      price: product.price
    };
  }

  setProductForDisplay(cardProduct: IProduct): void {
    const oldProduct = this.cardProduct ? { ...this.cardProduct } : undefined;
    this.cardProduct = { ...cardProduct };
    
    this.events.emit('product:display:changed', {
      oldProduct,
      newProduct: this.cardProduct
    });
  }

  getProductForDisplay(): IProduct { 
    return this.cardProduct; 
  }
}
