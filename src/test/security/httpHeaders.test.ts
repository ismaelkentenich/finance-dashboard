import {
  CONTENT_SECURITY_POLICY,
  CSP_DIRECTIVES,
  SECURITY_HEADERS,
} from "@/constants/security.constants";
import { SecurityHeader } from "@/types/security.types";
import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";

// Decoupled helper to extract header value by key
function getHeaderValue(headers: readonly SecurityHeader[], key: string): string | undefined {
  return headers.find((header) => header.key.toLowerCase() === key.toLowerCase())?.value;
}

// Helper to convert a CSP string into a map of directives
function parseCspDirectives(cspString: string): Map<string, string[]> {
  const directiveMap = new Map<string, string[]>();

  cspString.split(";").forEach((directive) => {
    const trimmed = directive.trim();
    if (!trimmed) return;
    const [name, ...values] = trimmed.split(/\s+/);
    directiveMap.set(name, values);
  });

  return directiveMap;
}

describe("HTTP Security Hardening (SEC-002)", () => {
  describe("Individual Mandatory Security Headers", () => {
    it("should configure 'Content-Security-Policy' with valid directives", () => {
      const value = getHeaderValue(SECURITY_HEADERS, "Content-Security-Policy");
      expect(value).toBeDefined();
      expect(value).toBe(CONTENT_SECURITY_POLICY);
    });

    it("should configure 'X-Frame-Options' set to DENY", () => {
      const value = getHeaderValue(SECURITY_HEADERS, "X-Frame-Options");
      expect(value).toBe("DENY");
    });

    it("should configure 'X-Content-Type-Options' set to nosniff", () => {
      const value = getHeaderValue(SECURITY_HEADERS, "X-Content-Type-Options");
      expect(value).toBe("nosniff");
    });

    it("should configure 'Referrer-Policy' set to strict-origin-when-cross-origin", () => {
      const value = getHeaderValue(SECURITY_HEADERS, "Referrer-Policy");
      expect(value).toBe("strict-origin-when-cross-origin");
    });

    it("should configure 'Permissions-Policy' restricting sensitive APIs", () => {
      const value = getHeaderValue(SECURITY_HEADERS, "Permissions-Policy");
      expect(value).toBeDefined();
      expect(value).toContain("camera=()");
      expect(value).toContain("microphone=()");
      expect(value).toContain("geolocation=()");
      expect(value).toContain("interest-cohort=()");
    });

    it("should configure 'Strict-Transport-Security' with HSTS and preload", () => {
      const value = getHeaderValue(SECURITY_HEADERS, "Strict-Transport-Security");
      expect(value).toBeDefined();
      expect(value).toContain("max-age=63072000");
      expect(value).toContain("includeSubDomains");
      expect(value).toContain("preload");
    });

    it("should configure 'X-DNS-Prefetch-Control' enabled", () => {
      const value = getHeaderValue(SECURITY_HEADERS, "X-DNS-Prefetch-Control");
      expect(value).toBe("on");
    });
  });

  describe("Granular CSP Directive Constraints", () => {
    it("should restrict fallback resource loading to 'self'", () => {
      const directives = parseCspDirectives(CONTENT_SECURITY_POLICY);
      expect(directives.get("default-src")).toEqual(["'self'"]);
    });

    it("should configure script-src to permit application execution", () => {
      const directives = parseCspDirectives(CONTENT_SECURITY_POLICY);
      const scriptSrc = directives.get("script-src");
      expect(scriptSrc).toContain("'self'");
      expect(scriptSrc).toContain("'unsafe-inline'");
      expect(scriptSrc).toContain("'unsafe-eval'");
    });

    it("should configure style-src to permit CSS modules and styles", () => {
      const directives = parseCspDirectives(CONTENT_SECURITY_POLICY);
      const styleSrc = directives.get("style-src");
      expect(styleSrc).toContain("'self'");
      expect(styleSrc).toContain("'unsafe-inline'");
    });

    it("should prevent clickjacking via frame-ancestors 'none'", () => {
      const directives = parseCspDirectives(CONTENT_SECURITY_POLICY);
      expect(directives.get("frame-ancestors")).toEqual(["'none'"]);
    });

    it("should disallow embedding object plugins via object-src 'none'", () => {
      const directives = parseCspDirectives(CONTENT_SECURITY_POLICY);
      expect(directives.get("object-src")).toEqual(["'none'"]);
    });

    it("should restrict base-uri to 'self'", () => {
      const directives = parseCspDirectives(CONTENT_SECURITY_POLICY);
      expect(directives.get("base-uri")).toEqual(["'self'"]);
    });

    it("should restrict form submissions to 'self'", () => {
      const directives = parseCspDirectives(CONTENT_SECURITY_POLICY);
      expect(directives.get("form-action")).toEqual(["'self'"]);
    });

    it("should maintain consistency between CSP_DIRECTIVES and CONTENT_SECURITY_POLICY", () => {
      const expectedString = CSP_DIRECTIVES.join("; ").trim();
      expect(CONTENT_SECURITY_POLICY).toBe(expectedString);
    });
  });

  describe("Next.js Server Configuration Integration", () => {
    it("should expose an async headers function in nextConfig", () => {
      expect(nextConfig.headers).toBeTypeOf("function");
    });

    it("should bind security headers to the global /:path* route pattern", async () => {
      if (!nextConfig.headers) return;

      const routeConfigs = await nextConfig.headers();
      const globalRoute = routeConfigs.find((rc) => rc.source === "/:path*");

      expect(globalRoute).toBeDefined();
      expect(globalRoute?.headers).toEqual(SECURITY_HEADERS);
    });
  });
});
