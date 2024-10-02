"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useWorkspaceStore } from "@/store";
import { useSession } from "next-auth/react";

export default function JoinWorkspacePage() {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const searchParams = useSearchParams();
	const { toast } = useToast();
	const { joinWorkspace } = useWorkspaceStore((state) => state);
	const session = useSession();
	const { data: user, status } = session;

	useEffect(() => {
		const token = searchParams.get("token");
		if (!token) {
			setError("No invitation token found.");
			setIsLoading(false);
			return;
		}

		const verifyTokenAndJoin = async () => {
			try {
				if (!user) {
					// User is not logged in, redirect to login page with token
					router.push(`/login?token=${token}`);
					return;
				}

				// User is logged in, attempt to join the workspace
				const { workspace, message, variant } = await joinWorkspace(
					token,
					user.user.id,
				);

				if (workspace) {
					toast({
						title: "Success!",
						description: message,
						variant: variant,
					});
					router.push(`/workspace/${workspace.id}`);
				} else {
					setError(message || "Failed to join the workspace.");
				}
			} catch {
				setError("Invalid or expired invitation token.");
			} finally {
				setIsLoading(false);
			}
		};
		if (status !== "loading") {
			verifyTokenAndJoin();
		}
	}, [router, searchParams, toast, joinWorkspace, user, status]);

	if (isLoading) {
		return (
			<div className="h-screen flex items-center justify-center w-full">
				<Card className="h-40">
					<CardHeader>
						<CardTitle>Joining Workspace</CardTitle>
						<CardDescription>
							Please wait while we process your invitation...
						</CardDescription>
					</CardHeader>
					<CardContent className="flex justify-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900" />
					</CardContent>
				</Card>
			</div>
		);
	}

	if (error) {
		return (
			<div className="h-screen flex items-center justify-center w-full">
				<Card className="h-40">
					<CardHeader>
						<CardTitle>Error</CardTitle>
						<CardDescription>{error}</CardDescription>
					</CardHeader>
					<CardFooter>
						<Button onClick={() => router.push("/")} className="w-full">
							Go to Homepage
						</Button>
					</CardFooter>
				</Card>
			</div>
		);
	}

	return null;
}
