import { ValidatorInterface } from "../../@shared/validators/validator.interface";
import { Product } from "../entities/product.entity";
import { ProductValidator } from "../validators/product.validator";

export class ProductValidatorFactory {
  static create(): ValidatorInterface<Product> {
    return new ProductValidator();
  }
}
