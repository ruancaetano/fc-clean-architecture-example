import { faker } from "@faker-js/faker";
import { Address } from "../../../domain/customer/entities/address";
import { Customer } from "../../../domain/customer/entities/customer.entity";
import { CreateCustomerUseCase } from "./create-customer.usecase";
import { InputCreateCustomerDto } from "./create-customer.usecase.dto";

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
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn().mockReturnValue(Promise.resolve(customer)),
    update: jest.fn(),
  };
};

describe("Creacte customer use case unit test", () => {
  it("should create a customer", async () => {
    const customerRepository = MockRepository();
    const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
    const mockedCustomer = customerRepository.customers[0];

    const input: InputCreateCustomerDto = {
      name: mockedCustomer.name,
      address: {
        street: mockedCustomer.Address.street,
        number: mockedCustomer.Address.number,
        city: mockedCustomer.Address.city,
        state: mockedCustomer.Address.state,
        zipcode: mockedCustomer.Address.zipcode,
      },
    };

    const output = await createCustomerUseCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      ...input,
    });
  });

  it("should throw an error when name is missing", async () => {
    const customerRepository = MockRepository();
    const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
    const mockedCustomer = customerRepository.customers[0];

    const input = {
      address: {
        street: mockedCustomer.Address.street,
        number: mockedCustomer.Address.number,
        city: mockedCustomer.Address.city,
        state: mockedCustomer.Address.state,
        zipcode: mockedCustomer.Address.zipcode,
      },
    } as InputCreateCustomerDto;

    expect(async () => {
      await createCustomerUseCase.execute(input);
    }).rejects.toThrow("Name is required");
  });

  it("should throw an error when address is invalid", async () => {
    const customerRepository = MockRepository();
    const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
    const mockedCustomer = customerRepository.customers[0];

    const input = {
      name: mockedCustomer.name,
      address: {
        street: '',
        number: mockedCustomer.Address.number,
        city: mockedCustomer.Address.city,
        state: mockedCustomer.Address.state,
        zipcode: mockedCustomer.Address.zipcode,
      },
    } as InputCreateCustomerDto;

    expect(async () => {
      await createCustomerUseCase.execute(input);
    }).rejects.toThrow("Street is required");
  });
});
