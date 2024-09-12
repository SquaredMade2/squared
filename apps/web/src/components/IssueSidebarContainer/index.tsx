import React from "react";
import TaskDesignationsContainer from "../TaskDesignationsContainer";
import IssueSidebarTopRow from "../IssueSidebarTopRow";
import type { Task } from "@repo/db";

const IssueSidebarContainer = ({currentTask}: {currentTask: Task | null}) => {
	return (
		<>
			<div className="w-full">
				<IssueSidebarTopRow />
			</div>
			<div className="flex flex-col min-h-[320px] w-[300px] text-foreground bg-popover rounded-lg mt-5">
				<TaskDesignationsContainer currentTask={currentTask} />
			</div>
		</>
	);
};

export default IssueSidebarContainer;
