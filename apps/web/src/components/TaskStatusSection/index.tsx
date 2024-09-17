"use client";

import type React from "react";
import TaskCard from "@/components/TaskCard";
import { GridColumnNewIssueButton } from "../NewIssueButton";
import type { Status, Task } from "@repo/db";

interface TaskStatusSectionProps {
	isListView: boolean;
	filteredTasks: Task[];
	showTasks: boolean;
	title: string;
}

const TaskStatusSection: React.FC<TaskStatusSectionProps> = ({
	isListView,
	filteredTasks,
	showTasks,
	title,
}) => {
	const location = "dashboard";
	const highlightText = (taskTitle: string) => taskTitle;

	return (
		<div
			className={
				isListView
					? "grid grid-rows-[1fr 9fr] rounded-lg bg-card w-full"
					: "flex flex-col z-30 w-full min-h-[135px] pb-1 gap-3"
			}
		>
			{showTasks &&
				filteredTasks.map((task, index) => (
					<TaskCard
						key={task.id}
						task={task}
						index={index}
						location={location}
						highlightText={highlightText}
					/>
				))}
			{!isListView && <GridColumnNewIssueButton status={title as Status} />}
		</div>
	);
};

export default TaskStatusSection;
