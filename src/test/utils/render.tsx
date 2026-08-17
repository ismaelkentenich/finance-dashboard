import {
  render as testingLibraryRender,
  renderHook as testingLibraryRenderHook,
  type RenderHookResult,
  type RenderResult,
} from "@testing-library/react";
import type { ReactElement } from "react";
import type { CustomRenderHookOptions, CustomRenderOptions } from "../types";
import { AllTheProviders } from "./providers";

export function customRender(
  ui: ReactElement,
  { locale, queryClient, ...renderOptions }: CustomRenderOptions = {}
): RenderResult {
  return testingLibraryRender(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders locale={locale} queryClient={queryClient}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
}

export function customRenderHook<TProps, TResult>(
  callback: (props: TProps) => TResult,
  options: CustomRenderHookOptions<TProps> = {}
): RenderHookResult<TResult, TProps> {
  const { locale, queryClient, ...renderHookOptions } = options;

  return testingLibraryRenderHook(callback, {
    wrapper: ({ children }) => (
      <AllTheProviders locale={locale} queryClient={queryClient}>
        {children}
      </AllTheProviders>
    ),
    ...renderHookOptions,
  });
}
