import { Address } from "../../../domain/customer/entities/address";
import { CustomerFactory } from "../../../domain/customer/factories/customer.factory";

import { CustomerRespositoryInterface } from "../../../domain/customer/repositories/customer.repository";
import {
  InputCreateCustomerDto,
  OutputCreateCustomerDto,
} from "./create-customer.usecase.dto";

export class CreateCustomerUseCase {
  constructor(private readonly repository: CustomerRespositoryInterface) {}

  async execute(
    input: InputCreateCustomerDto
  ): Promise<OutputCreateCustomerDto> {
    const customer = CustomerFactory.createWithAddress(
      input.name,
      new Address(
        input.address.street,
        input.address.number,
        input.address.city,
        input.address.state,
        input.address.zipcode
      )
    );

    await this.repository.create(customer);

    return {
      id: customer.id,
      name: customer.name,
      address: {
        street: customer.Address.street,
        number: customer.Address.number,
        city: customer.Address.city,
        state: customer.Address.state,
        zipcode: customer.Address.zipcode,
      },
    };
  }
}
