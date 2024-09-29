import { ChevronDown, SlidersVertical } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useViewStore } from "@/store";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import type {
	CompletedTaskPeriod,
	DisplayProperty,
} from "@/store/views/interfaces";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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

	const { showEmptyGroups, showCompletedTasks, displayProperties } =
		currentOptions;

	const completedPeriodOptions: CompletedTaskPeriod[] = [
		"All",
		"Past day",
		"Past week",
		"Past month",
		"None",
	];

	const handleListClick = (): void => {
		setView("list");
	};

	const handleGridClick = (): void => {
		setView("grid");
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

	return (
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
							<span className="text-foreground text-sm">Layout</span>
							<div className="flex gap-2 items-center">
								<Button
									type="button"
									onClick={handleListClick}
									variant={view === "list" ? "outline" : "ghost"}
								>
									List
								</Button>
								<Button
									type="button"
									onClick={handleGridClick}
									variant={view === "grid" ? "outline" : "ghost"}
								>
									Grid
								</Button>
							</div>
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
						<span className="text-xs text-foreground">Completed issues</span>
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
	);
};

export default TopNavBarDisplay;
