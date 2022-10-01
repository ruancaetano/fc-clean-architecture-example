import { faker } from "@faker-js/faker";
import { Product } from "../../../domain/product/entities/product.entity";
import { UpdateProductUseCase } from "./update-product.usecase";
import { InputUpdateProductDto } from "./update-product.usecase.dto";

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

describe("Update product use case unit test", () => {
  it("should update a product", async () => {
    const productRepository = MockRepository();
    const updateProductUseCase = new UpdateProductUseCase(productRepository);
    const mockedProduct = productRepository.products[0];

    const input: InputUpdateProductDto = {
      id: mockedProduct.id,
      name: `${mockedProduct.name} updated`,
      price: 50,
    };

    const output = await updateProductUseCase.execute(input);

    expect(output).toEqual(input);
  });

  it("should throw an error when name is missing", async () => {
    const productRepository = MockRepository();
    const updateProductUseCase = new UpdateProductUseCase(productRepository);
    const mockedProduct = productRepository.products[0];

    const input = {
      id: mockedProduct.id,
      name: '',
      price: mockedProduct.price,
    } as InputUpdateProductDto;

    expect(async () => {
      await updateProductUseCase.execute(input);
    }).rejects.toThrow("Name is required");
  });

  it("should throw an error when price is less than 0", async () => {
    const productRepository = MockRepository();
    const updateProductUseCase = new UpdateProductUseCase(productRepository);
    const mockedProduct = productRepository.products[0];

    const input = {
      id: mockedProduct.id,
      name: mockedProduct.id,
      price: -50,
    } as InputUpdateProductDto;

    expect(async () => {
      await updateProductUseCase.execute(input);
    }).rejects.toThrow("Price must be greater than zero");
  });
});
