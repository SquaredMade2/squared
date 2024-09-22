import TaskDesignationsContainer from "./TaskDesignationsContainer";
import TaskSidebarTopRow from "./TaskSidebarTopRow";

const TaskSidebarContainer = () => {
	return (
		<>
			<div className="w-full">
				<TaskSidebarTopRow />
			</div>
			<div className="flex flex-col min-h-[320px] w-[300px] text-foreground bg-popover rounded-lg mt-5">
				<TaskDesignationsContainer />
			</div>
		</>
	);
};

export default TaskSidebarContainer;
