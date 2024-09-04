import { useState, useEffect } from "react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { filterInProgress } from "@/components/Svg";
import { useViewsStore } from "@/storeZ/provider"; // Correct import for Zustand store
import type { StatusFilterDropDownProps } from "./StatusFilterDropDown.interfaces";
import { Circle, CircleCheckBig, CircleDashed, CircleX } from "lucide-react";
import type { FilterCondition } from "@/storeZ/views";

const groupStatus = [
	{
		id: 0,
		name: "Backlog",
		border: false,
		svg: <CircleDashed className="size-4" />,
		group: "status",
	},
	{
		id: 1,
		name: "Todo",
		border: false,
		svg: <Circle className="size-4" />,
		group: "status",
	},
	{
		id: 2,
		name: "In Progress",
		border: false,
		svg: filterInProgress(),
		group: "status",
	},
	{
		id: 3,
		name: "Done",
		border: false,
		svg: <CircleCheckBig className="size-4 text-[#7394FF]" />,
		group: "status",
	},
	{
		id: 4,
		name: "Cancelled",
		border: false,
		svg: <CircleX className="size-4" />,
		group: "status",
	},
	{
		id: 5,
		name: "Duplicate",
		border: false,
		svg: <CircleX className="size-4" />,
		group: "status",
	},
];

const StatusFilterDropDown = ({
	showStatusFilterDropDown,
	setShowStatusFilterDropDown,
}: StatusFilterDropDownProps) => {
	const [query, setQuery] = useState("");
	const [filterOption, setFilterOption] = useState<string | null>(null);

	const { addFilter } = useViewsStore().getState(); // Correct method usage from Zustand store

	const filteredGroup =
		query === ""
			? groupStatus
			: groupStatus.filter((item) =>
					item.name
						.toLowerCase()
						.replace(/\s+/g, "")
						.includes(query.toLowerCase().replace(/\s+/g, "")),
				);

	useEffect(() => {
		if (filterOption) {
			const taskFilter: FilterCondition = {
				field: "status",
				value: filterOption,
				operator: "equals",
			};

			addFilter(taskFilter);
			setShowStatusFilterDropDown(false);
		}
	}, [filterOption]);

	return (
		<DropdownMenu
			open={showStatusFilterDropDown}
			onOpenChange={setShowStatusFilterDropDown}
		>
			<DropdownMenuContent className="w-72 p-0">
				{filteredGroup.map((item) => (
					<DropdownMenuItem
						key={item.id}
						onSelect={() => setFilterOption(item.name)}
					>
						<div className="flex items-center space-x-2">
							{item.svg}
							<span>{item.name}</span>
						</div>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default StatusFilterDropDown;
