"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { client } from "@/lib/client";
import { useTeamStore } from "@/store";
import { parseParams } from "@/utils/parseParams";
import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import WorkspaceNotFoundPage from "./WorkspaceNotFoundPage";

export default function Home() {
	const router = useRouter();
	const params = useParams();
	const { organization } = useOrganization();
	const workspaceUrl = parseParams(params.workspace) ?? "";
	const { team, setTeam } = useTeamStore((state) => state);

	const { data, isPending } = useQuery({
		queryKey: ["team", "workspacePage", workspaceUrl],
		queryFn: async () => {
			if (!organization) return null;
			const allTeams = await client.team.getUserTeams
				.$get()
				.then((res) => res.json());

			if (team) {
				const teamBelongsToCurrentWorkspace = allTeams.some(
					(t) => t.id === team.id,
				);
				if (teamBelongsToCurrentWorkspace) {
					router.push(`/${workspaceUrl}/team/${team.identifier}/all`);
					return allTeams;
				}
			}

			if (allTeams[0]?.identifier) {
				setTeam(allTeams[0]);
				router.push(`/${workspaceUrl}/team/${allTeams[0].identifier}/all`);
			}
			return allTeams;
		},
		enabled: !!organization,
		retry: true,
	});

	return (
		<>
			{isPending || data ? (
				<div className="h-screen w-full">
					<div className="flex h-full items-center justify-center">
						<div className="flex flex-col items-center gap-4">
							<div className="font-bold text-3xl">Loading Workspace</div>
							<SquaredLoader />
						</div>
					</div>
				</div>
			) : (
				<WorkspaceNotFoundPage />
			)}
		</>
	);
}
