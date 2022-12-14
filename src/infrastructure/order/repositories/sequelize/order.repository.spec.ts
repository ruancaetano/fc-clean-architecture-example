import { faker } from "@faker-js/faker";
import { Sequelize } from "sequelize-typescript";


import { CustomerModel } from "../../../customer/repositories/sequelize/customer.model";
import { OrderItemModel } from "./order-item.model";

import { ProductModel } from "../../../product/repositories/sequelize/product.model";

import { OrderRepository } from "./order.repository";
import { ProductRepository } from "../../../product/repositories/sequelize/product.repository";
import { Address } from "../../../../domain/customer/entities/address";
import { Customer } from "../../../../domain/customer/entities/customer.entity";
import { Order } from "../../../../domain/checkout/entities/order.entity";
import { OrderItem } from "../../../../domain/checkout/entities/order-item";
import { Product } from "../../../../domain/product/entities/product.entity";
import { OrderModel } from "./order.model";
import { CustomerRepository } from "../../../customer/repositories/sequelize/customer.repository";

const createAddressMock = () => {
  return new Address(
    faker.address.street(),
    faker.datatype.number(),
    faker.address.city(),
    faker.address.state(),
    faker.address.zipCode()
  );
};

const createCustomerMock = (withAddress = true) => {
  const customer = new Customer(faker.datatype.uuid(), faker.name.fullName());

  if (withAddress) {
    const address = createAddressMock();
    customer.changeAddress(address);
  }

  return customer;
};

const createProductMock = () => {
  return new Product(
    faker.datatype.uuid(),
    faker.random.alpha(10),
    faker.datatype.number()
  );
};

const createOrderItemMock = (product: Product) => {
  return new OrderItem(
    faker.datatype.uuid(),
    product.name,
    product.price,
    product.id,
    2
  );
};

const createOrderMock = (customer: Customer, orderItems: OrderItem[]) => {
  return new Order(faker.datatype.uuid(), customer.id, orderItems);
};

const mapOrderEntityToModel = (orderEntity: Order): OrderModel => {
  return {
    id: orderEntity.id,
    customer_id: orderEntity.customerId,
    items: orderEntity.items.map((item) => ({
      id: item.id,
      name: item.name,
      product_id: item.productId,
      order_id: orderEntity.id,
      price: item.price,
      quantity: item.quantity,
    })),
    total: orderEntity.calculateTotal(),
  } as OrderModel;
};

describe("Order repository unit tests", () => {
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

    sequilize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequilize.sync();
  });

  afterEach(async () => {
    await sequilize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    const customer = createCustomerMock();
    await customerRepository.create(customer);

    const product = createProductMock();
    await productRepository.create(product);

    const orderItem = createOrderItemMock(product);
    const order = createOrderMock(customer, [orderItem]);
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: {
        id: order.id,
      },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual(mapOrderEntityToModel(order));
  });

  it("should undo all persistence changes if any order update operation fails", async () => {
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    const customer = createCustomerMock();
    await customerRepository.create(customer);

    const product = createProductMock();
    productRepository.create(product);

    const orderItem = createOrderItemMock(product);
    const order = createOrderMock(customer, [orderItem]);
    await orderRepository.create(order);

    let orderModel = await OrderModel.findOne({
      where: {
        id: order.id,
      },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual(mapOrderEntityToModel(order));

    order.updateOrderItems([orderItem, { id: "invalid order" } as OrderItem]);

    await expect(() => {
      return orderRepository.update(order);
    }).rejects.toThrow("Update transaction failed");

    orderModel = await OrderModel.findOne({
      where: {
        id: order.id,
      },
      include: ["items"],
    });

    // revert invalid order insertion to compare
    order.updateOrderItems([orderItem]);

    expect(orderModel.toJSON()).toStrictEqual(mapOrderEntityToModel(order));
  });

  it("should update an order", async () => {
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    const customer = createCustomerMock();
    await customerRepository.create(customer);

    const product = createProductMock();
    productRepository.create(product);

    const orderItem = createOrderItemMock(product);
    const order = createOrderMock(customer, [orderItem]);
    await orderRepository.create(order);

    let orderModel = await OrderModel.findOne({
      where: {
        id: order.id,
      },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual(mapOrderEntityToModel(order));

    const product2 = createProductMock();
    await productRepository.create(product2);

    const orderItem2 = createOrderItemMock(product2);
    order.updateOrderItems([orderItem, orderItem2]);
    await orderRepository.update(order);

    orderModel = await OrderModel.findOne({
      where: {
        id: order.id,
      },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual(mapOrderEntityToModel(order));
  });

  it("should find order", async () => {
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    const customer = createCustomerMock();
    await customerRepository.create(customer);

    const product = createProductMock();
    await productRepository.create(product);

    const orderItem = createOrderItemMock(product);
    const order = createOrderMock(customer, [orderItem]);
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: {
        id: order.id,
      },
      include: ["items"],
    });

    const foundOrder = await orderRepository.find(order.id);

    expect(orderModel.toJSON()).toStrictEqual(
      mapOrderEntityToModel(foundOrder)
    );
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    const customer = createCustomerMock();
    await customerRepository.create(customer);

    const product = createProductMock();
    const product2 = createProductMock();
    await productRepository.create(product);
    await productRepository.create(product2);

    const orderItem = createOrderItemMock(product);
    const orderItem2 = createOrderItemMock(product2);

    const order = createOrderMock(customer, [orderItem]);
    const order2 = createOrderMock(customer, [orderItem2]);
    await orderRepository.create(order);
    await orderRepository.create(order2);

    const orders = [order, order2];

    const foundOrders = await orderRepository.findAll();

    expect(orders).toEqual(foundOrders);
  });
});
