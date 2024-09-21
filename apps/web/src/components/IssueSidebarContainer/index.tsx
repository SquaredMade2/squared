import TaskDesignationsContainer from "../TaskDesignationsContainer";
import IssueSidebarTopRow from "../IssueSidebarTopRow";

const IssueSidebarContainer = () => {
	return (
		<>
			<div className="w-full">
				<IssueSidebarTopRow />
			</div>
			<div className="flex flex-col min-h-[320px] w-[300px] text-foreground bg-popover rounded-lg mt-5">
				<TaskDesignationsContainer />
			</div>
		</>
	);
};

export default IssueSidebarContainer;
