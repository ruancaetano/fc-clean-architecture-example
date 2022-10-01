import { faker } from "@faker-js/faker";
import { Product } from "../../../domain/product/entities/product.entity";
import { CreateProductUseCase } from "./create-product.usecase";
import { InputCreateProductDto } from "./create-product.usecase.dto";

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
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn().mockReturnValue(Promise.resolve(product)),
    update: jest.fn(),
  };
};

describe("Creacte product use case unit test", () => {
  it("should create a product", async () => {
    const productRepository = MockRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);
    const mockedProduct = productRepository.products[0];

    const input: InputCreateProductDto = {
      name: mockedProduct.name,
      price: mockedProduct.price,
    };

    const output = await createProductUseCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      ...input,
    });
  });

  it("should throw an error when name is missing", async () => {
    const productRepository = MockRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    const input = {
      name: "",
      price: 100,
    } as InputCreateProductDto;

    expect(async () => {
      await createProductUseCase.execute(input);
    }).rejects.toThrow("Name is required");
  });

  it("should throw an error when price less than zero", async () => {
    const productRepository = MockRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    const input = {
      name: "Product",
      price: -10,
    } as InputCreateProductDto;

    expect(async () => {
      await createProductUseCase.execute(input);
    }).rejects.toThrow("Price must be greater than zero");
  });
});
