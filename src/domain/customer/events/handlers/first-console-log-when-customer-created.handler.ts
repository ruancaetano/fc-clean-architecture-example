import { EventHandlerInterface } from "../../../@shared/events/event-handler.interface";
import { EventInterface } from "../../../@shared/events/event.interface";

export class FirstConsolelogWhenCustomerCreatedHandler
  implements EventHandlerInterface
{
  handle(event: EventInterface): void {
    console.log("Esse é o primeiro console.log do evento: CustomerCreated");
  }
}
