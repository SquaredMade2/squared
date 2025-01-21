"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { client } from "@/lib/client";
import { useWorkspaceStore } from "@/store";
import { useClerk, useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Join = () => {
	const [inputValue, setInputValue] = useState("");
	const [urlInputValue, setUrlInputValue] = useState("");
	const { createWorkspace } = useWorkspaceStore((state) => state);
	const { toast } = useToast();
	const router = useRouter();
	const { signOut } = useClerk();
	const queryClient = useQueryClient();

	// List of restricted routes (initial set)
	const restrictedRoutes = [
		"verify",
		"inbox",
		"join",
		"sign-in",
		"password",
		"sign-up",
		"welcome",
	];
	const { isLoaded, isSignedIn, user: clerkUser } = useUser();

	const { data: user, isLoading: isUserLoading } = useQuery({
		queryKey: ["user", clerkUser?.id],
		queryFn: () => {
			if (!clerkUser?.id) return;
			const res = client.user.getUser
				.$get({ userId: clerkUser?.id })
				.then((res) => res.json());
			return res;
		},
		enabled: !!clerkUser?.id,
	});

	const { data: workspaces = [], isLoading: isWorkspacesLoading } = useQuery({
		queryKey: ["workspaces", clerkUser?.id],
		queryFn: () => {
			if (!clerkUser?.id) return;
			const res = client.workspace.getAllWorkspaces
				.$get({ userId: clerkUser?.id })
				.then((res) => res.json());
			return res;
		},
		enabled: !!clerkUser?.id,
	});

	const createWorkspaceMutation = useMutation({
		mutationFn: async (newWorkspace: { name: string; url: string }) => {
			if (!clerkUser?.id) return;
			return await client.workspace.createWorkspace
				.$post(newWorkspace)
				.then((res) => res.json());
		},
		onSuccess: (data) => {
			if (!data) return;
			createWorkspace(data);
			toast({ title: "Workspace created successfully" });
			if (data) {
				if (user?.onBoarding) {
					onBoardUserMutation.mutate();
				}
				router.refresh();
				router.push(`/${data.url}`);
			}
		},
		onError: (error) => {
			console.error(error);
			toast({ title: "Failed to create workspace", variant: "destructive" });
		},
	});

	const onBoardUserMutation = useMutation({
		mutationFn: async () => {
			if (!clerkUser?.id) return;
			return await client.user.onBoardUser
				.$post({ userId: clerkUser?.id })
				.then((res) => res.json());
		},
		onSuccess: (data) => {
			if (!data) return;
			queryClient.invalidateQueries({ queryKey: ["user", clerkUser?.id] });
		},
		onError: (error) => {
			console.error(error);
			toast({ title: "Failed to onboard user", variant: "destructive" });
		},
	});

	useEffect(() => {
		if (!isLoaded || !isSignedIn) return;

		if (!user && !isUserLoading) {
			signOut();
		}
	}, [isLoaded, isSignedIn, user, isUserLoading]);

	useEffect(() => {
		const formattedUrlInput = inputValue
			.trim()
			.toLowerCase()
			.replace(/&/g, "and")
			.replace(/'/g, "")
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "");

		setUrlInputValue(formattedUrlInput);
	}, [inputValue]);

	const isUrlTaken = (url: string) => {
		// Check against both restricted routes and existing workspaces
		const takenUrls = [
			...restrictedRoutes,
			...(workspaces?.map((ws) => ws.url) || []),
		];
		return takenUrls.includes(url);
	};

	const isWorkspaceNameTaken = (name: string) => {
		// Check for an existing workspace with the same name
		const takenNames = [...workspaces.map((ws) => ws.name)];
		return takenNames.includes(name);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!user || !clerkUser) return;

		if (inputValue.length === 0) {
			toast({
				title: "Please enter a workspace name.",
				variant: "destructive",
			});
			return;
		}

		if (urlInputValue.length === 0) {
			toast({
				title: "Please enter a workspace URL.",
				variant: "destructive",
			});
			return;
		}

		if (isWorkspaceNameTaken(inputValue)) {
			toast({
				title: "Workspace name already exists. Please choose a different name.",
				variant: "destructive",
			});
			return;
		}

		if (isUrlTaken(urlInputValue)) {
			toast({
				title: "Workspace URL already exists. Please choose a different name.",
				variant: "destructive",
			});
			return;
		}

		if (urlInputValue.includes("/")) {
			toast({
				title: "Workplace URL cannot contain '/'",
				variant: "destructive",
			});
			return;
		}

		const newWorkspaceInput = {
			name: inputValue,
			url: urlInputValue,
		};

		createWorkspaceMutation.mutate(newWorkspaceInput);
	};

	if (isUserLoading || isWorkspacesLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="w-screen h-screen">
			{!user?.onBoarding && workspaces && workspaces.length > 0 && (
				<div className="w-screen absolute top-0 p-10 flex justify-between">
					<div className="flex flex-col text-sm">
						<span className="text-xs text-muted-foreground">Logged in as:</span>
						<span className="text-foreground">{user?.email}</span>
					</div>
					<div className="flex items-center space-x-1 text-foreground">
						<ChevronLeft className="text-[#858699] size-5" />
						<a href={`/${workspaces[0].url}`}>Back to Squared</a>
					</div>
				</div>
			)}
			<Card className="p-8 flex flex-col space-y-6 w-5/6 lg:w-1/2 mx-auto mt-32">
				<div className="text-center">
					<span className="text-2xl text-foreground font-medium">
						Create a new workspace
					</span>
				</div>
				<div className="text-center">
					<span className="text-muted-foreground text-md">
						Workspaces are shared environments where teams can work on projects,
						cycles and tasks.
					</span>
				</div>
				<form
					className="flex flex-col space-y-6 text-foreground items-center"
					onSubmit={handleSubmit}
				>
					<div className="w-full shadow-[0_3px_15px_5px_rgb(0,0,0,0.1)] p-7 rounded-xl flex flex-col space-y-7 bg-accent">
						<div className="flex flex-col space-y-1 text-foreground relative">
							<Label>Workspace Name</Label>
							<Input
								type="text"
								id="workSpace"
								autoComplete="off"
								className="bg-card xs:pl-0 xs:indent-2 relative"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
							/>
						</div>
						<div className="flex flex-col space-y-1 text-foreground relative">
							<Label>Workspace URL</Label>
							<div className="flex flex-col space-y-1 text-foreground relative">
								<span className="absolute z-10 bottom-3 left-2 text-muted-foreground xs:hidden">
									app.squaredmade.com/
								</span>
								<Input
									className="pl-44 bg-card xs:pl-0 xs:indent-2 relative"
									id="workSpaceUrl"
									autoComplete="off"
									value={urlInputValue}
									onChange={(e) => setUrlInputValue(e.target.value)}
								/>
							</div>
						</div>
					</div>
					<Button type="submit" disabled={createWorkspaceMutation.isPending}>
						{createWorkspaceMutation.isPending
							? "Creating..."
							: "Create workspace"}
					</Button>
				</form>
			</Card>
		</div>
	);
};

export default Join;
