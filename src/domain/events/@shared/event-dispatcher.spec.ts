import { CustomerCreatedEvent } from "../customer/customer-created.event";
import { FirstConsolelogWhenCustomerCreatedHandler } from "../customer/handlers/first-console-log-when-customer-created.handler";
import { SecondConsolelogWhenCustomerCreatedHandler } from "../customer/handlers/second-console-log-when-customer-created.handler";
import { SendEmailWhenProductIsCreatedHandler } from "../product/handlers/send-email-when-product-created.handler";
import { ProductCreatedEvent } from "../product/product-created.event";
import { EventDispatcher } from "./event-dispatcher";

describe("Domain events tests", () => {
  describe("Product Created Event", () => {
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

      eventDispatcher.register(
        productCreatedEvent.constructor.name,
        eventHandler
      );

      expect(
        eventDispatcher.handlers[productCreatedEvent.constructor.name]
      ).toBeDefined();
      expect(
        eventDispatcher.handlers[productCreatedEvent.constructor.name].length
      ).toBe(1);
      expect(
        eventDispatcher.handlers[productCreatedEvent.constructor.name][0]
      ).toMatchObject(eventHandler);

      eventDispatcher.notify(productCreatedEvent);

      expect(spyEventHandler).toBeCalledWith(productCreatedEvent);
      expect(spyEventHandler).toBeCalledTimes(1);
    });
  });

  describe("Customer Created Event", () => {
    it("should register console.log events", () => {
      const eventDispatcher = new EventDispatcher();
      const firstEventHandler = new FirstConsolelogWhenCustomerCreatedHandler();
      const secondEventHandler =
        new SecondConsolelogWhenCustomerCreatedHandler();

      const eventName = "CustomerCreatedEvent";
      eventDispatcher.register(eventName, firstEventHandler);
      eventDispatcher.register(eventName, secondEventHandler);

      expect(eventDispatcher.handlers[eventName]).toBeDefined();
      expect(eventDispatcher.handlers[eventName].length).toBe(2);
      expect(eventDispatcher.handlers[eventName]).toMatchObject([
        firstEventHandler,
        secondEventHandler,
      ]);
    });

    it("should unregister an event handler", () => {
      const eventDispatcher = new EventDispatcher();
      const firstEventHandler = new FirstConsolelogWhenCustomerCreatedHandler();
      const secondEventHandler =
        new SecondConsolelogWhenCustomerCreatedHandler();

      const eventName = "CustomerCreatedEvent";
      eventDispatcher.register(eventName, firstEventHandler);
      eventDispatcher.register(eventName, secondEventHandler);

      expect(eventDispatcher.handlers[eventName]).toBeDefined();
      expect(eventDispatcher.handlers[eventName].length).toBe(2);
      expect(eventDispatcher.handlers[eventName]).toMatchObject([
        firstEventHandler,
        secondEventHandler,
      ]);

      eventDispatcher.unregister(eventName, firstEventHandler);

      expect(eventDispatcher.handlers[eventName].length).toBe(1);
      expect(eventDispatcher.handlers[eventName]).toMatchObject([
        secondEventHandler,
      ]);

      eventDispatcher.unregister(eventName, secondEventHandler);

      expect(eventDispatcher.handlers[eventName].length).toBe(0);
    });

    it("should unregister all events", () => {
      const eventDispatcher = new EventDispatcher();
      const firstEventHandler = new FirstConsolelogWhenCustomerCreatedHandler();
      const secondEventHandler =
        new SecondConsolelogWhenCustomerCreatedHandler();

      const eventName = "CustomerCreatedEvent";
      eventDispatcher.register(eventName, firstEventHandler);
      eventDispatcher.register(eventName, secondEventHandler);

      expect(eventDispatcher.handlers[eventName]).toBeDefined();
      expect(eventDispatcher.handlers[eventName].length).toBe(2);
      expect(eventDispatcher.handlers[eventName]).toMatchObject([
        firstEventHandler,
        secondEventHandler,
      ]);

      eventDispatcher.unregisterAll();

      expect(eventDispatcher.handlers.ProductCreatedEvent).not.toBeDefined();
    });

    it("should notify all events handlers", () => {
      const eventDispatcher = new EventDispatcher();
      const firstEventHandler = new FirstConsolelogWhenCustomerCreatedHandler();
      const secondEventHandler =
        new SecondConsolelogWhenCustomerCreatedHandler();

      const spyFirstEventHandler = jest.spyOn(firstEventHandler, "handle");
      const spySecondEventHandler = jest.spyOn(secondEventHandler, "handle");

      const eventName = "CustomerCreatedEvent";
      eventDispatcher.register(eventName, firstEventHandler);
      eventDispatcher.register(eventName, secondEventHandler);

      expect(eventDispatcher.handlers[eventName]).toBeDefined();
      expect(eventDispatcher.handlers[eventName].length).toBe(2);
      expect(eventDispatcher.handlers[eventName]).toMatchObject([
        firstEventHandler,
        secondEventHandler,
      ]);

      const customerCreatedEvent = new CustomerCreatedEvent({
        id: "123",
        name: "Customer",
      });

      eventDispatcher.notify(customerCreatedEvent);

      expect(spyFirstEventHandler).toBeCalledWith(customerCreatedEvent);
      expect(spySecondEventHandler).toBeCalledWith(customerCreatedEvent);
      expect(spyFirstEventHandler).toBeCalledTimes(1);
      expect(spySecondEventHandler).toBeCalledTimes(1);
    });
  });
});
