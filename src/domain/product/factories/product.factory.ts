import { v4 as uuid } from "uuid";
import { Product } from "../entities/product.entity";

export class ProductFactory {
  static create(name: string, price: number): Product {
    return new Product(uuid(), name, price);
  }
}
