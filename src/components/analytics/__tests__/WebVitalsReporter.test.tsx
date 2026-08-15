import type { MetricPayload } from "@/services/telemetry";
import { telemetryService } from "@/services/telemetry";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WebVitalsReporter } from "../WebVitalsReporter";

let webVitalsCallback: (metric: MetricPayload) => void;

vi.mock("next/web-vitals", () => ({
  useReportWebVitals: (cb: (metric: MetricPayload) => void) => {
    webVitalsCallback = cb;
  },
}));

describe("WebVitalsReporter Component", () => {
  it("subscribes to useReportWebVitals and forwards metric payload to telemetryService", () => {
    const recordMetricSpy = vi.spyOn(telemetryService, "recordMetric").mockImplementation(() => {});

    render(<WebVitalsReporter />);

    const sampleMetric: MetricPayload = {
      name: "FCP",
      value: 230,
      rating: "good",
      id: "metric-fcp-1",
      navigationType: "navigate",
    };

    webVitalsCallback(sampleMetric);

    expect(recordMetricSpy).toHaveBeenCalledWith({
      name: "FCP",
      value: 230,
      rating: "good",
      id: "metric-fcp-1",
      navigationType: "navigate",
    });
  });
});
