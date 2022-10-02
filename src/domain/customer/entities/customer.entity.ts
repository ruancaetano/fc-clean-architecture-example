import { Entity } from "../../@shared/entities/entity.abstract";
import { NotificationError } from "../../@shared/notifications/notification.error";
import { Address } from "./address";

export class Customer extends Entity {
  private _name: string;
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string) {
    super();
    this._id = id;
    this._name = name;

    this.validate();

    if (this.notification.hasErrors()) {
      throw new NotificationError(this.notification.getErros());
    }
  }

  get name(): string {
    return this._name;
  }

  get Address(): Address {
    return this._address;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  get active(): boolean {
    return this._active;
  }

  validate() {
    if (!this.id) {
      this.notification.addError({
        message: "Id is required",
        context: "customer",
      });
    }

    if (!this._name) {
      this.notification.addError({
        message: "Name is required",
        context: "customer",
      });
    }
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (!this._address) {
      this.notification.addError({
        message: "Address is mandatory to activate a customer!",
        context: "customer",
      });
      throw new NotificationError(this.notification.getErros());
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  changeAddress(address: Address) {
    if (this._active && !address) {
      this.notification.addError({
        message: "Address is mandatory to activate a customer!",
        context: "customer",
      });
      throw new NotificationError(this.notification.getErros());
    }
    this._address = address;
  }

  changeName(name: string) {
    if (!name) {
      this.notification.addError({
        message: "Name is required",
        context: "customer",
      });
      throw new NotificationError(this.notification.getErros());
    }
    this._name = name;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }
}
