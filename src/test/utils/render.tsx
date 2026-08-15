import {
  render,
  renderHook,
  type RenderHookOptions,
  type RenderHookResult,
  type RenderResult,
} from "@testing-library/react";
import { type ReactElement } from "react";
import type { CustomRenderOptions, CustomRenderProvidersOptions } from "../types";
import { AllTheProviders } from "./providers";

export const customRender = (
  ui: ReactElement,
  { locale, queryClient, ...options }: CustomRenderOptions = {}
): RenderResult => {
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders locale={locale} queryClient={queryClient}>
        {children}
      </AllTheProviders>
    ),
    ...options,
  });
};

export const customRenderHook = <TProps, TResult>(
  callback: (props: TProps) => TResult,
  options?: Omit<RenderHookOptions<TProps>, "wrapper"> & CustomRenderProvidersOptions
): RenderHookResult<TResult, TProps> => {
  const { locale, queryClient, ...restOptions } = options || {};

  return renderHook(callback, {
    wrapper: ({ children }) => (
      <AllTheProviders locale={locale} queryClient={queryClient}>
        {children}
      </AllTheProviders>
    ),
    ...restOptions,
  });
};

export * from "@testing-library/react";
