import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/private/",
					"/forgotPassword/",
					"/sign-in/",
					"/sign-up/",
					"/settings/",
					"/verify/",
				],
			},
		],
		sitemap: "https://app.squaredmade.com/sitemap.xml",
	};
}
