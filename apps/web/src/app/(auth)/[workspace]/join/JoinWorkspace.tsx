"use client";

import { useOrganizationList, useUser } from "@clerk/nextjs";
import { Button } from "@squaredmade/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@squaredmade/ui/card";
import { toast } from "@squaredmade/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { client } from "@/lib/client";
import { parseError } from "@/utils/parseError";

export default function JoinWorkspace() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const params = useParams();
	const workspaceSlug = params.workspace as string;
	const { setActive } = useOrganizationList();
	const { user, isLoaded } = useUser();

	const token = searchParams.get("token") || "";
	const signup = searchParams.get("signup") === "true";

	const { mutate: joinWorkspaceMutation, isPending } = useMutation({
		mutationFn: async () => {
			const res = await client.workspace.joinWorkspace
				.$post({
					signup:
						signup && user
							? {
									email: user.emailAddresses[0].emailAddress,
									id: user.id,
									name: user.fullName,
									username: user.username,
								}
							: undefined,
					token,
					workspaceSlug,
				})
				.then((r) => r.json());
			return res?.externalId;
		},
		mutationKey: ["workspace", "joinWorkspace", workspaceSlug],
		onError: (error) => {
			toast.error("Failed to join workspace", {
				description: parseError(error),
			});
		},
		onSuccess: (organizationId) => {
			toast.success("Workspace joined successfully");
			setActive?.({ organization: organizationId });
			router.push(`/${workspaceSlug}`);
		},
	});

	if (isPending || !isLoaded) {
		return (
			<div className="h-screen w-full">
				<div className="flex h-full items-center justify-center">
					<div className="flex flex-col items-center gap-4">
						<div className="font-bold text-3xl">
							Loading Workspace Invite...
						</div>
						<SquaredLoader />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-secondary/20">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-center font-bold text-2xl">
						Join Workspace
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-center">
						You've been invited to join a workspace.
					</p>
					<Button
						className="w-full"
						disabled={isPending || !token}
						onClick={() => joinWorkspaceMutation()}
					>
						{isPending ? "Joining..." : "Join Workspace"}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
