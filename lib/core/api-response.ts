import { NextResponse } from "next/server";
import { ApiResponse } from "./types";

/**
 * Standardized Success API Response Builder
 */
export function apiSuccess<T>(
  data: T,
  meta?: Record<string, unknown>,
  status = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta,
    },
    { status }
  );
}

/**
 * Standardized Error API Response Builder
 */
export function apiError(
  code: string,
  message: string,
  details?: unknown,
  status = 400
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}
