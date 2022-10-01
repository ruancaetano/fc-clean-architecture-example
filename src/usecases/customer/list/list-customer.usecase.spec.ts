import { faker } from "@faker-js/faker";
import { Address } from "../../../domain/customer/entities/address";
import { Customer } from "../../../domain/customer/entities/customer.entity";
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

const MockRepository = () => {
  const customers = [createCustomerMock(), createCustomerMock()];

  return {
    customers,
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(customers),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("List customer use case unit test", () => {
  it("should list all customers", async () => {
    const customerRepository = MockRepository();
    const listCustomerUseCase = new ListCustomerUseCase(customerRepository);
    const mockedCustomers = customerRepository.customers;

    const input: InputListCustomerDto = {};

    const output = await listCustomerUseCase.execute(input);

    expect(output).toEqual({
      customers: mockedCustomers.map((item) => ({
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
