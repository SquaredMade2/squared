"use client";

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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { getInitials } from "@/utils/formatting";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
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

	if (!isLoaded || !user) return null;

	return (
		<div className="md:w-3/4 w-full flex flex-col py-8 container gap-4">
			<div className="flex flex-col gap-2 items-start">
				<h1 className="text-2xl">Profile</h1>
				<p className="text-xs text-muted-foreground">
					Manage your Squared profile
				</p>
			</div>
			<Separator className="mb-8" />
			<div className="w-full">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="flex justify-start w-full lg:w-1/2">
							<FormItem className="flex flex-col items-start justify-center gap-2">
								<FormLabel>Profile picture</FormLabel>
								<Avatar className="size-32">
									<AvatarImage src={user.imageUrl} />
									<AvatarFallback className="text-3xl">
										{getInitials(`${user.firstName} ${user.lastName}`)}
									</AvatarFallback>
								</Avatar>
								<Input
									type="file"
									accept="image/*"
									onChange={handleImageUpload}
								/>
							</FormItem>
						</div>
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormDescription>
								{user.primaryEmailAddress?.emailAddress}
							</FormDescription>
						</FormItem>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem className="col-span-1">
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
									<FormItem className="col-span-1">
										<FormLabel>Last name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem className="col-span-1">
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
						</div>

						<Button type="submit" disabled={isUpdating}>
							{isUpdating ? "Updating..." : "Update"}
						</Button>
					</form>
				</Form>

				<Separator className="my-8" />

				<div className="space-y-4">
					<h2 className="text-xl">Account Information</h2>
					<p>
						Member Since:{" "}
						{user.createdAt && new Date(user.createdAt).toLocaleDateString()}
					</p>

					<h3 className="text-lg">Password</h3>
					<Button onClick={() => user.createPasswordResetFlow()}>
						Change Password
					</Button>

					<h3 className="text-lg mt-4">Connected Accounts</h3>
					<div className="flex gap-4">
						<Button
							onClick={() => user.connectAccount("oauth_google")}
							disabled={user.externalAccounts.some(
								(account) => account.provider === "google",
							)}
						>
							{user.externalAccounts.some(
								(account) => account.provider === "google",
							)
								? "Google Connected"
								: "Connect Google"}
						</Button>
						<Button
							onClick={() => user.connectAccount("oauth_github")}
							disabled={user.externalAccounts.some(
								(account) => account.provider === "github",
							)}
						>
							{user.externalAccounts.some(
								(account) => account.provider === "github",
							)
								? "GitHub Connected"
								: "Connect GitHub"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
