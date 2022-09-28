import { Customer } from "../../../entities/customer.entity";
import { EventHandlerInterface } from "../../@shared/event-handler.interface";
import { EventInterface } from "../../@shared/event.interface";
import { CustomerAddressChangedEvent } from "../customer-address-changed.event";

export class ConsoleLogWhenCustomerAddressChangedHandler
  implements EventHandlerInterface<CustomerAddressChangedEvent>
{
  handle(event: EventInterface): void {
    const customer = event.eventData as Customer;
    console.log(
      `Endereço do cliente: ${customer.id}, ${
        customer.name
      } alterado para: ${Object.values(customer.Address).join(", ")}`
    );
  }
}
