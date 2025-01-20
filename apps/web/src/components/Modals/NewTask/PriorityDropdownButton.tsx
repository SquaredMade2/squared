import { PriorityIcon } from "@/components/Icons";
import { priorityOptions } from "@/lib/constants";
import { useModalStore } from "@/store";
import { formatPriority } from "@/utils/formatting";
import type { Priority } from "@squared/db";
import { Button } from "@squared/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuTrigger,
} from "@squared/ui/dropdown-menu";
import { Check } from "lucide-react";

export const PriorityDropdownButton = () => {
	const { newTaskData, setNewTaskData } = useModalStore((state) => state);
	const newTaskPriority = newTaskData.priority;

	const handleSelectPriority = (priority: Priority) => {
		setNewTaskData({ ...newTaskData, priority });
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="max-w-full w-full">
					<span className="cursor-pointer">
						<PriorityIcon priority={newTaskPriority || "noPriority"} />
					</span>
					<span className="ml-2 cursor-pointer">
						{formatPriority(newTaskPriority || "noPriority")}
					</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				sideOffset={4}
				side={"left"}
				align="start"
				className="w-[150px]"
			>
				<DropdownMenuRadioGroup
					value={newTaskPriority}
					onValueChange={(priority) =>
						handleSelectPriority(priority as Priority)
					}
				>
					{priorityOptions.map((priority) => (
						<DropdownMenuItem
							key={priority}
							onSelect={() => handleSelectPriority(priority as Priority)}
							className="flex justify-between items-center px-2 py-1.5 cursor-pointer"
						>
							<div className="flex items-center ">
								<PriorityIcon priority={priority} />
								<span className="ml-2 cursor-pointer">
									{formatPriority(priority)}
								</span>
							</div>
							{newTaskPriority === priority && <Check className="h-4 w-4" />}
						</DropdownMenuItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
