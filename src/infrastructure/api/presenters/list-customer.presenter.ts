import { toXML } from "jstoxml";
import { OutputListCustomerDto } from "../../../usecases/customer/list/list-customer.usecase.dto";

export class ListCustomerPresenter {
  static toXML(data: OutputListCustomerDto): string {
    const xmlOptions = {
      header: true,
      indent: "  ",
      newline: "\n",
      allowEmpty: true,
    };

    return toXML(
      {
        customers: {
          customer: data.customers.map((item) => ({
            id: item.id,
            name: item.name,
            address: {
              street: item.address.street,
              number: item.address.number,
              city: item.address.city,
              state: item.address.state,
              zipcode: item.address.zipcode,
            },
          })),
        },
      },
      xmlOptions
    );
  }
}
