export class ApplicationError extends Error {
  public statusCode: number;
  public details: Object;

  constructor(message, statusCode, details?) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }
}