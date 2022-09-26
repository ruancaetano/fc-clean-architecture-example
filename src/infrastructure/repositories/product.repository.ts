import { Product } from "../../domain/entities/product.entity";
import { ProductRespositoryInterface } from "../../domain/repositories/product.repository";
import { ProductModel } from "../db/sequelize/models/product.model";

export class ProductRepository implements ProductRespositoryInterface {
  async create(entity: Product): Promise<void> {
    await ProductModel.create({
      id: entity.id,
      name: entity.name,
      price: entity.price,
    });
  }

  async update(entity: Product): Promise<void> {
    await ProductModel.update(
      { name: entity.name, price: entity.price },
      {
        where: { id: entity.id },
      }
    );
  }

  async find(id: string): Promise<Product> {
    const foundProduct = await ProductModel.findOne({
      where: { id },
    });

    if (!foundProduct) {
      throw new Error("Product not found");
    }

    return new Product(foundProduct.id, foundProduct.name, foundProduct.price);
  }

  async findAll(): Promise<Product[]> {
    const foundProducts = await ProductModel.findAll();

    return foundProducts.map((product) => {
      return new Product(product.id, product.name, product.price);
    });
  }
}
