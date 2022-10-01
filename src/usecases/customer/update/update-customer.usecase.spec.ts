import { faker } from "@faker-js/faker";
import { Address } from "../../../domain/customer/entities/address";
import { Customer } from "../../../domain/customer/entities/customer.entity";
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

describe("Update customer use case unit test", () => {
  it("should update a customer", async () => {
    const customerRepository = MockRepository();
    const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);
    const mockedCustomer = customerRepository.customers[0];

    const input: InputUpdateCustomerDto = {
      id: mockedCustomer.id,
      name: `${mockedCustomer.name} updated`,
      address: {
        street: mockedCustomer.Address.street,
        number: mockedCustomer.Address.number,
        city: mockedCustomer.Address.city,
        state: mockedCustomer.Address.state,
        zipcode: mockedCustomer.Address.zipcode,
      },
    };

    const output = await updateCustomerUseCase.execute(input);

    expect(output).toEqual(input);
  });

  it("should throw an error when name is missing", async () => {
    const customerRepository = MockRepository();
    const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);
    const mockedCustomer = customerRepository.customers[0];

    const input = {
      address: {
        street: mockedCustomer.Address.street,
        number: mockedCustomer.Address.number,
        city: mockedCustomer.Address.city,
        state: mockedCustomer.Address.state,
        zipcode: mockedCustomer.Address.zipcode,
      },
    } as InputUpdateCustomerDto;

    expect(async () => {
      await updateCustomerUseCase.execute(input);
    }).rejects.toThrow("Name is required");
  });

  it("should throw an error when address is invalid", async () => {
    const customerRepository = MockRepository();
    const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);
    const mockedCustomer = customerRepository.customers[0];

    const input = {
      name: mockedCustomer.name,
      address: {
        street: "",
        number: mockedCustomer.Address.number,
        city: mockedCustomer.Address.city,
        state: mockedCustomer.Address.state,
        zipcode: mockedCustomer.Address.zipcode,
      },
    } as InputUpdateCustomerDto;

    expect(async () => {
      await updateCustomerUseCase.execute(input);
    }).rejects.toThrow("Street is required");
  });
});
