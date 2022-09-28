import { Customer } from "../../entities/customer.entity";
import { EventInterface } from "../@shared/event.interface";

export class CustomerAddressChangedEvent implements EventInterface {
  dateTimeOccured: Date;
  eventData: Customer;

  constructor(eventData: Customer) {
    this.dateTimeOccured = new Date();
    this.eventData = eventData;
  }
}
