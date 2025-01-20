import { high, low, medium } from "@/components/Svg";
import { Button } from "@squared/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@squared/ui/dropdown-menu";
import { effortEstimateOptions } from "@/lib/constants";
import { useModalStore, useTeamStore } from "@/store";
import { Check } from "lucide-react";

export const EffortDropdownButton = () => {
	const { newTaskData, setNewTaskData } = useModalStore((state) => state);
	const effortEstimate = newTaskData.effortEstimate;
	const { team } = useTeamStore((state) => state);

	const difficultyLevels = effortEstimateOptions(team?.effort as string);

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

	const extractNumber = (str: string): number =>
		Number.parseInt(str.substring(0, 2).trim(), 10);

	const handleSelectEffort = (effortEstimate: number) => {
		setNewTaskData({ ...newTaskData, effortEstimate });
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
							<div>{showIcon(estimateNumber)}</div>
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
