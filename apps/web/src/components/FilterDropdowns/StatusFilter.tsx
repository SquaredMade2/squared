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
import { useFilterStore } from "@/store";
import {
	Circle,
	CircleCheckBig,
	CircleDashed,
	CircleFadingPlus,
} from "lucide-react";
import type { FilterDropDownProps } from "./interfaces";
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
	showFilterDropDown,
	setShowFilterDropDown,
}: FilterDropDownProps) => {
	const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
	const { addFilter, removeFilter, currentFilterTypes } = useFilterStore(
		(state) => state,
	);

	const handleStatusChange = (status: Status, checked: boolean) => {
		setSelectedStatuses((prev) =>
			checked ? [...prev, status] : prev.filter((item) => item !== status),
		);
	};

	useEffect(() => {
		if (selectedStatuses.length > 0) {
			addFilter({
				field: "status",
				value: selectedStatuses,
				operator: "arrayIncludesAny",
			});
		} else {
			removeFilter("status");
		}
	}, [selectedStatuses, addFilter, removeFilter]);

	useEffect(() => {
		if (
			currentFilterTypes.length === 0 ||
			!currentFilterTypes.includes("status")
		) {
			setSelectedStatuses([]);
		}
	}, [currentFilterTypes]);

	return (
		<DropdownMenu
			open={showFilterDropDown}
			onOpenChange={setShowFilterDropDown}
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
						onSelect={(e) => {
							e.preventDefault();
						}}
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
