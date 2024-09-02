"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { createTeam, teamExists } from "@/store/taskData/thunks";
import { useRouter } from "next/navigation";
import type { InputChangeEvent, FormSubmitEvent } from "@/types";
import BlueButton from "@/components/BlueButton";

const styles = {
	mainContainer:
		"flex bg-background text-foreground min-h-screen mdsm:flex-col w-full",
	pageContainer: "w-full pt-20 flex justify-center",
	pageWrapper: "flex flex-col w-1/3 mdsm:w-3/4",
	form: "flex flex-col",
	title: "text-2xl text-foreground mb-1 font-medium",
	line: "block w-full border-t border-border mt-6",
	input:
		"w-full border border-border rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-foreground py-1.5 px-3 text-sm mt-1.5 bg-textField",
	identifierInput:
		"w-20 border border-border max-h-8 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-foreground py-1.5 px-3 text-sm mt-1.5 bg-textField",
	inputWrapper: "my-6",
	TopNavbar: "lg:hidden mdsm:visible",
	navbarWrapper:
		"relative mdsm:absolute -left-0 transition-all duration-300 ease-in-out",
	titleDescription: "text-sm text-muted-foreground",
	inputLabel: "text-sm",
	identifierDescription: "text-sm text-muted-foreground pl-5",
	identifierinputWrapper: "flex",
};

export default function CreateTeam() {
	const { toast } = useToast();
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [teamName, setTeamName] = useState<string>("");
	const [teamIdentifier, setTeamIdentifier] = useState<string>("");
	const workspace = useAppSelector((state) => state.taskData.currentWorkspace);
	const { user, theme } = useAppSelector((state) => state.userSettings);
	const access = useAppSelector((state) => state.taskData.access);

	const userHasAccess =
		typeof access === "object" &&
		access &&
		"id" in access &&
		access.id === user?._id;

	const identifierInputFilter = (e: InputChangeEvent): void => {
		const identifierFormat = /^[A-Za-z0-9]*$/g;
		if (identifierFormat.test(e.target.value)) {
			setTeamIdentifier(e.target.value.toUpperCase());
		}
	};

	const handleSubmit = async (e: FormSubmitEvent): Promise<void> => {
		e.preventDefault();
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
			const doesTeamExist = await dispatch(
				teamExists({
					workspace: workspace.id,
					identifier: teamIdentifier,
					name: teamName.trim(),
				}),
			);

			if (!doesTeamExist.payload) {
				dispatch(
					createTeam({
						name: teamName.trim(),
						identifier: teamIdentifier,
						workspaceId: workspace.id,
					}),
				);
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
		<div className={styles.mainContainer}>
			<div className={styles.pageContainer}>
				<div className={styles.pageWrapper}>
					<div>
						<h1 className={styles.title}>Create Team</h1>
						<p className={styles.titleDescription}>
							Create a new team to manage separate cycles and workflows
						</p>
					</div>
					<span className={styles.line} />
					<form className={styles.form} onSubmit={handleSubmit}>
						<div>
							<div className={styles.inputWrapper}>
								<p className={styles.inputLabel}>Team Name</p>
								<input
									type="text"
									value={teamName}
									placeholder="e.g. Engineering"
									onChange={(e) => setTeamName(e.target.value)}
									className={`${styles.input} ${theme === "dark" ? "bg-background" : "bg-card"}`}
								/>
							</div>
							<div className={styles.inputWrapper}>
								<p className={styles.inputLabel}>Team identifier</p>
								<div className={styles.identifierinputWrapper}>
									<input
										type="text"
										value={teamIdentifier}
										placeholder="e.g. ENG"
										maxLength={5}
										onChange={identifierInputFilter}
										className={`${styles.identifierInput} ${
											theme === "dark" ? "bg-background" : "bg-card"
										}`}
									/>
									<p className={styles.identifierDescription}>
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
