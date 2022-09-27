import { faker } from "@faker-js/faker";

import { Product } from "../entities/product.entity";
import { ProductService } from "./product.service";

const createProductMock = () => {
  return new Product(
    faker.datatype.uuid(),
    faker.random.alpha(10),
    faker.datatype.number()
  );
};

describe("Product service unit tests", () => {
  it("should change the price of all products", () => {
    const product1 = createProductMock();
    const product2 = createProductMock();
    const products = [product1, product2];

    const percentage = faker.datatype.number({
      min: 1,
      max: 100,
    });

    const expectedProduct1Price =
      product1.price + (product1.price * percentage / 100);

    const expectedProduct2Price =
      product2.price + (product2.price * percentage / 100);

    ProductService.increasePrice(products, percentage);

    expect(product1.price).toBe(expectedProduct1Price);
    expect(product2.price).toBe(expectedProduct2Price);
  });
});
