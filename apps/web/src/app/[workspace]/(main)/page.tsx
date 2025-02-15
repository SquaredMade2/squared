"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { teamService, workspaceService } from "@/lib/services";
import { useWorkspaceStore } from "@/store";
import { parseParams } from "@/utils/parseParams";
import { useUser } from "@clerk/nextjs";
import { TODO } from "@squared/context";
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
	const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);
	const workspaceUrl = parseParams(params.workspace) ?? "";

	useQuery({
		queryKey: ["workspacePage", workspaceUrl],
		queryFn: async () => {
			if (!user) {
				router.push("/sign-in");
				return;
			}

			const currentWorkspace = await workspaceService.getWorkspaceByUrl(TODO, {
				url: workspaceUrl,
			});
			if (!currentWorkspace) {
				setWorkspaceFound(false);
				setLoading(false);
				return;
			}
			setWorkspace(currentWorkspace);

			const allTeams = await teamService.getUserTeams(TODO, {
				userId: user.id,
				workspaceId: currentWorkspace.externalId,
			});
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
