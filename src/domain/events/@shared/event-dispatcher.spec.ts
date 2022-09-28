import { SendEmailWhenProductIsCreatedHandler } from "../product/handlers/send-email-when-product-created.handler";
import { ProductCreatedEvent } from "../product/product-created.event";
import { EventDispatcher } from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(eventDispatcher.handlers.ProductCreatedEvent).toBeDefined();
    expect(eventDispatcher.handlers.ProductCreatedEvent.length).toBe(1);
    expect(eventDispatcher.handlers.ProductCreatedEvent[0]).toMatchObject(
      eventHandler
    );
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(eventDispatcher.handlers.ProductCreatedEvent).toBeDefined();
    expect(eventDispatcher.handlers.ProductCreatedEvent.length).toBe(1);
    expect(eventDispatcher.handlers.ProductCreatedEvent[0]).toMatchObject(
      eventHandler
    );

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);
    expect(eventDispatcher.handlers.ProductCreatedEvent.length).toBe(0);
  });

  it("should unregister all events", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(eventDispatcher.handlers.ProductCreatedEvent).toBeDefined();
    expect(eventDispatcher.handlers.ProductCreatedEvent.length).toBe(1);
    expect(eventDispatcher.handlers.ProductCreatedEvent[0]).toMatchObject(
      eventHandler
    );

    eventDispatcher.unregisterAll();
    expect(eventDispatcher.handlers.ProductCreatedEvent).not.toBeDefined();
  });

  it("should notify all events handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    const productCreatedEvent = new ProductCreatedEvent({
      id: 1,
      name: "Product 1",
      description: "product-1",
      price: 10.0,
    });

    eventDispatcher.register(productCreatedEvent.constructor.name, eventHandler);

    expect(eventDispatcher.handlers[productCreatedEvent.constructor.name]).toBeDefined();
    expect(eventDispatcher.handlers[productCreatedEvent.constructor.name].length).toBe(1);
    expect(eventDispatcher.handlers[productCreatedEvent.constructor.name][0]).toMatchObject(
      eventHandler
    );

    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toBeCalledWith(productCreatedEvent);
    expect(spyEventHandler).toBeCalledTimes(1);
  });
});
