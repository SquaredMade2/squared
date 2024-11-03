"use client";

import { useState } from "react";
import { effortEstimateOptions } from "@/constants/designations";
import { useTaskStore } from "@/store";
import { high, medium, low } from "@/components/Svg";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useTeamStore } from "@/store";

const EffortEstimateDropdown = () => {
	const [open, setOpen] = useState(false);
	const { toast } = useToast();

	const { currentTeam } = useTeamStore((state) => state);
	const { updateTask, currentTask, setCurrentTask } = useTaskStore(
		(state) => state,
	);

	if (!currentTask) return null;

	const { id: taskId } = currentTask;

	const sidebarEffortEstimate = ():
		| { text: string; value: number }
		| undefined => {
		const effortArray = effortEstimateOptions(currentTeam?.effort);

		const selectedEffortIndex = effortArray.findIndex((efforts) => {
			return efforts.value === currentTask?.effortEstimate;
		});

		return effortArray[selectedEffortIndex];
	};

	const extractNumber = (str: string): number =>
		Number.parseInt(str.substring(0, 2).trim(), 10);

	const handleSelectEffortEstimate = async (
		newEffortEstimate: Record<string, string | number>,
	) => {
		try {
			await updateTask(taskId, {
				effortEstimate: newEffortEstimate.value as number,
			});
			setCurrentTask({
				...currentTask,
				effortEstimate: newEffortEstimate.value as number,
			});
		} catch {
			toast({
				title: "Error updating effort estimate",
				variant: "destructive",
			});
		}
		setOpen(false);
	};

	const showIcon = (estimate: number): JSX.Element => {
		switch (true) {
			case estimate > 4:
				return high();
			case estimate > 2:
				return medium();
			default:
				return low();
		}
	};

	const effortEstimate = sidebarEffortEstimate();

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="flex items-center justify-between w-full"
				>
					<div className="flex gap-2 items-center">
						{effortEstimate ? showIcon(effortEstimate.value) : medium()}

						<span className="text-sm font-semibold">
							{effortEstimate ? extractNumber(effortEstimate.text) : "Effort"}
						</span>
					</div>
					<ChevronDown className="size-4 text-muted-foreground" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{effortEstimateOptions(currentTeam?.effort).map((effortEstimate) => {
					const estimateNumber = extractNumber(effortEstimate.text);
					return (
						<DropdownMenuItem
							key={estimateNumber}
							onSelect={() => handleSelectEffortEstimate(effortEstimate)}
							className="flex justify-between items-center"
						>
							<div className="flex items-center">
								<span className="w-4 h-4 mr-2">{showIcon(estimateNumber)}</span>
								<span>{estimateNumber}</span>
							</div>
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default EffortEstimateDropdown;
