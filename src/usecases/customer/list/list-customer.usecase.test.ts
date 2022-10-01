import { faker } from "@faker-js/faker";
import { Sequelize } from "sequelize-typescript";
import { Address } from "../../../domain/customer/entities/address";
import { Customer } from "../../../domain/customer/entities/customer.entity";
import { CustomerModel } from "../../../infrastructure/customer/repositories/sequelize/customer.model";
import { CustomerRepository } from "../../../infrastructure/customer/repositories/sequelize/customer.repository";
import { ListCustomerUseCase } from "./list-customer.usecase";
import { InputListCustomerDto } from "./list-customer.usecase.dto";

const createAddressMock = () => {
  return new Address(
    faker.address.street(),
    faker.datatype.number(),
    faker.address.city(),
    faker.address.state(),
    faker.address.zipCode()
  );
};

const createCustomerMock = () => {
  const customer = new Customer(faker.datatype.uuid(), faker.name.fullName());
  const address = createAddressMock();
  customer.changeAddress(address);

  return customer;
};

describe("List customer use case integration test", () => {
  let sequilize: Sequelize;

  beforeEach(async () => {
    sequilize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: {
        force: true,
      },
    });

    sequilize.addModels([CustomerModel]);
    await sequilize.sync();
  });

  afterEach(async () => {
    await sequilize.close();
  });
  it("should list all customers", async () => {
    const customerRepository = new CustomerRepository();
    const listCustomerUseCase = new ListCustomerUseCase(customerRepository);
    const customer1 = createCustomerMock();
    const customer2 = createCustomerMock();

    await customerRepository.create(customer1);
    await customerRepository.create(customer2);

    const input: InputListCustomerDto = {};

    const output = await listCustomerUseCase.execute(input);

    expect(output).toEqual({
      customers: [customer1, customer2].map((item) => ({
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
    });
  });
});
