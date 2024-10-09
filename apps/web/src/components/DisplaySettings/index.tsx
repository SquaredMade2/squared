import {
	ChevronDown,
	SlidersVertical,
	ArrowUpWideNarrow,
	ArrowDownWideNarrow,
	AlignJustify,
	LayoutGrid,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useViewStore } from "@/store";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import type {
	CompletedTaskPeriod,
	DisplayProperty,
	TaskOrder,
} from "@/store/views/interfaces";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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
		listViewOptions,
		gridViewOptions,
		setListViewOptions,
		setGridViewOptions,
	} = useViewStore((state) => state);

	const currentOptions = view === "grid" ? gridViewOptions : listViewOptions;
	const setOptions = view === "grid" ? setGridViewOptions : setListViewOptions;

	const { showEmptyGroups, taskOrder, showCompletedTasks, displayProperties } =
		currentOptions;

	const orderByOptions: TaskOrder[] = [
		"Title",
		"Status",
		"Priority",
		"Assignee",
		"Effort",
		"Due Date",
		"Updated",
		"Created",
	];

	const completedPeriodOptions: CompletedTaskPeriod[] = [
		"All",
		"Past day",
		"Past week",
		"Past month",
		"None",
	];

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
			.replace(/([A-Z])/g, " $1") // Insert space before each capital letter
			.replace(/^./, (char) => char.toUpperCase()); // Capitalize the first letter of the string
	};

	const handleToggleChange = (value: string[]) => {
		const updatedProperties = Object.keys(displayProperties).reduce(
			(acc, key) => {
				acc[key as keyof typeof displayProperties] = !value.includes(key);
				return acc;
			},
			{} as typeof displayProperties,
		);
		setOptions({ displayProperties: updatedProperties });
	};

	const handleDropdownSelection = (value: CompletedTaskPeriod) => {
		if (value === "None") {
			setOptions({ showCompletedTasks: { show: false, period: value } });
		} else setOptions({ showCompletedTasks: { show: true, period: value } });
	};

	const handleValueChange = (val: string) => setView(val as "list" | "grid");

	return (
		<TooltipProvider delayDuration={0}>
			<div className="flex flex-col gap-2 items-end relative h-10 ">
				<Popover>
					<PopoverTrigger asChild>
						<Button variant={"ghost"} className="gap-2">
							<SlidersVertical className="size-4" />
							<div className="hidden md:flex items-center gap-2">
								Display
								<ChevronDown className="size-4" />
							</div>
						</Button>
					</PopoverTrigger>
					<PopoverContent>
						<div className="flex flex-col">
							<div className=" w-full items-center justify-between flex mb-3">
								<ToggleGroup
									type="single"
									value={view}
									onValueChange={handleValueChange}
									className="w-full flex"
								>
									<ToggleGroupItem
										value="list"
										className="flex-1 cursor-pointer flex flex-col p-1 h-14 border-secondary border-[1px] gap-1"
									>
										<AlignJustify />
										List
									</ToggleGroupItem>
									<ToggleGroupItem
										value="grid"
										className="flex-1 cursor-pointer flex flex-col p-1 h-14 border-secondary border-[1px] gap-1"
									>
										<LayoutGrid />
										Grid
									</ToggleGroupItem>
								</ToggleGroup>
							</div>
							<Separator className="my-4" />

							<div className="flex items-center justify-between">
								<span className="text-xs text-foreground">Ordering</span>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											size="sm"
											className="w-[120px] justify-between"
										>
											<span className="text-xs">{taskOrder.orderBy}</span>
											<ChevronDown className="size-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-[120px]">
										{orderByOptions.map((option) => (
											<DropdownMenuItem
												key={option}
												className="text-xs"
												onSelect={() =>
													setOptions({
														taskOrder: { ...taskOrder, orderBy: option },
													})
												}
											>
												{option}
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
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

							<div>
								<Separator className="my-2" />
								<div>{view === "grid" ? "Grid" : "List"} options</div>
								<div className="flex items-center justify-between w-full my-3">
									<p className="text-foreground text-xs py-1">
										Show Empty Groups
									</p>
									<Switch
										checked={showEmptyGroups}
										onCheckedChange={(checked) =>
											setOptions({ showEmptyGroups: checked })
										}
									/>
								</div>
								<p className="text-foreground text-xs py-1 mb-2">
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
													className="text-xs py-0 px-2 h-6"
												>
													{formatCamelCaseString(property)}
												</Button>
											</ToggleGroupItem>
										);
									})}
								</ToggleGroup>
							</div>
						</div>
						<Separator className="my-4" />

						<div className="flex items-center justify-between">
							<span className="text-xs text-foreground">Completed tasks</span>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className="w-[120px] justify-between"
									>
										<span className="text-xs">{showCompletedTasks.period}</span>
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
					</PopoverContent>
				</Popover>
			</div>
		</TooltipProvider>
	);
};

export default TopNavBarDisplay;
