import { cn } from "@squaredmade/ui/cn";
import {
	IconAdjustmentsBolt,
	IconCloud,
	IconCurrencyDollar,
	IconEaseInOut,
	IconHeart,
	IconHelp,
	IconRouteAltLeft,
	IconTerminal2,
} from "@tabler/icons-react";

export const GridFeatures = () => {
	const features = [
		{
			title: "Built for developers",
			description:
				"Built for engineers, developers, dreamers, thinkers and doers.",
			icon: <IconTerminal2 />,
		},
		{
			title: "Ease of use",
			description:
				"An easy to use  UI that isn't complicated like every other task manager.",
			icon: <IconEaseInOut />,
		},
		{
			title: "Pricing like no other",
			description:
				"Our basic tier is free and comes with all the features you need to get started.",
			icon: <IconCurrencyDollar />,
		},
		{
			title: "100% Uptime guarantee",
			description: "We just cannot be taken down by anyone.",
			icon: <IconCloud />,
		},
		{
			title: "Multi-tenant Architecture",
			description:
				"Easily add new team members. Please contact us for pricing per seat.",
			icon: <IconRouteAltLeft />,
		},
		{
			title: "24/7 Customer Support",
			description: "We are available a 100% of the time.",
			icon: <IconHelp />,
		},
		{
			title: "Money back guarantee",
			description:
				"If you do not like Squared, we will work with you to find a solution.",
			icon: <IconAdjustmentsBolt />,
		},
		{
			title: "Exponential outcomes with Squared",
			description: "Focus on what matters and make organizing easy.",
			icon: <IconHeart />,
		},
	];
	return (
		<div className="relative z-10 grid grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-4">
			{features.map((feature, index) => (
				<Feature key={feature.title} {...feature} index={index} />
			))}
		</div>
	);
};

const Feature = ({
	title,
	description,
	icon,
	index,
}: {
	title: string;
	description: string;
	icon: React.ReactNode;
	index: number;
}) => {
	return (
		<div
			className={cn(
				"group relative flex flex-col py-10 lg:border-r dark:border-neutral-secondary",
				(index === 0 || index === 4) &&
					"lg:border-l dark:border-neutral-secondary",
				index < 4 && "lg:border-b dark:border-neutral-secondary",
			)}
		>
			{index < 4 && (
				<div className="group pointer-events-none absolute inset-0 h-full w-full bg-linear-to-t from-neutral-secondary to-transparent opacity-0 transition duration-200 group-hover:opacity-100 dark:from-background-dark" />
			)}
			{index >= 4 && (
				<div className="group pointer-events-none absolute inset-0 h-full w-full bg-linear-to-b from-neutral-secondary to-transparent opacity-0 transition duration-200 group-hover:opacity-100 dark:from-background-dark" />
			)}
			<div className="relative z-10 mb-4 px-10">{icon}</div>
			<div className="relative z-10 mb-2 px-10 font-bold text-lg">
				<div className="absolute inset-y-0 left-0 h-6 w-1 rounded-tr-full rounded-br-full bg-neutral-accent transition duration-200 group-hover:bg-blue" />
				<span className="inline-block transition duration-200 group-hover:translate-x-2">
					{title}
				</span>
			</div>
			<p className="relative z-10 mx-auto max-w-xs px-10 text-muted-foreground text-sm">
				{description}
			</p>
		</div>
	);
};
