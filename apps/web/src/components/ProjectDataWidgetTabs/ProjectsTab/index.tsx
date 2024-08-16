import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { LayoutGrid } from "lucide-react";
import type { ProjectsTabProps } from "./ProjectsTabProps";

export const ProjectsTab = ({ tasksList }: ProjectsTabProps) => {
	const lightSettings = useAppSelector((state) => state.userSettings).theme;

	return (
		<div className="flex flex-col items-center mt-10 m-5 w-full h-80 text-foreground">
			<div className="flex flex-row items-center w-full h-12 text-sm my-1 hover:bg-accent duration-200 p-2 rounded-lg">
				<div className="mx-3">
					<LayoutGrid className="text-[#9577FF] size-4" />
				</div>
				<p>No Project</p>
				<header className="ml-auto">{tasksList.length}</header>
			</div>
		</div>
	);
};
