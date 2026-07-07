import { NextResponse } from "next/server"
import { AppError } from "@/lib/errors"
import type { ApiError, ApiResponse, ApiSuccess } from "@/types/api"

export function successResponse<T>(data: T): ApiSuccess<T> {
  return { success: true, data }
}

export function errorResponse(error: unknown): ApiError {
  if (error instanceof AppError) {
    return { success: false, error: { code: error.code, message: error.message } }
  }

  console.error("Unhandled error:", error)

  return {
    success: false,
    error: { code: "INTERNAL_ERROR", message: "Something went wrong. Please try again." },
  }
}

export function jsonResponse<T>(response: ApiResponse<T>): NextResponse<ApiResponse<T>> {
  if (response.success) {
    return NextResponse.json(response)
  }

  const status = response.error.code === "INTERNAL_ERROR" ? 500 : statusForCode(response.error.code)

  return NextResponse.json(response, { status })
}

function statusForCode(code: ApiError["error"]["code"]): number {
  switch (code) {
    case "VALIDATION_ERROR":
      return 400
    case "UNAUTHENTICATED":
      return 401
    case "FORBIDDEN":
      return 403
    case "NOT_FOUND":
      return 404
    default:
      return 500
  }
}
