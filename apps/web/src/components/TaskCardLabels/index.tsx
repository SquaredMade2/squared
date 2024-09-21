import type { TaskCardLabelsProps } from "./TaskCardLabels.interfaces";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DropdownMenuContent } from "@repo/ui/dropdown-menu";
import type { Label } from "@repo/db";

export const LabelColor = ({ label }: { label: Label }) => {
	const { color } = label;
	const validatedColor = color.startsWith("#") ? color : `#${color}`;
	return (
		<div
			className="w-3 h-3 rounded-lg"
			style={{ backgroundColor: validatedColor }}
		/>
	);
};

export default function TaskCardLabels({ labels, view }: TaskCardLabelsProps) {
	const isGridView = view === "grid";
	const maxLabels = isGridView ? 5 : 4;
	const maxLabelsMobile = isGridView ? 5 : 2;

	const visibleLabels = labels.slice(0, maxLabels);
	const visibleLabelsMobile = labels.slice(0, maxLabelsMobile);
	const hasMoreLabels = labels.length > maxLabels;
	const hasMoreLabelsMobile = labels.length > maxLabelsMobile;
	const getMaxLabels = (isMobile: boolean) => {
		if (isGridView) return 5;
		return isMobile ? 2 : 4;
	};

	const renderLabels = (labelsToRender: typeof labels, isMobile: boolean) => (
		<>
			{labelsToRender.map((label) => (
				<div
					key={label.id}
					className={`${
						isMobile ? "flex lg:hidden" : "hidden lg:flex"
					} items-center p-1 mr-1 mb-1 border border-border rounded`}
				>
					<LabelColor label={label} />
					<span className="ml-1">{label.name}</span>
				</div>
			))}
			{((isMobile && hasMoreLabelsMobile) || (!isMobile && hasMoreLabels)) && (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className={`${
								isMobile ? "flex lg:hidden" : "hidden lg:flex"
							} items-center p-1 h-6`}
						>
							...
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="z-50 bg-popover border border-border">
						{labels.slice(getMaxLabels(isMobile)).map((label) => (
							<DropdownMenuItem key={label.id}>
								<LabelColor label={label} />
								<span className="ml-1">{label.name}</span>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</>
	);

	return (
		<div
			className={`flex items-center text-muted-foreground text-xs ${
				isGridView ? "flex-wrap" : "mr-5"
			}`}
		>
			{renderLabels(visibleLabels, false)}
			{renderLabels(visibleLabelsMobile, true)}
		</div>
	);
}
