import type { Meta, StoryObj } from "@storybook/react";
import { Box, type BoxProps } from "./Box";

const meta: Meta<typeof Box> = {
	title: "Layout/Box",
	component: Box,
	argTypes: {
		padding: { control: "select", options: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
		margin: { control: "select", options: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
		display: {
			control: "select",
			options: [
				"block",
				"inline",
				"inline-block",
				"flex",
				"inline-flex",
				"grid",
				"inline-grid",
			],
		},
		flexDirection: {
			control: "select",
			options: ["row", "row-reverse", "col", "col-reverse"],
		},
		alignItems: {
			control: "select",
			options: ["start", "end", "center", "baseline", "stretch"],
		},
		justifyContent: {
			control: "select",
			options: ["start", "end", "center", "between", "around", "evenly"],
		},
		background: {
			control: "select",
			options: ["primary", "secondary", "accent", "background", "foreground"],
		},
		borderRadius: {
			control: "select",
			options: ["none", "sm", "md", "lg", "xl", "2xl", "3xl", "full"],
		},
		width: {
			control: "select",
			options: ["auto", "1/2", "1/3", "2/3", "1/4", "3/4", "full"],
		},
		height: {
			control: "select",
			options: ["auto", "1/2", "1/3", "2/3", "1/4", "3/4", "full"],
		},
	},
};

export default meta;

const ExampleContent = () => (
	<div className="bg-secondary p-4 text-secondary-foreground">
		Example Content
	</div>
);

export const Default: StoryObj<BoxProps> = {
	render: (args) => (
		<Box {...args}>
			<ExampleContent />
		</Box>
	),
	args: {
		padding: 4,
		background: "primary",
		borderRadius: "md",
	},
};

export const ResponsivePadding: StoryObj<BoxProps> = {
	render: (args) => (
		<Box {...args}>
			<ExampleContent />
		</Box>
	),
	args: {
		padding: [2, 4, 6, 8],
		background: "accent",
		borderRadius: "lg",
	},
};

export const FlexBox: StoryObj<BoxProps> = {
	render: (args) => (
		<Box {...args}>
			<ExampleContent />
			<ExampleContent />
			<ExampleContent />
		</Box>
	),
	args: {
		display: "flex",
		flexDirection: "row",
		gap: 4,
		padding: 4,
		background: "background",
		borderRadius: "xl",
	},
};

export const ResponsiveFlexBox: StoryObj<BoxProps> = {
	render: (args) => (
		<Box {...args}>
			<ExampleContent />
			<ExampleContent />
			<ExampleContent />
		</Box>
	),
	args: {
		display: "flex",
		flexDirection: ["col", "row", "row", "row"],
		gap: [2, 4, 6, 8],
		padding: 4,
		background: "foreground",
		borderRadius: "2xl",
	},
};

export const GridBox: StoryObj<BoxProps> = {
	render: (args) => (
		<Box {...args}>
			<ExampleContent />
			<ExampleContent />
			<ExampleContent />
			<ExampleContent />
		</Box>
	),
	args: {
		display: "grid",
		gap: 4,
		padding: 4,
		background: "primary",
		borderRadius: "3xl",
		className: "grid-cols-2",
	},
};

export const BorderedBox: StoryObj<BoxProps> = {
	render: (args) => (
		<Box {...args}>
			<ExampleContent />
		</Box>
	),
	args: {
		padding: 4,
		border: true,
		borderColor: "primary",
		borderRadius: "md",
	},
};

export const ShadowBox: StoryObj<BoxProps> = {
	render: (args) => (
		<Box {...args}>
			<ExampleContent />
		</Box>
	),
	args: {
		padding: 4,
		background: "background",
		boxShadow: "2xl",
		borderRadius: "lg",
	},
};

export const PositionedBox: StoryObj<BoxProps> = {
	render: (args) => (
		<Box position="relative" height="64" background="primary" borderRadius="lg">
			<Box {...args}>
				<ExampleContent />
			</Box>
		</Box>
	),
	args: {
		position: "absolute",
		padding: 4,
		background: "accent",
		borderRadius: "md",
	},
};

export const OverflowBox: StoryObj<BoxProps> = {
	render: (args) => (
		<Box {...args}>
			{Array.from({ length: 10 }).map((_, index) => (
				<ExampleContent key={index} />
			))}
		</Box>
	),
	args: {
		height: "32",
		width: ["3/4", "1/2"],
		overflow: "auto",
		padding: 4,
		background: "secondary",
		borderRadius: "xl",
		display: "flex",
	},
};

export const ResponsiveWidthBox: StoryObj<BoxProps> = {
	render: (args) => (
		<Box {...args}>
			<ExampleContent />
		</Box>
	),
	args: {
		width: ["full", "3/4", "1/2", "1/4"],
		padding: 4,
		background: "primary",
		borderRadius: "lg",
	},
};

export const ContainerBox: StoryObj<BoxProps> = {
	render: (args) => (
		<Box {...args}>
			<ExampleContent />
		</Box>
	),
	args: {
		container: true,
		padding: 4,
		background: "background",
		borderRadius: "xl",
	},
};
