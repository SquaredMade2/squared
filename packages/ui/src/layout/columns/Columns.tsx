import type { BoxVariants } from "@squaredmade/ui/box";
import { cn } from "@squaredmade/ui/cn";
import {
	type ResponsiveProps,
	createResponsiveComponent,
	getSizeVariants,
} from "@squaredmade/ui/responsive";
import { type VariantProps, cva } from "class-variance-authority";
import type { ReactNode } from "react";

const columnsVariants = cva("grid w-full", {
	variants: {
		columns: {
			1: "grid-cols-1",
			2: "grid-cols-2",
			3: "grid-cols-3",
			4: "grid-cols-4",
			5: "grid-cols-5",
			6: "grid-cols-6",
			7: "grid-cols-7",
			8: "grid-cols-8",
			9: "grid-cols-9",
			10: "grid-cols-10",
			11: "grid-cols-11",
			12: "grid-cols-12",
			"auto-fill": "grid-cols-auto-fill",
		},
		gap: getSizeVariants("gap"),
	},
	defaultVariants: {
		columns: 2,
		gap: 1,
	},
});

type ColumnsVariants = VariantProps<typeof columnsVariants>;

const { createResponsive: createResponsiveColumns } =
	createResponsiveComponent(columnsVariants);

interface ColumnsProps extends ResponsiveProps<ColumnsVariants> {
	/** The content to be rendered inside the columns */
	children: ReactNode;
	/** Optional className for additional styling */
	className?: BoxVariants;
}

const Columns = ({ children, columns, gap, className }: ColumnsProps) => {
	return (
		<div className={cn(createResponsiveColumns({ columns, gap }), className)}>
			{children}
		</div>
	);
};

const columnVariants = cva("", {
	variants: {
		colSpan: {
			1: "col-span-1",
			2: "col-span-2",
			3: "col-span-3",
			4: "col-span-4",
			5: "col-span-5",
			6: "col-span-6",
			7: "col-span-7",
			8: "col-span-8",
			9: "col-span-9",
			10: "col-span-10",
			11: "col-span-11",
			12: "col-span-12",
		},
	},
	defaultVariants: {
		colSpan: 1,
	},
});

type ColumnVariants = VariantProps<typeof columnVariants>;

const { createResponsive: createResponsiveColumn } =
	createResponsiveComponent(columnVariants);

interface ColumnProps extends ResponsiveProps<ColumnVariants> {
	/** The content to be rendered inside the column */
	children: ReactNode;
	/** Optional className for additional styling */
	className?: BoxVariants;
}

const Column = ({ children, colSpan, className }: ColumnProps) => (
	<div className={cn(createResponsiveColumn({ colSpan }), className)}>
		{children}
	</div>
);

export { Columns, Column, columnVariants, columnsVariants };
export type { ColumnsProps, ColumnProps, ColumnVariants, ColumnsVariants };
