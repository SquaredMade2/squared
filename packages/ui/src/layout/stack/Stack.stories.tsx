import type { Meta, StoryObj } from "@storybook/react";
import { Stack, type StackProps } from "./Stack";

const meta: Meta<typeof Stack> = {
	title: "Layout/Stack",
	component: Stack,
	argTypes: {
		gap: {
			control: {
				type: "select",
				options: ["0", "1", "2", "3", "4", "5"],
			},
			description: "Sets the gap between items in the stack.",
			defaultValue: "1",
		},
	},
};

export default meta;

const ExampleBlock = ({ index }: { index: number }) => (
	<div className="border border-border bg-zinc-400 p-5">Block {index}</div>
);

export const Default: StoryObj<StackProps> = {
	render: (args) => (
		<Stack {...args}>
			<ExampleBlock index={0} />
			<ExampleBlock index={1} />
			<ExampleBlock index={2} />
		</Stack>
	),
	args: {
		gap: 4,
	},
};

export const ResponsiveStack: StoryObj<StackProps> = {
	render: (args) => (
		<Stack {...args}>
			<ExampleBlock index={0} />
			<ExampleBlock index={1} />
			<ExampleBlock index={2} />
			<ExampleBlock index={3} />
		</Stack>
	),
	args: {
		gap: [2, 4, 6],
	},
};

export const StackWithDifferentGaps: StoryObj<StackProps> = {
	render: (args) => (
		<Stack {...args}>
			<ExampleBlock index={0} />
			<ExampleBlock index={1} />
			<ExampleBlock index={2} />
		</Stack>
	),
	args: {
		gap: 2,
	},
};

export const ManyBlocks: StoryObj<StackProps> = {
	render: (args) => (
		<Stack {...args}>
			{[...Array(10)].map((_, index) => (
				<ExampleBlock key={index} index={index} />
			))}
		</Stack>
	),
	args: {
		gap: 2,
	},
};

export const ResponsiveGap: StoryObj<StackProps> = {
	render: (args) => (
		<Stack {...args}>
			<ExampleBlock index={0} />
			<ExampleBlock index={1} />
			<ExampleBlock index={2} />
			<ExampleBlock index={3} />
			<ExampleBlock index={4} />
			<ExampleBlock index={5} />
		</Stack>
	),
	args: {
		gap: [2, 4, 6, 8],
	},
};

export const NestedStacks: StoryObj<StackProps> = {
	render: (args) => (
		<Stack {...args}>
			<Stack gap={2}>
				<ExampleBlock index={0} />
				<ExampleBlock index={1} />
			</Stack>
			<ExampleBlock index={2} />
			<ExampleBlock index={3} />
		</Stack>
	),
	args: {
		gap: 4,
	},
};
