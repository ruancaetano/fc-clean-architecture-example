export interface InputFindCustomerDto {
  id: string;
}

export interface OutputFindCustomerDto {
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
