import { Customer } from "../../../domain/customer/entities/customer.entity";

import { CustomerRespositoryInterface } from "../../../domain/customer/repositories/customer.repository";
import {
  InputListCustomerDto,
  OutputListCustomerDto,
} from "./list-customer.usecase.dto";

export class ListCustomerUseCase {
  constructor(private readonly repository: CustomerRespositoryInterface) {}

  async execute(_: InputListCustomerDto): Promise<OutputListCustomerDto> {
    const customers = await this.repository.findAll();
    return OutputMapper.toOuput(customers);
  }
}

class OutputMapper {
  static toOuput(customers: Customer[]): OutputListCustomerDto {
    return {
      customers: customers.map((item) => ({
        id: item.id,
        name: item.name,
        address: {
          street: item.Address.street,
          number: item.Address.number,
          city: item.Address.city,
          state: item.Address.state,
          zipcode: item.Address.zipcode,
        },
      })),
    };
  }
}
