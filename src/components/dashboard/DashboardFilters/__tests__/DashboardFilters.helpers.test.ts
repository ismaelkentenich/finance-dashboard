import { en } from "@/locales/en";
import { pt } from "@/locales/pt-br";
import { describe, expect, it } from "vitest";
import { getCategoryOptions, getPeriodOptions, getTypeOptions } from "../DashboardFilters.helpers";

describe("DashboardFilters Helpers", () => {
  describe("getPeriodOptions", () => {
    it("returns period options formatted according to pt-BR translation dictionary", () => {
      const options = getPeriodOptions(pt);

      expect(options).toHaveLength(3);
      expect(options[0]).toEqual({
        value: "current-month",
        label: "Mês Atual",
      });
    });

    it("returns period options formatted according to en-US translation dictionary", () => {
      const options = getPeriodOptions(en);

      expect(options[0]).toEqual({
        value: "current-month",
        label: "Current Month",
      });
    });
  });

  describe("getTypeOptions", () => {
    it("returns all, income, and expense options mapped from dictionary", () => {
      const options = getTypeOptions(pt);

      expect(options).toHaveLength(3);
      expect(options.map((opt) => opt.value)).toEqual(["all", "income", "expense"]);
      expect(options[1].label).toBe("Receitas");
      expect(options[2].label).toBe("Despesas");
    });
  });

  describe("getCategoryOptions", () => {
    it("prepends 'all' category option and maps all standard categories", () => {
      const options = getCategoryOptions(pt);

      expect(options[0]).toEqual({ value: "all", label: "Todas as Categorias" });
      expect(options.length).toBeGreaterThan(10);

      const housingOption = options.find((opt) => opt.value === "housing");
      expect(housingOption?.label).toBe("Moradia");
    });
  });
});
