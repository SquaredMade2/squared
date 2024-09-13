"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import type { InputChangeEvent, FormSubmitEvent } from "@/types";
import BlueButton from "@/components/BlueButton";
import { useAuthStore, useTeamStore, useWorkspaceStore } from "@/storeZ";
import { useTheme } from "next-themes";

export default function CreateTeam() {
	const { toast } = useToast();
	const router = useRouter();
	const [teamName, setTeamName] = useState<string>("");
	const [teamIdentifier, setTeamIdentifier] = useState<string>("");

	const workspace = useWorkspaceStore((state) => state.currentWorkspace);
	const user = useAuthStore((state) => state.user);
	const getTeam = useTeamStore((state) => state.getTeam);
	const addTeam = useTeamStore((state) => state.addTeam);
	const { theme } = useTheme();

	const userHasAccess = user;

	const identifierInputFilter = (e: InputChangeEvent): void => {
		const identifierFormat = /^[A-Za-z0-9]*$/g;
		if (identifierFormat.test(e.target.value)) {
			setTeamIdentifier(e.target.value.toUpperCase());
		}
	};

	const handleSubmit = async (e: FormSubmitEvent): Promise<void> => {
		e.preventDefault();

		if (!workspace) {
			toast({
				title: "Workspace not found",
				variant: "destructive",
			});
			return;
		}

		if (!teamName && !teamIdentifier) {
			toast({
				title: "Both Name and Identifier required",
				variant: "destructive",
			});
		} else if (!teamIdentifier) {
			toast({
				title: "Identifier is required",
				variant: "destructive",
			});
		} else if (!teamName) {
			toast({ title: "Name is required", variant: "destructive" });
		} else {
			const { team } = await getTeam(teamName.trim());

			if (!team) {
				await addTeam({
					name: teamName.trim(),
					identifier: teamIdentifier,
					workspaceId: workspace.id,
				});

				router.push(`/${workspace?.url}/team/${teamIdentifier}/all`);
				toast({ title: "Team created" });
			}
		}
	};

	useEffect(() => {
		if (!userHasAccess) {
			router.push(`/${workspace?.url}`);
		}
	}, []);

	return (
		<div className="flex bg-background text-foreground min-h-screen mdsm:flex-col w-full">
			<div className="w-full pt-20 flex justify-center">
				<div className="flex flex-col w-1/3 mdsm:w-3/4">
					<div>
						<h1 className="text-2xl text-foreground mb-1 font-medium">
							Create Team
						</h1>
						<p className="text-sm text-muted-foreground">
							Create a new team to manage separate cycles and workflows
						</p>
					</div>
					<span className="block w-full border-t border-border mt-6" />
					<form className="flex flex-col" onSubmit={handleSubmit}>
						<div>
							<div className="my-6">
								<p className="text-sm">Team Name</p>
								<input
									type="text"
									value={teamName}
									placeholder="e.g. Engineering"
									onChange={(e) => setTeamName(e.target.value)}
									className={`w-full border border-border rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-foreground py-1.5 px-3 text-sm mt-1.5 ${
										theme === "dark" ? "bg-background" : "bg-card"
									}`}
								/>
							</div>
							<div className="my-6">
								<p className="text-sm">Team identifier</p>
								<div className="flex">
									<input
										type="text"
										value={teamIdentifier}
										placeholder="e.g. ENG"
										maxLength={5}
										onChange={identifierInputFilter}
										className={`w-20 border border-border max-h-8 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-foreground py-1.5 px-3 text-sm mt-1.5 ${
											theme === "dark" ? "bg-background" : "bg-card"
										}`}
									/>
									<p className="text-sm text-muted-foreground pl-5">
										{
											"This is used as the identifier (e.g. ENG-123) for all issues of the team. Keep it short and simple."
										}
									</p>
								</div>
							</div>
							<BlueButton description="Create Team" />
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
