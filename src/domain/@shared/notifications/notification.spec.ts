import { Notification } from "./notification";
describe("Notificaiton unit tests", () => {
  it("should create errors", () => {
    const notificaiton = new Notification();
    const error = {
      message: "error message",
      context: "customer",
    };

    notificaiton.addError(error);

    expect(notificaiton.getMessages("customer")).toBe(
      "customer: error message"
    );

    const error2 = {
      message: "error message 2",
      context: "customer",
    };
    notificaiton.addError(error2);

    expect(notificaiton.getMessages("customer")).toBe(
      "customer: error message, customer: error message 2"
    );

    const error3 = {
      message: "error message 3",
      context: "order",
    };
    notificaiton.addError(error3);

    expect(notificaiton.getMessages()).toBe(
      "customer: error message, customer: error message 2, order: error message 3"
    );
  });

  it("should check if notification has at least on error", () => {
    const notificaiton = new Notification();
    const error = {
      message: "error message",
      context: "customer",
    };

    notificaiton.addError(error);

    expect(notificaiton.hasErrors()).toBeTruthy();
  });

  it("should get all erros props", () => {
    const notificaiton = new Notification();
    const error = {
      message: "error message",
      context: "customer",
    };

    notificaiton.addError(error);

    expect(notificaiton.getErros()).toEqual([error]);
  });
});
