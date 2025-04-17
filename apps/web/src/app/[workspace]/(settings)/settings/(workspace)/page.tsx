"use client";

import ImageUpload from "@/components/ImageUpload";
import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { client } from "@/lib/client";
import { parseError } from "@/utils/parseError";
import { Protect, useOrganization, useOrganizationList } from "@clerk/nextjs";
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
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useForm,
} from "@squaredmade/ui/form";
import { zodResolver } from "@squaredmade/ui/form/resolvers";
import { Input } from "@squaredmade/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@squaredmade/ui/select";
import { Separator } from "@squaredmade/ui/separator";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
	const { workspace } = useWorkspaces();
	const [isFormChanged, setIsFormChanged] = useState(false);
	const router = useRouter();
	const { membership, organization } = useOrganization();
	const { userMemberships } = useOrganizationList({ userMemberships: true });

	const defaultPages = ["all", "active", "my", "backlog", "sprint"];
	const defaultSelect =
		workspace?.defaultView === "sprints/current"
			? "sprint"
			: workspace?.defaultView;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: organization?.name,
			url: workspace?.url.replace("https://app.squaredmade.com/", ""),
		},
	});

	const hasDomainManagePermission = membership?.permissions.includes(
		"org:sys_domains:manage",
	);

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

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && organization) {
			try {
				await organization.setLogo({ file });
				toast.success("Profile picture updated successfully.");
			} catch {
				toast.error("Failed to update profile picture. Please try again.");
			}
		}
	};

	useEffect(() => {
		if (!workspace) return;

		//on a page refresh the form values are blank. This is a quick fix for it to reupdate the values.
		if (
			form.getValues("name") !== workspace.name ||
			(form.getValues("url") !==
				workspace.url.replace("https://app.squaredmade.com/", "") &&
				hasDomainManagePermission)
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

	const { mutate: updateWorkspace, isPending: updatingWorkspace } = useMutation(
		{
			mutationKey: ["workspace", "updateWorkspace", organization?.id],
			mutationFn: async (values: z.infer<typeof formSchema>) => {
				let defaultView: string | null = null;
				if (!organization) throw new Error("Workspace not found");
				if (values.viewPage) {
					defaultView = `${values.viewPage !== "sprint" ? values.viewPage : "sprints/current"}`;
				}
				const [updatedWorkspace] = await Promise.all([
					client.workspace.updateWorkspace
						.$post({
							workspaceId: organization.id,
							workspace: { name: values.name, url: values.url, defaultView },
						})
						.then((res) => res.json()),
					organization.update({ name: values.name, slug: values.url }),
				]);
				return updatedWorkspace;
			},
			onSuccess: (updatedWorkspace) => {
				updateWorkspace(updatedWorkspace);
				toast.success("Workspace updated successfully");
				setIsFormChanged(false);
			},
			onError: (error) => {
				toast.error("Error updating workspace", {
					description: parseError(error),
				});
			},
		},
	);

	const { mutate: deleteWorkspace, isPaused: isDeleting } = useMutation({
		mutationKey: ["workspace", "deleteWorkspace", organization?.id],
		mutationFn: async () => {
			if (!organization) throw new Error("Workspace not found");
			await client.workspace.deleteWorkspace.$post({
				workspaceId: organization.id,
			});
		},
		onSuccess: () => {
			toast.success("Workspace deleted successfully");
			if (userMemberships.data?.[0].organization.slug) {
				router.replace(`/${userMemberships.data?.[0].organization.slug}`);
			} else {
				router.replace("/create");
			}
		},
		onError: (error) => {
			toast.error("Error deleting workspace", {
				description: parseError(error),
			});
		},
	});

	if (updatingWorkspace)
		return (
			<div className="container mx-auto mb-16 w-2/3 space-y-6 p-4">
				<h1 className="mb-2 font-bold text-3xl">Workspace Settings</h1>
				<p className="mb-6 text-muted-foreground">Manage workspace settings</p>
				<div className="flex h-64 w-full items-center justify-center">
					<SquaredLoader />
				</div>
			</div>
		);

	if (!organization) return null;

	return (
		<div className="container mx-auto w-full py-10 md:w-3/4 ">
			<h1 className="mb-2 font-bold text-3xl">Workspace</h1>
			<p className="mb-6 text-muted-foreground">
				Manage your workspace settings
			</p>

			<div className="mb-6 flex items-center space-x-4">
				<ImageUpload
					alt="Workspace Logo"
					fallbackText={organization.name[0]}
					handleImageUpload={handleImageUpload}
					imageUrl={organization.imageUrl}
				/>
				<div>
					<h2 className="font-semibold text-xl">{organization.name}</h2>
					<p className="text-muted-foreground">{organization.slug}</p>
				</div>
			</div>

			<Separator className="my-6" />

			<Form {...form} onSubmit={updateWorkspace} className="space-y-8">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<FormField
						control={form.control}
						// TODO: Add this prop to the form component
						// defaultValue={""}
						name="name"
						render={({ field }) => (
							<FormItem className="col-span-1">
								<FormLabel>Workspace Name</FormLabel>
								<FormControl>
									{hasDomainManagePermission ? (
										<Input {...field} />
									) : (
										<div className="rounded-md border border-input px-3 py-2">
											{organization?.name}
										</div>
									)}
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						// TODO: Add this prop to the form component
						// defaultValue={""}
						name="url"
						render={({ field }) => (
							<FormItem className="col-span-1">
								<FormLabel>Workspace URL</FormLabel>
								<FormControl>
									<div className="flex">
										{hasDomainManagePermission ? (
											<>
												<span className="mr-0 inline-flex items-center rounded-l-md border border-input border-r-0 bg-transparent px-3 pr-0 text-muted-foreground text-sm">
													https://app.squaredmade.com/
												</span>
												<Input
													{...field}
													className="ml-0 rounded-l-none border-l-0 pl-0 focus-visible:ring-0 focus-visible:ring-offset-0"
												/>
											</>
										) : (
											<div className="rounded-md border border-input px-3 py-2">
												{" "}
												https://app.squaredmade.com/
												{workspace?.url.replace(
													"https://app.squaredmade.com/",
													"",
												)}
											</div>
										)}
									</div>
								</FormControl>
								<FormDescription>
									This is your workspace's unique URL on our platform.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="col-span-2">
						{/* NOTE: The following select fields should only be accessable to workspace admins. This section needs to be updated as soon as admin roles are implemented. */}
						<div className="col-span-2">
							<FormField
								control={form.control}
								name="viewPage"
								render={({ field }) => (
									<FormItem className="col-span-1 mb-2">
										<FormLabel>Set Workspace View</FormLabel>
										<FormControl>
											{hasDomainManagePermission ? (
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
											) : (
												<div>{field.value}</div>
											)}
										</FormControl>
										<FormDescription>
											Set the default page users of a workspace will load into{" "}
											<br />
											<small className="text-xs">
												*If Sprints is disabled, default view will fall back to{" "}
												<strong>All Tasks</strong>
											</small>
										</FormDescription>
									</FormItem>
								)}
							/>
						</div>
					</div>
				</div>
				<Protect permission="org:sys_domains:manage">
					<Button type="submit" disabled={!isFormChanged}>
						Update
					</Button>
				</Protect>
			</Form>

			<Protect permission="org:sys_profile:delete">
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
									This action cannot be undone. This will permanently delete
									your workspace and remove your data from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
									onClick={() => deleteWorkspace()}
								>
									{isDeleting ? "Deleting..." : "Yes, delete workspace"}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</Protect>
		</div>
	);
}
