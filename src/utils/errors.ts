export class HTTPError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "HTTPError";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, HTTPError.prototype);
  }
}

export function mapStatusToError(status: number): HTTPError {
  switch (status) {
    case 400:
      return new HTTPError(
        400,
        "Unable to process the request. Please check your input and try again."
      );
    case 401:
      return new HTTPError(
        401,
        "Authentication required. Please log in to continue."
      );
    case 403:
      return new HTTPError(
        403,
        "You do not have permission to perform this action."
      );
    case 404:
      return new HTTPError(404, "Requested resource not found.");
    case 405:
      return new HTTPError(
        405,
        "This action is not allowed in the current context."
      );
    case 500:
      return new HTTPError(
        500,
        "Something went wrong on our end. Please try again later. If the error persists, please contact the support team."
      );

    default:
      return new HTTPError(
        status,
        `An unexpected error occurred (code ${status}). Please try again.`
      );
  }
}

export function createHTTPError(
  status: number,
  serverMessage?: string
): HTTPError {
  return serverMessage?.trim()
    ? new HTTPError(status, serverMessage)
    : mapStatusToError(status);
}
