import { faker } from "@faker-js/faker";
import request from "supertest";
import { Address } from "../../../domain/customer/entities/address";
import { Customer } from "../../../domain/customer/entities/customer.entity";

import { app, sequelize } from "../express";

const createAddressMock = () => {
  return new Address(
    faker.address.street(),
    faker.datatype.number(),
    faker.address.city(),
    faker.address.state(),
    faker.address.zipCode()
  );
};

const createCustomerMock = () => {
  const customer = new Customer(faker.datatype.uuid(), faker.name.fullName());
  const address = createAddressMock();
  customer.changeAddress(address);

  return customer;
};

describe("Customer e2e test", () => {
  beforeEach(async () => {
    await sequelize.sync({
      force: true,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("Create customer", () => {
    it("should create a customer", async () => {
      const mockCustomer = createCustomerMock();

      const response = await request(app)
        .post("/customers")
        .send({
          name: mockCustomer.name,
          address: {
            street: mockCustomer.Address.street,
            number: mockCustomer.Address.number,
            city: mockCustomer.Address.city,
            state: mockCustomer.Address.state,
            zipcode: mockCustomer.Address.zipcode,
          },
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: expect.any(String),
        name: mockCustomer.name,
        address: {
          street: mockCustomer.Address.street,
          number: mockCustomer.Address.number,
          city: mockCustomer.Address.city,
          state: mockCustomer.Address.state,
          zipcode: mockCustomer.Address.zipcode,
        },
      });
    });

    it("should not create a customer", async () => {
      const mockCustomer = createCustomerMock();

      const response = await request(app)
        .post("/customers")
        .send({
          address: {
            street: mockCustomer.Address.street,
            number: mockCustomer.Address.number,
            city: mockCustomer.Address.city,
            state: mockCustomer.Address.state,
            zipcode: mockCustomer.Address.zipcode,
          },
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Name is required");
    });
  });

  describe("Update customer", () => {
    it("should update a customer", async () => {
      const mockCustomer = createCustomerMock();

      const createResponse = await request(app)
        .post("/customers")
        .send({
          name: mockCustomer.name,
          address: {
            street: mockCustomer.Address.street,
            number: mockCustomer.Address.number,
            city: mockCustomer.Address.city,
            state: mockCustomer.Address.state,
            zipcode: mockCustomer.Address.zipcode,
          },
        });

      expect(createResponse.status).toBe(201);

      const customer = createResponse.body;

      const updatedCustomer = {
        ...customer,
        name: `${customer.name} Updated`,
      };

      const response = await request(app)
        .put("/customers")
        .send(updatedCustomer);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedCustomer);
    });

    it("should not update a customer with invalid body", async () => {
      const mockCustomer = createCustomerMock();
      const createResponse = await request(app)
        .post("/customers")
        .send({
          name: mockCustomer.name,
          address: {
            street: mockCustomer.Address.street,
            number: mockCustomer.Address.number,
            city: mockCustomer.Address.city,
            state: mockCustomer.Address.state,
            zipcode: mockCustomer.Address.zipcode,
          },
        });

      expect(createResponse.status).toBe(201);

      const customer = createResponse.body;
      const updatedCustomer = {
        ...customer,
        name: "",
      };

      const response = await request(app)
        .put("/customers")
        .send(updatedCustomer);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Name is required");
    });
  });

  describe("Get customer", () => {
    it("should return a customer", async () => {
      const mockCustomer = createCustomerMock();

      const createResponse = await request(app)
        .post("/customers")
        .send({
          name: mockCustomer.name,
          address: {
            street: mockCustomer.Address.street,
            number: mockCustomer.Address.number,
            city: mockCustomer.Address.city,
            state: mockCustomer.Address.state,
            zipcode: mockCustomer.Address.zipcode,
          },
        });

      expect(createResponse.status).toBe(201);

      const customer = createResponse.body;

      const getResponse = await request(app)
        .get(`/customers/${customer.id}`)
        .send();

      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toEqual(customer);
    });

    it("should throw an error if customer not exists", async () => {
      const getResponse = await request(app).get("/customers/invalidId").send();
      console.log(getResponse.error);
      expect(getResponse.status).toBe(404);
      expect(getResponse.body.message).toBe("Customer not found");
    });
  });

  describe("List all customers", () => {
    it("should list all customers", async () => {
      const mockCustomer1 = createCustomerMock();
      const mockCustomer2 = createCustomerMock();

      const createResponse1 = await request(app)
        .post("/customers")
        .send({
          name: mockCustomer1.name,
          address: {
            street: mockCustomer1.Address.street,
            number: mockCustomer1.Address.number,
            city: mockCustomer1.Address.city,
            state: mockCustomer1.Address.state,
            zipcode: mockCustomer1.Address.zipcode,
          },
        });
      const createResponse2 = await request(app)
        .post("/customers")
        .send({
          name: mockCustomer2.name,
          address: {
            street: mockCustomer2.Address.street,
            number: mockCustomer2.Address.number,
            city: mockCustomer2.Address.city,
            state: mockCustomer2.Address.state,
            zipcode: mockCustomer2.Address.zipcode,
          },
        });

      expect(createResponse1.status).toBe(201);
      expect(createResponse2.status).toBe(201);

      const listResponse = await request(app).get("/customers").send();

      expect(listResponse.status).toBe(200);
      expect(listResponse.body).toEqual({
        customers: [mockCustomer1, mockCustomer2].map((item) => {
          return {
            id: expect.any(String),
            name: item.name,
            address: {
              street: item.Address.street,
              number: item.Address.number,
              city: item.Address.city,
              state: item.Address.state,
              zipcode: item.Address.zipcode,
            },
          };
        }),
      });
    });
  });
});
