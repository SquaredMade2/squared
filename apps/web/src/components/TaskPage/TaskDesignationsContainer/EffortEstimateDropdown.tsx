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
import type { ButtonProps } from "./interfaces";
import { ChevronDown } from "lucide-react";

const EffortEstimateDropdown = ({ currentTask }: ButtonProps) => {
	const [open, setOpen] = useState(false);
	const { toast } = useToast();

	const { updateTask } = useTaskStore((state) => state);
	const sidebarEffortEstimate = currentTask?.effortEstimate ?? "";
	const taskId = currentTask?.id ?? "";

	const extractNumber = (str: string): number =>
		Number.parseInt(str.substring(0, 2).trim(), 10);

	const handleSelectEffortEstimate = async (newEffortEstimate: number) => {
		try {
			await updateTask(taskId, { effortEstimate: newEffortEstimate });
			// await getTaskEvents(taskId);
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
			case estimate > 8:
				return high();
			case estimate > 3:
				return medium();
			default:
				return low();
		}
	};

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="flex items-center justify-between w-full"
				>
					<div className="flex gap-2 items-center">
						{sidebarEffortEstimate ? showIcon(sidebarEffortEstimate) : medium()}

						<span className="text-sm font-semibold">
							{sidebarEffortEstimate || "Effort"}
						</span>
					</div>
					<ChevronDown className="size-4 text-muted-foreground" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-52">
				{effortEstimateOptions.map((effortEstimate) => {
					const estimateNumber = extractNumber(effortEstimate);
					return (
						<DropdownMenuItem
							key={estimateNumber}
							onSelect={() => handleSelectEffortEstimate(estimateNumber)}
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
