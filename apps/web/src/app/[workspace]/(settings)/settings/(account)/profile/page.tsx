"use client";

import ImageUpload from "@/components/ImageUpload";
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
import { client } from "@/lib/client";
import { getInitials } from "@/utils/formatting";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import * as z from "zod";

const formSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	username: z.string().min(1, "Username is required"),
});

export default function Profile() {
	const { toast } = useToast();
	const { user, isLoaded } = useUser();
	const router = useRouter();
	const [isUpdating, setIsUpdating] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			username: "",
		},
	});

	useEffect(() => {
		if (isLoaded && user) {
			form.reset({
				firstName: user.firstName ?? "",
				lastName: user.lastName ?? "",
				username: user.username ?? "",
			});
		}
	}, [isLoaded, user, form]);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (!user) return;

		setIsUpdating(true);
		try {
			await user.update({
				firstName: values.firstName,
				lastName: values.lastName,
				username: values.username,
			});

			toast({
				title: "Profile updated",
				description: "Your profile information has been successfully updated.",
			});
			router.refresh();
		} catch {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to update profile. Please try again.",
			});
		} finally {
			setIsUpdating(false);
		}
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && user) {
			try {
				await user.setProfileImage({ file });
				toast({
					title: "Success",
					description: "Profile picture updated successfully.",
				});
			} catch {
				toast({
					variant: "destructive",
					title: "Error",
					description: "Failed to update profile picture. Please try again.",
				});
			}
		}
	};

	const { mutate: markAsDeleted, isPaused: isDeleting } = useMutation({
		mutationFn: async (userId: string) => {
			return client.user.markAsDeleted.$post({ userId });
		},
		onSuccess: () => {
			console.log("User successfully marked as deleted!");
		},
		onError: (err) => {
			console.error("Error deleting user:", err);
		},
	});

	const handleDelete = () => {
		markAsDeleted(user?.id || "");
		user?.delete();
	};

	if (!isLoaded || !user) return null;

	return (
		<div className="container py-10">
			<div className="mx-auto max-w-4xl space-y-8">
				<div>
					<h1 className="font-bold text-3xl">Profile</h1>
					<p className="text-muted-foreground">Manage your Squared profile</p>
				</div>
				<Separator />
				<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
					<div className="md:col-span-2">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6"
							>
								<div className="space-y-4">
									<h2 className="font-semibold text-xl">
										Personal Information
									</h2>
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="firstName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>First name</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="lastName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Last name</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<FormField
										control={form.control}
										name="username"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Username</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormDescription>
													How you want to be called in Squared
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormDescription>
											{user.primaryEmailAddress?.emailAddress}
										</FormDescription>
									</FormItem>
								</div>
								<Button type="submit" disabled={isUpdating}>
									{isUpdating ? "Updating..." : "Update Profile"}
								</Button>
							</form>
						</Form>
					</div>
					<div>
						<div className="flex flex-col items-center space-y-4">
							<h2 className="text-center font-semibold text-xl">
								Profile Picture
							</h2>
							<ImageUpload
								alt="User Avatar"
								fallbackText={getInitials(`${user.firstName} ${user.lastName}`)}
								handleImageUpload={handleImageUpload}
								imageUrl={user.imageUrl}
							/>
						</div>
					</div>
				</div>
				<Separator />
				<div className="space-y-6">
					<h2 className="font-semibold text-xl">Account Information</h2>
					<p>
						Member Since:{" "}
						{user.createdAt && new Date(user.createdAt).toLocaleDateString()}
					</p>
				</div>
				<div className="rounded-lg bg-destructive/10 p-6">
					<h2 className="mb-4 font-semibold text-xl">Delete Account</h2>
					<p className="mb-4 text-muted-foreground">
						Permanently delete your account and all of its contents from the
						platform. This action is not reversible, so please continue with
						caution.
					</p>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="destructive">Delete Account</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete
									your account and remove your data from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
									onClick={handleDelete}
								>
									{isDeleting ? "Deleting..." : "Yes, delete account"}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>
		</div>
	);
}
