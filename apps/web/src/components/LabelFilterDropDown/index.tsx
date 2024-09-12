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
	CommandGroup,
} from "@/components/ui/command";
import { useFilterStore, useWorkspaceStore } from "@/storeZ";
import type { LabelFilterDropDownProps } from "./LabelFilterDropDown.interfaces";
import type { FilterCondition } from "@/storeZ/filters";
import type { Label } from "@repo/db";
import { LabelColor } from "../LabelDropdownButton";
import { Check } from "lucide-react";

const LabelFilterDropDown = ({
	showLabelFilterDropDown,
	setShowLabelFilterDropDown,
}: LabelFilterDropDownProps): React.ReactElement => {
	const { workspaceLabels } = useWorkspaceStore((state) => state);
	const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
	const { addFilter, removeFilter } = useFilterStore((state) => state);

	const handleLabelChange = (label: Label, checked: boolean) => {
		setSelectedLabels((prev) =>
			checked ? [...prev, label] : prev.filter((item) => item !== label),
		);
	};

	useEffect(() => {
		if (selectedLabels.length > 0) {
			addFilter({
				field: "labels",
				value: selectedLabels.map((label) => label.id),
				operator: "arrayIncludesAny",
			});
		} else {
			removeFilter("labels");
		}
	}, [selectedLabels, addFilter, removeFilter]);

	return (
		<Popover
			open={showLabelFilterDropDown}
			onOpenChange={setShowLabelFilterDropDown}
		>
			<PopoverTrigger />
			<PopoverContent className="w-72 p-0" sideOffset={20}>
				<Command>
					<CommandInput placeholder="Search labels..." />
					<CommandEmpty>No Labels Found</CommandEmpty>
					<CommandList>
						<CommandGroup>
							{workspaceLabels.map((label) => (
								<CommandItem
									key={label.id}
									onClick={() =>
										handleLabelChange(label, selectedLabels.includes(label))
									}
								>
									<div className="flex items-center space-x-2">
										{selectedLabels.includes(label) ? (
											<Check className="size-3" />
										) : (
											<div className="size-3" />
										)}
										<div
											className="w-3 h-3 rounded-lg"
											style={{ backgroundColor: label.color }}
										/>
										<span>{label.name}</span>
									</div>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default LabelFilterDropDown;
