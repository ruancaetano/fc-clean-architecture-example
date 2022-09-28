import { Order } from "./order.entity";
import { OrderItem } from "./order-item";

describe("Order entity test unit", () => {
  describe("Creation", () => {
    it("should throws error if id is empty", () => {
      expect(() => new Order("", "", [])).toThrow("Id is required");
    });

    it("should throws error if customer id is empty", () => {
      expect(() => new Order("1", "", [])).toThrow("Customer id is required");
    });

    it("should throws error if order items empty", () => {
      expect(() => new Order("1", "1", [])).toThrow(
        "At least one item is required"
      );
    });

    it("should create order", () => {
      const item = new OrderItem("1", "Item 1", 10, "p1", 2);
      const order = new Order("1", "1", [item]);
      expect(order).toBeDefined();
    });
  });

  describe("total", () => {
    it("should return total", () => {
      const item1 = new OrderItem("1", "Item 1", 100, "p1", 2);
      const item2 = new OrderItem("1", "Item 1", 200, "p1", 2);

      const order1 = new Order("1", "1", [item1]);

      expect(order1.calculateTotal()).toBe(200);

      const order2 = new Order("2", "2", [item1, item2]);

      expect(order2.calculateTotal()).toBe(600);
    });

    it("should check if the quantity is greater than 0", () => {
      const item = new OrderItem("1", "Item 1", 100, "p1", 0);

      expect(() => new Order("1", "1", [item])).toThrowError(
        "Quantity must be greater than 0"
      );
    });
  });
});
