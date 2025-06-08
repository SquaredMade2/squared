import { cn } from "@squaredmade/ui/cn";
import type React from "react";
import { GridLineHorizontal, GridLineVertical } from "./grid-lines";
import { Heading } from "./heading";
import { SkeletonOne } from "./skeletons/first";
import { SkeletonFour } from "./skeletons/fourth";
import { SkeletonTwo } from "./skeletons/second";
import { SkeletonThree } from "./skeletons/third";
import { Subheading } from "./subheading";

export const Features = () => {
	const features = [
		{
			title: "Track how your tasks change over time",
			description:
				"Keep track of what's getting done and what you have to do next.",
			skeleton: <SkeletonOne />,
			className:
				"col-span-1 md:col-span-4 border-b border-r dark:border-neutral-secondary",
		},
		{
			title: "Get notified of what your team is doing",
			description:
				"Get automatic notifications sent to your inbox so you know exactly what's happening.",
			skeleton: <SkeletonTwo />,
			className:
				"border-b col-span-1 md:col-span-2 dark:border-neutral-secondary",
		},
		{
			title: "An engaging task tracking interface",
			description: "We make it easy to create and assign tasks to your team.",
			skeleton: <SkeletonThree />,
			className:
				"col-span-1 md:col-span-3 border-r dark:border-neutral-secondary",
		},
		{
			title: "All the integrations you need",
			description:
				"Connect with your favorite git client, notify your team on slack, or coordinate between your engineering and design team.",
			skeleton: <SkeletonFour />,
			className: "col-span-1 md:col-span-3",
		},
	];
	return (
		<div className="relative z-20 py-10 md:py-40">
			<Heading as="h2">Spend time on what counts.</Heading>
			<Subheading className="text-center ">
				Engineered for today’s software teams, Squared has all the tools to
				effortlessly organize your projects.
			</Subheading>

			<div className="relative">
				<div className="mt-12 grid grid-cols-1 md:grid-cols-6">
					{features.map((feature) => (
						<FeatureCard key={feature.title} className={feature.className}>
							<FeatureTitle>{feature.title}</FeatureTitle>
							<FeatureDescription>{feature.description}</FeatureDescription>
							<div className=" h-full w-full">{feature.skeleton}</div>
						</FeatureCard>
					))}
				</div>
				<GridLineHorizontal
					style={{
						top: 0,
						left: "-10%",
						width: "120%",
					}}
				/>

				<GridLineHorizontal
					style={{
						bottom: 0,
						left: "-10%",
						width: "120%",
					}}
				/>

				<GridLineVertical
					style={{
						top: "-10%",
						right: 0,
						height: "120%",
					}}
				/>
				<GridLineVertical
					style={{
						top: "-10%",
						left: 0,
						height: "120%",
					}}
				/>
			</div>
		</div>
	);
};

const FeatureCard = ({
	children,
	className,
}: {
	children?: React.ReactNode;
	className?: string;
}) => {
	return (
		<div className={cn("relative overflow-hidden p-4 sm:p-8", className)}>
			{children}
		</div>
	);
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
	return (
		<Heading as="h3" size="sm" className="text-left">
			{children}
		</Heading>
	);
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
	return (
		<Subheading className="mx-0 my-2 max-w-sm text-left md:text-sm">
			{children}
		</Subheading>
	);
};
