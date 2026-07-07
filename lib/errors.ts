import type { ApiErrorCode } from "@/types/api"

export class AppError extends Error {
  readonly code: ApiErrorCode
  readonly status: number

  constructor(message: string, code: ApiErrorCode, status: number) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.status = status
  }
}

export class ValidationError extends AppError {
  constructor(message = "Invalid input") {
    super(message, "VALIDATION_ERROR", 400)
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "You must be signed in to do this") {
    super(message, "UNAUTHENTICATED", 401)
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "You do not have permission to do this") {
    super(message, "FORBIDDEN", 403)
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, "NOT_FOUND", 404)
  }
}
