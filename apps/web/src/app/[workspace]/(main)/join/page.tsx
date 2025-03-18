"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { client } from "@/lib/client";
import { parseError } from "@/utils/parseError";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function JoinWorkspace() {
	const router = useRouter();
	const { toast } = useToast();
	const { organization, membership, isLoaded } = useOrganization();
	const { user } = useUser();

	const { mutate: handleJoin, isPending } = useMutation({
		mutationKey: ["workspace", "joinWorkspace", organization?.id],
		mutationFn: async () => {
			if (!organization || !membership?.role) return;
			await client.workspace.joinWorkspace.$post({
				userEmail: user?.emailAddresses[0].emailAddress || "",
				userName:
					user?.fullName ??
					(user?.emailAddresses[0].emailAddress.split("@")[0] || ""),
			});
		},
		onSuccess: () => {
			toast({ title: "Workspace joined successfully" });
			router.push(`/${organization?.slug}`);
		},
		onError: (error) => {
			console.error("Error joining workspace:", error);
			toast({
				title: "Failed to join workspace",
				description: parseError(error),
				variant: "destructive",
			});
		},
	});

	if (!isLoaded) {
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
		<div className="flex min-h-screen items-center justify-center bg-linear-to-b from-background to-secondary/20">
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
						onClick={() => handleJoin()}
						className="w-full"
						disabled={isPending}
					>
						{isPending ? "Joining..." : "Join Workspace"}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
