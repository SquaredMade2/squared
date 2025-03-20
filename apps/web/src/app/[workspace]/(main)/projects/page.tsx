import { ProjectsBreadcrumbs } from "@/components/ProjectsPage/ProjectBreadCrumbs";

const ProjectsPage = () => {
	return (
		<div className="flex h-screen w-full overflow-hidden bg-background">
			<div className="space-around scrollbar-thin-transparent flex w-full overflow-auto max850:overflow-x-hidden mdlg:w-full">
				<div className="h-full w-full p-1 md:pb-5 xl:px-10">
					<div className="relative flex w-full flex-col">
						<div className="z-0 w-full snap-start overflow-x-hidden">
							<div className="mb-4 flex w-full items-center gap-4 border-border border-b py-4">
								<ProjectsBreadcrumbs />
							</div>
						</div>
						<MobileTaskSettings />
						<div className="relative flex w-full">
							<ScrollArea className="h-[calc(100vh-5rem)] w-full">
								<div className="mr-1 px-1 max850:mr-1 md:mr-5 xl:mr-10">
									<TaskPageForm />
									{currentTaskBlockedBy.length > 0 && <BlockedByTasks />}
									{subtasks.length > 0 && <Subtasks />}
									<NewTaskCollapsible parentId={currentTask.id} />
									<EventTabs />
								</div>
							</ScrollArea>
							<div className="hidden flex-col gap-4 md:flex">
								<TaskSidebarTopRow />
								<TaskDesignationsContainer />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProjectsPage;
