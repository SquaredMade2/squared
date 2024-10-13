"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useAuthStore, useUserStore, useWorkspaceStore } from "@/store";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signOut, useSession } from "next-auth/react";

const Join = () => {
	const [inputValue, setInputValue] = useState("");
	const [urlInputValue, setUrlInputValue] = useState("");
	const { getAllWorkspaces, workspaces, addWorkspace } = useWorkspaceStore(
		(state) => state,
	);
	const { user, setUser } = useAuthStore((state) => state);
	const { updateUser, getUser } = useUserStore((state) => state);
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
				getAllWorkspaces(user.id);
			} else if (data?.user) {
				const { user: newUser } = await getUser(data.user.id);
				if (!newUser) await signOut();
				setUser(newUser);
				getAllWorkspaces(data.user.id);
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

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!user) return;

		if (inputValue.length === 0) {
			alert("Please enter a workspace name");
			return;
		}

		if (urlInputValue.length === 0) {
			alert("Please enter a workspace URL");
			return;
		}

		if (isUrlTaken(urlInputValue)) {
			alert("Workspace URL is already taken");
			return;
		}

		if (urlInputValue.includes("/")) {
			alert("Workspace URL cannot contain '/'");
			return;
		}

		const newWorkspaceInput = {
			name: inputValue,
			url: urlInputValue,
		};
		try {
			const response = await addWorkspace(newWorkspaceInput, user.id);
			const { workspace, message, variant } = response;
			toast({ title: message, variant });
			if (workspace) {
				if (user.onBoarding) {
					const updatedUser = await updateUser(user.id, { onBoarding: false });
					setUser(updatedUser.user);
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
