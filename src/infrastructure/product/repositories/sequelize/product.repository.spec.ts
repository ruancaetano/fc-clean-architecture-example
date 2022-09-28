import { Sequelize } from "sequelize-typescript";

import { faker } from "@faker-js/faker";


import { ProductModel } from "./product.model";
import { ProductRepository } from "./product.repository";
import { Product } from "../../../../domain/product/entities/product.entity";


const createProductMock = () => {
  return new Product(
    faker.datatype.uuid(),
    faker.random.alpha(10),
    faker.datatype.number()
  );
};

const mapProductEntityToModel = (product: Product): ProductModel => {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
  } as ProductModel;
};

describe("Product repository unit tests", () => {
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

  it("should create a product model", async () => {
    const productRepository = new ProductRepository();

    const product = createProductMock();

    await productRepository.create(product);

    const productModel = await ProductModel.findOne({
      where: { id: product.id },
    });

    expect(productModel?.toJSON()).toStrictEqual(
      mapProductEntityToModel(product)
    );
  });

  it("should update a product model", async () => {
    const productRepository = new ProductRepository();
    const product = createProductMock();

    await productRepository.create(product);

    const productModel = await ProductModel.findOne({
      where: { id: product.id },
    });

    expect(productModel?.toJSON()).toStrictEqual(
      mapProductEntityToModel(product)
    );

    product.changeName(faker.random.alpha(10));
    product.changePrice(faker.datatype.number());

    await productRepository.update(product);

    const updatedProductModel = await ProductModel.findOne({
      where: { id: product.id },
    });

    expect(updatedProductModel?.toJSON()).toStrictEqual(
      mapProductEntityToModel(product)
    );
  });

  it("should find a product model", async () => {
    const productRepository = new ProductRepository();
    const product = createProductMock();

    await productRepository.create(product);

    const productModel = await ProductModel.findOne({
      where: { id: product.id },
    });

    const foundProduct = await productRepository.find(product.id);

    expect(productModel?.toJSON()).toStrictEqual(
      mapProductEntityToModel(product)
    );
  });

  it("should find all products ", async () => {
    const productRepository = new ProductRepository();
    const product1 = createProductMock();
    const product2 = createProductMock();
    const products = [product1, product2];

    await productRepository.create(product1);
    await productRepository.create(product2);

    const foundProducts = await productRepository.findAll();

    expect(products).toEqual(foundProducts);
  });
});
