type ErrorSeverity = "low" | "medium" | "high" | "critical"

interface ErrorLogContext {
  component?: string
  action?: string
  data?: Record<string, any>
  severity?: ErrorSeverity
  userId?: string
}

interface ErrorLog {
  id: string
  timestamp: string
  severity: ErrorSeverity
  component: string
  action: string
  message: string
  stack?: string
  data?: Record<string, any>
  userId?: string
}

// In-memory error log storage (in production, use proper logging service)
let errorLogs: ErrorLog[] = []

/**
 * Logs application errors with context
 */
export function logAppError(error: Error, context: ErrorLogContext = {}): void {
  const { component = "unknown", action = "unknown", data = {}, severity = "medium", userId = "anonymous" } = context

  const errorLog: ErrorLog = {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    severity,
    component,
    action,
    message: error.message,
    stack: error.stack,
    data,
    userId,
  }

  errorLogs.push(errorLog)

  // Keep only last 100 logs to prevent memory issues
  if (errorLogs.length > 100) {
    errorLogs = errorLogs.slice(-100)
  }

  // In a real app, you might send this to a logging service
  console.error(`[${severity.toUpperCase()}] Error in ${component} during ${action}:`, error.message, {
    stack: error.stack,
    userId,
    timestamp: new Date().toISOString(),
    ...data,
  })
}

/**
 * Logs user actions for analytics
 */
export function logUserAction(action: string, data: Record<string, any> = {}): void {
  // In a real app, you might send this to an analytics service
  console.log(`[USER ACTION] ${action}:`, {
    timestamp: new Date().toISOString(),
    ...data,
  })
}

/**
 * Formats error messages for user display
 */
export function formatErrorForUser(error: Error | string): string {
  const message = typeof error === "string" ? error : error.message

  // Clean up common error messages to be more user-friendly
  if (message.includes("network error") || message.includes("failed to fetch")) {
    return "Network error. Please check your internet connection and try again."
  }

  if (message.includes("timeout")) {
    return "The operation timed out. Please try again."
  }

  if (message.includes("insufficient funds") || message.includes("insufficient balance")) {
    return "Insufficient funds for this transaction."
  }

  // Default generic message if we can't make it more user-friendly
  return message || "An unexpected error occurred. Please try again."
}

/**
 * Gets all error logs
 */
export function getErrorLogs(): ErrorLog[] {
  return [...errorLogs]
}

/**
 * Clears all error logs
 */
export function clearErrorLogs(): void {
  errorLogs = []
}

/**
 * Gets error logs by severity
 */
export function getErrorLogsBySeverity(severity: ErrorSeverity): ErrorLog[] {
  return errorLogs.filter(log => log.severity === severity)
}

/**
 * Creates a safe error handler that won't crash the app
 */
export function createSafeErrorHandler(
  handler: (error: Error) => void,
  fallback?: (error: Error) => void,
): (error: Error) => void {
  return (error: Error) => {
    try {
      handler(error)
    } catch (handlerError) {
      console.error("Error in error handler:", handlerError)
      if (fallback) {
        try {
          fallback(error)
        } catch (fallbackError) {
          console.error("Error in fallback error handler:", fallbackError)
        }
      }
    }
  }
}

// Export ErrorSeverity type for use in other files
export type { ErrorSeverity, ErrorLog }
