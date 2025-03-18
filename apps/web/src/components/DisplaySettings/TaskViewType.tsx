import type { View } from "@/store/views";
import { LayoutGrid, Menu } from "@squared/icons";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export const TaskViewType = ({
	view,
	handleValueChange,
}: { view: View; handleValueChange: (val: string) => void }) => {
	return (
		<div className="mb-3 flex w-full items-center justify-between">
			<ToggleGroup
				type="single"
				value={view}
				onValueChange={handleValueChange}
				className="flex w-full"
			>
				<ToggleGroupItem
					value="list"
					className="flex h-14 flex-1 cursor-pointer flex-col gap-1 border-[1px] border-secondary p-1"
				>
					<Menu />
					List
				</ToggleGroupItem>
				<ToggleGroupItem
					value="grid"
					className="flex h-14 flex-1 cursor-pointer flex-col gap-1 border-[1px] border-secondary p-1"
				>
					<LayoutGrid />
					Grid
				</ToggleGroupItem>
			</ToggleGroup>
		</div>
	);
};
