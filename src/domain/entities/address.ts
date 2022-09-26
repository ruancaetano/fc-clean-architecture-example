export class Address {
  _street: string;
  _number: number;
  _city: string;
  _state: string;
  _zipcode: string;

  constructor(
    street: string,
    streetNumber: number,
    city: string,
    state: string,
    zipcode: string
  ) {
    this._street = street;
    this._number = streetNumber;
    this._city = city;
    this._state = state;
    this._zipcode = zipcode;

    this.validate();
  }

  validate(): void {
    if (!this._street) {
      throw new Error("Street is required");
    }

    if (!this._number) {
      throw new Error("Number is required");
    }

    if (!this._city) {
      throw new Error("City is required");
    }

    if (!this._state) {
      throw new Error("State is required");
    }

    if (!this._zipcode) {
      throw new Error("Zipcode is required");
    }
  }

  toString() {
    return `${this._street} ${this._number} ${this._city} ${this._state} ${this._zipcode}`;
  }
}
