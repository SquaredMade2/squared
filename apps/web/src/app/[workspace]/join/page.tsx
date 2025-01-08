"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { workspaceService } from "@/lib/services";
import { useUser } from "@clerk/nextjs";
import { TODO } from "@squared/context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function JoinWorkspace() {
	const { isLoaded, isSignedIn, user } = useUser();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const token = searchParams.get("token");

	useEffect(() => {
		if (isLoaded && !isSignedIn) {
			router.push(`/login?token=${token}`);
		}
	}, [isLoaded, router, token]);

	const handleJoin = async () => {
		if (!isLoaded || !isSignedIn) return;

		setIsLoading(true);
		try {
			if (!token) {
				throw new Error("Invalid token");
			}
			const workspace = await workspaceService.joinWorkspace(TODO, {
				token,
				userId: user.id,
			});
			toast({ title: "Workspace joined successfully" });
			if (workspace?.url) {
				router.push(`/${workspace.url}`);
			}
		} catch (error) {
			console.error("Error joining workspace:", error);
			toast({
				title: "Failed to join workspace",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (status === "loading" || status === "unauthenticated") {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary/20">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-center">
						Join Workspace
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-center">
						You've been invited to join a workspace.
					</p>
					<Button onClick={handleJoin} className="w-full" disabled={isLoading}>
						{isLoading ? "Joining..." : "Join Workspace"}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
