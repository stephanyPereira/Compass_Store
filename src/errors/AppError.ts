export default class AppError {
  public readonly details: string;
  public readonly statusCode: number;
  public readonly message: string;

  constructor(details: string, statusCode = 400, message = 'Bad Request') {
    this.details = details;
    this.message = message;
    this.statusCode = statusCode;
  }
}
