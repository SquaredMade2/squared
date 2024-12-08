import { sprintService, taskService } from "@/lib/services";
import {
	useSprintStore,
	useTaskStore,
	useTeamStore,
	useUserStore,
} from "@/store";
import { TODO } from "@squared/context";
import type { Sprint } from "@squared/db";
import { useEffect, useState } from "react";
import { DesignationCombobox } from "./DesignationCombobox";

const SprintCombobox = () => {
	const [open, setOpen] = useState(false);
	const { team } = useTeamStore((state) => state);
	const { sprints, setSprints } = useSprintStore((state) => state);
	const { currentTask, setCurrentTask, updateTask } = useTaskStore(
		(state) => state,
	);
	const user = useUserStore((state) => state.user);
	const [assignedSprintId, setAssignedSprintId] = useState<Sprint | null>(null);

	const taskId = currentTask?.id ?? "";
	const sprintId = assignedSprintId?.id ?? "";
	const sprintName = assignedSprintId?.name ?? "";

	useEffect(() => {
		const fetchSprints = async () => {
			if (team) {
				const fetchedSprints = await sprintService.getSprints(TODO, {
					teamId: team.id,
				});
				setSprints(fetchedSprints);
			}
		};
		fetchSprints();

		const foundSprint = sprints.find((s) => s.id === currentTask?.sprintId);
		setAssignedSprintId(foundSprint ?? null);
	}, [team, currentTask]);

	const handleAssignToSprint = async (sprintId: string | null) => {
		const updatedTask = await taskService.updateTask(TODO, {
			id: taskId,
			updaterId: user.id,
			sprintId: sprintId,
		});
		updateTask(updatedTask);
		setCurrentTask(updatedTask);
		setOpen(false);
	};

	if (!currentTask) return null;

	return (
		<>
			<DesignationCombobox
				open={open}
				setOpen={setOpen}
				triggerText={sprintName ? sprintName : "No sprint assigned"}
				emptyText="No sprints found."
				listItems={sprints}
				selectedItemId={sprintId}
				selectedItemLabel={sprintName}
				itemLabel={(sprint: Sprint) => sprint.name}
				itemId={(sprint: Sprint) => sprint.id}
				onItemSelect={handleAssignToSprint}
			/>
		</>
	);
};

export default SprintCombobox;
