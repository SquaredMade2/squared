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
import { client } from "@/lib/client";
import { useTeamStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
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
	const { loading: teamLoading, authorized } = useTeams();
	const { createTeam: addTeam } = useTeamStore((state) => state);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			teamName: "",
			teamIdentifier: "",
		},
	});

	const { mutate: onSubmit } = useMutation({
		mutationKey: ["createTeam", workspace?.id],
		mutationFn: async (values: z.infer<typeof formSchema>) => {
			if (!workspace) {
				throw new Error("Workspace not found");
			}
			const res = await client.team.createTeam
				.$post({
					name: values.teamName.trim(),
					identifier: values.teamIdentifier.toUpperCase(),
					workspaceId: workspace.id,
				})
				.then((res) => res.json());

			if (!res) throw new Error("Failed to create team");
			return res;
		},
		onSuccess: (data) => {
			if (!data) return;
			addTeam(data);
			router.push(
				`/${workspace?.url}/team/${data?.identifier?.toUpperCase()}/all`,
			);
			toast({ title: "Team created" });
		},
		onError: (error) => {
			toast({
				title: "Failed to create team",
				description: parseError(error),
				variant: "destructive",
			});
		},
	});

	useEffect(() => {
		if (!authorized && !teamLoading && workspace) {
			router.push(`/${workspace.url}`);
		} else if (!workspace && !workspaceLoading) {
			router.push("/");
		}
	}, [authorized, workspace, teamLoading, workspaceLoading]);

	if (workspaceLoading || teamLoading)
		return (
			<div className="container mx-auto mb-16 w-2/3 space-y-6 p-4">
				<h1 className="mb-2 font-bold text-3xl">New Team Settings</h1>
				<p className="mb-6 text-muted-foreground">Create a new team</p>
				<div className="flex h-64 w-full items-center justify-center">
					<SquaredLoader />
				</div>
			</div>
		);

	return (
		<div className="flex w-[80vw] bg-background text-foreground mdsm:flex-col">
			<div className="flex w-full justify-center pt-20">
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
								onSubmit={form.handleSubmit((values) => onSubmit(values))}
								className="mt-4 space-y-6"
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
