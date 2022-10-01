import { ProductRespositoryInterface } from "../../../domain/product/repositories/product.repository";

import {
  InputUpdateProductDto,
  OutputUpdateProductDto,
} from "./update-product.usecase.dto";

export class UpdateProductUseCase {
  constructor(private readonly repository: ProductRespositoryInterface) {}

  async execute(input: InputUpdateProductDto): Promise<OutputUpdateProductDto> {
    const product = await this.repository.find(input.id);

    product.changeName(input.name);
    product.changePrice(input.price);

    await this.repository.update(product);

    return {
      id: product.id,
      name: product.name,
      price: product.price,
    };
  }
}
