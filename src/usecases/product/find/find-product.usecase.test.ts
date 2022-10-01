import { faker } from "@faker-js/faker";
import { Sequelize } from "sequelize-typescript";
import { Product } from "../../../domain/product/entities/product.entity";
import { ProductModel } from "../../../infrastructure/product/repositories/sequelize/product.model";
import { ProductRepository } from "../../../infrastructure/product/repositories/sequelize/product.repository";
import { FindProductUseCase } from "./find-product.usecase";
import { InputFindProductDto } from "./find-product.usecase.dto";

const createProductMock = () => {
  return new Product(
    faker.datatype.uuid(),
    faker.random.alpha(10),
    faker.datatype.number()
  );
};

describe("Find Product use case integration test", () => {
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

  it("should find a product", async () => {
    const productRepository = new ProductRepository();

    const product = createProductMock();

    await productRepository.create(product);

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
    const productRepository = new ProductRepository();

    const input: InputFindProductDto = {
      id: "invalid",
    };

    await expect(async () => {
      await new FindProductUseCase(productRepository).execute(input);
    }).rejects.toThrow("Product not found");
  });
});
