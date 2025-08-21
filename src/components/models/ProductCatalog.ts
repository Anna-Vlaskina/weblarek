import { IProduct } from '../../types/index.ts'

export class ProductCatalog {
  arrayProducts: IProduct[];
  cardProduct!: IProduct;

  constructor(initialProducts: IProduct[]) {
    this.arrayProducts = initialProducts;
  }

  setArrayProducts(arrayProducts: IProduct[]): void {
    this.arrayProducts = [...arrayProducts];
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
    this.cardProduct = { ...cardProduct };
  }

  getProductForDisplay(id: string): IProduct { 
    const product = this.arrayProducts.find(item => item.id === id);

    if (!product) { 
      throw new Error(`Товар с ID ${id} не найден`);
    }

    return product; 
  }
}