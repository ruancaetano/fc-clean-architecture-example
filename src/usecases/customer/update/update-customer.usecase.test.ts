import { faker } from "@faker-js/faker";
import { Sequelize } from "sequelize-typescript";
import { Address } from "../../../domain/customer/entities/address";
import { Customer } from "../../../domain/customer/entities/customer.entity";
import { CustomerModel } from "../../../infrastructure/customer/repositories/sequelize/customer.model";
import { CustomerRepository } from "../../../infrastructure/customer/repositories/sequelize/customer.repository";
import { UpdateCustomerUseCase } from "./update-customer.usecase";
import { InputUpdateCustomerDto } from "./update-customer.usecase.dto";

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

describe("Update customer use case integration test", () => {
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
  it("should update a customer", async () => {
    const customerRepository = new CustomerRepository();
    const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);

    const customer = createCustomerMock();
    await customerRepository.create(customer);

    const input: InputUpdateCustomerDto = {
      id: customer.id,
      name: `${customer.name} updated`,
      address: {
        street: customer.Address.street,
        number: customer.Address.number,
        city: customer.Address.city,
        state: customer.Address.state,
        zipcode: customer.Address.zipcode,
      },
    };

    const output = await updateCustomerUseCase.execute(input);

    expect(output).toEqual(input);
  });

  it("should throw an error when name is missing", async () => {
    const customerRepository = new CustomerRepository();
    const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);

    const customer = createCustomerMock();
    await customerRepository.create(customer);

    const input = {
      id: customer.id,
      name: "",
      address: {
        street: customer.Address.street,
        number: customer.Address.number,
        city: customer.Address.city,
        state: customer.Address.state,
        zipcode: customer.Address.zipcode,
      },
    } as InputUpdateCustomerDto;

    await expect(async () => {
      await updateCustomerUseCase.execute(input);
    }).rejects.toThrow("Name is required");
  });

  it("should throw an error when address is invalid", async () => {
    const customerRepository = new CustomerRepository();
    const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);

    const customer = createCustomerMock();
    await customerRepository.create(customer);

    const input = {
      id: customer.id,
      name: customer.name,
      address: {
        street: "",
        number: customer.Address.number,
        city: customer.Address.city,
        state: customer.Address.state,
        zipcode: customer.Address.zipcode,
      },
    } as InputUpdateCustomerDto;

    await expect(async () => {
      await updateCustomerUseCase.execute(input);
    }).rejects.toThrow("Street is required");
  });
});
