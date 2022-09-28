import { Address } from "../entities/address";
import { CustomerFactory } from "./customer.factory";

describe("Customer factory unit tests", () => {
  it("should create a customer without address", () => {
    const customer = CustomerFactory.create("John");

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("John");
    expect(customer.Address).not.toBeDefined();
    expect(customer.constructor.name).toBe("Customer");
  });

  it("should create a customer with address", () => {
    const address = new Address("street", 1, "SP", "SP", "00000-000");

    const customer = CustomerFactory.createWithAddress("John", address);

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("John");
    expect(customer.Address).toBe(address);
    expect(customer.constructor.name).toBe("Customer");
  });
});
