import { ProductFactory } from "../../../domain/product/factories/product.factory";

import { ProductRespositoryInterface } from "../../../domain/product/repositories/product.repository";
import {
  InputCreateProductDto,
  OutputCreateProductDto,
} from "./create-product.usecase.dto";

export class CreateProductUseCase {
  constructor(private readonly repository: ProductRespositoryInterface) {}

  async execute(input: InputCreateProductDto): Promise<OutputCreateProductDto> {
    const product = ProductFactory.create(input.name, input.price);

    await this.repository.create(product);

    return {
      id: product.id,
      name: product.name,
      price: product.price,
    };
  }
}
