import { sprintService, taskService } from "@/lib/services";
import { useSprintStore, useTaskStore, useTeamStore } from "@/store";
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
	const [assignedSprintId, setAssignedSprintId] = useState<string | null>(null);

	const taskId = currentTask?.id ?? "";
	const sprintName = sprints.find((s) => s.id === assignedSprintId)?.name ?? "";

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
		setAssignedSprintId(foundSprint?.id ?? null);
	}, [team, currentTask]);

	const handleAssignToSprint = async (sprintId: string | null) => {
		const updatedTask = await taskService.updateTask(TODO, {
			id: taskId,
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
				triggerText={currentTask?.sprintId ? sprintName : "No sprint assigned"}
				emptyText="No sprints found."
				listItems={sprints}
				selectedItemId={assignedSprintId}
				selectedItemLabel={sprintName}
				itemLabel={(sprint: Sprint) => sprint.name}
				itemId={(sprint: Sprint) => sprint.id}
				onItemSelect={handleAssignToSprint}
			/>
		</>
	);
};

export default SprintCombobox;
