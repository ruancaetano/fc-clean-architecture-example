import { EventHandlerInterface } from "../../../@shared/events/event-handler.interface";
import { EventInterface } from "../../../@shared/events/event.interface";
import { Customer } from "../../entities/customer.entity";
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
