import { IProduct } from '../../types/index.ts'

export class Basket {
  arrayProducts: IProduct[];

  constructor(selectedProducts: IProduct[] = []) {
    this.arrayProducts = selectedProducts;
  }

  getArrayBasket(): IProduct[] {
    return [...this.arrayProducts];
  }

  addProduct(product: IProduct): IProduct[] {
    return this.arrayProducts.concat(product);
  }

  delProduct(id: string): IProduct[] {
    this.arrayProducts = this.arrayProducts.filter(item => item.id !== id);
    return this.arrayProducts;
  }
  
  clearBasket(): void {
    this.arrayProducts = [];
  }

  getTotalPrice(): number | null {
    return this.arrayProducts.reduce((total, product) => {
        return total + (product.price ?? 0);
    }, 0);
  }

  getItemsCount(): number {
    return this.arrayProducts.length;
  }

  hasProduct(id: string): boolean {
    return this.arrayProducts.some(item => item.id === id)
  }
}
