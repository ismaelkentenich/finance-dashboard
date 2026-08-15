import type { NextConfig } from "next";
import { SECURITY_HEADERS } from "./src/constants/security.constants";

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [...SECURITY_HEADERS],
      },
    ];
  },
};

export default nextConfig;
