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
	SelectLabel,
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
	"default-view": z.string().trim(),
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

	console.log(workspace);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: workspace?.name || "",
			url: workspace?.url.replace("https://app.squaredmade.com/", "") || "",
		},
	});

	useEffect(() => {
		if (!workspace) return;

		const subscription = form.watch((value) => {
			if (
				value.name !== workspace.name ||
				value.url !== workspace.url.replace("https://app.squaredmade.com/", "")
			) {
				setIsFormChanged(true);
			} else {
				setIsFormChanged(false);
			}
		});

		return () => subscription.unsubscribe();
	}, [form, workspace]);

	if (!workspace) return null;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const updatedWorkspace = await workspaceService.updateWorkspace(TODO, {
				workspaceId: workspace.id,
				workspace: { name: values.name, url: values.url },
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
		await deleteWorkspace(workspace.id);
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
			<div className="container mx-auto p-4 w-2/3 space-y-6 mb-16">
				<h1 className="text-3xl font-bold mb-2">Team Settings</h1>
				<p className="text-muted-foreground mb-6">Manage team settings</p>
				<div className="flex justify-center items-center w-full h-64">
					<SquaredLoader />
				</div>
			</div>
		);

	return (
		<div className="container mx-auto py-10 md:w-3/4 w-full ">
			<h1 className="text-3xl font-bold mb-2">Workspace</h1>
			<p className="text-muted-foreground mb-6">
				Manage your workspace settings
			</p>

			<div className="flex items-center space-x-4 mb-6">
				<Avatar className="size-28">
					<AvatarImage src={workspace.avatarUrl ?? ""} alt="Workspace Logo" />
					<AvatarFallback className="text-5xl">
						{workspace.name[0]}
					</AvatarFallback>
				</Avatar>
				<div>
					<h2 className="text-xl font-semibold">{workspace.name}</h2>
					<p className="text-muted-foreground">{workspace.url}</p>
				</div>
			</div>

			<Separator className="my-6" />

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							control={form.control}
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
							name="url"
							render={({ field }) => (
								<FormItem className="col-span-1">
									<FormLabel>Workspace URL</FormLabel>
									<FormControl>
										<div className="flex">
											<span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-transparent text-sm mr-0 pr-0 text-muted-foreground">
												https://app.squaredmade.com/
											</span>
											<Input
												{...field}
												className="rounded-l-none border-l-0 ml-0 pl-0 focus-visible:ring-offset-0 focus-visible:ring-0"
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
						<FormField
							control={form.control}
							name="default-view"
							render={() => (
								<FormItem>
									<FormLabel>Set Workspace View</FormLabel>
									<FormControl>
										{/* <Select>
											<SelectTrigger className="w-[180px]">
												<SelectValue placeholder="Select a team" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>Teams</SelectLabel>
													{workspace.teams.map((team) => <SelectItem>{team}</SelectItem>)}
													<SelectItem value="apple">Apple</SelectItem>
													<SelectItem value="banana">Banana</SelectItem>
													<SelectItem value="blueberry">Blueberry</SelectItem>
													<SelectItem value="grapes">Grapes</SelectItem>
													<SelectItem value="pineapple">Pineapple</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select> */}
										<Select>
											<SelectTrigger className="w-[180px]">
												<SelectValue placeholder="Select a page" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>Pages</SelectLabel>
													<SelectItem value="apple">Apple</SelectItem>
													<SelectItem value="banana">Banana</SelectItem>
													<SelectItem value="blueberry">Blueberry</SelectItem>
													<SelectItem value="grapes">Grapes</SelectItem>
													<SelectItem value="pineapple">Pineapple</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
					<Button type="submit" disabled={!isFormChanged}>
						Update
					</Button>
				</form>
			</Form>

			<Separator className="my-6" />

			<div className="bg-destructive/10 p-6 rounded-lg">
				<h2 className="text-xl font-semibold mb-4">Delete Workspace</h2>
				<p className="text-muted-foreground mb-4">
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
