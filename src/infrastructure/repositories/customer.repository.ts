import { Address } from "../../domain/entities/address";
import { Customer } from "../../domain/entities/customer.entity";
import { CustomerRespositoryInterface } from "../../domain/repositories/customer.repository";
import { CustomerModel } from "../db/sequelize/models/customer.model";

export class CustomerRepository implements CustomerRespositoryInterface {
  async create(entity: Customer): Promise<void> {
    await CustomerModel.create({
      id: entity.id,
      active: entity.active || false,
      name: entity.name,
      rewardPoints: entity.rewardPoints,
      street: entity.Address.street,
      number: entity.Address.number,
      city: entity.Address.city,
      state: entity.Address.state,
      zipcode: entity.Address.zipcode,
    });
  }

  async update(entity: Customer): Promise<void> {
    await CustomerModel.update(
      {
        name: entity.name,
        active: entity.active || false,
        rewardPoints: entity.rewardPoints,
        street: entity.Address.street,
        number: entity.Address.number,
        city: entity.Address.city,
        state: entity.Address.state,
        zipcode: entity.Address.zipcode,
      },
      {
        where: { id: entity.id },
      }
    );
  }

  async find(id: string): Promise<Customer> {
    const foundCustomer = await CustomerModel.findOne({
      where: { id },
    }).catch(() => null);

    if (!foundCustomer) {
      throw new Error("Customer not found");
    }

    const customer = new Customer(foundCustomer.id, foundCustomer.name);
    customer.changeAddress(
      new Address(
        foundCustomer.street,
        foundCustomer.number,
        foundCustomer.city,
        foundCustomer.state,
        foundCustomer.zipcode
      )
    );

    customer.addRewardPoints(foundCustomer.rewardPoints);

    if (foundCustomer.active) {
      customer.activate();
    }

    return customer;
  }

  async findAll(): Promise<Customer[]> {
    const foundCustomersModels = await CustomerModel.findAll();

    return foundCustomersModels.map((model) => {
      const customer = new Customer(model.id, model.name);
      customer.changeAddress(
        new Address(
          model.street,
          model.number,
          model.city,
          model.state,
          model.zipcode
        )
      );

      customer.addRewardPoints(model.rewardPoints);

      if (model.active) {
        customer.activate();
      }

      return customer;
    });
  }
}
