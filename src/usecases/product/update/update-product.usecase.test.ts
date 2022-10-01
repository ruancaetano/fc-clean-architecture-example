import { faker } from "@faker-js/faker";
import { Sequelize } from "sequelize-typescript";
import { Product } from "../../../domain/product/entities/product.entity";
import { ProductModel } from "../../../infrastructure/product/repositories/sequelize/product.model";
import { ProductRepository } from "../../../infrastructure/product/repositories/sequelize/product.repository";
import { UpdateProductUseCase } from "./update-product.usecase";
import { InputUpdateProductDto } from "./update-product.usecase.dto";

const createProductMock = () => {
  return new Product(
    faker.datatype.uuid(),
    faker.random.alpha(10),
    faker.datatype.number()
  );
};

describe("Update product use case integration test", () => {
  let sequilize: Sequelize;

  beforeEach(async () => {
    sequilize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: {
        force: true,
      },
    });

    sequilize.addModels([ProductModel]);
    await sequilize.sync();
  });

  afterEach(async () => {
    await sequilize.close();
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const updateProductUseCase = new UpdateProductUseCase(productRepository);
    const mockedProduct = createProductMock();

    await productRepository.create(mockedProduct);

    const input: InputUpdateProductDto = {
      id: mockedProduct.id,
      name: `${mockedProduct.name} updated`,
      price: 50,
    };

    const output = await updateProductUseCase.execute(input);

    expect(output).toEqual(input);
  });

  it("should throw an error when name is missing", async () => {
    const productRepository = new ProductRepository();
    const updateProductUseCase = new UpdateProductUseCase(productRepository);
    const mockedProduct = createProductMock();

    await productRepository.create(mockedProduct);

    const input = {
      id: mockedProduct.id,
      name: "",
      price: mockedProduct.price,
    } as InputUpdateProductDto;

    await expect(async () => {
      await updateProductUseCase.execute(input);
    }).rejects.toThrow("Name is required");
  });

  it("should throw an error when price is less than 0", async () => {
    const productRepository = new ProductRepository();
    const updateProductUseCase = new UpdateProductUseCase(productRepository);
    const mockedProduct = createProductMock();

    await productRepository.create(mockedProduct);

    const input = {
      id: mockedProduct.id,
      name: mockedProduct.id,
      price: -50,
    } as InputUpdateProductDto;

    await expect(async () => {
      await updateProductUseCase.execute(input);
    }).rejects.toThrow("Price must be greater than zero");
  });
});
