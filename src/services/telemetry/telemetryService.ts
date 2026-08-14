import type { LogContext, LogLevel, MetricPayload, TelemetryService } from "./telemetry.types";

class ConsoleTelemetryService implements TelemetryService {
  private isProduction = process.env.NODE_ENV === "production";

  log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const payload = {
      timestamp,
      level,
      message,
      ...(context ? { context } : {}),
    };

    if (level === "error") {
      console.error("[TELEMETRY:ERROR]", payload);
    } else if (level === "warn") {
      console.warn("[TELEMETRY:WARN]", payload);
    } else {
      console.info("[TELEMETRY:INFO]", payload);
    }
  }

  logError(error: Error, context?: LogContext): void {
    this.log("error", error.message, {
      name: error.name,
      stack: this.isProduction ? undefined : error.stack,
      ...context,
    });
  }

  recordMetric(metric: MetricPayload): void {
    const roundedValue =
      metric.name === "CLS" ? Math.round(metric.value * 1000) / 1000 : Math.round(metric.value);

    console.info(`[WEB-VITAL] ${metric.name}:`, {
      value: roundedValue,
      rating: metric.rating,
      id: metric.id,
    });
  }
}

export const telemetryService = new ConsoleTelemetryService();
