"use client";

import { useState } from "react";
import { effortEstimateOptions } from "@/constants/designations";
import { useTheme } from "next-themes";
import { high, medium, low } from "@/components/Svg";
import { setBackgroundColor } from "@/components/TaskDesignationsContainer";
import ProgressBar from "@/components/ProgressBar";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DesignationsContainerProps } from "../DesignationsContainer/DesignationsContainer.interfaces";

const EffortEstimateButton = ({
	newIssueData,
	setNewIssueData,
}: DesignationsContainerProps) => {
	const [open, setOpen] = useState(false);
	const { toast } = useToast();
	const { theme } = useTheme();
	const effortEstimate = newIssueData?.effortEstimate;

	const extractNumber = (str: string): number =>
		Number.parseInt(str.substring(0, 2).trim(), 10);

	const handleSelectEffortEstimate = (newEffortEstimate: number) => {
		if (newIssueData.effortEstimate === newEffortEstimate) return;
		try {
			setNewIssueData({ ...newIssueData, effortEstimate: newEffortEstimate });
		} catch (err) {
			toast({
				title: "Error setting effort estimate",
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
					variant="ghost"
					className={`grow flex flex-row items-center border-[0.8px] border-transparent hover:border-border rounded px-2 py-2 mr-2 text-foreground text-sm ${setBackgroundColor(theme)}`}
				>
					<span className="w-4 h-4 mr-2 inline-block">
						{effortEstimate ? showIcon(effortEstimate) : medium()}
					</span>
					<span className="text-sm font-semibold">
						{effortEstimate || "Effort"}
					</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-[170px]">
				{effortEstimateOptions.map((effortEstimate) => {
					const estimateNumber = extractNumber(effortEstimate);
					return (
						<DropdownMenuItem
							key={estimateNumber}
							onSelect={() => handleSelectEffortEstimate(estimateNumber)}
							className="flex justify-between items-center px-2 py-1.5"
						>
							<div className="flex items-center">
								<span className="w-4 h-4 mr-2">{showIcon(estimateNumber)}</span>
								<span>{estimateNumber}</span>
							</div>
							<div className="w-16">
								<ProgressBar progress={estimateNumber} />
							</div>
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default EffortEstimateButton;
