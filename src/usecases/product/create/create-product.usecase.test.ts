import { faker } from "@faker-js/faker";
import { Sequelize } from "sequelize-typescript";
import { Product } from "../../../domain/product/entities/product.entity";
import { ProductModel } from "../../../infrastructure/product/repositories/sequelize/product.model";
import { ProductRepository } from "../../../infrastructure/product/repositories/sequelize/product.repository";
import { CreateProductUseCase } from "./create-product.usecase";
import { InputCreateProductDto } from "./create-product.usecase.dto";

const createProductMock = () => {
  return new Product(
    faker.datatype.uuid(),
    faker.random.alpha(10),
    faker.datatype.number()
  );
};

describe("Creacte product use case integration test", () => {
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

  it("should create a product", async () => {
    const productRepository = new ProductRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    const product = createProductMock();

    const input: InputCreateProductDto = {
      name: product.name,
      price: product.price,
    };

    const output = await createProductUseCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      ...input,
    });
  });

  it("should throw an error when name is missing", async () => {
    const productRepository = new ProductRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    const input = {
      name: "",
      price: 100,
    } as InputCreateProductDto;

    await expect(async () => {
      await createProductUseCase.execute(input);
    }).rejects.toThrow("Name is required");
  });

  it("should throw an error when price less than zero", async () => {
    const productRepository = new ProductRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    const input = {
      name: "Product",
      price: -10,
    } as InputCreateProductDto;

    await expect(async () => {
      await createProductUseCase.execute(input);
    }).rejects.toThrow("Price must be greater than zero");
  });
});
