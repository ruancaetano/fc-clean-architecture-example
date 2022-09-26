import { Sequelize } from "sequelize-typescript";
import { Product } from "../../domain/entities/product.entity";
import { ProductModel } from "../db/sequelize/models/product.model";
import { ProductRepository } from "./product.repository";

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
    const product = new Product("1", "Product 1", 100);

    await productRepository.create(product);

    const productModel = await ProductModel.findOne({ where: { id: "1" } });

    expect(productModel?.toJSON()).toStrictEqual({
      id: "1",
      name: "Product 1",
      price: 100,
    });
  });

  it("should update a product model", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 100);

    await productRepository.create(product);

    const productModel = await ProductModel.findOne({ where: { id: "1" } });

    expect(productModel?.toJSON()).toStrictEqual({
      id: "1",
      name: "Product 1",
      price: 100,
    });

    product.changeName("Product 1 edited");
    product.changePrice(200);

    await productRepository.update(product);

    const updatedProductModel = await ProductModel.findOne({
      where: { id: "1" },
    });

    expect(updatedProductModel?.toJSON()).toStrictEqual({
      id: "1",
      name: "Product 1 edited",
      price: 200,
    });
  });

  it("should find a product model", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 100);

    await productRepository.create(product);

    const productModel = await ProductModel.findOne({
      where: { id: "1" },
    });

    const foundProduct = await productRepository.find("1");

    expect(productModel?.toJSON()).toStrictEqual({
      id: foundProduct.id,
      name: foundProduct.name,
      price: foundProduct.price,
    });
  });

  it("should find all products ", async () => {
    const productRepository = new ProductRepository();
    const product1 = new Product("1", "Product 1", 100);
    const product2 = new Product("2", "Product 2", 200);
    const products = [product1, product2];

    await productRepository.create(product1);
    await productRepository.create(product2);

    const foundProducts = await productRepository.findAll();

    expect(products).toEqual(foundProducts);
  });
});
