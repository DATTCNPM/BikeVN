export class ApiError extends Error {
  public code: number;
  public status?: number;

  constructor(code: number, message: string, status?: number) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export function isApiError(error: any): error is ApiError {
  return (
    error instanceof ApiError ||
    (error && typeof error === "object" && error.name === "ApiError" && typeof error.code === "number")
  );
}

