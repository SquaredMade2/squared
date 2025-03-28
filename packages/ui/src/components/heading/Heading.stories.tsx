import type { Meta, StoryObj } from "@storybook/react";
import { Heading, type HeadingProps } from "./Heading";

const meta: Meta<typeof Heading> = {
	title: "Components/Heading",
	component: Heading,
	argTypes: {
		as: {
			control: {
				type: "select",
				options: ["h1", "h2", "h3", "h4", "h5", "h6"],
			},
			description: "The HTML tag to use for the heading.",
		},
		color: {
			control: {
				type: "select",
				options: [
					"foreground",
					"card",
					"popover",
					"primary",
					"secondary",
					"accent",
					"destructive",
					"n-50",
					"n-100",
					"n-200",
					"n-300",
					"n-400",
					"n-500",
					"n-600",
					"n-700",
					"n-800",
					"n-900",
					"n-950",
				],
			},
			description: "The color of the heading.",
		},
	},
	tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj<HeadingProps> = {
	args: {
		as: "h1",
		children: "Default Heading",
		color: "foreground",
	},
};

export const AllLevels: StoryObj<HeadingProps> = {
	render: (args) => (
		<div className="space-y-4">
			<Heading {...args} variant="h1">
				Heading 1
			</Heading>
			<Heading {...args} variant="h2">
				Heading 2
			</Heading>
			<Heading {...args} variant="h3">
				Heading 3
			</Heading>
			<Heading {...args} variant="h4">
				Heading 4
			</Heading>
			<Heading {...args} variant="h5">
				Heading 5
			</Heading>
			<Heading {...args} variant="h6">
				Heading 6
			</Heading>
			<Heading {...args} variant="display">
				Display
			</Heading>
			<Heading {...args} variant="section">
				Section
			</Heading>
			<Heading {...args} variant="subtitle">
				Subtitle
			</Heading>
			<Heading {...args} variant="title">
				Title
			</Heading>
		</div>
	),
};

export const ColorVariations: StoryObj<HeadingProps> = {
	render: (args) => (
		<div className="space-y-4">
			<Heading {...args} color="foreground">
				Foreground Color
			</Heading>
			<Heading {...args} color="primary">
				Primary Color
			</Heading>
			<Heading {...args} color="secondary">
				Secondary Color
			</Heading>
			<Heading {...args} color="accent">
				Accent Color
			</Heading>
			<Heading {...args} color="destructive">
				Destructive Color
			</Heading>
			<Heading {...args} color="n-300">
				n 300 Color
			</Heading>
			<Heading {...args} color="n-600">
				n 600 Color
			</Heading>
			<Heading {...args} color="n-900">
				n 900 Color
			</Heading>
		</div>
	),
	args: {
		as: "h4",
	},
};

export const ResponsiveHeading: StoryObj<HeadingProps> = {
	args: {
		as: "h2",
		children: "Responsive Heading",
		color: ["n-600", "primary"],
	},
};

export const NestedHeadings: StoryObj<HeadingProps> = {
	render: (args) => (
		<div className="space-y-4">
			<Heading {...args} variant="h1" color="primary">
				Main Title
			</Heading>
			<div className="pl-4">
				<Heading {...args} variant="h2" color="secondary">
					Subtitle 1
				</Heading>
				<div className="mt-2 pl-4">
					<Heading {...args} variant="h3" color="n-700">
						Sub-subtitle 1.1
					</Heading>
					<Heading {...args} variant="h3" color="n-700">
						Sub-subtitle 1.2
					</Heading>
				</div>
			</div>
			<div className="pl-4">
				<Heading {...args} variant="h2" color="secondary">
					Subtitle 2
				</Heading>
				<div className="mt-2 pl-4">
					<Heading {...args} variant="h3" color="n-700">
						Sub-subtitle 2.1
					</Heading>
					<Heading {...args} variant="h3" color="n-700">
						Sub-subtitle 2.2
					</Heading>
				</div>
			</div>
		</div>
	),
};
