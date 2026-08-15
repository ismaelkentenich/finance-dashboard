import type { SupportedLocale } from "@/locales/types";
import type { QueryClient } from "@tanstack/react-query";
import type { RenderOptions } from "@testing-library/react";
import type { ReactNode } from "react";
import type { AxeMatchers } from "vitest-axe/matchers";

export interface CustomRenderProvidersOptions {
  locale?: SupportedLocale;
  queryClient?: QueryClient;
}

export interface CustomRenderOptions
  extends Omit<RenderOptions, "wrapper">, CustomRenderProvidersOptions {}

export interface AllTheProvidersProps extends CustomRenderProvidersOptions {
  children: ReactNode;
}

declare module "vitest" {
  /* eslint-disable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
  interface Assertion<T = any> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
  /* eslint-enable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
}
