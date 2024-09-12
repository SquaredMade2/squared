import { useState, useEffect } from "react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuCheckboxItem,
	DropdownMenuSeparator,
	DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { filterInProgress } from "@/components/Svg";
import { useFilterStore } from "@/storeZ";
import {
	Circle,
	CircleCheckBig,
	CircleDashed,
	CircleFadingPlus,
	CircleX,
} from "lucide-react";
import type { StatusFilterDropDownProps } from "./StatusFilterDropDown.interfaces";
import { Button } from "../ui/button";
import { Status } from "@repo/db";

const groupStatus = [
	{
		id: 0,
		name: "Backlog",
		border: false,
		svg: <CircleDashed className="size-4" />,
		group: "status",
		value: Status.backlog,
	},
	{
		id: 1,
		name: "Todo",
		border: false,
		svg: <Circle className="size-4" />,
		group: "status",
		value: Status.todo,
	},
	{
		id: 2,
		name: "In Progress",
		border: false,
		svg: filterInProgress(),
		group: "status",
		value: Status.inProgress,
	},
	{
		id: 3,
		name: "Done",
		border: false,
		svg: <CircleCheckBig className="size-4 text-[#7394FF]" />,
		group: "status",
		value: Status.done,
	},
	{
		id: 4,
		name: "In Review",
		border: false,
		svg: <CircleFadingPlus className="size-4 text-green-400" />,
		group: "status",
		value: Status.inReview,
	},
];

const StatusFilterDropDown = ({
	showStatusFilterDropDown,
	setShowStatusFilterDropDown,
}: StatusFilterDropDownProps) => {
	const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
	const { addFilter, removeFilter } = useFilterStore((state) => state);

	const handleStatusChange = (status: Status, checked: boolean) => {
		setSelectedStatuses((prev) =>
			checked ? [...prev, status] : prev.filter((item) => item !== status),
		);
	};

	useEffect(() => {
		if (selectedStatuses.length > 0) {
			console.log("StatusFilter: ", {
				field: "status",
				value: selectedStatuses,
				operator: "arrayIncludesAny",
			});
			const newFilter = addFilter({
				field: "status",
				value: selectedStatuses,
				operator: "arrayIncludesAny",
			});
		} else {
			removeFilter("status");
		}
	}, [selectedStatuses, addFilter, removeFilter]);

	return (
		<DropdownMenu
			open={showStatusFilterDropDown}
			onOpenChange={setShowStatusFilterDropDown}
		>
			<DropdownMenuTrigger />
			<DropdownMenuContent className="w-72 p-0" sideOffset={20}>
				<DropdownMenuLabel>Status</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{groupStatus.map((item) => (
					<DropdownMenuCheckboxItem
						key={item.id}
						checked={selectedStatuses.includes(item.value)}
						onCheckedChange={(checked) =>
							handleStatusChange(item.value, checked)
						}
					>
						<div className="flex items-center space-x-2">
							{item.svg}
							<span>{item.name}</span>
						</div>
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default StatusFilterDropDown;
