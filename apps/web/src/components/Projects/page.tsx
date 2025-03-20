import { ProjectsBreadcrumbs } from "@/components/Projects/ProjectsBreadcrumbs";

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
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProjectsPage;
