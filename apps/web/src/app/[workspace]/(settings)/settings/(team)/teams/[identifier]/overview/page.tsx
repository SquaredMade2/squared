"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { useTeams } from "@/hooks/useTeams";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { teamService } from "@/lib/services";
import { useTeamStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { TODO } from "@squared/context";
import type { Effort } from "@squared/db";
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
import { useToast } from "@squaredmade/ui/hooks";
import { Input } from "@squaredmade/ui/input";
import { Separator } from "@squaredmade/ui/separator";
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
	const { workspace, loading: workspaceLoading } = useWorkspaces();
	const { team, teams, loading: teamLoading } = useTeams();

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

	const [isDeleting, setIsDeleting] = useState(false);
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

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (team && workspace) {
			try {
				const updatedTeam = await teamService.updateTeam(TODO, {
					id: team.id,
					name: values.name,
					identifier: values.identifier,
					effort: selectedEffort?.dbValue as Effort,
				});
				updateTeam(updatedTeam);
				if (updatedTeam) {
					setTeam(
						await teamService.getTeamByIdentifier(TODO, {
							identifier: values.identifier,
							workspaceId: workspace.id,
						}),
					);
					router.refresh();
					toast({ title: "Team updated successfully" });
				}
			} catch {
				toast({
					title: "Failed to update team",
					variant: "destructive",
				});
			}
		}
	};

	const handleDelete = async () => {
		setIsDeleting(true);
		if (teams.length === 1) {
			toast({
				title: "This is your only team; it cannot be deleted.",
				variant: "destructive",
			});
		} else {
			await teamService.deleteTeam(TODO, { teamId: team.id });
			team && deleteTeam(team.id);
			router.push(`/${workspace?.url}`);
			toast({ title: "Team deleted" });
		}
		setIsDeleting(false);
	};

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

	if (teamLoading || workspaceLoading)
		return (
			<div className="container mx-auto p-4 w-2/3 space-y-6 mb-16">
				<h1 className="text-3xl font-bold mb-2">Team Settings</h1>
				<p className="text-muted-foreground mb-6">Manage team settings</p>
				<div className="flex justify-center items-center w-full h-64">
					<SquaredLoader />
				</div>
			</div>
		);

	return (
		<div className="container mx-auto py-10 md:w-3/4 w-full">
			<h1 className="text-3xl font-bold mb-2">{team.name}</h1>
			<p className="text-muted-foreground mb-6">Manage team settings</p>

			<Separator className="my-6" />

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
										className="border flex items-center text-left px-3 rounded-md w-40 h-10 justify-between hover:cursor-pointer"
										aria-label="Effort style dropdown menu"
										aria-hidden="true"
									>
										{selectedEffort?.dropdownTitle}
										<ChevronDown
											className={`${showEffortDropdown ? "rotate-180" : "rotate-0"}`}
										/>
									</menu>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-52 p-0 mr-48 mt-3 z-10 rounded-md">
									<DropdownMenuRadioGroup
										value={selectedEffort?.listOption as string}
										onValueChange={handleEffortSelection}
										className="bg-secondary hover:cursor-pointer z-50 rounded-md"
									>
										{effortType.map((item, index) => (
											<DropdownMenuRadioItem
												key={item.id}
												value={item.dropdownTitle}
												className="hover:cursor-pointer"
											>
												<div
													className={`${index === 1 ? "border-y-2" : ""} flex items-center space-x-2 p-3 z-10`}
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

			<div className="bg-destructive/10 p-6 rounded-lg">
				<h2 className="text-xl font-semibold mb-4">Delete Team</h2>
				<p className="text-muted-foreground mb-4">
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
								onClick={handleDelete}
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
