import { BaseError } from "./BaseError";

export class ExternalApiError extends BaseError {
  constructor(message = "Error External API Error", httpcode = 500) {
    super("External API Error", httpcode, message, true);
  }
}
