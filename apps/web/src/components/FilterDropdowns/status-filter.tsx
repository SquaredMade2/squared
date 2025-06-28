import { Status } from "@squaredmade/db";
import {
	DropdownMenuCheckboxItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@squaredmade/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useFilterStore } from "@/store";
import { StatusIcon } from "../Icons";
import type { FilterOption } from "./interfaces";

const groupStatus = [
	{
		border: false,
		group: "status",
		id: 0,
		name: "Backlog",
		svg: <StatusIcon status={Status.backlog} />,
		value: Status.backlog,
	},
	{
		border: false,
		group: "status",
		id: 1,
		name: "Todo",
		svg: <StatusIcon status={Status.todo} />,
		value: Status.todo,
	},
	{
		border: false,
		group: "status",
		id: 2,
		name: "In Progress",
		svg: <StatusIcon status={Status.inProgress} />,
		value: Status.inProgress,
	},
	{
		border: false,
		group: "status",
		id: 3,
		name: "Done",
		svg: <StatusIcon status={Status.done} />,
		value: Status.done,
	},
	{
		border: false,
		group: "status",
		id: 4,
		name: "In Review",
		svg: <StatusIcon status={Status.inReview} />,
		value: Status.inReview,
	},
	{
		border: false,
		group: "status",
		id: 5,
		name: "Canceled",
		svg: <StatusIcon status={Status.canceled} />,
		value: Status.canceled,
	},
];

const StatusFilterDropDown = ({
	filterOption,
}: {
	filterOption: FilterOption;
}) => {
	const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
	const { addFilter, removeFilter, currentFilterTypes, currentFilters } =
		useFilterStore((state) => state);

	const handleStatusChange = (status: Status, checked: boolean) => {
		setSelectedStatuses((prev) =>
			checked ? [...prev, status] : prev.filter((item) => item !== status),
		);
	};

	useEffect(() => {
		removeFilter("status");
		if (selectedStatuses.length > 0) {
			addFilter({
				field: "status",
				operator: "arrayIncludesAny",
				value: selectedStatuses,
			});
		}
	}, [selectedStatuses, addFilter, removeFilter]);

	useEffect(() => {
		if (
			selectedStatuses.length === 0 &&
			currentFilterTypes.includes("status")
		) {
			const statusValues = currentFilters
				.filter((filter) => filter.field === "status")
				.flatMap((filter) => filter.value) as Status[];

			if (statusValues.length > 0) {
				setSelectedStatuses(statusValues);
			}
		}
	}, [currentFilterTypes, currentFilters]);

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				<div className="flex items-center space-x-2">
					{filterOption.svg}
					<span>{filterOption.name}</span>
				</div>
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent className="w-[17.5rem]">
				{groupStatus.map((item) => (
					<DropdownMenuCheckboxItem
						checked={selectedStatuses.includes(item.value)}
						key={item.id}
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
