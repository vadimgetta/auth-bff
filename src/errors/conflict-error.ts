import { CustomError } from "./custom-error";

export default class ConflictError extends CustomError {
  statusCode = 409;

  constructor(public message: string) {
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, ConflictError.prototype);
  }

  serializeError() {
    return { message: this.message };
  }
}
