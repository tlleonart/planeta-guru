import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: path.join(__dirname, ".."),
  },
  images: {
    remotePatterns: [new URL("https://storage.googleapis.com/**")]
  }
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
