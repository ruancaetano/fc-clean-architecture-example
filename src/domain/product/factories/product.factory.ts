import { v4 as uuid } from "uuid";
import { Product } from "../entities/product.entity";
import { ProductInterface } from "../entities/product.interface";

export class ProductFactory {
  static create(name: string, price: number): ProductInterface {
    return new Product(uuid(), name, price);
  }
}
