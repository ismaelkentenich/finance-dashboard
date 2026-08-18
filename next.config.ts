import type { NextConfig } from "next";
import { SECURITY_HEADERS } from "./src/constants/security.constants";

const nextConfig: NextConfig = {
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
