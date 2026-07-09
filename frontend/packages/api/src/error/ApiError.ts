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

export function isApiError(error: unknown): error is ApiError {
  return (
    error instanceof ApiError ||
    (error !== null &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ApiError" &&
      "code" in error &&
      typeof (error as any).code === "number")
  );
}
