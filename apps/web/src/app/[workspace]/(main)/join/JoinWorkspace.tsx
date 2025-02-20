"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { client } from "@/lib/client";
import { parseError } from "@/utils/parseError";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

export default function JoinWorkspace() {
	const { isLoaded, user } = useUser();
	const router = useRouter();
	const searchParams = useSearchParams();
	const { toast } = useToast();

	const token = searchParams.get("token") || "";
	const isLink = searchParams.has("link");
	const currentURL = window.location.href;
	// First non-capturing group matches up to "/" 3 times. Second capture matches up to next "/"
	const workspaceName = currentURL.match(/^(?:[^\/]*\/){3}([^\/]+)/);

	const joinWorkspaceMutation = useMutation({
		mutationFn: async () => {
			const workspace = await client.workspace.joinWorkspace
				.$post({
					token,
					isLink,
					userId: user?.id || "",
					workspaceName: workspaceName ? workspaceName[1] : undefined,
				})
				.then((res) => res.json());

			return workspace;
		},
		onSuccess: (workspace) => {
			toast({ title: "Workspace joined successfully" });
			if (workspace?.url) {
				router.push(`/${workspace.url}`);
			}
		},
		onError: (error) => {
			toast({
				title: "Failed to join workspace",
				variant: "destructive",
				description: parseError(error, "An unknown error occurred"),
			});
		},
	});

	const handleJoin = async () => {
		if (token && user) {
			joinWorkspaceMutation.mutate();
		}
	};

	if (joinWorkspaceMutation.isPending || !isLoaded) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-4">
				<SquaredLoader />
				<p className="text-lg">Loading...</p>
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
						onClick={handleJoin}
						className="w-full"
						disabled={joinWorkspaceMutation.isPending || !token}
					>
						{joinWorkspaceMutation.isPending ? "Joining..." : "Join Workspace"}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
