import { Sequelize } from "sequelize-typescript";
import { Address } from "../../domain/entities/address";
import { Customer } from "../../domain/entities/customer.entity";
import { OrderItem } from "../../domain/entities/order-item";
import { Order } from "../../domain/entities/order.entity";
import { Product } from "../../domain/entities/product.entity";
import { CustomerModel } from "../db/sequelize/models/customer.model";
import { OrderItemModel } from "../db/sequelize/models/order-item.model";
import { OrderModel } from "../db/sequelize/models/order.model";
import { ProductModel } from "../db/sequelize/models/product.model";
import { CustomerRepository } from "./customer.repository";
import { OrderRepository } from "./order.repository";
import { ProductRepository } from "./product.repository";

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
    const customer = new Customer("1", "Customer Name");
    customer.changeAddress(
      new Address("Rua teste", 10, "São Paulo", "São Paulo", "00000-000")
    );
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("1", "Product Name", 100);
    productRepository.create(product);

    const orderRepository = new OrderRepository();
    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );
    const order = new Order("1", customer.id, [orderItem]);
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: {
        id: order.id,
      },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: order.customerId,
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          product_id: product.id,
          order_id: order.id,
          price: orderItem.price,
          quantity: orderItem.quantity,
        },
      ],
      total: order.calculateTotal(),
    });
  });

  it("should update an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer Name");
    customer.changeAddress(
      new Address("Rua teste", 10, "São Paulo", "São Paulo", "00000-000")
    );
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("1", "Product Name", 100);
    productRepository.create(product);

    const orderRepository = new OrderRepository();
    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );
    const order = new Order("1", customer.id, [orderItem]);
    await orderRepository.create(order);

    let orderModel = await OrderModel.findOne({
      where: {
        id: order.id,
      },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: order.customerId,
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          product_id: product.id,
          order_id: order.id,
          price: orderItem.price,
          quantity: orderItem.quantity,
        },
      ],
      total: order.calculateTotal(),
    });

    const product2 = new Product("2", "Product 2", 100);
    await productRepository.create(product2);

    const orderItem2 = new OrderItem(
      "2",
      product2.name,
      product2.price,
      product2.id,
      1
    );

    order.updateOrderItems([orderItem, orderItem2]);
    await orderRepository.update(order);

    orderModel = await OrderModel.findOne({
      where: {
        id: order.id,
      },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: order.customerId,
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          product_id: product.id,
          order_id: order.id,
          price: orderItem.price,
          quantity: orderItem.quantity,
        },
        {
          id: orderItem2.id,
          name: orderItem2.name,
          product_id: product2.id,
          order_id: order.id,
          price: orderItem2.price,
          quantity: orderItem2.quantity,
        },
      ],
      total: order.calculateTotal(),
    });
  });

  it("should find order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer Name");
    customer.changeAddress(
      new Address("Rua teste", 10, "São Paulo", "São Paulo", "00000-000")
    );
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("1", "Product Name", 100);
    productRepository.create(product);

    const orderRepository = new OrderRepository();
    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );
    const order = new Order("1", customer.id, [orderItem]);
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: {
        id: order.id,
      },
      include: ["items"],
    });

    const foundOrder = await orderRepository.find(order.id);

    expect(orderModel.toJSON()).toStrictEqual({
      id: foundOrder.id,
      customer_id: foundOrder.customerId,
      items: foundOrder.items.map((item) => ({
        id: item.id,
        name: item.name,
        product_id: item.productId,
        order_id: foundOrder.id,
        price: item.price,
        quantity: item.quantity,
      })),
      total: order.calculateTotal(),
    });
  });

  it("should find order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer Name");
    customer.changeAddress(
      new Address("Rua teste", 10, "São Paulo", "São Paulo", "00000-000")
    );
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 100);
    const product2 = new Product("2", "Product 2", 200);
    productRepository.create(product);
    productRepository.create(product2);

    const orderRepository = new OrderRepository();
    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );
    const order = new Order("1", customer.id, [orderItem]);
    await orderRepository.create(order);
    const orderItem2 = new OrderItem(
      "2",
      product2.name,
      product2.price,
      product2.id,
      4
    );
    const order2 = new Order("2", customer.id, [orderItem2]);
    await orderRepository.create(order2);

    const orders = [order, order2];

    const foundOrders = await orderRepository.findAll();

    expect(orders).toEqual(foundOrders);
  });
});
