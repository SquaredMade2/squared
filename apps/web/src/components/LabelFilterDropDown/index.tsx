import { useState, useEffect } from "react";
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
import { useFilterStore, useWorkspaceStore } from "@/storeZ";
import type { LabelFilterDropDownProps } from "./LabelFilterDropDown.interfaces";
import type { FilterCondition } from "@/storeZ/filters";

const LabelFilterDropDown = ({
	showLabelFilterDropDown,
	setShowLabelFilterDropDown,
}: LabelFilterDropDownProps): React.ReactElement => {
	const [query, setQuery] = useState<string>("");
	const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
	const { addFilter, removeFilter } = useFilterStore((state) => state);
	const { workspaceLabels } = useWorkspaceStore((state) => state);

	const handleSelect = (labelName: string) => {
		setSelectedLabels((prev) =>
			prev.includes(labelName)
				? prev.filter((label) => label !== labelName)
				: [...prev, labelName],
		);
	};

	useEffect(() => {
		// Apply filters based on the selected labels
		if (selectedLabels.length > 0) {
			for (const label of selectedLabels) {
				const filterCondition: FilterCondition = {
					field: "labels",
					value: label,
					operator: "arrayIncludesAny",
				};
				addFilter(filterCondition);
			}
		} else {
			removeFilter("labels");
		}
		setShowLabelFilterDropDown(false);
	}, [selectedLabels]);

	return (
		<Popover
			open={showLabelFilterDropDown}
			onOpenChange={setShowLabelFilterDropDown}
		>
			<PopoverTrigger>
				<div className="hidden" aria-hidden="true" />
			</PopoverTrigger>
			<PopoverContent className="w-72 p-0 mt-4 mr-32" sideOffset={10}>
				<Command>
					<CommandInput
						placeholder="Search labels..."
						value={query}
						onValueChange={setQuery}
					/>
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						{workspaceLabels.map((item) => (
							<CommandItem
								key={item.id}
								value={item.name}
								onSelect={() => handleSelect(item.name)}
							>
								<div className="flex items-center space-x-2">
									<div className={`size-3 rounded-full bg-[${item.color}]`} />,
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
