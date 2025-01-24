"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { teamService, workspaceService } from "@/lib/services";
import { useWorkspaceStore } from "@/store";
import { parseParams } from "@/utils/parseParams";
import { useUser } from "@clerk/nextjs";
import { TODO } from "@squared/context";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import WorkspaceNotFoundPage from "./WorkspaceNotFoundPage";

export default function Home() {
	const [loading, setLoading] = useState(true);
	const [workspaceFound, setWorkspaceFound] = useState(true); // To track if workspace exists
	const router = useRouter();
	const params = useParams();

	const { user } = useUser();
	const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);
	const workspaceUrl = parseParams(params.workspace) ?? "";

	useEffect(() => {
		const fetchWorkspace = async () => {
			setLoading(true);
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
				workspaceId: currentWorkspace.id,
			});
			if (allTeams) {
				router.push(`/${workspaceUrl}/team/${allTeams[0].identifier}/all`);
			}
			setLoading(false);
		};
		fetchWorkspace();
	}, [router, user, workspaceUrl]);

	return (
		<>
			{loading || workspaceFound ? (
				<div className="h-screen w-full">
					<div className="flex h-full justify-center items-center">
						<div className="flex flex-col gap-4 items-center">
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
