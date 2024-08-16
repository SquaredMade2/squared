import React from "react";
import { Plus } from "lucide-react";

const IssueSidebarProject = () => {
	return (
		<div className="flex flex-row items-center mb-4">
			<div className="w-[95px] h-4 my-2.5 text-sm text-muted-foreground">
				<span>Project</span>
			</div>
			<div>
				<button
					className="inline-flex items-center w-[132.4px] h-[32.4px] border-[0.8px] border border-transparent rounded px-2 py-px mr-[-8px] text-foreground text-sm hover:bg-black hover:border-border"
					type="button"
				>
					<span className="ml-px mr-2.5 w-2 h-2">
						<Plus className="size-5 cursor-pointer" />
					</span>
					<span>Add Project</span>
				</button>
			</div>
		</div>
	);
};

export default IssueSidebarProject;
