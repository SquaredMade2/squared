import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import axios from "axios";
import { setEffortEstimate } from "@/store/taskData";
import { getSingleTask } from "@/store/task/thunks";
import { effortEstimateOptions } from "@/constants/designations";
import type { EffortEstimateDropdownProps } from "@/components/EffortEstimateDropdown/EffortEstimateDropdown.interfaces";
// import ProgressBar from "@/components/ProgressBar";
import { useToast } from "../ui/use-toast";
import { Command, CommandGroup, CommandItem, CommandList } from "../ui/command";

const EffortEstimateDropdown = ({
	location,
	showIcon,
	setDropdownOpen,
}: EffortEstimateDropdownProps) => {
	const dispatch = useAppDispatch();
	const { toast } = useToast();
	const taskId = useAppSelector((state) => state.singleTask?.data?._id);
	const newIssueEffortEstimate = useAppSelector(
		(state) => state.taskData.effortEstimate,
	);
	const sidebarEffortEstimate: number | undefined = useAppSelector((state) => {
		if (location === "issueSidebar") {
			return state.singleTask.data?.effortEstimate;
		}
		return undefined;
	});

	const extractNumber = (str: string): number =>
		Number.parseInt(str.substring(0, 2).trim(), 10);

	const handleSelectEffortEstimate = (newEffortEstimate: number) => {
		if (location === "issueSidebar") updateItem(newEffortEstimate);
		if (location === "newIssue") dispatch(setEffortEstimate(newEffortEstimate));
		setDropdownOpen(false);
	};

	const updateItem = async (newEffortEstimate: number) => {
		try {
			await axios.put(
				`${process.env.NEXT_PUBLIC_SERVER}/task/update/${taskId}`,
				{
					effortEstimate: newEffortEstimate,
				},
			);
			dispatch(getSingleTask(taskId as string));
		} catch (err) {
			toast({
				title: "Error updating effort estimate",
				variant: "destructive",
			});
		}
	};

	// will this component be used in contextMenu? if not this file can be combined with EffortEstimateButton

	return (
		<>
			<Command>
				<CommandList className="relative z-[1] min-w-[170px] bg-popover">
					<CommandGroup>
						{effortEstimateOptions.map((effortEstimate) => {
							const estimateNumber = extractNumber(effortEstimate);
							let isChecked = false;
							if (location === "newIssue")
								isChecked = newIssueEffortEstimate === estimateNumber;
							if (location === "issueSidebar")
								isChecked = sidebarEffortEstimate === estimateNumber;
							return (
								<CommandItem
									key={effortEstimate}
									onSelect={() => handleSelectEffortEstimate(estimateNumber)}
									className="rounded-md py-1 cursor-pointer"
								>
									<div className="flex flex-row items-center">
										<span className="w-4 h-4 mr-2 cursor-pointer">
											{showIcon(estimateNumber)}
										</span>
										<span className="cursor-pointer">{estimateNumber}</span>
									</div>

									{/* 
									is this progress bar going to be used? currently nothing renders when uncommented
									<div className="w-16">
										<ProgressBar progress={estimateNumber} />
									</div> */}
								</CommandItem>
							);
						})}
					</CommandGroup>
				</CommandList>
			</Command>
		</>
	);
};

export default EffortEstimateDropdown;
