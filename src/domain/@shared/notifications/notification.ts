export type NotificationErrorProps = {
  message: string;
  context: string;
};

export class Notification {
  private _errors: NotificationErrorProps[] = [];

  getErros(): NotificationErrorProps[] {
    return this._errors;
  }

  addError(error: NotificationErrorProps) {
    this._errors.push(error);
  }

  getMessages(contextFilter?: string) {
    return this._errors
      .filter((error) => !contextFilter || error.context === contextFilter)
      .map((error) => `${error.context}: ${error.message}`)
      .join(", ");
  }

  hasErrors(): boolean {
    return this._errors.length > 0;
  }
}
