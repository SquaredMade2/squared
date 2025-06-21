import { Check } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@squaredmade/ui/dropdown-menu";
import type { JSX } from "react";
import { high, low, medium } from "@/components/Svg";
import { effortEstimateOptions } from "@/lib/constants";
import { useModalStore, useTeamStore } from "@/store";

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

	const handleSelectEffort = (e: number) => {
		setNewTaskData({ ...newTaskData, effortEstimate: e });
	};

	const buttonContent = (e: number | null | undefined) => (
		<>
			<span className="mr-2 inline-block h-4 w-4 cursor-pointer">
				{e ? showIcon(e) : medium()}
			</span>
			<span className="cursor-pointer font-medium text-sm">
				{e || "Effort"}
			</span>
		</>
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild={true}>
				<Button className="w-full max-w-full" variant="outline">
					{buttonContent(effortEstimate)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-[240px]" side="left">
				{difficultyLevels.map((effortLevel) => {
					const estimateNumber = extractNumber(effortLevel.text);

					return (
						<DropdownMenuItem
							className="flex cursor-pointer items-center gap-2"
							key={effortLevel.value}
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
