import { ChevronDown, SlidersVertical } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useViewStore } from "@/store";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";

const TopNavBarDisplay = () => {
	const {
		view,
		setView,
		showPriority,
		showLabels,
		showDateTime,
		listViewOptions,
		gridViewOptions,
		setShowPriority,
		setShowLabels,
		setShowDateTime,
		setListViewOptions,
		setGridViewOptions,
	} = useViewStore((state) => state);
	const handleListClick = (): void => {
		setView("list");
	};

	const handleGridClick = (): void => {
		setView("grid");
	};

	const handlePriority = (): void => {
		setShowPriority(!showPriority);
	};

	const handleLabels = (): void => {
		setShowLabels(!showLabels);
	};

	const handleDateTime = (): void => {
		setShowDateTime(!showDateTime);
	};

	const getFormattedKeyString = (obj: { showEmptyGroups?: boolean }) => {
		return Object.keys(obj)
			.map((key) => key.replace(/([A-Z])/g, " $1"))
			.join(", ")
			.replace(/\b\w/g, (char) => char.toUpperCase());
	};

	const displayOptions = [
		{ label: "Priority", show: showPriority, handle: handlePriority },
		{ label: "Labels", show: showLabels, handle: handleLabels },
		{ label: "Date and Time", show: showDateTime, handle: handleDateTime },
	];

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
							{displayOptions.map((option) => (
								<div
									className="flex items-center justify-between w-full"
									key={option.label}
								>
									<p className="text-foreground text-xs py-1 mb-1 last:mb-0">
										{option.label}
									</p>
									<Switch checked={option.show} onClick={option.handle} />
								</div>
							))}
							<Separator className="my-2" />
							{view === "grid" && (
								<div className="flex items-center justify-between w-full">
									<p className="text-foreground text-xs py-1 mb-1 last:mb-0">
										{getFormattedKeyString(gridViewOptions)}
									</p>
									<Switch
										checked={gridViewOptions.showEmptyGroups}
										onCheckedChange={(checked) =>
											setGridViewOptions({ showEmptyGroups: checked })
										}
									/>
								</div>
							)}
							{view === "list" && (
								<div className="flex items-center justify-between w-full">
									<p className="text-foreground text-xs py-1 mb-1 last:mb-0">
										{getFormattedKeyString(listViewOptions)}
									</p>
									<Switch
										checked={listViewOptions.showEmptyGroups}
										onCheckedChange={(checked) =>
											setListViewOptions({ showEmptyGroups: checked })
										}
									/>
								</div>
							)}
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default TopNavBarDisplay;
