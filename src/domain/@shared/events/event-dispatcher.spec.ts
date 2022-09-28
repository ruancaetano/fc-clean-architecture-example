import { faker } from "@faker-js/faker";
import { Address } from "../../customer/entities/address";
import { Customer } from "../../customer/entities/customer.entity";
import { CustomerAddressChangedEvent } from "../../customer/events/customer-address-changed.event";
import { CustomerCreatedEvent } from "../../customer/events/customer-created.event";

import { ConsoleLogWhenCustomerAddressChangedHandler } from "../../customer/events/handlers/console-log-when-customer-address-changed.handler";
import { FirstConsolelogWhenCustomerCreatedHandler } from "../../customer/events/handlers/first-console-log-when-customer-created.handler";
import { SecondConsolelogWhenCustomerCreatedHandler } from "../../customer/events/handlers/second-console-log-when-customer-created.handler";
import { SendEmailWhenProductIsCreatedHandler } from "../../product/events/handlers/send-email-when-product-created.handler";
import { ProductCreatedEvent } from "../../product/events/product-created.event";

import { EventDispatcher } from "./event-dispatcher";

const createAddressMock = () => {
  return new Address(
    faker.address.street(),
    faker.datatype.number(),
    faker.address.city(),
    faker.address.state(),
    faker.address.zipCode()
  );
};

const createCustomerMock = () => {
  const customer = new Customer(faker.datatype.uuid(), faker.name.fullName());
  const address = createAddressMock();
  customer.changeAddress(address);

  return customer;
};

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

  describe("Customer Address Changed Event", () => {
    it("should register changed address handlers", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler = new ConsoleLogWhenCustomerAddressChangedHandler();

      const eventName = "CustomerAddressChangedEvent";
      eventDispatcher.register(eventName, eventHandler);

      expect(eventDispatcher.handlers[eventName]).toBeDefined();
      expect(eventDispatcher.handlers[eventName].length).toBe(1);
      expect(eventDispatcher.handlers[eventName]).toMatchObject([eventHandler]);
    });

    it("should unregister an event handler", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler = new ConsoleLogWhenCustomerAddressChangedHandler();

      const eventName = "CustomerAddressChangedEvent";
      eventDispatcher.register(eventName, eventHandler);

      expect(eventDispatcher.handlers[eventName]).toBeDefined();
      expect(eventDispatcher.handlers[eventName].length).toBe(1);
      expect(eventDispatcher.handlers[eventName]).toMatchObject([eventHandler]);

      eventDispatcher.unregister(eventName, eventHandler);

      expect(eventDispatcher.handlers[eventName].length).toBe(0);
    });

    it("should unregister all events", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler = new ConsoleLogWhenCustomerAddressChangedHandler();

      const eventName = "CustomerAddressChangedEvent";

      eventDispatcher.register(eventName, eventHandler);

      expect(eventDispatcher.handlers[eventName]).toBeDefined();
      expect(eventDispatcher.handlers[eventName].length).toBe(1);
      expect(eventDispatcher.handlers[eventName]).toMatchObject([eventHandler]);

      eventDispatcher.unregisterAll();

      expect(eventDispatcher.handlers.ProductCreatedEvent).not.toBeDefined();
    });

    it("should notify all events handlers", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler = new ConsoleLogWhenCustomerAddressChangedHandler();

      const spyEventHandler = jest.spyOn(eventHandler, "handle");

      const eventName = "CustomerAddressChangedEvent";

      eventDispatcher.register(eventName, eventHandler);

      expect(eventDispatcher.handlers[eventName]).toBeDefined();
      expect(eventDispatcher.handlers[eventName].length).toBe(1);
      expect(eventDispatcher.handlers[eventName]).toMatchObject([eventHandler]);

      const customerAddressChangedEvent = new CustomerAddressChangedEvent(
        createCustomerMock()
      );

      eventDispatcher.notify(customerAddressChangedEvent);

      expect(spyEventHandler).toBeCalledWith(customerAddressChangedEvent);
      expect(spyEventHandler).toBeCalledTimes(1);
    });
  });
});
