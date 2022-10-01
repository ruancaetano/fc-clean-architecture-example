import { ProductRespositoryInterface } from "../../../domain/product/repositories/product.repository";
import {
  InputFindProductDto,
  OutputFindProductDto,
} from "./find-product.usecase.dto";

export class FindProductUseCase {
  constructor(private readonly repository: ProductRespositoryInterface) {}

  async execute(input: InputFindProductDto): Promise<OutputFindProductDto> {
    const product = await this.repository.find(input.id);

    return {
      id: product.id,
      name: product.name,
      price: product.price,
    };
  }
}
