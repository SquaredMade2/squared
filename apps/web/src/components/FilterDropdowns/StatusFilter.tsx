import { useState, useEffect } from "react";
import {
	DropdownMenuCheckboxItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useFilterStore } from "@/store";
import { Status } from "@repo/db";
import { StatusIcon } from "../Icons";
import type { FilterOption } from "./interfaces";

const groupStatus = [
	{
		id: 0,
		name: "Backlog",
		border: false,
		svg: <StatusIcon status={Status.backlog} />,
		group: "status",
		value: Status.backlog,
	},
	{
		id: 1,
		name: "Todo",
		border: false,
		svg: <StatusIcon status={Status.todo} />,
		group: "status",
		value: Status.todo,
	},
	{
		id: 2,
		name: "In Progress",
		border: false,
		svg: <StatusIcon status={Status.inProgress} />,
		group: "status",
		value: Status.inProgress,
	},
	{
		id: 3,
		name: "Done",
		border: false,
		svg: <StatusIcon status={Status.done} />,
		group: "status",
		value: Status.done,
	},
	{
		id: 4,
		name: "In Review",
		border: false,
		svg: <StatusIcon status={Status.inReview} />,
		group: "status",
		value: Status.inReview,
	},
	{
		id: 5,
		name: "Canceled",
		border: false,
		svg: <StatusIcon status={Status.canceled} />,
		group: "status",
		value: Status.canceled,
	},
];

const StatusFilterDropDown = ({
	filterOption,
}: { filterOption: FilterOption }) => {
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
			removeFilter("status");
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
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				<div className="flex items-center space-x-2">
					{filterOption.svg}
					<span>{filterOption.name}</span>
				</div>
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent className="w-70">
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
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
};

export default StatusFilterDropDown;
