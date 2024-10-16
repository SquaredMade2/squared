"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWorkspaceStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function JoinWorkspace() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const searchParams = useSearchParams();
	const { joinWorkspace } = useWorkspaceStore((state) => state);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const token = searchParams.get("token");

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push(`/login?token=${token}`);
		}
	}, [status, router, token]);

	const handleJoin = async () => {
		if (!session?.user) return;

		setIsLoading(true);
		try {
			if (!token) {
				throw new Error("Invalid token");
			}
			const { workspace, message, variant } = await joinWorkspace(
				token,
				session.user.id,
			);
			toast({ title: message, variant });
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
