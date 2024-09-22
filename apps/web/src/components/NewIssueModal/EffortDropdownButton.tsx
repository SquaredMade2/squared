import { high, medium, low } from "@/components/Svg";
import { useModalStore } from "@/store";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const difficultyLevels = [
	"1 - Really easy",
	"2 - Easy",
	"3 - Normal",
	"4 - Hard",
	"5 - Really hard",
];

export const EffortDropdownButton = () => {
	const { newIssueData, setNewIssueData } = useModalStore((state) => state);
	const effortEstimate = newIssueData.effortEstimate;

	const showIcon = (estimate: number): JSX.Element => {
		switch (true) {
			case estimate > 3:
				return high();
			case estimate > 1:
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
			<DropdownMenuContent className="w-[180px]" side="left" align="start">
				{difficultyLevels.map((effortLevel) => {
					const estimateNumber = extractNumber(effortLevel);

					return (
						<DropdownMenuItem
							key={effortLevel}
							className="flex gap-2 items-center"
							onClick={() => handleSelectEffort(estimateNumber)}
						>
							{showIcon(estimateNumber)}
							<div className="flex flex-col">
								<span>{effortLevel}</span>
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
