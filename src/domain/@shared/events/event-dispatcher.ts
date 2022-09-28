import { EventDispatcherInterface } from "./event-dispatcher.interface";
import { EventHandlerInterface } from "./event-handler.interface";
import { EventInterface } from "./event.interface";

export class EventDispatcher implements EventDispatcherInterface {
  private _handlers: Record<string, EventHandlerInterface[]> = {};

  get handlers(): Record<string, EventHandlerInterface[]> {
    return this._handlers;
  }

  register(
    eventName: string,
    handler: EventHandlerInterface<EventInterface>
  ): void {
    if (!this._handlers[eventName]) {
      this._handlers[eventName] = [];
    }

    this._handlers[eventName].push(handler);
  }

  unregister(
    eventName: string,
    handler: EventHandlerInterface<EventInterface>
  ): void {
    if (this._handlers[eventName]) {
      this._handlers[eventName] = this._handlers[eventName].filter(
        (item) => item !== handler
      );
    }
  }

  unregisterAll(): void {
    this._handlers = {};
  }

  notify(event: EventInterface): void {
    const eventName = event.constructor.name;

    if (this._handlers[eventName]) {
      this._handlers[eventName].forEach((handler) => {
        handler.handle(event);
      });
    }
  }
}
