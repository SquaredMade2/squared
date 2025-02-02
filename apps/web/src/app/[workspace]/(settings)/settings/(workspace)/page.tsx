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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { workspaceService } from "@/lib/services";
import { useUserStore, useWorkspaceStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { TODO } from "@squared/context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	name: z.string().min(2, {
		message: "Workspace name must be at least 2 characters.",
	}),
	url: z
		.string()
		.min(1, {
			message: "Workspace URL is required.",
		})
		.regex(/^[a-zA-Z0-9-]+$/, {
			message: "URL can only contain letters, numbers, and hyphens.",
		}),
	viewPage: z.string().trim().optional(),
});

export default function WorkspaceSettings() {
	const { deleteWorkspace, updateWorkspace } = useWorkspaceStore(
		(state) => state,
	);
	const { workspace, workspaces, loading: workspaceLoading } = useWorkspaces();
	const { user } = useUserStore((state) => state);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isFormChanged, setIsFormChanged] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const defaultPages = ["all", "active", "my", "backlog", "sprint"];
	const defaultSelect =
		workspace?.defaultView === "sprints/current"
			? "sprint"
			: workspace?.defaultView;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: workspace?.name,
			url: workspace?.url.replace("https://app.squaredmade.com/", ""),
		},
	});

	const { watch, setValue } = form;

	const updateValues = () => {
		if (workspace) {
			setValue("name", workspace.name);
			setValue(
				"url",
				workspace.url.replace("https://app.squaredmade.com/", ""),
			);
		}
	};

	useEffect(() => {
		if (!workspace) return;

		//on a page refresh the form values are blank. This is a quick fix for it to reupdate the values.
		if (
			form.getValues("name") !== workspace.name ||
			form.getValues("url") !==
				workspace.url.replace("https://app.squaredmade.com/", "")
		) {
			updateValues();
		}
		const subscription = watch((value) => {
			if (
				value.name !== workspace.name ||
				value.url !==
					workspace.url.replace("https://app.squaredmade.com/", "") ||
				value.viewPage
			) {
				setIsFormChanged(true);
			} else {
				setIsFormChanged(false);
			}
		});

		return () => subscription.unsubscribe();
	}, [watch, workspace]);

	if (!workspace || !workspaces) return null;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		let defaultView: string | null = null;
		if (values.viewPage) {
			defaultView = `${values.viewPage !== "sprint" ? values.viewPage : "sprints/current"}`;
		}
		try {
			const updatedWorkspace = await workspaceService.updateWorkspace(TODO, {
				workspaceId: workspace.id,
				workspace: { name: values.name, url: values.url, defaultView },
			});
			updateWorkspace(updatedWorkspace);

			toast({ title: "Workspace updated successfully" });
			setIsFormChanged(false);
		} catch (error) {
			console.error("Error updating workspace:", error);
			toast({
				title: "Internal server error",
				variant: "destructive",
			});
		}
	};

	const handleDelete = async () => {
		setIsDeleting(true);
		deleteWorkspace(workspace.id);
		if (user) {
			if (workspaces.length > 0) {
				router.replace(`/${workspaces[0].id}`);
			} else {
				router.replace("/join");
			}
		}
	};

	if (workspaceLoading)
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
		<div className="container mx-auto w-full py-10 md:w-3/4 ">
			<h1 className="mb-2 font-bold text-3xl">Workspace</h1>
			<p className="mb-6 text-muted-foreground">
				Manage your workspace settings
			</p>

			<div className="mb-6 flex items-center space-x-4">
				<Avatar className="size-28">
					<AvatarImage src={workspace.avatarUrl ?? ""} alt="Workspace Logo" />
					<AvatarFallback className="text-5xl">
						{workspace.name[0]}
					</AvatarFallback>
				</Avatar>
				<div>
					<h2 className="font-semibold text-xl">{workspace.name}</h2>
					<p className="text-muted-foreground">{workspace.url}</p>
				</div>
			</div>

			<Separator className="my-6" />

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							defaultValue={""}
							name="name"
							render={({ field }) => (
								<FormItem className="col-span-1">
									<FormLabel>Workspace Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							defaultValue={""}
							name="url"
							render={({ field }) => (
								<FormItem className="col-span-1">
									<FormLabel>Workspace URL</FormLabel>
									<FormControl>
										<div className="flex">
											<span className="mr-0 inline-flex items-center rounded-l-md border border-input border-r-0 bg-transparent px-3 pr-0 text-muted-foreground text-sm">
												https://app.squaredmade.com/
											</span>
											<Input
												{...field}
												className="ml-0 rounded-l-none border-l-0 pl-0 focus-visible:ring-0 focus-visible:ring-offset-0"
											/>
										</div>
									</FormControl>
									<FormDescription>
										This is your workspace's unique URL on our platform.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* NOTE: The following select fields should only be accessable to workspace admins. This section needs to be updated as soon as admin roles are implemented. */}
						<div className="col-span-2">
							<FormField
								control={form.control}
								name="viewPage"
								render={({ field }) => (
									<FormItem className="col-span-1 mb-2">
										<FormLabel>Set Workspace View</FormLabel>
										<FormControl>
											<Select
												onValueChange={(value) => {
													field.onChange(value);
												}}
												value={field.value}
												defaultValue={defaultSelect ? defaultSelect : ""}
											>
												<SelectTrigger className="w-[180px]">
													<SelectValue placeholder="Select a page" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														{defaultPages.map((page: string) => {
															return (
																<SelectItem
																	key={page}
																	value={page}
																>{`${page.replace(/^./, (char) => char.toUpperCase())} Tasks`}</SelectItem>
															);
														})}
													</SelectGroup>
												</SelectContent>
											</Select>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormDescription>
								Set the default page users of a workspace will load into <br />
								<small className="text-xs">
									*If Sprints is disabled, default view will fall back to{" "}
									<strong>All Tasks</strong>
								</small>
							</FormDescription>
						</div>
					</div>
					<Button type="submit" disabled={!isFormChanged}>
						Update
					</Button>
				</form>
			</Form>

			<Separator className="my-6" />

			<div className="rounded-lg bg-destructive/10 p-6">
				<h2 className="mb-4 font-semibold text-xl">Delete Workspace</h2>
				<p className="mb-4 text-muted-foreground">
					Permanently delete your workspace and all of its contents from the
					platform. This action is not reversible, so please continue with
					caution.
				</p>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant="destructive">Delete Workspace</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your
								workspace and remove your data from our servers.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
								onClick={handleDelete}
							>
								{isDeleting ? "Deleting..." : "Yes, delete workspace"}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
}
