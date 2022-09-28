import { ProductFactory } from "./product.factory";

describe("Product factory unit tests", () => {
  it("should create a product", () => {
    const product = ProductFactory.create("Product A", 1);

    expect(product.id).toBeDefined();
    expect(product.name).toBe("Product A");
    expect(product.price).toBe(1);
    expect(product.constructor.name).toBe("Product");
  });
});
