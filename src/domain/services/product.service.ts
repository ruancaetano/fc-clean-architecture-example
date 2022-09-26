import { Product } from "../entities/product";

export class ProductService {

    static increasePrice(products: Product[], percentage: number): void {
        products.forEach(product => {
            product.changePrice(product.price + (product.price * percentage / 100));
        });
    }
}