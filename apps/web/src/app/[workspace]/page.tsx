"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import WorkspaceNotFoundPage from "../[workspace]/WorkspaceNotFoundPage";
import { useAuthStore, useTeamStore, useWorkspaceStore } from "@/storeZ";
import { Loader2 } from "lucide-react";

export default function Home() {
	const [loading, setLoading] = useState(true);
	const [workspaceFound, setWorkspaceFound] = useState(true); // To track if workspace exists
	const router = useRouter();
	const params = useParams();

	const user = useAuthStore((state) => state.user);
	const getWorkspace = useWorkspaceStore((state) => state.getWorkspace);
	const getAllTeams = useTeamStore((state) => state.getAllTeams);
	let workspaceUrl = params.workspace;
	if (Array.isArray(workspaceUrl)) {
		workspaceUrl = workspaceUrl[0];
	}

	useEffect(() => {
		const fetchWorkspace = async () => {
			setLoading(true);
			if (!user) {
				router.push("/login");
				return;
			}
			if (user?.onBoarding) {
				router.push("/join");
				return;
			}

			const { workspace: currentWorkspace } = await getWorkspace(workspaceUrl);
			if (!currentWorkspace) {
				setWorkspaceFound(false);
				setLoading(false);
				return;
			}

			const currentTeam = await getAllTeams(currentWorkspace.id);
			if (currentTeam) {
				router.push(`/${workspaceUrl}/team/${currentTeam[0].identifier}/all`);
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
							<div className="font-bold text-3xl">
								Loading Workspace, please wait...
							</div>
							<Loader2 size={64} className="animate-spin" />
						</div>
					</div>
				</div>
			) : (
				<WorkspaceNotFoundPage />
			)}
		</>
	);
}
