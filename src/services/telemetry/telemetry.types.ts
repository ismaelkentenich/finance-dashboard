export type LogLevel = "info" | "warn" | "error";

export interface LogContext {
  [key: string]: unknown;
}

export interface MetricPayload {
  name: string;
  value: number;
  rating?: "good" | "needs-improvement" | "poor";
  id?: string;
  navigationType?: string;
}

export interface TelemetryService {
  log(level: LogLevel, message: string, context?: LogContext): void;
  logError(error: Error, context?: LogContext): void;
  recordMetric(metric: MetricPayload): void;
}
