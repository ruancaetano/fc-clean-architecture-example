import { Product } from "../../../domain/product/entities/product.entity";
import { ProductRespositoryInterface } from "../../../domain/product/repositories/product.repository";
import {
  InputListProductDto,
  OutputListProductDto,
} from "./list-product.usecase.dto";

export class ListProductUseCase {
  constructor(private readonly repository: ProductRespositoryInterface) {}

  async execute(_: InputListProductDto): Promise<OutputListProductDto> {
    const products = await this.repository.findAll();
    return OutputMapper.toOuput(products);
  }
}

class OutputMapper {
  static toOuput(products: Product[]): OutputListProductDto {
    return {
      products: products.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
      })),
    };
  }
}
