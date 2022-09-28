import { Product } from "./product.entity";

describe("Product entity unit tests", () => {
  describe("Creation", () => {
    it("should throw an error when id is empty", () => {
      expect(() =>
        new Product("", "Product 1", 100)
      ).toThrowError("Id is required");
    });

    it("should throw an error when name is empty", () => {
      expect(() =>
        new Product("1", "", 100)
      ).toThrowError("Name is required");
    });

    it("should throw an error when price is less than zero", () => {
      expect(() =>
        new Product("1", "Product 1", -1)
      ).toThrowError("Price must be greater than zero");
    });

    it("should create a new product", () => {
      const product = new Product("1", "Product 1", 100);

      expect(product).toBeDefined();
    });
  });

  describe("Change name", () => {
    it("should throw an error when name is empty", () => {
      const product = new Product("1", "Product 1", 100);

      expect(() => {
        product.changeName("");
      }).toThrowError("Name is required");
    });

    it("should update name", () => {
      const product = new Product("1", "Product 1", 100);

      product.changeName("Product 1 edited");
      expect(product.name).toBe("Product 1 edited");
    });
  });

  describe("Change price", () => {
    it("should throw an error when price is less than zero", () => {
      const product = new Product("1", "Product 1", 100);

      expect(() => {
        product.changePrice(-1);
      }).toThrowError("Price must be greater than zero");
    });

    it("should change price", () => {
      const product = new Product("1", "Product 1", 100);

      product.changePrice(200);
      expect(product.price).toBe(200);
    });
  });
});
