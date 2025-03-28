const withMDX = require("@next/mdx")();

const million = require("@million/lint");

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	transpilePackages: ["@squaredmade/ui", "@prisma/client"],
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
	webpack: (config, { isServer }) => {
		// Direct Million.js integration
		if (!isServer) {
			config.plugins.push(million.webpack({ auto: true }));
		}
		return config;
	},
};

module.exports = withMDX(nextConfig);
