"use client";

import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Effort } from "@squaredmade/db";
import { ChevronDown } from "@squaredmade/icons";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@squaredmade/ui/alert-dialog";
import { Button } from "@squaredmade/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@squaredmade/ui/dropdown-menu";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { useTeams } from "@/hooks/useTeams";
import { client } from "@/lib/client";
import { useTeamStore } from "@/store";

const formSchema = z.object({
	identifier: z
		.string()
		.min(1, {
			message: "Team identifier is required.",
		})
		.max(5, {
			message: "Team identifier must be at most 5 characters.",
		})
		.regex(/^[A-Z0-9]*$/, {
			message: "Identifier can only contain uppercase letters and numbers.",
		}),
	name: z.string().min(2, {
		message: "Team name must be at least 2 characters.",
	}),
});

const effortType = [
	{
		dbValue: "LINEAR",
		dropdownTitle: "Linear",
		id: 0,
		listOption: "Linear - [1, 2, 3, 4, 5]",
		options: [1, 2, 3, 4, 5],
	},
	{
		dbValue: "EXPONENTIAL",
		dropdownTitle: "Exponential",
		id: 1,
		listOption: "Exponential - [1, 2, 4, 8, 16]",
		options: [1, 2, 4, 8, 16],
	},
	{
		dbValue: "FIBONACCI",
		dropdownTitle: "Fibonacci",
		id: 2,
		listOption: "Fibonacci - [1, 2, 3, 5, 8]",
		options: [1, 2, 3, 5, 8],
	},
];

export default function TeamsSetting() {
	const [showEffortDropdown, setShowEffortDropdown] = useState(false);
	const [selectedEffort, setSelectedEffort] =
		useState<Record<string, number | string | number[]>>();
	const router = useRouter();
	const { organization, isLoaded } = useOrganization();
	const { team, loading: teamLoading } = useTeams();

	const { deleteTeam, updateTeam, setTeam } = useTeamStore((state) => state);

	useEffect(() => {
		switch (team?.effort) {
			case "LINEAR":
				setSelectedEffort(effortType[0]);
				break;
			case "EXPONENTIAL":
				setSelectedEffort(effortType[1]);
				break;
			case "FIBONACCI":
				setSelectedEffort(effortType[2]);
				break;
		}
	}, []);

	const [isFormChanged, setIsFormChanged] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: {
			identifier: team?.identifier ?? "",
			name: team?.name ?? "",
		},
		resolver: zodResolver(formSchema),
	});

	useEffect(() => {
		const subscription = form.watch((value) => {
			if (value.name !== team?.name || value.identifier !== team?.identifier) {
				setIsFormChanged(true);
			} else {
				setIsFormChanged(false);
			}
		});
		return () => subscription.unsubscribe();
	}, [form, team]);

	const { mutate: handleSubmit } = useMutation({
		mutationFn: async (values: z.infer<typeof formSchema>) => {
			if (!(team && organization))
				throw new Error("Team or workspace not found");
			return await client.team.updateTeam
				.$post({
					effort: selectedEffort?.dbValue as Effort,
					identifier: values.identifier,
					name: values.name,
					teamId: team.id,
				})
				.then((res: Response) => res.json());
		},
		mutationKey: ["team", "update", team?.id],
		onError: (error) => {
			toast.error("Failed to update team", {
				description: error.message,
			});
		},
		onSuccess: async (updatedTeam) => {
			updateTeam(updatedTeam);
			if (updatedTeam) {
				setTeam(
					await client.team.getTeamByIdentifier
						.$get({
							identifier: updatedTeam.identifier,
						})
						.then((res: Response) => res.json()),
				);
				router.refresh();
				toast.success("Team updated successfully");
			}
		},
	});

	const { mutate: handleDelete, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			if (!team) throw new Error("Team not found");
			return await client.team.deleteTeam
				.$post({
					teamId: team.id,
				})
				.then((res: Response) => res.json());
		},
		mutationKey: ["team", "delete", team?.id],
		onError: (error) => {
			toast.error("Failed to delete team", {
				description: error.message,
			});
		},
		onSuccess: () => {
			deleteTeam(team?.id ?? "");
			router.push(`/${organization?.slug}`);
			toast.success("Team deleted");
		},
	});

	const handleEffortSelection = (value: string) => {
		if (value !== selectedEffort?.name) {
			setIsFormChanged(true);
		}

		if (value === "Linear") {
			setSelectedEffort(effortType[0]);
		} else if (value === "Exponential") {
			setSelectedEffort(effortType[1]);
		} else {
			setSelectedEffort(effortType[2]);
		}
	};

	if (teamLoading || !isLoaded)
		return (
			<div className="container mx-auto mb-16 w-2/3 space-y-6 p-4">
				<h1 className="mb-2 font-bold text-3xl">Team Settings</h1>
				<p className="mb-6 text-muted-foreground">Manage team settings</p>
				<div className="flex h-64 w-full items-center justify-center">
					<SquaredLoader />
				</div>
			</div>
		);

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		handleSubmit(values);
	};

	return (
		<div className="container mx-auto w-full py-10 md:w-3/4">
			<h1 className="mb-2 font-bold text-3xl">{team?.name}</h1>
			<p className="mb-6 text-muted-foreground">Manage team settings</p>

			<Separator className="my-6" />

			<Form {...form}>
				<form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Team Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="identifier"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Team Identifier</FormLabel>
									<FormControl>
										<Input {...field} maxLength={5} />
									</FormControl>
									<FormDescription>
										Used in task IDs. Max 5 characters, uppercase letters and
										numbers only.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex flex-col">
							<DropdownMenu
								onOpenChange={setShowEffortDropdown}
								open={showEffortDropdown}
							>
								<DropdownMenuTrigger className="mb-2 w-fit cursor-auto text-start">
									Effort Type
								</DropdownMenuTrigger>
								<DropdownMenuTrigger>
									<menu
										aria-hidden="true"
										aria-label="Effort style dropdown menu"
										className="flex h-10 w-full items-center justify-between rounded-md border px-3 text-left hover:cursor-pointer"
									>
										{selectedEffort?.dropdownTitle}
										<ChevronDown
											className={`${showEffortDropdown ? "rotate-180" : "rotate-0"}`}
										/>
									</menu>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="z-10 mt-3 mr-48 w-full rounded-md p-0">
									<DropdownMenuRadioGroup
										className="z-50 rounded-md bg-secondary hover:cursor-pointer"
										onValueChange={handleEffortSelection}
										value={selectedEffort?.listOption as string}
									>
										{effortType.map((item, index) => (
											<DropdownMenuRadioItem
												className="hover:cursor-pointer"
												key={item.id}
												value={item.dropdownTitle}
											>
												<div
													className={`${index === 1 ? "border-y-2" : ""} z-10 flex w-full items-center space-x-2 p-3`}
												>
													<span className="hover:cursor-pointer">
														{item.listOption}
													</span>
												</div>
											</DropdownMenuRadioItem>
										))}
									</DropdownMenuRadioGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
					<Button disabled={!isFormChanged} type="submit">
						Save Changes
					</Button>
				</form>
			</Form>

			<Separator className="my-6" />

			<div className="rounded-lg bg-destructive/10 p-6">
				<h2 className="mb-4 font-semibold text-xl">Delete Team</h2>
				<p className="mb-4 text-muted-foreground">
					<span className="font-medium">Warning: </span>
					Deleting the team will also permanently delete any tasks associated
					with it. This can't be undone and your data cannot be recovered by
					Squared.
				</p>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant="destructive">Delete Team</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your
								team and remove all associated data from our servers.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
								onClick={() => handleDelete()}
							>
								{isDeleting ? "Deleting..." : "Yes, delete team"}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
}
