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

	const handleConnectAccount = async (
		strategy: "oauth_google" | "oauth_github",
	) => {
		if (!user) return;
		try {
			await user.createExternalAccount({ strategy });
			toast({
				title: "Account connected",
				description: `Successfully connected your ${strategy === "oauth_google" ? "Google" : "GitHub"} account.`,
			});
		} catch {
			toast({
				variant: "destructive",
				title: "Error",
				description: `Failed to connect ${strategy === "oauth_google" ? "Google" : "GitHub"} account. Please try again.`,
			});
		}
	};

	const handleDisconnectAccount = async (
		strategy: "oauth_google" | "oauth_github",
	) => {
		if (!user) return;

		// Find the external account for the given strategy
		const externalAccount = user.externalAccounts.find(
			(account) => account.provider.split("_")[1] === strategy,
		);

		if (!externalAccount) {
			toast({
				variant: "destructive",
				title: "Error",
				description: `No ${strategy === "oauth_google" ? "Google" : "GitHub"} account found.`,
			});
			return;
		}

		try {
			// Call the destroy method on the specific external account to disconnect it
			await externalAccount.destroy();
			toast({
				title: "Account disconnected",
				description: `Successfully disconnected your ${strategy === "oauth_google" ? "Google" : "GitHub"} account.`,
			});
		} catch {
			toast({
				variant: "destructive",
				title: "Error",
				description: `Failed to disconnect ${strategy === "oauth_google" ? "Google" : "GitHub"} account. Please try again.`,
			});
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

					<h3 className="text-lg mt-4">Connected Accounts</h3>
					<div className="flex gap-4">
						{user.externalAccounts.some(
							(account) => account.provider === "google",
						) ? (
							<Button onClick={() => handleDisconnectAccount("oauth_google")}>
								Reauthorize Google
							</Button>
						) : (
							<Button onClick={() => handleConnectAccount("oauth_google")}>
								Connect Google
							</Button>
						)}
						{user.externalAccounts.some(
							(account) => account.provider === "github",
						) ? (
							<Button onClick={() => handleDisconnectAccount("oauth_github")}>
								Reauthorize GitHub
							</Button>
						) : (
							<Button onClick={() => handleConnectAccount("oauth_github")}>
								Connect GitHub
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
