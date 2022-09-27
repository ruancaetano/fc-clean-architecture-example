import { faker } from "@faker-js/faker";

import { Address } from "./address";
import { Customer } from "./customer.entity";

const createAddressMock = () => {
  return new Address(
    faker.address.street(),
    faker.datatype.number(),
    faker.address.city(),
    faker.address.state(),
    faker.address.zipCode()
  );
};

describe("Customer unit tests", () => {
  describe("Creation", () => {
    it("should throw error when id is empty", () => {
      expect(() => new Customer("", "John")).toThrowError("Id is required");
    });

    it("should throw error when name is empty", () => {
      expect(() => new Customer("1", "")).toThrowError("Name is required");
    });

    it("should create user", () => {
      const customer = new Customer("1", "Doe");
      expect(customer).toBeDefined();
    });
  });

  describe("Change name", () => {
    it("should throw error on changeName with empty value", () => {
      const customer = new Customer("1", "Customer");
      expect(() => customer.changeName("")).toThrowError("Name is required");
    });

    it("should change name", () => {
      const customer = new Customer("1", "Customer");

      customer.changeName("John");

      expect(customer.name).toBe("John");
    });
  });

  describe("Activate/Deactivate", () => {
    it("should thorw error if address is empty", () => {
      const customer = new Customer("1", "Customer");
      expect(() => customer.activate()).toThrowError(
        "Address is mandatory to activate a customer!"
      );
    });

    it("should activate customer", () => {
      const customer = new Customer("1", "Customer");

      customer.changeAddress(createAddressMock());

      customer.activate();
      expect(customer.isActive()).toBeTruthy();
    });

    it("should activate customer", () => {
      const customer = new Customer("1", "Customer");

      customer.changeAddress(createAddressMock());

      customer.activate();
      expect(customer.isActive()).toBeTruthy();

      customer.deactivate();
      expect(customer.isActive()).toBeFalsy();
    });
  });

  describe("Reward points", () => {
    it("should add reward points", () => {
      const customer = new Customer("1", "Customer");
      expect(customer.rewardPoints).toEqual(0);

      customer.addRewardPoints(5);
      expect(customer.rewardPoints).toEqual(5);

      customer.addRewardPoints(5);
      expect(customer.rewardPoints).toEqual(10);
    });
  });
});
