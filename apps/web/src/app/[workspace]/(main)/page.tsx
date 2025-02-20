"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { client } from "@/lib/client";
import { useWorkspaceStore } from "@/store";
import { parseParams } from "@/utils/parseParams";
import { useOrganizationList, useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import WorkspaceNotFoundPage from "./WorkspaceNotFoundPage";

export default function Home() {
	const [loading, setLoading] = useState(true);
	const [workspaceFound, setWorkspaceFound] = useState(true); // To track if workspace exists
	const router = useRouter();
	const params = useParams();

	const { user } = useUser();
	const { setActive } = useOrganizationList();
	const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);
	const workspaceUrl = parseParams(params.workspace) ?? "";

	useQuery({
		queryKey: ["workspacePage", workspaceUrl],
		queryFn: async () => {
			if (!user) {
				router.push("/sign-in");
				return;
			}

			const currentWorkspace = await client.workspace.getWorkspaceByUrl
				.$get({
					workspaceUrl,
				})
				.then((res) => res.json());

			if (!currentWorkspace) {
				setWorkspaceFound(false);
				setLoading(false);
				return;
			}
			setWorkspace(currentWorkspace);
			setActive ? setActive({ organization: currentWorkspace.id }) : "";

			const allTeams = await client.team.getUserTeams
				.$get({
					workspaceId: currentWorkspace.externalId,
				})
				.then((res) => res.json());

			if (allTeams[0].identifier) {
				console.log("FirstTeamIdentifier: ", allTeams[0].identifier);
				router.push(`/${workspaceUrl}/team/${allTeams[0].identifier}/all`);
			}
			return allTeams;
		},
		enabled: !!user && !!parseParams(workspaceUrl),
		retry: true,
	});

	return (
		<>
			{loading || workspaceFound ? (
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
