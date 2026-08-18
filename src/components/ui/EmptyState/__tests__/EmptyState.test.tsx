import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "../EmptyState";

describe("EmptyState UI Component", () => {
  describe("content rendering and status role", () => {
    it("renders title, description and status role container", () => {
      render(
        <EmptyState
          title="No Transactions Found"
          description="Try adjusting your filter options."
        />
      );

      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByTestId("empty-state-title")).toHaveTextContent("No Transactions Found");
      expect(screen.getByTestId("empty-state-description")).toHaveTextContent(
        "Try adjusting your filter options."
      );
    });

    it("renders custom action node when passed", () => {
      render(
        <EmptyState
          title="Empty list"
          description="Description text"
          action={<button type="button">Reset Filters</button>}
        />
      );

      expect(screen.getByRole("button", { name: "Reset Filters" })).toBeInTheDocument();
    });
  });
});
