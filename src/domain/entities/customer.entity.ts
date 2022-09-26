import { Address } from "./address";

export class Customer {
  private _id: string;
  private _name: string;
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;

    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }

    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
  }

  set Address(address: Address) {
    if (this._active && !address) {
      throw new Error("Address is mandatory to activate a customer!");
    }
    this._address = address;
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (!this._address) {
      throw new Error("Address is mandatory to activate a customer!");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  changeName(name: string) {
    if (!name) {
      throw new Error("Name is required");
    }
    this._name = name;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }
}
