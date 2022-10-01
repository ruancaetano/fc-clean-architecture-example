import { faker } from "@faker-js/faker";
import { Sequelize } from "sequelize-typescript";
import { Address } from "../../../domain/customer/entities/address";
import { Customer } from "../../../domain/customer/entities/customer.entity";
import { CustomerModel } from "../../../infrastructure/customer/repositories/sequelize/customer.model";
import { CustomerRepository } from "../../../infrastructure/customer/repositories/sequelize/customer.repository";
import { InputFindCustomerDto } from "./find-customer.usecase.dto";
import { FindCustomerUseCase } from "./find-customer.usecase";

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

const MockRepository = () => {
  const customer = createCustomerMock();

  return {
    customers: [customer],
    find: jest.fn().mockReturnValue(Promise.resolve(customer)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};
describe("Find Customer use case", () => {
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

  it("should find a customer", async () => {
    const mockCustomerRespository = MockRepository();

    const customer = mockCustomerRespository.customers[0];

    const input: InputFindCustomerDto = {
      id: customer.id,
    };

    const output = await new FindCustomerUseCase(
      mockCustomerRespository
    ).execute(input);

    expect(output).toEqual({
      id: customer.id,
      name: customer.name,
      address: {
        street: customer.Address.street,
        number: customer.Address.number,
        city: customer.Address.city,
        state: customer.Address.state,
        zipcode: customer.Address.zipcode,
      },
    });
  });

  it("should not find a customer", async () => {
    const mockCustomerRespository = MockRepository();
    mockCustomerRespository.find.mockImplementationOnce(() => {
      throw new Error("Customer not found");
    });
    const input: InputFindCustomerDto = {
      id: "invalid",
    };

    await expect(async () => {
      await new FindCustomerUseCase(mockCustomerRespository).execute(input);
    }).rejects.toThrow("Customer not found");
  });
});
