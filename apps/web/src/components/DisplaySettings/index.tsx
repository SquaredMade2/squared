import { CompletedTaskPeriodOptions } from "@/lib/constants";
import { useViewStore } from "@/store";
import {
	type CompletedTaskPeriod,
	type DisplayOptions,
	type DisplayProperty,
	type TaskGroup,
	type TaskOrder,
	TaskOrderOptions,
	type View,
	taskGroupOptions,
} from "@/store/views";
import {
	ArrowDownWideNarrow,
	ArrowUpWideNarrow,
	ChevronDown,
	Layers3,
	LayoutGrid,
	Menu,
	SlidersVertical,
} from "@squared/icons";
import { useEffect } from "react";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";

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

	const formatCamelCaseString = (str: string): string => {
		return str
			.replace(/([A-Z])/g, " $1")
			.replace(/^./, (char) => char.toUpperCase());
	};

	const handleToggleChange = (value: string[]) => {
		const updatedProperties = Object.keys(displayProperties).reduce(
			(acc, key) => {
				acc[key as keyof DisplayProperty] = !value.includes(key);
				return acc;
			},
			{} as DisplayProperty,
		);
		setOptions({
			viewOptions: {
				[`${view}Options`]: {
					...currentOptions,
					displayProperties: updatedProperties,
				},
			},
		} as Partial<DisplayOptions>);
	};

	const handleDropdownSelection = (value: CompletedTaskPeriod) => {
		setOptions({
			showCompletedTasks: { show: value !== "None", period: value },
		});
	};

	const handleValueChange = (val: string) =>
		!val ? setView(view) : setView(val as View);

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
							<div className="mb-3 flex w-full items-center justify-between">
								<ToggleGroup
									type="single"
									value={view}
									onValueChange={handleValueChange}
									className="flex w-full"
								>
									<ToggleGroupItem
										value="list"
										className="flex h-14 flex-1 cursor-pointer flex-col gap-1 border-[1px] border-secondary p-1"
									>
										<Menu />
										List
									</ToggleGroupItem>
									<ToggleGroupItem
										value="grid"
										className="flex h-14 flex-1 cursor-pointer flex-col gap-1 border-[1px] border-secondary p-1"
									>
										<LayoutGrid />
										Grid
									</ToggleGroupItem>
								</ToggleGroup>
							</div>
							<Separator className="my-4" />
							<div className="grid grid-cols-6 items-center gap-1">
								{/* Columns Row */}
								<span className="col-span-2 text-foreground text-xs">
									Columns
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
												<SelectItem
													key={option}
													value={option}
													className="text-xs"
												>
													{option}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{/* Rows Row */}
								<span className="col-span-2 text-foreground text-xs">Rows</span>
								<div className="col-span-4">
									<Select
										onValueChange={(value: TaskGroup | "None") => {
											if (value === groupTasksBy) {
												// Apply the swap
												setOptions({
													groupRowsBy: value,
													groupTasksBy:
														value === "Status" ? "Priority" : "Status",
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
												<SelectItem
													key={option}
													value={option}
													className="text-xs"
												>
													{option}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{/* Ordering Row */}
								<span className="col-span-2 text-foreground text-xs">
									Ordering
								</span>
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
													<SelectItem
														key={option}
														value={option}
														className="text-xs"
													>
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
							<Separator className="my-4" />

							<div className="flex items-center justify-between">
								<span className="text-foreground text-xs">Completed tasks</span>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											size="sm"
											className="w-[120px] justify-between"
										>
											<span className="text-xs">
												{showCompletedTasks.period}
											</span>
											<ChevronDown className="size-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-[120px]">
										{completedPeriodOptions.map((option) => (
											<DropdownMenuItem
												key={option}
												className="text-xs"
												onSelect={() => handleDropdownSelection(option)}
											>
												{option}
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
							<div className="my-3 flex w-full items-center justify-between">
								<p className="py-1 text-foreground text-xs">Show SubTasks</p>
								<Switch
									checked={displayOptions.showSubTasks}
									onCheckedChange={(checked) =>
										setOptions({ showSubTasks: checked })
									}
								/>
							</div>

							<Separator className="my-4" />
							<div>
								<div>{view === "grid" ? "Grid" : "List"} options</div>
								<div className="my-3 flex w-full items-center justify-between">
									<p className="py-1 text-foreground text-xs">
										Show Empty Groups
									</p>
									<Switch
										checked={showEmptyGroups}
										onCheckedChange={(checked) =>
											setOptions({
												viewOptions: {
													[`${view}Options`]: {
														...currentOptions,
														showEmptyGroups: checked,
													},
												},
											} as Partial<DisplayOptions>)
										}
									/>
								</div>
								<p className="mb-2 py-1 text-foreground text-xs">
									Display Properties
								</p>
								<ToggleGroup
									type="multiple"
									className="flex flex-wrap justify-start gap-3"
									onValueChange={handleToggleChange}
								>
									{Object.keys(displayProperties).map((property) => {
										const typedKey = property as keyof DisplayProperty;
										const value = displayProperties[typedKey];
										return (
											<ToggleGroupItem
												key={property}
												value={property}
												data-state={value ? "on" : "off"}
												asChild
											>
												<Button
													variant={value ? "secondary" : "ghost"}
													size="sm"
													className="h-6 px-2 py-0 text-xs"
												>
													{formatCamelCaseString(property)}
												</Button>
											</ToggleGroupItem>
										);
									})}
								</ToggleGroup>
							</div>
						</div>
					</PopoverContent>
				</Popover>
			</div>
		</TooltipProvider>
	);
};

export default TopNavBarDisplay;
