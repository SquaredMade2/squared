"use client";
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@squaredmade/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@squaredmade/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@squaredmade/ui/form";
import { Input } from "@squaredmade/ui/input";
import { Separator } from "@squaredmade/ui/separator";
import { toast } from "@squaredmade/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { useTeams } from "@/hooks/useTeams";
import { client } from "@/lib/client";
import { alphaNumericRegex } from "@/lib/regex";
import { useTeamStore } from "@/store";
import { parseError } from "@/utils/parseError";

const formSchema = z.object({
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
	teamName: z.string().min(1, {
		message: "Team name is required",
	}),
});

export default function CreateTeam() {
	const router = useRouter();
	const { organization, isLoaded } = useOrganization();
	const { loading: teamLoading, authorized } = useTeams();
	const { createTeam: addTeam } = useTeamStore((state) => state);

	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: {
			teamIdentifier: "",
			teamName: "",
		},
		resolver: zodResolver(formSchema),
	});

	const { mutate: handleSubmit } = useMutation({
		mutationFn: async (values: z.infer<typeof formSchema>) => {
			if (!organization) {
				throw new Error("Workspace not found");
			}
			const res = await client.team.createTeam
				.$post({
					identifier: values.teamIdentifier.toUpperCase(),
					name: values.teamName.trim(),
				})
				.then((r) => r.json());

			if (!res) throw new Error("Failed to create team");
			return res;
		},
		mutationKey: ["team", "createTeam", organization?.id],
		onError: (error) => {
			toast.error("Failed to create team", {
				description: parseError(error),
			});
		},
		onSuccess: (data) => {
			if (!data) return;
			addTeam(data);
			router.push(
				`/${organization?.slug}/team/${data?.identifier?.toUpperCase()}/all`,
			);
			toast.success("Team created");
		},
	});

	useEffect(() => {
		if (!(authorized || teamLoading) && organization) {
			router.push(`/${organization.slug}`);
		} else if (!organization && isLoaded) {
			router.push("/");
		}
	}, [authorized, organization, teamLoading, isLoaded]);

	if (!isLoaded || teamLoading)
		return (
			<div className="container mx-auto mb-16 w-2/3 space-y-6 p-4">
				<h1 className="mb-2 font-bold text-3xl">New Team Settings</h1>
				<p className="mb-6 text-muted-foreground">Create a new team</p>
				<div className="flex h-64 w-full items-center justify-center">
					<SquaredLoader />
				</div>
			</div>
		);

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		handleSubmit(values);
	};

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
								className="mt-4 space-y-6"
								onSubmit={form.handleSubmit(onSubmit)}
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
														className="w-20"
														maxLength={5}
														placeholder="e.g. ENG"
														{...field}
														onChange={(e) => {
															const value = e.target.value.toUpperCase();
															if (alphaNumericRegex.test(value)) {
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
								<Button className="w-full" type="submit">
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
