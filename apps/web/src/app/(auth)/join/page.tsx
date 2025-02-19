"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { client } from "@/lib/client";
import { useWorkspaceStore } from "@/store";
import { useClerk, useOrganizationList, useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Join = () => {
	const [inputValue, setInputValue] = useState("");
	const [urlInputValue, setUrlInputValue] = useState("");
	const { createWorkspace } = useWorkspaceStore((state) => state);
	const { toast } = useToast();
	const router = useRouter();
	const { signOut } = useClerk();
	const { setActive } = useOrganizationList();
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
		"undefined",
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

	const { data: workspaceUrls = [], isLoading: isWorkspacesLoading } = useQuery(
		{
			queryKey: ["workspaces", clerkUser?.id],
			queryFn: async () => {
				if (!clerkUser?.id) return;
				const res = await client.workspace.getTakenUrls
					.$get()
					.then((res) => res.json());
				return res;
			},
			enabled: !!clerkUser?.id,
		},
	);

	const { data: defaultWorkspace } = useQuery({
		queryKey: ["defaultWorkspace"],
		queryFn: async () => {
			if (!clerkUser?.id) return;
			return await client.user.getDefaultWorkpace
				.$get()
				.then((res) => res.json());
		},
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
			setActive ? setActive({ organization: data.externalId }) : "";
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
		const takenUrls = [...restrictedRoutes, ...(workspaceUrls || [])];
		return takenUrls.includes(url);
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
		<div className="h-screen w-screen">
			{!user?.onBoarding && workspaceUrls?.length > 0 && (
				<div className="absolute top-0 flex w-screen justify-between p-10">
					<div className="flex flex-col text-sm">
						<span className="text-muted-foreground text-xs">Logged in as:</span>
						<span className="text-foreground">{user?.email}</span>
					</div>
					<div className="flex items-center space-x-1 text-foreground">
						<ChevronLeft className="size-5 text-[#858699]" />
						<Link href={`/${defaultWorkspace?.url}`}>Back to Squared</Link>
					</div>
				</div>
			)}
			<Card className="mx-auto mt-32 flex w-5/6 flex-col space-y-6 p-8 lg:w-1/2">
				<div className="text-center">
					<span className="font-medium text-2xl text-foreground">
						Create a new workspace
					</span>
				</div>
				<div className="text-center">
					<span className="text-md text-muted-foreground">
						Workspaces are shared environments where teams can work on projects,
						cycles and tasks.
					</span>
				</div>
				<form
					className="flex flex-col items-center space-y-6 text-foreground"
					onSubmit={handleSubmit}
				>
					<div className="flex w-full flex-col space-y-7 rounded-xl bg-accent p-7 shadow-[0_3px_15px_5px_rgb(0,0,0,0.1)]">
						<div className="relative flex flex-col space-y-1 text-foreground">
							<Label>Workspace Name</Label>
							<Input
								type="text"
								id="workSpace"
								autoComplete="off"
								className="relative bg-card xs:pl-0 xs:indent-2"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
							/>
						</div>
						<div className="relative flex flex-col space-y-1 text-foreground">
							<Label>Workspace URL</Label>
							<div className="relative flex flex-col space-y-1 text-foreground">
								<span className="absolute bottom-3 left-2 z-10 xs:hidden text-muted-foreground">
									app.squaredmade.com/
								</span>
								<Input
									className="relative bg-card pl-44 xs:pl-0 xs:indent-2"
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
