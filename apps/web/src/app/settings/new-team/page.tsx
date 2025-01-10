"use client";
import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useTeams } from "@/hooks/useTeams";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { teamService } from "@/lib/services";
import { useUserStore } from "@/store";
import { useTeamStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { TODO } from "@squared/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
	const { workspace, loading: workspaceLoading } = useWorkspaces();
	const { teams, loading: teamLoading, authorized } = useTeams();
	const { createTeam: addTeam } = useTeamStore((state) => state);
	const user = useUserStore((state) => state.user);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			teamName: "",
			teamIdentifier: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (!workspace) {
			toast({
				title: "No workspace selected",
				variant: "destructive",
			});
			return;
		}

		const doesTeamExist = teams.find((team) => team.name === values.teamName);

		if (!doesTeamExist && user) {
			const createdTeamService = await teamService.createTeam(TODO, {
				name: values.teamName.trim(),
				identifier: values.teamIdentifier.toUpperCase(),
				workspaceId: workspace.id,
				userId: user.id,
			});

			addTeam(createdTeamService);
			router.push(
				`/${workspace.url}/team/${values.teamIdentifier.toUpperCase()}/all`,
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
		if (!authorized && !teamLoading && workspace) {
			router.push(`/${workspace.url}`);
		} else if (!workspace && !workspaceLoading) {
			router.push("/");
		}
	}, [authorized, workspace, teamLoading, workspaceLoading]);

	if (workspaceLoading || teamLoading)
		return (
			<div className="container mx-auto p-4 w-2/3 space-y-6 mb-16">
				<h1 className="text-3xl font-bold mb-2">New Team Settings</h1>
				<p className="text-muted-foreground mb-6">Create a new team</p>
				<div className="flex justify-center items-center w-full h-64">
					<SquaredLoader />
				</div>
			</div>
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
														all tasks of the team. Keep it short and simple.
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
