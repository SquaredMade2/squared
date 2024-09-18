import { high, medium, low } from "@/components/Svg";
import { useModalStore } from "@/store";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
	effortEstimateOptions,
	complexityScale,
} from "@/constants/designations";
import ProgressBar from "@/components/ProgressBar";

export const EffortDropdownButton = () => {
	const { newIssueData, setNewIssueData } = useModalStore((state) => state);
	const effortEstimate = newIssueData.effortEstimate;

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
				<Button variant="outline" className="max-w-full w-full ">
					{buttonContent(effortEstimate)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-[150px]" side={"left"} align="start">
				{effortEstimateOptions.map((effortEstimate, index) => {
					const estimateNumber = extractNumber(effortEstimate);

					return (
						<DropdownMenuItem
							key={effortEstimate}
							className="flex gap-2 items-center"
							onClick={() => handleSelectEffort(estimateNumber)}
						>
							{showIcon(estimateNumber)}
							<div className="flex flex-col">
								<span>{effortEstimate}</span>
							</div>
							{/* <div className="w-16 ml-auto">
								<ProgressBar progress={estimateNumber} />
							</div> */}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
