"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import type { Effort, Team } from "@repo/db";
import { Button } from "@/components/ui/button";
import { useTeamStore, useWorkspaceStore } from "@/store";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { isFriday } from "date-fns";

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

	const { currentTeam, deleteTeam, getTeam, updateTeam } = useTeamStore(
		(state) => state,
	);
	const { currentWorkspace, getWorkspace } = useWorkspaceStore(
		(state) => state,
	);

	useEffect(() => {
		if (currentTeam?.effort === "LINEAR") {
			setSelectedEffort(effortType[0]);
		} else if (currentTeam?.effort === "EXPONENTIAL") {
			setSelectedEffort(effortType[1]);
		} else {
			setSelectedEffort(effortType[2]);
		}
	}, []);

	const [isDeleting, setIsDeleting] = useState(false);
	const [isFormChanged, setIsFormChanged] = useState(false);

	const teams = [] as Team[];

	if (!currentTeam || !currentTeam.name) return null;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: currentTeam.name,
			identifier: currentTeam.identifier,
		},
	});

	useEffect(() => {
		const subscription = form.watch((value) => {
			if (
				value.name !== currentTeam.name ||
				value.identifier !== currentTeam.identifier
			) {
				setIsFormChanged(true);
			} else {
				setIsFormChanged(false);
			}
		});
		return () => subscription.unsubscribe();
	}, [form, currentTeam]);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (currentTeam && currentWorkspace) {
			try {
				const update = await updateTeam(currentTeam.id, {
					name: values.name,
					identifier: values.identifier,
					effort: selectedEffort?.dbValue as Effort,
				});
				if (update) {
					const { workspace } = await getWorkspace(currentWorkspace.id);
					await getTeam(values.identifier);
					const url = `/${workspace?.url}/settings/teams/${values.identifier}`;
					router.push(url);
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
			currentTeam && deleteTeam(currentTeam.id);
			router.push(`/${currentWorkspace?.url}`);
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

	return (
		<div className="container mx-auto py-10 md:w-3/4 w-full">
			<h1 className="text-3xl font-bold mb-2">{currentTeam.name}</h1>
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
										Used in issue IDs. Max 5 characters, uppercase letters and
										numbers only.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Todo Create new dropdown component here */}
						<div className="flex flex-col">
							<FormLabel className="mb-2">Effort Type</FormLabel>
							<DropdownMenu
								open={showEffortDropdown}
								onOpenChange={setShowEffortDropdown}
							>
								<DropdownMenuTrigger>
									<menu
										className="border flex items-center text-left px-3 rounded-md w-40 h-10 hover:cursor-pointer"
										aria-label="Effort style dropdown menu"
										aria-hidden="true"
									>
										{/* todo add chevron */}
										{selectedEffort?.dropdownTitle as string}
									</menu>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-52 p-0 mr-48 mt-3 z-10 rounded-md">
									<DropdownMenuRadioGroup
										value={selectedEffort?.listOption as string}
										onValueChange={handleEffortSelection}
										className="bg-secondary hover:cursor-pointer z-50 rounded-md"
									>
										{/* todo add borders between options */}
										{effortType.map((item) => (
											<DropdownMenuRadioItem
												key={item.id}
												value={item.dropdownTitle}
												className="hover:cursor-pointer"
											>
												<div className="flex items-center space-x-2 p-3 z-10">
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
					Deleting the team will also permanently delete any issues associated
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
