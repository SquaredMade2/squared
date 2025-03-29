const withMDX = require("@next/mdx")();

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	transpilePackages: ["@squaredmade/ui", "@squaredmade/db"],
	productionBrowserSourceMaps: true,
	output: "standalone",
	pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
	images: {
		domains: [
			"avatars.githubusercontent.com",
			"lh3.googleusercontent.com",
			"api.dicebear.com",
			"utfs.io",
		],
	},
};

// Export the final configuration
module.exports = withMDX(nextConfig);
