import { EventInterface } from "../../@shared/events/event.interface";
import { Customer } from "../../customer/entities/customer.entity";


export class CustomerAddressChangedEvent implements EventInterface {
  dateTimeOccured: Date;
  eventData: Customer;

  constructor(eventData: Customer) {
    this.dateTimeOccured = new Date();
    this.eventData = eventData;
  }
}
