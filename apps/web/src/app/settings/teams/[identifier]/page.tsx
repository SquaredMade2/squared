"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { FormSubmitEvent } from "@/types";
import BlueButton from "@/components/BlueButton";
import { X } from "lucide-react";
import type { Team } from "@repo/db";
import { Button } from "@/components/ui/button";
import { useTeamStore, useWorkspaceStore } from "@/storeZ";

export default function TeamsSetting() {
	const { toast } = useToast();
	const router = useRouter();

	const { currentTeam, deleteTeam, getTeam, updateTeam } = useTeamStore(
		(state) => state,
	);
	const { currentWorkspace, getWorkspace } = useWorkspaceStore(
		(state) => state,
	);

	const [teamName, setTeamName] = useState<string>(currentTeam?.name ?? "");
	const [teamIdentifier, setTeamIdentifier] = useState<string>(
		currentTeam?.identifier ?? "",
	);
	const [fillColor, setFillColor] = useState<string>("text-[#9c9eac]");

	const dialogRef = useRef<HTMLDialogElement | null>(null);
	const prevName = currentTeam?.name;
	const prevIdentifier = currentTeam?.identifier;
	const valueChanged =
		prevName !== teamName || prevIdentifier !== teamIdentifier;

	const teams = [] as Team[];

	const identifierInputFilter = (value: string): void => {
		const regex = /^[A-Za-z0-9]*$/g;
		const test = regex.test(value);
		if (test) {
			setTeamIdentifier(value.toUpperCase());
		}
	};

	const handleOpen = () => {
		if (dialogRef.current) {
			dialogRef.current.showModal();
		}
	};

	const handleClose = () => {
		if (dialogRef.current) {
			dialogRef.current.close();
		}
	};

	const handleDelete = (): void => {
		if (teams.length === 1) {
			toast({
				title: "This is your only team; it cannot be deleted.",
				variant: "destructive",
			});
		} else {
			currentTeam && deleteTeam(currentTeam.id);
			handleClose();
			router.push(`/${currentWorkspace?.url}`);
			toast({ title: "Team deleted" });
		}
	};

	const handleSubmit = async (e: FormSubmitEvent) => {
		e.preventDefault();
		if (!teamName && !teamIdentifier) {
			toast({
				title: "Both Name and Identifier are required",
				variant: "destructive",
			});
		} else if (!teamIdentifier) {
			toast({
				title: "Identifier is required",
				variant: "destructive",
			});
		} else if (!teamName) {
			toast({ title: "Name is required", variant: "destructive" });
		} else if (valueChanged && currentTeam && currentWorkspace) {
			try {
				const update = await updateTeam(currentTeam.id, {
					name: teamName,
					identifier: teamIdentifier,
				});
				if (update) {
					const { workspace } = await getWorkspace(currentWorkspace.id);
					await getTeam(teamIdentifier);
					const url = `/${workspace?.url}/settings/teams/${teamIdentifier}`;
					router.push(url);
				}
			} catch (err) {}
		}
	};

	return (
		<div className="flex bg-background text-foreground mdsm:flex-col min-h-screen w-full">
			<div className="flex flex-col h-screen xs:h-full w-full items-center pt-20">
				<div className="w-1/3 mdsm:w-3/4">
					<dialog
						className="w-84 bg-background text-foreground rounded-lg cursor-default border border-border"
						ref={dialogRef}
					>
						<div className="w-full flex items-center justify-between py-4 px-8 border-b border-border">
							<h1>Verify team deletion</h1>
							<div
								onClick={handleClose}
								onMouseEnter={() => setFillColor("text-[#BDBFC5]")}
								onMouseLeave={() => setFillColor("text-[#9c9eac]")}
							>
								<X className={`cursor-pointer ${fillColor}`} />
							</div>
						</div>
						<div className="h-full w-full flex flex-col items-center mt-5 py-2 px-8">
							<h1>Are you sure you want to delete this team?</h1>
							<div className="flex mb-5">
								<Button variant={"destructive"} onClick={handleDelete}>
									Delete my team
								</Button>
							</div>
						</div>
					</dialog>
					<form className="flex flex-col" onSubmit={handleSubmit}>
						<div>
							<div>
								<h1 className="text-2xl text-foreground mb-1 font-medium">
									{teamName}
								</h1>
								<p className="text-muted-foreground text-sm">
									Manage team settings
								</p>
							</div>
							<span className="block w-full border-t border-border my-6" />
							<div className="mt-6">
								<p className="text-sm mb-1.5">Name</p>
								<input
									type="text"
									aria-label="Team"
									className="border border-border pl-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-400 rounded xs:w-3/4 bg-textField bg-card dark:bg-background "
									onChange={(e) => setTeamName(e.target.value)}
									value={teamName}
								/>
							</div>
							<div className="mt-6">
								<p className="text-sm mb-1.5">
									Identifier
									<span className="text-muted-foreground">
										{" "}
										- Used in issue IDs
									</span>
								</p>
								<input
									type="text"
									maxLength={5}
									className={
										"border border-border pl-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-400 rounded xs:w-3/4 bg-textField bg-card dark:bg-background"
									}
									onChange={(e) => identifierInputFilter(e.target.value)}
									value={teamIdentifier}
								/>
							</div>
							<div
								className={`${valueChanged ? "opacity-0 transition-all duration-300 ease-in-out" : "opacity-100 transition-all duration-300 ease-in-out"}`}
							>
								<BlueButton description="Save" />
							</div>
						</div>
					</form>
					<div>
						<h3 className="text-lg font-medium mb-3">Delete team</h3>
						<p className="text-muted-foreground text-sm mb-3">
							<span className="font-medium">Warning: </span>
							Deleting the team will also permanently delete any issues
							associated with it. This can't be undone and your data cannot be
							recovered by Squared.
						</p>
						<Button variant={"destructive"} onClick={handleOpen}>
							Delete Team
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
