"use client";

import { useToast } from "@/components/ui/use-toast";
import { client } from "@/lib/client";
import { useEventStore, useTaskStore, useTeamStore } from "@/store";
import type { Sprint, TaskEvent } from "@squared/db";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DesignationCombobox } from "./DesignationCombobox";

const SprintDropdown = () => {
	const [open, setOpen] = useState(false);
	const { toast } = useToast();
	const { team } = useTeamStore((state) => state);
	const { currentTask, setCurrentTask } = useTaskStore((state) => state);
	const { setEvents } = useEventStore((state) => state);
	const [assignedSprint, setAssignedSprint] = useState<Sprint | null>(null);
	const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);

	const taskId = currentTask?.id ?? "";

	useQuery({
		queryKey: ["sprint", team?.id],
		queryFn: async () => {
			if (team) {
				const res = await client.sprint.getSprints
					.$get({ teamId: team.id })
					.then((res) => res.json());
				setAssignedSprint(
					res.find((s: Sprint) => s.id === currentTask?.sprintId) ?? null,
				);
				setActiveSprint(res.find((s: Sprint) => s.status === "ACTIVE") ?? null);
				return res;
			}
			return [];
		},
		enabled: !!team,
	});

	const { mutate: updateSprint } = useMutation({
		mutationKey: ["task", "updateSprint", taskId],
		mutationFn: async (sprintId: string | null) => {
			const res = await client.task.updateSprint.$post({
				taskId,
				sprintId,
			});
			const updatedTask = await res.json();
			setCurrentTask(updatedTask);

			const eventsRes = await client.event.getEvents.$get({
				taskId,
			});
			const updatedEvents = await eventsRes.json();
			setEvents(updatedEvents as TaskEvent[]);

			return updatedTask;
		},
		onError: (error) => {
			toast({
				title: "Error updating sprint",
				description: error.message,
				variant: "destructive",
			});
		},
		onSettled: () => setOpen(false),
	});

	const handleAssignToSprint = (sprintId: string | null) => {
		updateSprint(sprintId);
	};

	if (!currentTask) return null;

	return (
		<DesignationCombobox
			open={open}
			setOpen={setOpen}
			triggerText={
				assignedSprint?.name ? assignedSprint.name : "No sprint assigned"
			}
			emptyText="No sprints found."
			listItems={activeSprint ? [activeSprint] : []}
			selectedItemId={assignedSprint?.id ?? ""}
			selectedItemLabel={assignedSprint?.name ?? ""}
			itemLabel={(sprint: Sprint) => sprint.name}
			itemId={(sprint: Sprint) => sprint.id}
			onItemSelect={handleAssignToSprint}
		/>
	);
};

export default SprintDropdown;
