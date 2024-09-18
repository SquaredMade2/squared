import React, {} from "react";
import { ChevronDown, SlidersVertical } from "lucide-react";
import DisplayPreferences from "../DisplayPreferences";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useViewStore } from "@/store";

const TopNavBarDisplay = () => {
	const [view, setView] = useViewStore((state) => [state.view, state.setView]);

	const handleListClick = (): void => {
		setView("list");
	};

	const handleGridClick = (): void => {
		setView("grid");
	};

	return (
		<div className="flex flex-col gap-2 items-end relative h-10 ">
			<Popover>
				<PopoverTrigger asChild>
					<Button variant={"outline"} className="gap-2">
						<SlidersVertical className="size-4" />
						Display
						<ChevronDown className="size-4" />
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
						<DisplayPreferences />
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default TopNavBarDisplay;
