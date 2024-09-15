import {
	ChevronDown,
	Circle,
	CircleCheckBig,
	CircleDashed,
	CirclePlus,
	CircleX,
	Copy,
} from "lucide-react";
import { inProgress } from "../Svg";
import type { TaskColumnTitleProps } from "./TaskColumnTitle.interfaces";
import HideStatus from "@/components/HideStatus/HideStatus";
import { cn } from "@/utils/cn";
import { useModalStore } from "@/storeZ";
import { formatStatus } from "@/utils/formatting";

const TaskColumnTitle = ({
	isListView,
	showTasks,
	title,
	numberOfTasks,
	toggleShowTasks,
}: TaskColumnTitleProps) => {
	const { setNewIssueData, setShowNewIssue } = useModalStore((state) => state);

	const showIcon = (name: string): React.ReactNode => {
		switch (name) {
			case "Backlog":
				return <CircleDashed className="size-4" />;
			case "Todo":
				return <Circle className="size-4" />;
			case "In Progress":
				return inProgress();
			case "Done":
				return <CircleCheckBig className="size-4 text-[#7394FF]" />;
			case "Canceled":
				return <CircleX className="size-4" />;
			case "Duplicate":
				return <Copy className="size-4" />;
		}
	};

	const handleClick = (): void => {
		setShowNewIssue(true);
		setNewIssueData({ status: title });
	};

	return (
		<div className={isListView ? "" : "pr-2 min-w-64"}>
			<div
				className={cn(
					"flex w-full bg-muted dark:bg-accent items-center justify-between font-medium transition-all",
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
							<div className="w-4 lg:mr-2 mr-1.5">{showIcon(title)}</div>
							<span className="text-sm">{formatStatus(title)}</span>
							<span className="ml-1 text-muted-foreground">
								{numberOfTasks}
							</span>
						</div>
					)
				) : (
					<div
						className={
							isListView
								? "flex items-center text-foreground text-sm"
								: "flex items-center gap-4 text-foreground text-sm pr-8"
						}
					>
						<div className="w-4 lg:mr-2 mr-1.5">{showIcon(title)}</div>
						<span>{formatStatus(title)}</span>
						<span className="ml-2 text-muted-foreground">{numberOfTasks}</span>
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

					<HideStatus toggleShowTasks={toggleShowTasks} showTasks={showTasks} />
				</div>
			</div>
		</div>
	);
};

export default TaskColumnTitle;
