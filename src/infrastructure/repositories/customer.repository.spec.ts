import { Sequelize } from "sequelize-typescript";
import { Address } from "../../domain/entities/address";
import { Customer } from "../../domain/entities/customer.entity";
import { CustomerModel } from "../db/sequelize/models/customer.model";
import { CustomerRepository } from "./customer.repository";

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
    const customer = new Customer("1", "Customer Name");
    customer.changeAddress(
      new Address("Rua teste", 10, "São Paulo", "São Paulo", "00000-000")
    );

    await customerRepository.create(customer);

    const customerModel = await CustomerModel.findOne({ where: { id: "1" } });

    expect(customerModel?.toJSON()).toStrictEqual({
      id: "1",
      active: false,
      name: "Customer Name",
      rewardPoints: 0,
      street: "Rua teste",
      number: 10,
      city: "São Paulo",
      state: "São Paulo",
      zipcode: "00000-000",
    });
  });

  it("should update a customer model", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer Name");
    customer.changeAddress(
      new Address("Rua teste", 10, "São Paulo", "São Paulo", "00000-000")
    );
    await customerRepository.create(customer);

    const customerModel = await CustomerModel.findOne({ where: { id: "1" } });

    expect(customerModel?.toJSON()).toStrictEqual({
      id: "1",
      active: false,
      name: "Customer Name",
      rewardPoints: 0,
      street: "Rua teste",
      number: 10,
      city: "São Paulo",
      state: "São Paulo",
      zipcode: "00000-000",
    });

    customer.changeName("Customer Name edited");
    customer.changeAddress(
      new Address(
        "Rua teste edited",
        100,
        "São Paulo edited",
        "São Paulo edited",
        "11111-111"
      )
    );
    customer.addRewardPoints(100);
    customer.activate();

    customerRepository.update(customer);

    const updatedCustomerModel = await CustomerModel.findOne({
      where: { id: "1" },
    });

    expect(updatedCustomerModel?.toJSON()).toStrictEqual({
      id: "1",
      active: true,
      name: "Customer Name edited",
      rewardPoints: 100,
      street: "Rua teste edited",
      number: 100,
      city: "São Paulo edited",
      state: "São Paulo edited",
      zipcode: "11111-111",
    });
  });

  it("should find a customer model", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer Name");
    customer.changeAddress(
      new Address("Rua teste", 10, "São Paulo", "São Paulo", "00000-000")
    );
    await customerRepository.create(customer);

    const customerModel = await CustomerModel.findOne({
      where: { id: "1" },
    });

    const foundCustomer = await customerRepository.find("1");

    expect(customerModel?.toJSON()).toStrictEqual({
      id: foundCustomer.id,
      active: false,
      name: foundCustomer.name,
      rewardPoints: foundCustomer.rewardPoints,
      street: foundCustomer.Address.street,
      number: foundCustomer.Address.number,
      city: foundCustomer.Address.city,
      state: foundCustomer.Address.state,
      zipcode: foundCustomer.Address.zipcode,
    });
  });

  it("should thorw an error if customer not found", async () => {
    const customerRepository = new CustomerRepository();

    await expect(async () => {
      await customerRepository.find("invalid id");
    }).rejects.toThrow("Customer not found");
  });
  it("should find all customers ", async () => {
    const customerRepository = new CustomerRepository();
    const customer1 = new Customer("1", "Customer 1");
    customer1.changeAddress(
      new Address("Rua teste", 10, "São Paulo", "São Paulo", "00000-000")
    );

    const customer2 = new Customer("2", "Customer 2");
    customer2.changeAddress(
      new Address("Rua teste 2", 20, "São Paulo 2", "São Paulo 2", "11111-111")
    );
    customer2.activate();

    const customers = [customer1, customer2];

    await customerRepository.create(customer1);
    await customerRepository.create(customer2);

    const foundCustomers = await customerRepository.findAll();

    expect(customers).toEqual(foundCustomers);
  });
});
