import { CustomerRespositoryInterface } from "../../../domain/customer/repositories/customer.repository";
import { CustomerRepository } from "../../../infrastructure/customer/repositories/sequelize/customer.repository";
import {
  InputFindCustomerDto,
  OutputFindCustomerDto,
} from "./find-customer.usecase.dto";

export class FindCustomerUseCase {
  constructor(private readonly repository: CustomerRespositoryInterface) {}

  async execute(input: InputFindCustomerDto): Promise<OutputFindCustomerDto> {
    const customer = await this.repository.find(input.id);

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
