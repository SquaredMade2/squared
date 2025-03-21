import { client } from "@/lib/client";
import { useTaskStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { useQuery } from "@tanstack/react-query";
import { useTeams } from "./useTeams";

export function useTasks() {
	const { team, loading: teamLoading } = useTeams();
	const { setTasks } = useTaskStore((state) => state);

	const {
		data: tasks,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["tasks", team?.id],
		queryFn: async () => {
			if (!team) throw new Error("Team not found");
			const res = await client.task.getAllTasks.$get({
				teamId: team.id,
			});
			const storedTasks = await res.json();
			setTasks(storedTasks);
			return storedTasks;
		},
		enabled: !!team && !teamLoading,
	});

	return {
		loading: isLoading || teamLoading,
		tasks: tasks || [],
		error: error ? parseError(error, "Failed to fetch tasks") : null,
	};
}
