import { ChevronDown, CirclePlus } from "lucide-react";
import type { TaskColumnTitleProps } from "./interfaces";
import HideStatus from "./HideStatus";
import { cn } from "@/utils/cn";
import { useModalStore } from "@/store";
import { formatStatus } from "@/utils/formatting";
import { StatusIcon } from "../Icons";

const TaskColumnTitle = ({
	isListView,
	showTasks,
	title,
	numberOfTasks,
	setShowTasks,
	sprintId,
}: TaskColumnTitleProps) => {
	const { setNewIssueData, setShowNewIssue } = useModalStore((state) => state);

	const handleClick = (): void => {
		setShowNewIssue(true);
		setNewIssueData({ status: title, sprintId: sprintId ?? null });
	};

	return (
		<div className={isListView ? "" : "pr-2 min-w-64"}>
			<div
				className={cn(
					"flex w-full bg-secondary items-center justify-between font-medium transition-all",
					isListView
						? "rounded-t-lg xs:px-5 sm:px-5 lg:px-[42px] py-2"
						: "flex-row rounded-lg px-2 h-10 mb-2 font-bold",
					isListView && numberOfTasks === 0 ? "rounded-b-lg" : "",
				)}
			>
				{!isListView && (
					<div
						className={`flex justify-center items-center transform transition-transform duration-300 lg:mr-2 mr-1.5 ${
							showTasks ? "absolute opacity-0" : "-rotate-90"
						}`}
					>
						<ChevronDown className="size-5" />
					</div>
				)}
				{!isListView ? (
					showTasks && (
						<div
							className={
								isListView
									? "flex items-center text-foreground text-sm"
									: "flex items-center gap-4 text-foreground text-sm pr-8"
							}
						>
							<StatusIcon status={title} />
							<div className="flex gap-2 items-center">
								<span className="text-sm">{formatStatus(title)}</span>
								<span className="ml-1 text-muted-foreground">
									{numberOfTasks}
								</span>
							</div>
						</div>
					)
				) : (
					<div
						className={`flex items-center text-foreground text-sm ${isListView && "ml-2 gap-4 pr-8"}`}
					>
						<StatusIcon status={title} />
						<div className="flex gap-2 items-center">
							<span>{formatStatus(title)}</span>
							<span className="ml-2 text-muted-foreground">
								{numberOfTasks}
							</span>
						</div>
					</div>
				)}
				<div
					className={
						isListView
							? "flex gap-2 text-foreground"
							: "flex flex-row gap-2 items-center text-foreground"
					}
				>
					<div className="cursor-pointer" onClick={handleClick}>
						<div className="group cursor-pointer">
							<CirclePlus className="size-5" />
						</div>
					</div>
					<HideStatus setShowTasks={setShowTasks} showTasks={showTasks} />
				</div>
			</div>
		</div>
	);
};

export default TaskColumnTitle;
