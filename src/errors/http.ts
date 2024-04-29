abstract class HttpError extends Error {
  public status!: number;
}

export class Unauthorized extends HttpError {
  constructor(message = "Unauthorized") {
    super(message);

    this.status = 401;
  }
}
