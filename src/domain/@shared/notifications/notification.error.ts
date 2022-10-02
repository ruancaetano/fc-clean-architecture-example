import { NotificationErrorProps } from "./notification";

export class NotificationError extends Error {
  constructor(public errors: NotificationErrorProps[]) {
    super(errors.map((err) => `${err.context}: ${err.message}`).join(", "));
  }
}
