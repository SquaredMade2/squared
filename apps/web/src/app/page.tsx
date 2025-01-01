"use client";
import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { useAuthUser } from "@/hooks/useAuthUser";
import { workspaceService } from "@/lib/services";
import { useWorkspaceStore } from "@/store";
import { TODO } from "@squared/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HomePage = () => {
	const router = useRouter();
	const { user, loading, error } = useAuthUser();
	const { setWorkspaces } = useWorkspaceStore((state) => state);

	useEffect(() => {
		const handleRedirection = async () => {
			if (loading) return;

			try {
				if (user) {
					if (user.defaultWorkspaceId) {
						const workspace = await workspaceService.getWorkspace(TODO, {
							workspaceId: user.defaultWorkspaceId,
						});
						if (workspace?.url) {
							router.push(`/${workspace.url}`);
							return;
						}
					}

					const workspaces = await workspaceService.getUserWorkspaces(TODO, {
						userId: user.id,
					});
					setWorkspaces(workspaces);
					if (workspaces.length) {
						if (workspaces[0].defaultView) {
							router.push(`/${workspaces[0].defaultView}`);
						} else {
							router.push(`/${workspaces[0].url}`);
						}
						return;
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
