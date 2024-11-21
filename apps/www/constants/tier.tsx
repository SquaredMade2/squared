type Tier = {
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
		name: "Free",
		id: "tier-hobby",
		href: "#",
		priceMonthly: "Free",
		priceYearly: "Free",
		description: "Great for individual developers exploring the platform.",
		features: [
			"Unlimited members",
			"Email support within 48 hours",
			"Access to all integrations, APIs, and webhooks",
			"250 tasks (+ unlimited archived)",
			"Community forum access",
		],
		featured: false,
		cta: "Get started",
		onClick: () => {
			/* Handle free tier click */
		},
	},
	{
		name: "Pro",
		id: "tier-starter",
		href: "#",
		priceMonthly: "$8/mo",
		priceYearly: "$60/yr",
		description: "Designed for small businesses to manage tasks effectively.",
		features: [
			"Everything in Free, plus",
			"Unlimited tasks and file uploads (100 MB per file)",
			"Admin tools for better control",
			"Email support within 24 hours",
			"SSO access for enhanced security",
		],
		featured: false,
		cta: "Upgrade now",
		onClick: () => {
			/* Handle Pro tier click */
		},
	},
	{
		name: "Team",
		id: "tier-professional",
		href: "#",
		priceMonthly: "$12/mo",
		priceYearly: "$100/yr",
		description: "Perfect for startups scaling their operations.",
		features: [
			"Everything in Pro, plus",
			"Detailed progress reports",
			"Unlimited tasks and file uploads (1 GB per file)",
			"Access to advanced API endpoints",
			"Priority email support within 6 hours",
			"Self-hosting options",
			"Private infrastructure and On-Prem deployments",
		],
		featured: true,
		cta: "Try Team",
		onClick: () => {
			/* Handle Team tier click */
		},
	},
	{
		name: "Enterprise",
		id: "tier-enterprise",
		href: "#",
		priceMonthly: "Contact us",
		priceYearly: "Contact us",
		description: "Tailored for large enterprises with complex needs.",
		features: [
			"Everything in Team, plus",
			"500K API requests per day",
			"Domain claiming for branding",
			"White-glove platform onboarding",
			"Personalized platform setup",
			"24/7 live support",
		],
		featured: false,
		cta: "Contact us",
		onClick: () => {
			/* Handle Enterprise tier click */
		},
	},
];
