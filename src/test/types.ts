import type { SupportedLocale } from "@/locales/types";
import type { QueryClient } from "@tanstack/react-query";
import type { RenderHookOptions, RenderOptions } from "@testing-library/react";
import type { ReactNode } from "react";
import type { AxeMatchers } from "vitest-axe/matchers";

export interface TestProvidersOptions {
  locale?: SupportedLocale;
  queryClient?: QueryClient;
}

export interface CustomRenderOptions extends Omit<RenderOptions, "wrapper">, TestProvidersOptions {}

export type CustomRenderHookOptions<TProps> = Omit<RenderHookOptions<TProps>, "wrapper"> &
  TestProvidersOptions;

export interface AllTheProvidersProps extends TestProvidersOptions {
  children: ReactNode;
}

declare module "vitest" {
  /* eslint-disable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
  interface Assertion<T = any> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
  /* eslint-enable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
}
