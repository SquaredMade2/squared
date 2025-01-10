"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { userService, workspaceService } from "@/lib/services";
import { useUserStore, useWorkspaceStore } from "@/store";
import { TODO } from "@squared/context";
import { ChevronLeft } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Join = () => {
	const [inputValue, setInputValue] = useState("");
	const [urlInputValue, setUrlInputValue] = useState("");
	const { setWorkspaces, workspaces, createWorkspace } = useWorkspaceStore(
		(state) => state,
	);
	const { updateUser, user, setUser } = useUserStore((state) => state);
	const { toast } = useToast();
	const router = useRouter();

	// List of restricted routes (initial set)
	const restrictedRoutes = [
		"verify",
		"inbox",
		"join",
		"login",
		"password",
		"register",
		"settings",
	];
	const { data, status } = useSession();

	useEffect(() => {
		const initStore = async () => {
			if (user) {
				setWorkspaces(
					await workspaceService.getUserWorkspaces(TODO, { userId: user.id }),
				);
			} else if (data?.user) {
				const newUser = await userService.getUser(TODO, {
					userId: data.user.id,
				});
				if (!newUser) await signOut();
				setUser(newUser);
				setWorkspaces(
					await workspaceService.getUserWorkspaces(TODO, {
						userId: data.user.id,
					}),
				);
			}
		};
		initStore();
	}, [status]);

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
		const takenUrls = [...restrictedRoutes, ...workspaces.map((ws) => ws.url)];
		return takenUrls.includes(url);
	};

  const isWorkspaceNameTaken = (name: string) => {
    // Check for an existing workspace with the same name
    const takenNames = [...workspaces.map((ws) => ws.name)];
    return takenNames.includes(name);
  }

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!user) return;

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

    if(isWorkspaceNameTaken(inputValue)) {
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
		try {
			const workspace = await workspaceService.createWorkspace(TODO, {
				workspace: newWorkspaceInput,
				userId: user.id,
			});
			createWorkspace(workspace);
			toast({ title: "Workspace created successfully" });
			if (workspace) {
				if (user.onBoarding) {
					const updatedUser = await userService.onBoardUser(TODO, {
						userId: user.id,
					});
					updateUser(updatedUser);
					setUser(updatedUser);
				}
				router.refresh();
				router.push(`/${workspace.url}`);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		// testing purpose this is css is not here to stay
		<div className="w-screen h-screen">
			{!user?.onBoarding && workspaces.length > 0 && (
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
					<Button type="submit">Create workspace</Button>
				</form>
			</Card>
		</div>
	);
};

export default Join;
