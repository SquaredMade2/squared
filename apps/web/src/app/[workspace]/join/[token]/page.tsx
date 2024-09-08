"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore, useWorkspaceStore } from "@/storeZ";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";

const JoinWorkspacePage = () => {
	const [loading, setLoading] = useState(true);
	const { token, workspace: workspaceId } = useParams();
	const router = useRouter();
	const { user } = useAuthStore((state) => state);
	const { joinWorkspace } = useWorkspaceStore((state) => state);
	const { toast } = useToast();
	const { getWorkspace } = useWorkspaceStore((state) => state);

	const [workspaceName, setWorkspaceName] = useState<string | null>(null);

	useEffect(() => {
		if (!token) return;

		const fetchWorkspaceName = async () => {
			try {
				const response = await getWorkspace(workspaceId as string);
				if (!response.workspace) {
					toast({
						title: "Workspace not found",
						variant: "destructive",
					});
					router.push("/login");
					return;
				}
				setWorkspaceName(response.workspace.name);
			} catch (error) {
				toast({
					title: "Error fetching workspace",
					variant: "destructive",
				});
				router.push("/login");
			}
			setLoading(false);
		};

		fetchWorkspaceName();
	}, [token]);

	useEffect(() => {
		if (!user) {
			router.push(`/login?token=${token}`);
		}
	}, [user, token, router]);

	const handleJoinWorkspace = async () => {
		setLoading(true);
		try {
			if (!user) {
				toast({
					title: "Please login to join workspace",
					variant: "default",
				});
				router.push(`/login?token=${token}`);
				return;
			}
			const response = await joinWorkspace(token as string, user);
			if (response.workspace) {
				toast({
					title: `Successfully joined ${response.workspace.name}`,
					variant: "default",
				});
				router.push(`/${response.workspace.url}`);
			}
		} catch (error) {
			toast({
				title: "Error joining workspace",
				variant: "destructive",
			});
		}
		setLoading(false);
	};

	return !user || !workspaceName || loading ? (
		<div className="flex w-full h-full items-center justify-center flex-col">
			<div>Loading...</div>
			<Loader2 className="w-8 h-8 animate-spin" />
		</div>
	) : (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-2xl font-bold">Join {workspaceName}?</h1>
			<Button onClick={handleJoinWorkspace} className="mt-4">
				Join Workspace
			</Button>
		</div>
	);
};

export default JoinWorkspacePage;
