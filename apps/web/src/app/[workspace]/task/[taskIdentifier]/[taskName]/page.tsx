import type { Metadata } from "next";
import Task from "@/components/Task";
import { capitalizeFirstLetter, removeSlug } from "@/utils/formatting";

type Props = {
	params: { workspace: string; taskIdentifier: string; taskName: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { workspace, taskName } = params;
	return {
		title: `Task > ${capitalizeFirstLetter(removeSlug(taskName))}`,
		description: `View and manage task "${removeSlug(taskName)}" in workspace ${workspace}.`,
	};
}

const TaskPage = () => {
	return (
		<div className="w-full h-screen flex bg-background overflow-hidden">
			<Task />
		</div>
	);
};

export default TaskPage;
