"use client";
import { LoadingTask } from "@/components/Task/LoadingTask";
import TaskBreadcrumbs from "@/components/Task/TaskBreadcrumbs";
import TaskDesignationsContainer from "@/components/Task/TaskDesignationsContainer";
import EventTabs from "@/components/Task/TaskPageActivityTimeline/EventTabs";
import TaskPageForm from "@/components/Task/TaskPageForm";
import TaskSidebarTopRow from "@/components/Task/TaskSidebarTopRow";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { useTaskStore, useTeamStore } from "@/store";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const TaskPage = () => {
	const { tasks, currentTask, getAllTasks, setCurrentTask } = useTaskStore(
		(state) => state,
	);
	const { currentTeam, teams, setCurrentTeam } = useTeamStore((state) => state);

	const [isLoading, setIsLoading] = useState(true);

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
					currentTeam && (await getAllTasks(currentTeam.id));
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
			{isLoading || !currentTask ? (
				<LoadingTask />
			) : (
				<div className="w-full mdlg:w-full flex space-around scrollbar-thin-transparent overflow-auto max850:overflow-x-hidden">
					<div className="w-full h-full p-2 md:p-5 xl:px-10 ">
						<div className="flex w-full relative">
							<div className="w-full snap-start z-0 overflow-x-hidden">
								<div className="flex items-center gap-2">
									<Button variant={"ghost"} size="icon">
										<ArrowLeft className="size-4" />
									</Button>
									<div className=" w-full max850:w-10/12 overflow-hidden">
										<TaskBreadcrumbs />
									</div>
								</div>

								<ScrollArea className="h-[calc(100vh-5rem)] ">
									<div className="mr-1 max850:mr-1 md:mr-5 xl:mr-10">
										<TaskPageForm task={currentTask} />
										<EventTabs />
									</div>
								</ScrollArea>
							</div>
							<div className="flex flex-col gap-4">
								<TaskSidebarTopRow task={currentTask} />
								<TaskDesignationsContainer />
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TaskPage;
