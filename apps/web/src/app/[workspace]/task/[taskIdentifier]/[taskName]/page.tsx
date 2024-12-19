"use client";
import { NewTaskCollapsible } from "@/components/Modals";
import {
	// EventTabs,
	MobileTaskSettings,
	TaskBreadcrumbs,
	TaskDesignationsContainer,
	TaskPageForm,
	TaskSidebarTopRow,
} from "@/components/TaskPage";
import { LoadingTask } from "@/components/TaskPage/LoadingTask";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { userService } from "@/lib/services";
import { useUserStore } from "@/store";
import { TODO } from "@squared/context";

import { useTaskPage } from "@/hooks/useTaskPage";
import { useTaskStore } from "@/store";
import { useEffect } from "react";
import Subtasks from "./Subtasks";

const TaskPage = () => {
	const { isLoading, error, subtasks } = useTaskPage();
	const { currentTask } = useTaskStore((state) => state);
	const { toast } = useToast();
	const user = useUserStore((state) => state.user);

	useEffect(() => {
		if (currentTask && user?.id) {
			userService
				.setLastViewedTask(TODO, {
					userId: user.id,
					taskId: currentTask.id,
				})
				.catch((error) => {
					toast({
						title: error,
						variant: "destructive",
					});
				});
		}
	}, [currentTask, user]);

	useEffect(() => {
		if (error) {
			toast({
				title: error,
				variant: "destructive",
			});
		}
	}, [error]);

	return (
		<div className="w-full h-screen flex bg-background overflow-hidden">
			{isLoading || !currentTask ? (
				<LoadingTask />
			) : (
				<div className="w-full mdlg:w-full flex space-around scrollbar-thin-transparent overflow-auto max850:overflow-x-hidden">
					<div className="w-full h-full p-1 md:pb-5 xl:px-10 ">
						<div className="flex flex-col w-full relative">
							<div className="w-full snap-start z-0 overflow-x-hidden">
								<div className="flex gap-4 items-center mb-4 py-4 border-b border-border w-full">
									<TaskBreadcrumbs />
								</div>
							</div>
							<MobileTaskSettings />
							<div className="flex w-full relative">
								<ScrollArea className="h-[calc(100vh-5rem)] w-full">
									<div className="mr-1 max850:mr-1 md:mr-5 xl:mr-10">
										{/* <TaskPageForm /> */}
										{/* {subtasks.length > 0 && <Subtasks />} */}
										{/* <NewTaskCollapsible parentId={currentTask.id} /> */}
										{/* <EventTabs /> */}
									</div>
								</ScrollArea>
								<div className="md:flex hidden flex-col gap-4">
									{/* <TaskSidebarTopRow />
									<TaskDesignationsContainer /> */}
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
