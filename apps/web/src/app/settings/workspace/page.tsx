"use client";

import { useState, useEffect } from "react";
import { useWorkspaceStore } from "@/store";
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useMetaData } from "@/utils/useMetaData";

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
});

export default function WorkspaceSettings() {
	const { currentWorkspace, deleteWorkspace, updateWorkspace } =
		useWorkspaceStore((state) => state);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isFormChanged, setIsFormChanged] = useState(false);
	const { toast } = useToast();

	if (!currentWorkspace) return null;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: currentWorkspace.name,
			url: currentWorkspace.url.replace("https://app.squaredmade.com/", ""),
		},
	});

	useEffect(() => {
		const subscription = form.watch((value, { name, type }) => {
			if (
				value.name !== currentWorkspace.name ||
				value.url !==
					currentWorkspace.url.replace("https://app.squaredmade.com/", "")
			) {
				setIsFormChanged(true);
			} else {
				setIsFormChanged(false);
			}
		});
		return () => subscription.unsubscribe();
	}, [form, currentWorkspace]);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const response = await updateWorkspace(currentWorkspace.id, {
				name: values.name,
				url: values.url,
			});
			toast(response);
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
		deleteWorkspace(currentWorkspace.id);
	};

	// Custom hook for metadata
	useMetaData("Workspace Settings", "Manage your workspace settings.");

	return (
		<div className="container mx-auto py-10 md:w-3/4 w-full ">
			<h1 className="text-3xl font-bold mb-2">Workspace</h1>
			<p className="text-muted-foreground mb-6">
				Manage your workspace settings
			</p>

			<div className="flex items-center space-x-4 mb-6">
				<Avatar className="size-28">
					<AvatarImage
						src={currentWorkspace.avatarUrl ?? ""}
						alt="Workspace Logo"
					/>
					<AvatarFallback className="text-5xl">
						{currentWorkspace.name[0]}
					</AvatarFallback>
				</Avatar>
				<div>
					<h2 className="text-xl font-semibold">{currentWorkspace.name}</h2>
					<p className="text-muted-foreground">{currentWorkspace.url}</p>
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
