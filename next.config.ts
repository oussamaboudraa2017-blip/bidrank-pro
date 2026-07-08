import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  // Keep pdfjs-dist + pdf-parse as external in the server bundle so their
  // internal file structure (worker .mjs files) is preserved at runtime.
  // This is critical for Vercel serverless where the standalone tracer would
  // otherwise miss the dynamically-imported worker module.
  serverExternalPackages: ["pdfjs-dist", "pdf-parse"],
  webpack: (config) => {
    // pdfjs-dist pulls in optional native deps that don't work in serverless/standalone
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      encoding: false,
    };
    return config;
  },
};

export default nextConfig;