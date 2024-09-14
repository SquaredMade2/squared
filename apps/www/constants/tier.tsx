export type Tier = {
	name: string;
	id: string;
	href: string;
	priceMonthly: string;
	priceYearly: string;
	description: string;
	features: string[];
	featured: boolean;
	cta: string;
	onClick: () => void;
};

export const tiers: Tier[] = [
	{
		name: "Hobby",
		id: "tier-hobby",
		href: "#",
		priceMonthly: "$4/mo",
		priceYearly: "$30/yr",
		description: "Best for developers trying to use the platform.",
		features: [
			"Unlimited Members",
			"Email support within 48 hours",
			"All integrations, APIs, and webhooks",
			"250 issues (+unlimited archived)",
			"Community forum access",
		],
		featured: false,
		cta: "Browse Components",
		onClick: () => {},
	},
	{
		name: "Starter",
		id: "tier-starter",
		href: "#",
		priceMonthly: "$8/mo",
		priceYearly: "$60/yr",
		description: "Perfect for small businesses",
		features: [
			"Everything in Hobby, plus",
			"Unlimited issues and file uploads (100 mb per file)",
			"Admin Tools",
			"Email support within 24 hours",
			"SSO access",
		],
		featured: false,
		cta: "Buy Now",
		onClick: () => {},
	},
	{
		name: "Professional",
		id: "tier-professional",
		href: "#",
		priceMonthly: "$12/mo",
		priceYearly: "$100/yr",
		description: "Ideal for small to mid range startups",
		features: [
			"Everything in Starter, plus",
			"Progress reports",
			"Unlimited issues and file uploads (1 GB per file)",
			"Access to super advanced API endpoints",
			"Email support within 6 hours",
			"Self hosting options",
			"Private infrastructure",
			"On-Prem deployments",
		],
		featured: true,
		cta: "Buy Now",
		onClick: () => {},
	},

	{
		name: "Enterprise",
		id: "tier-enterprise",
		href: "#",
		priceMonthly: "Contact Us",
		priceYearly: "Contact Us",
		description: "Best for big fortune 500 companies.",
		features: [
			"Everything in professional, plus",
			"500K API requests per day",
			"Domain claiming",
			"White glove platform access",
			"Personalized platfrom setup",
			"Live support",
		],
		featured: false,
		cta: "Contact Us",
		onClick: () => {},
	},
];
