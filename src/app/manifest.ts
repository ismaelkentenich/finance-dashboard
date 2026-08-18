import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FinFlow — Financial Dashboard",
    short_name: "FinFlow",
    description: "Track your personal finances with clarity and precision.",
    start_url: "/",
    display: "standalone",
    background_color: "#f2f2f2",
    theme_color: "#008f47",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
