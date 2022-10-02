import { ValidatorInterface } from "../../@shared/validators/validator.interface";
import { Customer } from "../entities/customer.entity";
import { CustomerValidator } from "../validators/customer.validator";

export class CustomerValidatorFactory {
  static create(): ValidatorInterface<Customer> {
    return new CustomerValidator();
  }
}
