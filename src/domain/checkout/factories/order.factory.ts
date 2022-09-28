import { v4 as uuid } from "uuid";
import { OrderItem } from "../entities/order-item";
import { Order } from "../entities/order.entity";

interface OrderFactoryProps {
  id: string;
  customerId: string;
  items: {
    id: string;
    name: string;
    productId: string;
    quantity: number;
    price: number;
  }[];
}

export class OrderFactory {
  static create(orderFactoryProps: OrderFactoryProps): Order {
    const items = orderFactoryProps.items.map((propItem) => {
      return new OrderItem(
        propItem.id,
        propItem.name,
        propItem.price,
        propItem.productId,
        propItem.quantity
      );
    });

    return new Order(orderFactoryProps.id, orderFactoryProps.customerId, items);
  }
}
