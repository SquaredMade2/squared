import { StatusIcon } from "@/components/Icons";
import { statusOptions } from "@/lib/constants";
import { useModalStore } from "@/store";
import { formatStatus } from "@/utils/formatting";
import type { Status } from "@squaredmade/db";
import { Check } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuTrigger,
} from "@squaredmade/ui/dropdown-menu";

export const StatusDropdownButton = () => {
	const { newTaskData, setNewTaskData } = useModalStore((state) => state);
	const newTaskStatus = newTaskData.status;

	const handleSelectStatus = (status: Status) => {
		setNewTaskData({ ...newTaskData, status });
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild={true}>
				<Button variant="outline" className="w-full max-w-full">
					<span className="cursor-pointer">
						<StatusIcon status={newTaskStatus || "todo"} />
					</span>
					<span className="ml-2 cursor-pointer">
						{formatStatus(newTaskStatus ?? "backlog")}
					</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="left" align="start" className="w-[150px]">
				<DropdownMenuRadioGroup
					value={newTaskStatus}
					onValueChange={(status) => handleSelectStatus(status as Status)}
				>
					{statusOptions.map((status) => (
						<DropdownMenuItem
							key={status}
							onSelect={() => handleSelectStatus(status as Status)}
							className="flex cursor-pointer items-center justify-between px-2 py-1.5"
						>
							<div className="flex items-center">
								<StatusIcon status={status} />
								<span className="ml-2 cursor-pointer">
									{formatStatus(status)}
								</span>
							</div>
							{newTaskStatus === status && <Check className="h-4 w-4" />}
						</DropdownMenuItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
