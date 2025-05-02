"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { client } from "@/lib/client";
import { parseError } from "@/utils/parseError";
import { useOrganization } from "@clerk/nextjs";
import { Button } from "@squaredmade/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@squaredmade/ui/card";
import { toast } from "@squaredmade/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function JoinWorkspace() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { organization, isLoaded } = useOrganization();

	const token = searchParams.get("token") || "";
	const isLink = searchParams.has("link");
	const currentURL = usePathname();
	// First non-capturing group matches up to "/" 3 times. Second capture matches up to next "/"
	const workspaceName = currentURL.match(/^(?:[^\/]*\/){3}([^\/]+)/);

	const { mutate: joinWorkspaceMutation, isPending } = useMutation({
		mutationKey: ["workspace", "joinWorkspace", organization?.id],
		mutationFn: async () => {
			if (isLoaded) {
				await client.workspace.joinWorkspace.$post({
					token,
					isLink,
					workspace: {
						id: organization?.id,
						name: workspaceName ? workspaceName[1] : undefined,
					},
				});
			}
		},
		onSuccess: () => {
			toast.success("Workspace joined successfully");
			router.push(`/${organization?.slug}`);
		},
		onError: (error) => {
			toast.error("Failed to join workspace", {
				description: parseError(error),
			});
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
						onClick={() => joinWorkspaceMutation()}
						className="w-full"
						disabled={isPending || !token}
					>
						{isPending ? "Joining..." : "Join Workspace"}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
