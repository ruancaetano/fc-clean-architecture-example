import { faker } from "@faker-js/faker";
import request from "supertest";
import { Product } from "../../../domain/product/entities/product.entity";

import { app, sequelize } from "../express";

const createProductMock = () => {
  return new Product(
    faker.datatype.uuid(),
    faker.random.alpha(10),
    faker.datatype.number()
  );
};

describe("Product e2e test", () => {
  beforeEach(async () => {
    await sequelize.sync({
      force: true,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("Create product", () => {
    it("should create a product", async () => {
      const mockProduct = createProductMock();

      const response = await request(app).post("/products").send({
        name: mockProduct.name,
        price: mockProduct.price,
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: expect.any(String),
        name: mockProduct.name,
        price: mockProduct.price,
      });
    });

    it("should not create a product if name is invalid", async () => {
      const mockProduct = createProductMock();

      const response = await request(app).post("/products").send({
        name: "",
        price: mockProduct.price,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("product: Name is required");
    });

    it("should not create a product if price is less than 0", async () => {
      const mockProduct = createProductMock();

      const response = await request(app).post("/products").send({
        name: "Valid name",
        price: -10,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("product: Price must be greater than zero");
    });
  });

  describe("Update product", () => {
    it("should update a product", async () => {
      const mockProduct = createProductMock();

      const createResponse = await request(app).post("/products").send({
        name: mockProduct.name,
        price: mockProduct.price,
      });

      expect(createResponse.status).toBe(201);

      const product = createResponse.body;

      const updatedProduct = {
        ...product,
        name: `${product.name} Updated`,
      };

      const response = await request(app).put("/products").send(updatedProduct);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedProduct);
    });

    it("should not update a product with invalid name", async () => {
      const mockProduct = createProductMock();
      const createResponse = await request(app).post("/products").send({
        name: mockProduct.name,
        price: mockProduct.price,
      });

      expect(createResponse.status).toBe(201);

      const product = createResponse.body;
      const updatedProduct = {
        ...product,
        name: "",
      };

      const response = await request(app).put("/products").send(updatedProduct);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("product: Name is required");
    });

    it("should not update a product with price less than zero", async () => {
      const mockProduct = createProductMock();
      const createResponse = await request(app).post("/products").send({
        name: mockProduct.name,
        price: mockProduct.price,
      });

      expect(createResponse.status).toBe(201);

      const product = createResponse.body;
      const updatedProduct = {
        ...product,
        price: -100,
      };

      const response = await request(app).put("/products").send(updatedProduct);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("product: Price must be greater than zero");
    });
  });

  describe("Get product", () => {
    it("should return a product", async () => {
      const mockProduct = createProductMock();

      const createResponse = await request(app).post("/products").send({
        name: mockProduct.name,
        price: mockProduct.price,
      });

      expect(createResponse.status).toBe(201);

      const product = createResponse.body;

      const getResponse = await request(app)
        .get(`/products/${product.id}`)
        .send();

      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toEqual(product);
    });

    it("should throw an error if product not exists", async () => {
      const getResponse = await request(app).get("/products/invalidId").send();
      expect(getResponse.status).toBe(404);
      expect(getResponse.body.message).toBe("Product not found");
    });
  });

  describe("List all products", () => {
    it("should list all products", async () => {
      const mockProduct1 = createProductMock();
      const mockProduct2 = createProductMock();

      const createResponse1 = await request(app).post("/products").send({
        name: mockProduct1.name,
        price: mockProduct1.price,
      });
      const createResponse2 = await request(app).post("/products").send({
        name: mockProduct2.name,
        price: mockProduct2.price,
      });

      expect(createResponse1.status).toBe(201);
      expect(createResponse2.status).toBe(201);

      const listResponse = await request(app).get("/products").send();

      expect(listResponse.status).toBe(200);
      expect(listResponse.body).toEqual({
        products: [mockProduct1, mockProduct2].map((item) => {
          return {
            id: expect.any(String),
            name: item.name,
            price: item.price,
          };
        }),
      });
    });
  });
});
