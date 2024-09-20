/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
  output: "standalone",
  experimental: {
    scrollRestoration: true,
    useLightningcss: true,
    turbo: {
      resolveAlias: {
        "@components": "./src/components",
        react: require.resolve("react"),
        "react-dom": require.resolve("react-dom"),
      },
      resolveExtensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
        },
      },
      moduleIdStrategy: "deterministic",
    },
  },
};

module.exports = nextConfig;
