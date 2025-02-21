"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
import { client } from "@/lib/client";
import { useTeamStore } from "@/store";
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Effort } from "@squared/db";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@squaredmade/ui/dropdown-menu";
import { useMutation } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	name: z.string().min(2, {
		message: "Team name must be at least 2 characters.",
	}),
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
});

const effortType = [
	{
		id: 0,
		dropdownTitle: "Linear",
		dbValue: "LINEAR",
		listOption: "Linear - [1, 2, 3, 4, 5]",
		options: [1, 2, 3, 4, 5],
	},
	{
		id: 1,
		dropdownTitle: "Exponential",

		dbValue: "EXPONENTIAL",
		listOption: "Exponential - [1, 2, 4, 8, 16]",
		options: [1, 2, 4, 8, 16],
	},
	{
		id: 2,
		dropdownTitle: "Fibonacci",

		dbValue: "FIBONACCI",
		listOption: "Fibonacci - [1, 2, 3, 5, 8]",
		options: [1, 2, 3, 5, 8],
	},
];

export default function TeamsSetting() {
	const [showEffortDropdown, setShowEffortDropdown] = useState(false);
	const [selectedEffort, setSelectedEffort] =
		useState<Record<string, number | string | number[]>>();
	const { toast } = useToast();
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

	if (!team || !team.name) return null;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: team.name,
			identifier: team.identifier,
		},
	});

	useEffect(() => {
		const subscription = form.watch((value) => {
			if (value.name !== team.name || value.identifier !== team.identifier) {
				setIsFormChanged(true);
			} else {
				setIsFormChanged(false);
			}
		});
		return () => subscription.unsubscribe();
	}, [form, team]);

	const { mutate: onSubmit } = useMutation({
		mutationKey: ["team", "update", team.id],
		mutationFn: async (values: z.infer<typeof formSchema>) => {
			if (!team || !organization)
				throw new Error("Team or workspace not found");
			return await client.team.updateTeam
				.$post({
					teamId: team.id,
					name: values.name,
					identifier: values.identifier,
					effort: selectedEffort?.dbValue as Effort,
				})
				.then((res) => res.json());
		},
		onSuccess: async (updatedTeam) => {
			updateTeam(updatedTeam);
			if (updatedTeam) {
				setTeam(
					await client.team.getTeamByIdentifier
						.$get({
							identifier: updatedTeam.identifier,
							workspaceId: updatedTeam.workspaceId,
						})
						.then((res) => res.json()),
				);
				router.refresh();
				toast({ title: "Team updated successfully" });
			}
		},
		onError: (error) => {
			toast({
				title: "Failed to update team",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	const { mutate: handleDelete, isPending: isDeleting } = useMutation({
		mutationKey: ["team", "delete", team.id],
		mutationFn: async () => {
			if (!team) throw new Error("Team not found");
			return await client.team.deleteTeam
				.$post({
					teamId: team.id,
				})
				.then((res) => res.json());
		},
		onSuccess: () => {
			deleteTeam(team.id);
			router.push(`/${organization?.slug}`);
			toast({ title: "Team deleted" });
		},
		onError: (error) => {
			toast({
				title: "Failed to delete team",
				description: error.message,
				variant: "destructive",
			});
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

	return (
		<div className="container mx-auto w-full py-10 md:w-3/4">
			<h1 className="mb-2 font-bold text-3xl">{team.name}</h1>
			<p className="mb-6 text-muted-foreground">Manage team settings</p>

			<Separator className="my-6" />

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((values) => onSubmit(values))}
					className="space-y-8"
				>
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
							<FormLabel className="mb-2">Effort Type</FormLabel>
							<DropdownMenu
								open={showEffortDropdown}
								onOpenChange={setShowEffortDropdown}
							>
								<DropdownMenuTrigger>
									<menu
										className="flex h-10 w-40 items-center justify-between rounded-md border px-3 text-left hover:cursor-pointer"
										aria-label="Effort style dropdown menu"
										aria-hidden="true"
									>
										{selectedEffort?.dropdownTitle}
										<ChevronDown
											className={`${showEffortDropdown ? "rotate-180" : "rotate-0"}`}
										/>
									</menu>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="z-10 mt-3 mr-48 w-52 rounded-md p-0">
									<DropdownMenuRadioGroup
										value={selectedEffort?.listOption as string}
										onValueChange={handleEffortSelection}
										className="z-50 rounded-md bg-secondary hover:cursor-pointer"
									>
										{effortType.map((item, index) => (
											<DropdownMenuRadioItem
												key={item.id}
												value={item.dropdownTitle}
												className="hover:cursor-pointer"
											>
												<div
													className={`${index === 1 ? "border-y-2" : ""} z-10 flex items-center space-x-2 p-3`}
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
					<Button type="submit" disabled={!isFormChanged}>
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
