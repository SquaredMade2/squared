import type { TaskCardLabelsProps } from "./TaskCardLabels.interfaces";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import LabelBadge from "../LabelBadges";
import { cn } from "@/utils/cn";

export default function TaskCardLabels({ labels, view }: TaskCardLabelsProps) {
	const isGridView = view === "grid";
	const maxLabels = isGridView ? 5 : 4;

	const visibleLabels = labels.slice(0, maxLabels);
	const hasMoreLabels = labels.length > maxLabels;

	return (
		<div
			className={cn(
				"flex items-center text-muted-foreground gap-1",
				isGridView ? "flex-wrap" : "mr-5",
			)}
		>
			{visibleLabels.map((label) => (
				<LabelBadge key={label.id} label={label} />
			))}
			{hasMoreLabels && (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className="items-center p-0.5 h-fit w-fit min-w-[20px]"
						>
							<Ellipsis className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="z-50 bg-popover border border-border">
						{labels.slice(maxLabels).map((label) => (
							<DropdownMenuItem key={label.id} className="w-full justify-end">
								<LabelBadge label={label} />
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</div>
	);
}
