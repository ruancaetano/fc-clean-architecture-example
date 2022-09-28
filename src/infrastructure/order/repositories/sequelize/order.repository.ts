import { OrderItem } from "../../../../domain/checkout/entities/order-item";
import { Order } from "../../../../domain/checkout/entities/order.entity";
import { OrderRespositoryInterface } from "../../../../domain/checkout/repositories/order.repository";
import { OrderItemModel } from "./order-item.model";
import { OrderModel } from "./order.model";


export class OrderRepository implements OrderRespositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.calculateTotal(),
        items: entity.items.map((item) => {
          return {
            id: item.id,
            product_id: item.productId,
            quantity: item.quantity,
            name: item.name,
            price: item.price,
          };
        }),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const transaction = await OrderModel.sequelize.transaction();

    try {
      const mappedOrderItems = entity.items.map((item) => {
        return {
          id: item.id,
          product_id: item.productId,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
          order_id: entity.id,
        };
      });

      await Promise.all(
        mappedOrderItems.map((item) => {
          return OrderItemModel.upsert(item, { transaction });
        })
      );

      await OrderModel.update(
        {
          id: entity.id,
          customer_id: entity.customerId,
          total: entity.calculateTotal(),
          items: mappedOrderItems,
        },
        {
          where: {
            id: entity.id,
          },
          transaction
        }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new Error("Update transaction failed");
    }
  }

  async find(id: string): Promise<Order> {
    const foundOrderModel = await OrderModel.findOne({
      where: { id },
      include: ["items"],
    });

    if (!foundOrderModel) {
      throw new Error("Order not found");
    }

    const items: OrderItem[] = foundOrderModel.items.map((item) => {
      return new OrderItem(
        item.id,
        item.name,
        item.price / item.quantity,
        item.product_id,
        item.quantity
      );
    });

    return new Order(foundOrderModel.id, foundOrderModel.customer_id, items);
  }

  async findAll(): Promise<Order[]> {
    const foundModels = await OrderModel.findAll({
      include: ["items"],
    });

    return foundModels.map((model) => {
      const items: OrderItem[] = model.items.map((item) => {
        return new OrderItem(
          item.id,
          item.name,
          item.price / item.quantity,
          item.product_id,
          item.quantity
        );
      });

      return new Order(model.id, model.customer_id, items);
    });
  }
}
