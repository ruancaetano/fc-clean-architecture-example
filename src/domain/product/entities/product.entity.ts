import { Entity } from "../../@shared/entities/entity.abstract";
import { NotificationError } from "../../@shared/notifications/notification.error";
import { ProductInterface } from "./product.interface";

export class Product extends Entity implements ProductInterface {
  private _name: string;
  private _price: number;

  constructor(id: string, name: string, price: number) {
    super();
    this._id = id;
    this._name = name;
    this._price = price;

    this.validate();

    if (this.notification.hasErrors()) {
      throw new NotificationError(this.notification.getErros());
    }
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  validate(): boolean {
    if (!this._id.length) {
      this.notification.addError({
        message: "Id is required",
        context: "product",
      });
    }
    if (!this._name.length) {
      this.notification.addError({
        message: "Name is required",
        context: "product",
      });
    }
    if (this._price < 0) {
      this.notification.addError({
        message: "Price must be greater than zero",
        context: "product",
      });
    }
    return true;
  }

  changeName(name: string) {
    if (!name) {
      this.notification.addError({
        message: "Name is required",
        context: "product",
      });
      throw new NotificationError(this.notification.getErros());
    }
    this._name = name;
  }

  changePrice(price: number) {
    if (price < 0) {
      this.notification.addError({
        message: "Price must be greater than zero",
        context: "product",
      });
      throw new NotificationError(this.notification.getErros());
    }
    this._price = price;
  }
}
