import { Sequelize } from "sequelize-typescript";
import { faker } from "@faker-js/faker";

import { Address } from "../../../../domain/customer/entities/address";
import { Customer } from "../../../../domain/customer/entities/customer.entity";
import { CustomerModel } from "./customer.model";
import { CustomerRepository } from "./customer.repository";

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

const mapCustomerEntityToModel = (entity: Customer): CustomerModel => {
  return {
    id: entity.id,
    active: entity.active || false,
    name: entity.name,
    rewardPoints: entity.rewardPoints || 0,
    street: entity.Address.street,
    number: entity.Address.number,
    city: entity.Address.city,
    state: entity.Address.state,
    zipcode: entity.Address.zipcode,
  } as CustomerModel;
};

describe("Customer repository unit tests", () => {
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

  it("should create a new customer model", async () => {
    const customerRepository = new CustomerRepository();

    const customer = createCustomerMock();
    await customerRepository.create(customer);

    const customerModel = await CustomerModel.findOne({
      where: { id: customer.id },
    });

    expect(customerModel?.toJSON()).toStrictEqual(
      mapCustomerEntityToModel(customer)
    );
  });

  it("should update a customer model", async () => {
    const customerRepository = new CustomerRepository();

    const customer = createCustomerMock();
    await customerRepository.create(customer);

    const customerModel = await CustomerModel.findOne({
      where: { id: customer.id },
    });

    expect(customerModel?.toJSON()).toStrictEqual(
      mapCustomerEntityToModel(customer)
    );

    const randomRewardPoints = faker.datatype.number();

    customer.changeName(faker.name.fullName());
    customer.changeAddress(createAddressMock());
    customer.addRewardPoints(randomRewardPoints);
    customer.activate();

    await customerRepository.update(customer);

    const updatedCustomerModel = await CustomerModel.findOne({
      where: { id: customer.id },
    });

    expect(updatedCustomerModel?.toJSON()).toStrictEqual(
      mapCustomerEntityToModel(customer)
    );
  });

  it("should find a customer model", async () => {
    const customerRepository = new CustomerRepository();

    const customer = createCustomerMock();
    await customerRepository.create(customer);

    const customerModel = await CustomerModel.findOne({
      where: { id: customer.id },
    });

    const foundCustomer = await customerRepository.find(customer.id);

    expect(customerModel?.toJSON()).toStrictEqual(
      mapCustomerEntityToModel(customer)
    );
  });

  it("should throw an error if customer not found", async () => {
    const customerRepository = new CustomerRepository();

    await expect(async () => {
      await customerRepository.find("invalid id");
    }).rejects.toThrow("Customer not found");
  });

  it("should find all customers ", async () => {
    const customerRepository = new CustomerRepository();
    const customer1 = createCustomerMock()

    const customer2 = createCustomerMock()
    customer2.activate();

    const customers = [customer1, customer2];

    await customerRepository.create(customer1);
    await customerRepository.create(customer2);

    const foundCustomers = await customerRepository.findAll();

    expect(customers).toEqual(foundCustomers);
  });
});
