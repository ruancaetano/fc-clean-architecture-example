import { faker } from "@faker-js/faker";
import { Sequelize } from "sequelize-typescript";
import { Product } from "../../../domain/product/entities/product.entity";
import { ProductModel } from "../../../infrastructure/product/repositories/sequelize/product.model";
import { ProductRepository } from "../../../infrastructure/product/repositories/sequelize/product.repository";
import { ListProductUseCase } from "./list-product.usecase";
import { InputListProductDto } from "./list-product.usecase.dto";

const createProductMock = () => {
  return new Product(
    faker.datatype.uuid(),
    faker.random.alpha(10),
    faker.datatype.number()
  );
};

describe("List product use case integration test", () => {
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
  it("should list all products", async () => {
    const productRepository = new ProductRepository();
    const listProductUseCase = new ListProductUseCase(productRepository);
    const product1 = createProductMock();
    const product2 = createProductMock();

    const products = [product1, product2];

    await productRepository.create(product1);
    await productRepository.create(product2);

    const input: InputListProductDto = {};

    const output = await listProductUseCase.execute(input);

    expect(output).toEqual({
      products: products.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
      })),
    });
  });
});
