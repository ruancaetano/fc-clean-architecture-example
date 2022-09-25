import { OrderItem } from "./order-item";

export class Order {
  private _id: string;
  private _customerId: string;
  private _items: OrderItem[] = [];

  constructor(id: string, customerId: string, items: OrderItem[]) {
    this._id = id;
    this._customerId = customerId;
    this._items = items;

    this.validate()
  }

  validate() {
    if (!this._id) {
      throw new Error("Id is required");
    }
    if (!this._customerId) {
      throw new Error("Customer id is required");
    }
    if (this._items.length === 0) {
      throw new Error("At least one item is required");
    }

    if (this._items.some((item) => item.quantity <= 0)) {
      throw new Error("Quantity must be greater than 0");
    }
  }


  calculateTotal(): number {
    return this._items.reduce((total, item) => total + item.price, 0);
  }
}
