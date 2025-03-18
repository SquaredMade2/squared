import type { CompletedTaskPeriod, DisplayOptions } from "@/store/views";
import { ChevronDown } from "@squared/icons";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Switch } from "../ui/switch";

export const TaskDisplayOptions = ({
	showCompletedTasks,
	completedPeriodOptions,
	displayOptions,
	setOptions,
}: {
	showCompletedTasks: {
		show: boolean;
		period: CompletedTaskPeriod;
	};
	completedPeriodOptions: CompletedTaskPeriod[];
	displayOptions: DisplayOptions;
	setOptions: (input: Partial<DisplayOptions>) => void;
}) => {
	const handleDropdownSelection = (value: CompletedTaskPeriod) => {
		setOptions({
			showCompletedTasks: { show: value !== "None", period: value },
		});
	};

	return (
		<div>
			<div className="flex items-center justify-between">
				<span className="text-foreground text-xs">Completed tasks</span>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="w-[120px] justify-between"
						>
							<span className="text-xs">{showCompletedTasks.period}</span>
							<ChevronDown className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-[120px]">
						{completedPeriodOptions.map((option) => (
							<DropdownMenuItem
								key={option}
								className="text-xs"
								onSelect={() => handleDropdownSelection(option)}
							>
								{option}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="my-3 flex w-full items-center justify-between">
				<p className="py-1 text-foreground text-xs">Show SubTasks</p>
				<Switch
					checked={displayOptions.showSubTasks}
					onCheckedChange={(checked) => setOptions({ showSubTasks: checked })}
				/>
			</div>
		</div>
	);
};
