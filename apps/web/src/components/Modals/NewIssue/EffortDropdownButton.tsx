import { high, medium, low } from "@/components/Svg";
import { useModalStore, useTeamStore } from "@/store";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { effortEstimateOptions } from "@/constants/designations";

// todo change effort estimate here
export const EffortDropdownButton = () => {
	const { newIssueData, setNewIssueData } = useModalStore((state) => state);
	const effortEstimate = newIssueData.effortEstimate;
	const { currentTeam } = useTeamStore((state) => state);

	const difficultyLevels = effortEstimateOptions(currentTeam?.effort as string);

	const showIcon = (estimate: number): JSX.Element => {
		switch (true) {
			case estimate > 3:
				return high();
			case estimate > 2:
				return medium();
			default:
				return low();
		}
	};

	const extractNumber = (str: string): number =>
		Number.parseInt(str.substring(0, 2).trim(), 10);

	const handleSelectEffort = (effortEstimate: number) => {
		setNewIssueData({ ...newIssueData, effortEstimate });
	};

	const buttonContent = (effortEstimate: number | null | undefined) => (
		<>
			<span className="w-4 h-4 mr-2 inline-block cursor-pointer">
				{effortEstimate ? showIcon(effortEstimate) : medium()}
			</span>
			<span className="text-sm font-medium cursor-pointer">
				{effortEstimate || "Effort"}
			</span>
		</>
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="max-w-full w-full">
					{buttonContent(effortEstimate)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-[240px]" side="left" align="start">
				{difficultyLevels.map((effortLevel) => {
					const estimateNumber = extractNumber(effortLevel.text);

					return (
						<DropdownMenuItem
							key={effortLevel.value}
							className="flex gap-2 items-center cursor-pointer"
							onClick={() => handleSelectEffort(estimateNumber)}
						>
							{showIcon(estimateNumber)}
							<div className="flex flex-col">
								<span className="cursor-pointer">{effortLevel.text}</span>
							</div>
							<div className="ml-auto">
								{estimateNumber === effortEstimate && (
									<Check className="h-4 w-4" />
								)}
							</div>
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
