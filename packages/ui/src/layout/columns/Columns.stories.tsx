import type { Meta, StoryObj } from "@storybook/react";
import type React from "react";
import {
	Column,
	type ColumnProps,
	Columns,
	type ColumnsProps,
} from "./Columns";

const meta: Meta<typeof Columns> = {
	title: "Layout/Columns",
	component: Columns,
	tags: ["autodocs"],
	argTypes: {
		columns: {
			control: { type: "select" },
			options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, "auto-fill"],
		},
		gap: {
			control: { type: "select" },
			options: [
				"0",
				"1",
				"2",
				"3",
				"4",
				"5",
				"6",
				"7",
				"8",
				"9",
				"10",
				"12",
				"16",
				"20",
				"24",
				"28",
				"32",
			],
		},
	},
	parameters: {
		layout: "padded",
	},
};

export default meta;
type Story = StoryObj<typeof Columns>;

const colors = [
	"bg-red-500",
	"bg-blue-500",
	"bg-green-500",
	"bg-yellow-500",
	"bg-purple-500",
	"bg-pink-500",
	"bg-indigo-500",
	"bg-teal-500",
];

const ExampleColumn: React.FC<
	Omit<ColumnProps, "children"> & { index: number }
> = ({ index, colSpan }) => (
	<Column colSpan={colSpan}>
		<div
			className={`${colors[index % colors.length]} rounded p-4 text-center text-white`}
		>
			Column {index + 1}
		</div>
	</Column>
);

export const Default: Story = {
	render: () => (
		<Columns columns={3}>
			<ExampleColumn index={0} />
			<ExampleColumn index={1} />
			<ExampleColumn index={2} />
		</Columns>
	),
	args: {
		columns: 3,
		gap: 4,
	},
};

export const ResponsiveColumns: Story = {
	render: (args) => (
		<Columns {...args}>
			<ExampleColumn index={0} />
			<ExampleColumn index={1} />
			<ExampleColumn index={2} />
			<ExampleColumn index={3} />
		</Columns>
	),
	args: {
		columns: [1, 2, 3, 4],
		gap: [2, 4, 6, 8],
	},
};

export const ResponsiveColumnSpans: Story = {
	render: (args) => (
		<Columns {...args}>
			<ExampleColumn index={0} colSpan={[12, 6, 4, 3]} />
			<ExampleColumn index={1} colSpan={[12, 6, 4, 3]} />
			<ExampleColumn index={2} colSpan={[12, 12, 4, 3]} />
			<ExampleColumn index={3} colSpan={[12, 12, 12, 3]} />
		</Columns>
	),
	args: {
		columns: 12,
		gap: 4,
	},
};

export const WithDifferentColumnSpans: Story = {
	render: (args) => (
		<Columns {...args}>
			<ExampleColumn index={0} colSpan={6} />
			<ExampleColumn index={1} colSpan={3} />
			<ExampleColumn index={2} colSpan={3} />
			<ExampleColumn index={3} colSpan={4} />
			<ExampleColumn index={4} colSpan={4} />
			<ExampleColumn index={5} colSpan={4} />
		</Columns>
	),
	args: {
		columns: 12,
		gap: 4,
	},
};

export const AutoFillColumns: Story = {
	render: (args) => (
		<Columns {...args}>
			{[...Array(10)].map((_, index) => (
				<ExampleColumn key={index} index={index} />
			))}
		</Columns>
	),
	args: {
		columns: "auto-fill",
		gap: 4,
	},
};

const NestedColumnsExample: React.FC<ColumnsProps> = (props) => (
	<Columns {...props}>
		<Column>
			<Columns columns={2} gap={2}>
				<ExampleColumn index={0} />
				<ExampleColumn index={1} />
			</Columns>
		</Column>
		<ExampleColumn index={2} />
		<ExampleColumn index={3} />
	</Columns>
);

export const NestedColumns: Story = {
	render: (args) => <NestedColumnsExample {...args} />,
	args: {
		columns: 3,
		gap: 4,
	},
};

export const ManyColumns: Story = {
	render: (args) => (
		<Columns {...args}>
			{[...Array(24)].map((_, index) => (
				<ExampleColumn key={index} index={index} />
			))}
		</Columns>
	),
	args: {
		columns: 6,
		gap: 2,
	},
};

export const ResponsiveGap: Story = {
	render: (args) => (
		<Columns {...args}>
			<ExampleColumn index={0} />
			<ExampleColumn index={1} />
			<ExampleColumn index={2} />
			<ExampleColumn index={3} />
			<ExampleColumn index={4} />
			<ExampleColumn index={5} />
		</Columns>
	),
	args: {
		columns: 3,
		gap: [2, 4, 6, 8],
	},
};
