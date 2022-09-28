import { EventInterface } from "../../@shared/events/event.interface";

export class CustomerCreatedEvent implements EventInterface {
  dateTimeOccured: Date;
  eventData: any;

  constructor(eventData: any) {
    this.dateTimeOccured = new Date();
    this.eventData = eventData;
  }
}
