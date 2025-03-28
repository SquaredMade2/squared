import { Trash } from "@squaredmade/ui/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./Text";

const meta: Meta<typeof Text> = {
	title: "Components/Text",
	component: Text,
	tags: ["autodocs", "text"],
	argTypes: {
		size: {
			control: "select",
			options: ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"],
		},
		weight: {
			control: "select",
			options: ["normal", "medium", "semibold", "bold"],
		},
		transform: {
			control: "select",
			options: ["normal", "uppercase", "lowercase", "capitalize"],
		},
		align: {
			control: "select",
			options: ["left", "center", "right", "justify"],
		},
		color: {
			control: "select",
			options: [
				"foreground",
				"card",
				"popover",
				"primary",
				"secondary",
				"accent",
				"destructive",
				"muted",
			],
		},
		decoration: {
			control: "select",
			options: ["none", "underline", "line-through"],
		},
		lineHeight: {
			control: "select",
			options: ["none", "tight", "snug", "normal", "relaxed", "loose"],
		},
		whiteSpace: {
			control: "select",
			options: ["normal", "nowrap", "pre", "pre-line", "pre-wrap"],
		},
		truncate: { control: "boolean" },
		clamped: { control: "number" },
	},
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
	args: {
		children: "This is a default text",
	},
};

export const CustomSize: Story = {
	args: {
		size: "xl",
		children: "This is a larger text",
	},
};

export const BoldText: Story = {
	args: {
		weight: "bold",
		children: "This is bold text",
	},
};

export const TransformedText: Story = {
	args: {
		transform: "uppercase",
		children: "This is uppercase text",
	},
};

export const UnderlinedText: Story = {
	args: {
		decoration: "underline",
		children: "This is underlined text",
	},
};

export const CenteredText: Story = {
	args: {
		align: "center",
		children: "This is centered text",
	},
};

export const TruncatedText: Story = {
	args: {
		truncate: true,
		children:
			"This is a very long text that will be truncated with an ellipsis at the end",
	},
	decorators: [
		(Story) => (
			<div style={{ width: "200px" }}>
				<Story />
			</div>
		),
	],
};

export const ClampedText: Story = {
	args: {
		clamped: 2,
		children:
			"This is a multi-line text that will be clamped to two lines. Any content beyond the second line will not be displayed.",
	},
	decorators: [
		(Story) => (
			<div style={{ width: "300px" }}>
				<Story />
			</div>
		),
	],
};

export const ResponsiveText: Story = {
	args: {
		size: ["sm", "lg", "xl"],
		weight: ["normal", "bold"],
		color: ["muted", "primary"],
		children:
			"This text changes size, weight, and color on different screen sizes",
	},
};

export const CombinedStyles: Story = {
	args: {
		size: "lg",
		weight: "semibold",
		color: "accent",
		transform: "capitalize",
		decoration: "underline",
		align: "center",
		children: "This text combines multiple styles",
	},
};

export const PreformattedText: Story = {
	args: {
		whiteSpace: "pre",
		children: `This is preformatted text.
It preserves whitespace and line breaks.
    Even indentation is preserved.`,
	},
};

export const WithIcon: Story = {
	args: {
		children: "This is a default text",
		color: "destructive",
	},
	render: (args) => (
		<Text {...args}>
			<Trash className="size-4" />
			{args.children}
		</Text>
	),
};

export const LongWordHandling: Story = {
	args: {
		children:
			"This text contains a verylongwordthatwillbreakthings and demonstrates how the component handles it.",
	},
	decorators: [
		(Story) => (
			<div
				style={{ width: "200px", border: "1px solid #ccc", padding: "10px" }}
			>
				<Story />
			</div>
		),
	],
};
