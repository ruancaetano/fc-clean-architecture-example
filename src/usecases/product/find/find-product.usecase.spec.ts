import { faker } from "@faker-js/faker";
import { Product } from "../../../domain/product/entities/product.entity";
import { FindProductUseCase } from "./find-product.usecase";
import { InputFindProductDto } from "./find-product.usecase.dto";

const createProductMock = () => {
  return new Product(
    faker.datatype.uuid(),
    faker.random.alpha(10),
    faker.datatype.number()
  );
};

const MockRepository = () => {
  const product = createProductMock();

  return {
    products: [product],
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};
describe("Find Product use case unit test", () => {
  it("should find a product", async () => {
    const productRepository = MockRepository();

    const product = productRepository.products[0];

    const input: InputFindProductDto = {
      id: product.id,
    };

    const output = await new FindProductUseCase(productRepository).execute(
      input
    );

    expect(output).toEqual({
      id: product.id,
      name: product.name,
      price: product.price,
    });
  });

  it("should not find a product", async () => {
    const productRepository = MockRepository();
    productRepository.find.mockImplementationOnce(() => {
      throw new Error("Product not found");
    });

    const input: InputFindProductDto = {
      id: "invalid",
    };

    await expect(async () => {
      await new FindProductUseCase(productRepository).execute(input);
    }).rejects.toThrow("Product not found");
  });
});
