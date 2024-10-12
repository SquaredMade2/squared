import { useState, useEffect } from "react";
import type { RetrospectiveItem } from "@repo/db";

type RetrospectiveData = {
	wentWell: RetrospectiveItem[];
	toImprove: RetrospectiveItem[];
	actionItems: RetrospectiveItem[];
};

export function useRetrospectivePolling(sprintId: string) {
	const [data, setData] = useState<RetrospectiveData | null>(null);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`/api/sprints/${sprintId}/retrospective`);
				if (!response.ok) {
					throw new Error("Failed to fetch retrospective data");
				}
				const result = await response.json();
				setData(result.data);
			} catch (err) {
				setError(err instanceof Error ? err : new Error("An error occurred"));
			}
		};

		fetchData();
		const intervalId = setInterval(fetchData, 5000); // Poll every 5 seconds

		return () => clearInterval(intervalId);
	}, [sprintId]);

	return { data, error };
}
