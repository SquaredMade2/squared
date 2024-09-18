"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import {
	useAuthStore,
	useTeamStore,
	useUserStore,
	useWorkspaceStore,
} from "@/store";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useMetaData } from "@/utils/useMetaData";

const formSchema = z.object({
	teamName: z.string().min(1, {
		message: "Team name is required",
	}),
	teamIdentifier: z
		.string()
		.min(1, {
			message: "Team identifier is required",
		})
		.max(5, {
			message: "Team identifier must be 5 characters or less",
		})
		.regex(/^[A-Za-z0-9]*$/, {
			message: "Team identifier must only contain letters and numbers",
		}),
});

export default function CreateTeam() {
	const { toast } = useToast();
	const router = useRouter();
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	const { user } = useAuthStore((state) => state);
	const { users } = useUserStore((state) => state);
	const { getAllTeams, teams, addTeam } = useTeamStore((state) => state);
	const access = users.find((u) => u.id === user?.id);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			teamName: "",
			teamIdentifier: "",
		},
	});

	if (!teams) {
		currentWorkspace && getAllTeams(currentWorkspace.id);
	}

	const userHasAccess =
		typeof access === "object" &&
		access &&
		"id" in access &&
		access.id === user?.id;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (!currentWorkspace) {
			toast({
				title: "No workspace selected",
				variant: "destructive",
			});
			return;
		}

		const doesTeamExist = teams.find(
			(team) =>
				team.id === values.teamName &&
				team.identifier === values.teamIdentifier.toUpperCase(),
		);

		if (!doesTeamExist) {
			const newTeam = await addTeam({
				name: values.teamName.trim(),
				identifier: values.teamIdentifier.toUpperCase(),
				workspaceId: currentWorkspace.id,
			});
			router.push(
				`/${currentWorkspace.url}/team/${values.teamIdentifier.toUpperCase()}/all`,
			);
			toast({ title: "Team created" });
		} else {
			toast({
				title: "Team already exists",
				variant: "destructive",
			});
		}
	};

	useEffect(() => {
		if (!userHasAccess && currentWorkspace) {
			router.push(`/${currentWorkspace.url}`);
		} else if (!currentWorkspace) {
			router.push("/");
		}
	}, []);

	// Custom hook for metadata
	useMetaData(
		"Add Team",
		"Create a new team to manage separate cycles and workflows.",
	);

	return (
		<div className="flex bg-background text-foreground mdsm:flex-col w-[80vw]">
			<div className="w-full pt-20 flex justify-center">
				<Card className="w-full max-w-lg">
					<CardHeader>
						<CardTitle>Create Team</CardTitle>
						<CardDescription>
							Create a new team to manage separate cycles and workflows
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Separator />
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6 mt-4"
							>
								<FormField
									control={form.control}
									name="teamName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Team Name</FormLabel>
											<FormControl>
												<Input placeholder="e.g. Engineering" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="teamIdentifier"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Team identifier</FormLabel>
											<FormControl>
												<div className="flex items-center space-x-2">
													<Input
														placeholder="e.g. ENG"
														maxLength={5}
														className="w-20"
														{...field}
														onChange={(e) => {
															const value = e.target.value.toUpperCase();
															if (/^[A-Z0-9]*$/.test(value)) {
																field.onChange(value);
															}
														}}
													/>
													<FormDescription>
														This is used as the identifier (e.g. ENG-123) for
														all issues of the team. Keep it short and simple.
													</FormDescription>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit" className="w-full">
									Create Team
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
