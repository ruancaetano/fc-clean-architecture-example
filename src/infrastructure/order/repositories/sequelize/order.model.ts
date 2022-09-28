import {
  Model,
  Column,
  PrimaryKey,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { CustomerModel } from "../../../customer/repositories/sequelize/customer.model";
import { OrderItemModel } from "./order-item.model";

@Table({
  tableName: "orders",
  timestamps: false,
})
export class OrderModel extends Model {
  @PrimaryKey
  @Column
  declare id: string;

  @ForeignKey(() => CustomerModel)
  @Column({
    allowNull: false,
  })
  declare customer_id: string;

  @BelongsTo(() => CustomerModel)
  declare customer: CustomerModel;

  @Column({
    allowNull: false,
  })
  declare total: number;

  @HasMany(() => OrderItemModel)
  declare items: OrderItemModel[];
}
