import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import axios from "axios";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Combobox } from "@headlessui/react";
import { setEffortEstimate } from "@/store/taskData";
import { getSingleTask } from "@/store/task/thunks";
import { effortEstimateOptions } from "@/constants/designations";
import type { EffortEstimateDropdownProps } from "@/components/EffortEstimateDropdown/EffortEstimateDropdown.interfaces";
import ProgressBar from "@/components/ProgressBar";

const EffortEstimateDropdown = ({
	location,
	showIcon,
	handleButtonClick,
	handleClickAway,
}: EffortEstimateDropdownProps) => {
	//const { taskId }: { taskId: string } = useParams();
	const dispatch = useAppDispatch();
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
		handleButtonClick();
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
		} catch (err) {}
	};

	return (
		<ClickAwayListener onClickAway={() => handleClickAway()}>
			<Combobox>
				<div
					className={`absolute ${
						location === "newIssue" ? "top-8" : "top-0 -left-[190px]"
					}`}
				>
					<div className="relative z-[1] min-w-[170px] bg-popover border border-border p-2 font-medium text-foreground text-sm shadow-lg rounded-md">
						<Combobox.Options static>
							{effortEstimateOptions.map((effortEstimate) => {
								const estimateNumber = extractNumber(effortEstimate);
								let isChecked = false;
								if (location === "newIssue")
									isChecked = newIssueEffortEstimate === estimateNumber;
								if (location === "issueSidebar")
									isChecked = sidebarEffortEstimate === estimateNumber;
								return (
									<Combobox.Option
										onClick={() => handleSelectEffortEstimate(estimateNumber)}
										value={effortEstimate}
										key={estimateNumber}
										className={`flex flex-row justify-between items-center hover:bg-popoverHover rounded-md py-1 px-2 cursor-pointer ${
											isChecked ? "bg-popoverHover" : ""
										}`}
									>
										<div className="flex flex-row items-center">
											<span className="w-4 h-4 mr-2 cursor-pointer">
												{showIcon(estimateNumber)}
											</span>
											<span className="cursor-pointer">{estimateNumber}</span>
										</div>
										<div className="w-16">
											<ProgressBar progress={estimateNumber} />
										</div>
									</Combobox.Option>
								);
							})}
						</Combobox.Options>
					</div>
				</div>
			</Combobox>
		</ClickAwayListener>
	);
};

export default EffortEstimateDropdown;
