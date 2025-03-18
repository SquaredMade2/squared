import { CompletedTaskPeriodOptions } from "@/lib/constants";
import { useViewStore } from "@/store";
import {
	type CompletedTaskPeriod,
	type TaskOrder,
	TaskOrderOptions,
	type View,
} from "@/store/views";
import { ChevronDown, SlidersVertical } from "@squared/icons";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { TooltipProvider } from "../ui/tooltip";
import { TaskDisplayOptions } from "./TaskDisplayOptions";
import { TaskGrouping } from "./TaskGrouping";
import { TaskViewOptions } from "./TaskViewOptions";
import { TaskViewType } from "./TaskViewType";

const TopNavBarDisplay = () => {
	const {
		view,
		setView,
		displayOptions,
		setListViewOptions,
		setGridViewOptions,
	} = useViewStore((state) => state);

	const currentOptions = displayOptions.viewOptions[`${view}Options`];
	const setOptions = view === "grid" ? setGridViewOptions : setListViewOptions;

	const { showEmptyGroups, displayProperties } = currentOptions;
	const { taskOrder, groupTasksBy, showCompletedTasks, groupRowsBy } =
		displayOptions;

	const orderByOptions: TaskOrder[] = [...TaskOrderOptions];
	const completedPeriodOptions: CompletedTaskPeriod[] =
		CompletedTaskPeriodOptions;

	useEffect(() => {
		if (groupTasksBy === taskOrder.orderBy) {
			const orderMap: { [key in "Priority" | "Status" | "Assignee"]: string } =
				{
					Priority: "Status",
					Status: "Priority",
					Assignee: "Status",
				};
			setOptions({
				taskOrder: {
					...taskOrder,
					orderBy: orderMap[
						groupTasksBy as "Priority" | "Status" | "Assignee"
					] as TaskOrder,
				},
			});
		}
	}, [groupTasksBy, taskOrder.orderBy]);

	const handleValueChange = (val: string) =>
		!val ? setView(view) : setView(val as View);

	const taskGroupingProps = {
		view,
		groupRowsBy,
		setOptions,
		groupTasksBy,
		taskOrder,
		orderByOptions,
	};

	const taskDisplayProps = {
		showCompletedTasks,
		completedPeriodOptions,
		displayOptions,
		setOptions,
	};

	const taskOptionsProps = {
		view,
		showEmptyGroups,
		setOptions,
		currentOptions,
		displayProperties,
	};

	return (
		<TooltipProvider delayDuration={0}>
			<div className="relative flex h-10 flex-col items-end gap-2 ">
				<Popover>
					<PopoverTrigger asChild>
						<Button variant="ghost" className="gap-2">
							<SlidersVertical className="size-4" />
							<div className="hidden items-center gap-2 md:flex">
								Display
								<ChevronDown className="size-4" />
							</div>
						</Button>
					</PopoverTrigger>
					<PopoverContent>
						<div className="flex flex-col">
							<TaskViewType view={view} handleValueChange={handleValueChange} />
							<Separator className="my-4" />
							<TaskGrouping {...taskGroupingProps} />
							<Separator className="my-4" />
							<TaskDisplayOptions {...taskDisplayProps} />
							<Separator className="my-4" />
							<TaskViewOptions {...taskOptionsProps} />
						</div>
					</PopoverContent>
				</Popover>
			</div>
		</TooltipProvider>
	);
};

export default TopNavBarDisplay;
