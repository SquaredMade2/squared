import { CircleHelp } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@squaredmade/ui/dialog";
import { high, low, medium } from "@/components/Svg";
import { complexityScale, effortEstimateOptions } from "@/lib/constants";
import { useTeamStore } from "@/store";

const EffortModal = () => {
	const { team } = useTeamStore((state) => state);
	const svg = (estimateNumber: number) => {
		switch (estimateNumber) {
			case 3:
				return high();
			case 2:
				return medium();
			default:
				return low();
		}
	};
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					aria-label="help"
					className="rounded-full hover:bg-transparent"
					size="icon"
					variant="ghost"
				>
					<CircleHelp className="size-4 text-muted-foreground" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Effort Estimate Options</DialogTitle>
				</DialogHeader>

				{effortEstimateOptions(team?.effort).map((effortEstimate, index) => {
					const estimateNumber = Number.parseInt(
						effortEstimate.text.substring(0, 2),
						10,
					);
					const effortEstimateKey = index;
					return (
						<div
							className="flex w-full justify-between space-x-14"
							key={effortEstimateKey}
						>
							<div className="flex flex-row items-center">
								<span className={`${"h-4 w-4 cursor-pointer"} mr-2`}>
									{svg(estimateNumber)}
								</span>
								<span className="text-foreground">{effortEstimate.text}</span>
							</div>
							<div className="mr-2 text-muted-foreground">
								{complexityScale[index]}
							</div>
						</div>
					);
				})}
			</DialogContent>
		</Dialog>
	);
};

export default EffortModal;
