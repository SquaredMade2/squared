import { ChevronDown, Rows3, SlidersVertical, Table } from "lucide-react";
import DisplayPreferences from "./DisplayPreferences";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useViewStore } from "@/store";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

const TopNavBarDisplay = () => {
	const [view, setView] = useViewStore((state) => [state.view, state.setView]);
	const handleValueChange = (val: string) => setView(val as "list" | "grid");
	return (
		<div className="flex flex-col gap-2 items-end relative h-10">
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
						<div className="w-full items-center justify-between flex mb-3">
							<ToggleGroup
								type="single"
								value={view}
								onValueChange={handleValueChange}
								className="w-full flex"
							>
								<ToggleGroupItem
									value="list"
									className="flex-1 cursor-pointer flex flex-col p-1 h-12 border-secondary border-[1px]"
								>
									<Rows3 />
									List
								</ToggleGroupItem>
								<ToggleGroupItem
									value="grid"
									className="flex-1 cursor-pointer flex flex-col p-1 h-12 border-secondary border-[1px]"
								>
									<Table />
									Grid
								</ToggleGroupItem>
							</ToggleGroup>
						</div>
						<DisplayPreferences />
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default TopNavBarDisplay;
