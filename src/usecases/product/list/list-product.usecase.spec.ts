import { faker } from "@faker-js/faker";
import { Product } from "../../../domain/product/entities/product.entity";
import { ListProductUseCase } from "./list-product.usecase";
import { InputListProductDto } from "./list-product.usecase.dto";

const createProductMock = () => {
  return new Product(
    faker.datatype.uuid(),
    faker.random.alpha(10),
    faker.datatype.number()
  );
};

const MockRepository = () => {
  const products = [createProductMock(), createProductMock()];

  return {
    products,
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(products),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("List product use case unit test", () => {
  it("should list all products", async () => {
    const productRepository = MockRepository();
    const listProductUseCase = new ListProductUseCase(productRepository);
    const mockedProducts = productRepository.products;

    const input: InputListProductDto = {};

    const output = await listProductUseCase.execute(input);

    expect(output).toEqual({
      products: mockedProducts.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
      })),
    });
  });
});
