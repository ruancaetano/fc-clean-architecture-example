import { v4 as uuid } from "uuid";
import { Address } from "../entities/address";
import { Customer } from "../entities/customer.entity";

export class CustomerFactory {
  static create(name: string): Customer {
    return new Customer(uuid(), name);
  }

  static createWithAddress(name: string, address: Address): Customer {
    const customer = new Customer(uuid(), name);

    customer.changeAddress(address);

    return customer;
  }
}
