import { useState } from "react";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import {
	Command,
	CommandInput,
	CommandList,
	CommandItem,
	CommandEmpty,
} from "@/components/ui/command";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useViewsStore } from "@/storeZ/provider";
import type { LabelFilterDropDownProps } from "./LabelFilterDropDown.interfaces";
import type { FilterCondition } from "@/storeZ/views";

const groupLabel = [
	{
		id: 0,
		name: "Bug",
		border: false,
		svg: <div className="h-[20px] w-[20px] rounded-full bg-[#DD2E44]" />,
		group: "labels",
	},
	{
		id: 1,
		name: "Feature",
		border: false,
		svg: <div className="h-[20px] w-[20px] rounded-full bg-[#AA8ED6]" />,
		group: "labels",
	},
	{
		id: 2,
		name: "Improvement",
		border: false,
		svg: <div className="h-[20px] w-[20px] rounded-full bg-[#55ACEE]" />,
		group: "labels",
	},
	{
		id: 3,
		name: "Red",
		border: false,
		svg: <div className="h-[20px] w-[20px] rounded-full bg-[#F4900C]" />,
		group: "labels",
	},
	{
		id: 4,
		name: "Test",
		border: false,
		svg: <div className="h-[20px] w-[20px] rounded-full bg-[#808080]" />,
		group: "labels",
	},
];

const LabelFilterDropDown = ({
	showLabelFilterDropDown,
	setShowLabelFilterDropDown,
}: LabelFilterDropDownProps): React.ReactElement => {
	const [query, setQuery] = useState("");
	const { addFilter } = useViewsStore().getState();

	const filteredOptions =
		query === ""
			? groupLabel
			: groupLabel.filter((item) =>
					item.name
						.toLowerCase()
						.replace(/\s+/g, "")
						.includes(query.toLowerCase().replace(/\s+/g, "")),
				);

	const handleSelect = (itemName: string) => {
		const filterCondition: FilterCondition = {
			field: "labels",
			value: itemName,
			operator: "arrayIncludesAny",
		};

		addFilter(filterCondition);
		setShowLabelFilterDropDown(false);
	};

	return (
		<Popover
			open={showLabelFilterDropDown}
			onOpenChange={setShowLabelFilterDropDown}
		>
			<PopoverTrigger asChild>
				<button
					className="flex items-center space-x-2 py-2 pl-3 pr-10 text-sm leading-5 text-foreground bg-secondary focus-visible:outline-none"
					type="button"
				>
					<span>Filter by Label</span>
					<ChevronUpDownIcon
						className="h-5 w-5 text-gray-400"
						aria-hidden="true"
					/>
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-72 p-0">
				<Command>
					<CommandInput placeholder="Search labels..." />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						{filteredOptions.map((item) => (
							<CommandItem
								key={item.name}
								value={item.name}
								onSelect={() => {
									handleSelect(item.name);
									setShowLabelFilterDropDown(false);
								}}
							>
								<div className="flex items-center space-x-2">
									{item.svg}
									<span>{item.name}</span>
								</div>
							</CommandItem>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default LabelFilterDropDown;
