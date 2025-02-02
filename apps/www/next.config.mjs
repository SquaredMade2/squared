/** @type {import('next').NextConfig} */
const nextConfig = {
	images: { domains: ["i.pravatar.cc", "images.unsplash.com"] },
	pageExtensions: ["ts", "tsx", "mdx"],
	output: "standalone",
};

export default nextConfig;
