"use client";
import SquaredLoader from "@/components/Loaders/SquaredLoader";
import type { GetWorkspaceResponse } from "@/gen/rpc/workspace";
import { useAuthUser } from "@/hooks/useAuthUser";
import { teamService, workspaceService } from "@/lib/services";
import { useWorkspaceStore } from "@/store";
import { TODO } from "@squared/context";
import type { Team, User } from "@squared/db";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HomePage = () => {
	const router = useRouter();
	const { user, loading, error } = useAuthUser();
	const { setWorkspaces } = useWorkspaceStore((state) => state);

	useEffect(() => {
		const handleRedirection = async () => {
			if (loading) return;

			const userWorkspaceTeams = async (
				userId: string,
				workspaceId: string,
			): Promise<Team> => {
				const userTeams = await teamService.getUserTeams(TODO, {
					userId,
					workspaceId,
				});

				return userTeams[0];
			};

			const workspaceRoute = async (
				workspace: GetWorkspaceResponse,
				user: User,
			) => {
				if (workspace?.defaultView) {
					if (workspace.defaultView === "my") {
						return router.push(`/${workspace.url}/my-tasks/assigned`);
					}
					const userTeam = await userWorkspaceTeams(user.id, workspace.id);

					return router.push(
						`/${workspace.url}/team/${userTeam.identifier}/${workspace.defaultView === "sprint" && !userTeam.sprintsEnabled ? "all" : workspace.defaultView}`,
					);
				}
				return router.push(`/${workspace?.url}`);
			};

			try {
				if (user) {
					if (user.defaultWorkspaceId) {
						const workspace = await workspaceService.getWorkspace(TODO, {
							workspaceId: user.defaultWorkspaceId,
						});
						return workspaceRoute(workspace, user);
					}

					const workspaces = await workspaceService.getUserWorkspaces(TODO, {
						userId: user.id,
					});
					setWorkspaces(workspaces);
					if (workspaces.length) {
						return workspaceRoute(workspaces[0], user);
					}

					router.push("/join");
				} else {
					router.push("/login");
				}
			} catch (error) {
				console.error("Redirection Error: ", error);
			}
		};

		handleRedirection();
	}, [user, loading, router]);

	if (loading) {
		return (
			<div className="h-screen w-full">
				<div className="flex h-full justify-center items-center">
					<div className="flex flex-col gap-4 items-center">
						<div className="font-bold text-3xl">Loading</div>
						<SquaredLoader />
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return null;
};

export default HomePage;
