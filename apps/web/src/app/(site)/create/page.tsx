"use client";

import { useOrganizationList, useUser } from "@clerk/nextjs";
import { Button } from "@squaredmade/ui/button";
import { Card } from "@squaredmade/ui/card";
import { Input } from "@squaredmade/ui/input";
import { Label } from "@squaredmade/ui/label";
import { toast } from "@squaredmade/ui/toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { client } from "@/lib/client";
import { parseError } from "@/utils/parseError";

const Join = () => {
	const [inputValue, setInputValue] = useState("");
	const [urlInputValue, setUrlInputValue] = useState("");
	const { setActive } = useOrganizationList();
	const router = useRouter();

	// List of restricted routes (initial set)
	const restrictedRoutes = [
		"verify",
		"inbox",
		"create",
		"sign-in",
		"password",
		"sign-up",
		"welcome",
		"undefined",
	];
	const { isLoaded, user } = useUser();

	const { data: workspaceUrls = [], isLoading: isWorkspacesLoading } = useQuery(
		{
			queryFn: async () => {
				const res = await client.workspace.getTakenUrls
					.$get()
					.then((res) => res.json());
				return res;
			},
			queryKey: ["workspaces", user?.id],
		},
	);

	const { data: defaultWorkspace } = useQuery({
		queryFn: async () => {
			return await client.user.getDefaultWorkpace
				.$get()
				.then((res) => res.json());
		},
		queryKey: ["user", "defaultWorkspace"],
	});

	const createWorkspaceMutation = useMutation({
		mutationFn: async (newWorkspace: { name: string; url: string }) => {
			const newCreatedWorkspace = await client.workspace.createWorkspace
				.$post(newWorkspace)
				.then((res) => res.json());
			await setActive?.({ organization: newCreatedWorkspace.externalId });
			return newWorkspace;
		},
		onError: (error) => {
			toast.error("Failed to create workspace", {
				description: parseError(error),
			});
		},
		onSuccess: (data) => {
			if (!data) return;
			toast.success("Workspace created successfully");
			if (data) {
				router.refresh();
				router.push(`/${data.url}`);
			}
		},
	});

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

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (inputValue.length === 0) {
			toast.error("Please enter a workspace name.");
			return;
		}

		if (urlInputValue.length === 0) {
			toast.error("Please enter a workspace URL.");
			return;
		}

		if (isUrlTaken(urlInputValue)) {
			toast.error(
				"Workspace URL already exists. Please choose a different name.",
			);
			return;
		}

		if (urlInputValue.includes("/")) {
			toast.error("Workplace URL cannot contain '/'");
			return;
		}

		const newWorkspaceInput = {
			name: inputValue,
			url: urlInputValue,
		};

		createWorkspaceMutation.mutate(newWorkspaceInput);
	};

	if (isWorkspacesLoading || !isLoaded) {
		return (
			<div className="h-screen w-full">
				<div className="flex h-full items-center justify-center">
					<div className="flex flex-col items-center gap-4">
						<div className="font-bold text-3xl">Loading Workspace</div>
						<SquaredLoader />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen w-screen">
			{workspaceUrls?.length > 0 && (
				<div className="absolute top-0 flex w-screen justify-between p-10">
					<div className="flex flex-col text-sm">
						<span className="text-muted-foreground text-xs">Logged in as:</span>
						<span className="text-foreground">
							{user?.emailAddresses[0].emailAddress}
						</span>
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
								autoComplete="off"
								className="relative bg-card xs:pl-0 xs:indent-2"
								onChange={(e) => setInputValue(e.target.value)}
								type="text"
								value={inputValue}
							/>
						</div>
						<div className="relative flex flex-col space-y-1 text-foreground">
							<Label>Workspace URL</Label>
							<div className="relative flex flex-col space-y-1 text-foreground">
								<span className="absolute bottom-3 left-2 z-10 xs:hidden text-muted-foreground">
									app.squaredmade.com/
								</span>
								<Input
									autoComplete="off"
									className="relative bg-card pl-44 xs:pl-0 xs:indent-2"
									onChange={(e) => setUrlInputValue(e.target.value)}
									value={urlInputValue}
								/>
							</div>
						</div>
					</div>
					<Button disabled={createWorkspaceMutation.isPending} type="submit">
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
