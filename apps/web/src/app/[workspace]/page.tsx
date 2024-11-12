"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { teamService } from "@/lib/services";
import { useUserStore, useWorkspaceStore } from "@/store";
import { TODO } from "@squared/context";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import WorkspaceNotFoundPage from "../[workspace]/WorkspaceNotFoundPage";

export default function Home() {
	const [loading, setLoading] = useState(true);
	const [workspaceFound, setWorkspaceFound] = useState(true); // To track if workspace exists
	const router = useRouter();
	const params = useParams();

	const user = useUserStore((state) => state.user);
	const getWorkspace = useWorkspaceStore((state) => state.getWorkspace);
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
