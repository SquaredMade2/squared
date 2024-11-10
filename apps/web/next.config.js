const withMDX = require('@next/mdx')();
const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
  productionBrowserSourceMaps: true,
  output: "standalone",
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    domains: ["avatars.githubusercontent.com", "lh3.googleusercontent.com","api.dicebear.com"],
  },
};

// Combine MDX and Sentry configurations
const mdxConfig = withMDX(nextConfig);

const sentryWebpackPluginOptions = {
  silent: true,
  org: "squaredmade",
  project: "javascript-nextjs",
};

const sentryOptions = {
  widenClientFileUpload: true,
  transpileClientSDK: true,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
};

// Export the final configuration
module.exports = withSentryConfig(mdxConfig, sentryWebpackPluginOptions, sentryOptions);