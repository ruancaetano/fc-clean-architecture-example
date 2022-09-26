import { Customer } from "../entities/customer.entity";
import { Order } from "../entities/order.entity";
import { OrderItem } from "../entities/order-item";
import { Product } from "../entities/product.entity";
import { OrderService } from "./order.service";
import { ProductService } from "./product.service";

describe("Order service unit tests", () => {
  it("should place an order", () => {
    const customer = new Customer("1", "Customer 1");
    const item1 = new OrderItem("1", "Item 1", 100, "p1", 1);

    const order = OrderService.placeOrder(customer, [item1]);

    expect(customer.rewardPoints).toBe(50);
    expect(order.calculateTotal()).toBe(100);
  });
  it("should sum all order totals", () => {
    const item1 = new OrderItem("1", "Item 1", 100, "p1", 1);
    const item2 = new OrderItem("2", "Item 2", 200, "p1", 2);
    const item3 = new OrderItem("3", "Item 3", 300, "p1", 3);

    const order1 = new Order("1", "Order 1", [item1]);
    const order2 = new Order("2", "Order 2", [item2]);
    const order3 = new Order("3", "Order 3", [item3]);

    expect(OrderService.calculateAllOrdersTotal([order1, order2, order3])).toBe(
      1400
    );
  });
});
