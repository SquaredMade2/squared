import { high, low, medium } from "@/components/Svg";
import {
	complexityScale,
	effortEstimateOptions,
} from "@/constants/designations";
import { useTeamStore } from "@/store";
import { CircleHelp } from "lucide-react";
import { Button } from "../../ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../ui/dialog";

const EffortModal = () => {
	const { currentTeam } = useTeamStore((state) => state);
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="rounded-full hover:bg-transparent"
					aria-label="help"
				>
					<CircleHelp className="size-4 text-muted-foreground" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Effort Estimate Options</DialogTitle>
				</DialogHeader>

				{effortEstimateOptions(currentTeam?.effort).map(
					(effortEstimate, index) => {
						const estimateNumber = Number.parseInt(
							effortEstimate.text.substring(0, 2),
							10,
						);
						const effortEstimateKey = index;
						return (
							<div
								className="flex justify-between space-x-14 w-full"
								key={effortEstimateKey}
							>
								<div className="flex flex-row items-center">
									<span className={`${"w-4 h-4 cursor-pointer"} mr-2`}>
										{estimateNumber > 3
											? high()
											: estimateNumber > 2
												? medium()
												: low()}
									</span>
									<span className="text-foreground">{effortEstimate.text}</span>
								</div>
								<div className="text-muted-foreground mr-2">
									{complexityScale[index]}
								</div>
							</div>
						);
					},
				)}
			</DialogContent>
		</Dialog>
	);
};

export default EffortModal;
