import Task from "@/components/Task";
import { LoadingTask } from "@/components/Task/LoadingTask";
import TaskPageCenterContainer from "@/components/Task/TaskPageCenterContainer";
import { useToast } from "@/components/ui/use-toast";
import { useTaskStore, useTeamStore } from "@/store";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const TaskPage = () => {
	const { tasks, currentTask, getAllTasks, setCurrentTask } = useTaskStore(
		(state) => state,
	);

	const { currentTeam, teams, setCurrentTeam } = useTeamStore((state) => state);

	const [isLoading, setIsLoading] = useState(true);

	const showBackdrop = showSideNav;
	const { toast } = useToast();
	const { taskIdentifier } = useParams();
	const { teamIdentifier } = useParams();

	useEffect(() => {
		setIsLoading(true);

		const initializeTaskPage = async () => {
			try {
				if (!currentTeam) {
					const team = teams.find((t) => t.identifier === teamIdentifier);
					if (team) {
						setCurrentTeam(team);
					} else {
						toast({
							title: "Error getting current team",
							description: "Current Team does not exist",
							variant: "destructive",
						});
					}
				}
				if (!currentTask || currentTask.identifier !== taskIdentifier) {
					if (currentTeam) {
						await getAllTasks(currentTeam.id);
					}
				}
				const foundTask = tasks.find(
					(eachTask) => eachTask.identifier === taskIdentifier,
				);
				if (foundTask) {
					setCurrentTask(foundTask);
					setIsLoading(false);
				} else {
					toast({
						title: "Error finding task",
						description: "404 Cannot find task from current team.",
						variant: "destructive",
					});
					setIsLoading(false);
				}
			} catch (err) {
				if (err instanceof Error) {
					toast({
						title: "Error initializating Task Page",
						description: err.message,
						variant: "destructive",
					});
				}
			}
		};
		initializeTaskPage();
	}, []);

	return (
		<div className="w-full h-screen flex bg-background overflow-hidden">
			{isLoading ? (
				<LoadingTask />
			) : (
				<div className="w-full mdlg:w-full flex space-around scrollbar-thin-transparent overflow-auto max850:overflow-x-hidden">
					{showBackdrop && (
						<div
							className={
								showSideNav
									? "max850:block hidden w-full h-screen absolute bg-gray-500 z-10 bg-opacity-40"
									: ""
							}
						/>
					)}
					<div className="w-full h-full p-2 md:p-5 xl:px-10 ">
						<div className="flex w-full relative">
							<TaskPageCenterContainer />
							<div
								className={`relative max850:absolute transition-all duration-300 ease-in-out ${
									showSideNav
										? " z-20 max850:-right-0 "
										: " max850:-right-[500px] "
								}`}
							>
								<div className="" ref={sideNav}>
									<TaskSidebarContainer />
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TaskPage;
