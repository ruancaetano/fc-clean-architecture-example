export interface InputUpdateCustomerDto {
    id: string;
    name: string;
    address: {
      street: string;
      number: number;
      city: string;
      state: string;
      zipcode: string;
    };
}

export interface OutputUpdateCustomerDto {
    id: string;
    name: string;
    address: {
      street: string;
      number: number;
      city: string;
      state: string;
      zipcode: string;
    };
}