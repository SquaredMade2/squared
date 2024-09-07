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
	const { token } = useParams();
	const tokenString = Array.isArray(token) ? token[0] : token;
	const router = useRouter();
	const { user } = useAuthStore((state) => state);
	const { joinWorkspace } = useWorkspaceStore((state) => state);
	const { toast } = useToast();

	const [workspaceName, setWorkspaceName] = useState<string | null>(null);

	useEffect(() => {
		if (!tokenString) return;

		const fetchWorkspaceName = async () => {
			try {
				const response = await axios.get(`/api/workspace/${tokenString}`);
				setWorkspaceName(response.data.workspace.name);
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
	}, [tokenString]);

	useEffect(() => {
		if (!user) {
			router.push(`/login?token=${tokenString}`);
		}
	}, [user, tokenString, router]);

	const handleJoinWorkspace = async () => {
		setLoading(true);
		try {
			if (!user) {
				toast({
					title: "Please login to join workspace",
					variant: "default",
				});
				router.push(`/login?token=${tokenString}`);
				return;
			}
			const response = await joinWorkspace(tokenString, user);
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
