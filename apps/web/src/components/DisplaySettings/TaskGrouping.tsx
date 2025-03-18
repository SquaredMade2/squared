import {
	type DisplayOptions,
	type TaskGroup,
	type TaskOrder,
	type View,
	taskGroupOptions,
} from "@/store/views";
import {
	ArrowDownWideNarrow,
	ArrowUpWideNarrow,
	Layers3,
} from "@squared/icons";
import { Button } from "../ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const TaskGrouping = ({
	view,
	groupRowsBy,
	setOptions,
	groupTasksBy,
	taskOrder,
	orderByOptions,
}: {
	view: View;
	groupRowsBy: TaskGroup | "None";
	setOptions: (input: Partial<DisplayOptions>) => void;
	groupTasksBy: TaskGroup;
	taskOrder: {
		orderBy: TaskOrder;
		orderAscending: boolean;
	};
	orderByOptions: TaskOrder[];
}) => {
	const tooltipContent = (): string => {
		return ["Title", "Status", "Assignee"].includes(taskOrder.orderBy)
			? taskOrder.orderAscending
				? "A-Z"
				: "Z-A"
			: ["Priority", "Effort"].includes(taskOrder.orderBy)
				? taskOrder.orderAscending
					? "Ascending"
					: "Descending"
				: ["Due Date", "Updated", "Created"].includes(taskOrder.orderBy)
					? taskOrder.orderAscending
						? "Oldest first"
						: "Newest first"
					: "";
	};

	return (
		<div className="grid grid-cols-6 items-center gap-1">
			{/* Columns Row */}
			<span className="col-span-2 text-foreground text-xs">
				{view === "list" ? "Groups" : "Columns"}
			</span>
			<div className="col-span-4">
				<Select
					onValueChange={(value: TaskGroup) => {
						if (value === groupRowsBy) {
							// Apply the swap
							setOptions({
								groupRowsBy: "None",
								groupTasksBy: value,
							});
						} else {
							setOptions({
								groupTasksBy: value,
							});
						}
					}}
					value={groupTasksBy}
				>
					<SelectTrigger className="w-full">
						<SelectValue>
							<div className="flex w-full items-center justify-between">
								<Layers3 className="size-4" />
								<span className="mx-2 text-xs">{groupTasksBy}</span>
							</div>
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{taskGroupOptions.map((option) => (
							<SelectItem key={option} value={option} className="text-xs">
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Rows Row */}
			<span className="col-span-2 text-foreground text-xs">
				{view === "list" ? "Subgroups" : "Rows"}
			</span>
			<div className="col-span-4">
				<Select
					onValueChange={(value: TaskGroup | "None") => {
						if (value === groupTasksBy) {
							// Apply the swap
							setOptions({
								groupRowsBy: value,
								groupTasksBy: value === "Status" ? "Priority" : "Status",
							});
						} else {
							setOptions({
								groupRowsBy: value,
							});
						}
					}}
					value={groupRowsBy}
				>
					<SelectTrigger className="w-full">
						<SelectValue>
							<div className="flex w-full items-center justify-between">
								<Layers3 className="size-4" />
								<span className="mx-2 text-xs">{groupRowsBy}</span>
							</div>
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{[...taskGroupOptions, "None"].map((option) => (
							<SelectItem key={option} value={option} className="text-xs">
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Ordering Row */}
			<span className="col-span-2 text-foreground text-xs">Ordering</span>
			<div className="col-span-3">
				<Select
					onValueChange={(value) =>
						setOptions({
							taskOrder: {
								...taskOrder,
								orderBy: value as TaskOrder,
							},
						})
					}
					value={taskOrder.orderBy}
				>
					<SelectTrigger className="w-full">
						<SelectValue>
							<span className="text-xs">{taskOrder.orderBy}</span>
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{orderByOptions
							.filter((option) => option !== groupTasksBy)
							.map((option) => (
								<SelectItem key={option} value={option} className="text-xs">
									{option}
								</SelectItem>
							))}
					</SelectContent>
				</Select>
			</div>

			<div className="col-span-1 text-right">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								setOptions({
									taskOrder: {
										...taskOrder,
										orderAscending: !taskOrder.orderAscending,
									},
								})
							}
						>
							{taskOrder.orderAscending ? (
								<ArrowUpWideNarrow className="size-4" />
							) : (
								<ArrowDownWideNarrow className="size-4" />
							)}
						</Button>
					</TooltipTrigger>
					<TooltipContent>{tooltipContent()}</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
};
