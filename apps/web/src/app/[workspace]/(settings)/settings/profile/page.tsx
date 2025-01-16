"use client";

import { GoogleIcon } from "@/components/Svg";
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
import { Github } from "lucide-react";
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
			await user.createExternalAccount({
				strategy,
				redirectUrl: window.location.href,
			});
			toast({
				title: "Account connected",
				description: `Successfully connected your ${
					strategy === "oauth_google" ? "Google" : "GitHub"
				} account.`,
			});
		} catch {
			toast({
				variant: "destructive",
				title: "Error",
				description: `Failed to connect ${
					strategy === "oauth_google" ? "Google" : "GitHub"
				} account. Please try again.`,
			});
		}
	};

	const handleDisconnectAccount = async (strategy: "google" | "github") => {
		if (!user) return;

		const externalAccount = user.externalAccounts.find(
			(account) => account.provider === strategy,
		);

		if (!externalAccount) {
			toast({
				variant: "destructive",
				title: "Error",
				description: `No ${
					strategy === "google" ? "Google" : "GitHub"
				} account found.`,
			});
			return;
		}

		try {
			await externalAccount.destroy();
			toast({
				title: "Account disconnected",
				description: `Successfully disconnected your ${
					strategy === "google" ? "Google" : "GitHub"
				} account.`,
			});
		} catch {
			toast({
				variant: "destructive",
				title: "Error",
				description: `Failed to disconnect ${
					strategy === "google" ? "Google" : "GitHub"
				} account. Please try again.`,
			});
		}
	};

	if (!isLoaded || !user) return null;

	return (
		<div className="container py-10">
			<div className="max-w-4xl mx-auto space-y-8">
				<div>
					<h1 className="text-3xl font-bold">Profile</h1>
					<p className="text-muted-foreground">Manage your Squared profile</p>
				</div>
				<Separator />
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="md:col-span-2">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6"
							>
								<div className="space-y-4">
									<h2 className="text-xl font-semibold">
										Personal Information
									</h2>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
						<div className="space-y-4">
							<h2 className="text-xl font-semibold text-center">
								Profile Picture
							</h2>
							<div className="flex flex-col items-center space-y-4">
								<Avatar className="w-32 h-32">
									<AvatarImage src={user.imageUrl} />
									<AvatarFallback className="text-4xl">
										{getInitials(`${user.firstName} ${user.lastName}`)}
									</AvatarFallback>
								</Avatar>
								<Input
									type="file"
									accept="image/*"
									onChange={handleImageUpload}
									className="max-w-[200px]"
								/>
							</div>
						</div>
					</div>
				</div>
				<Separator />
				<div className="space-y-6">
					<h2 className="text-xl font-semibold">Account Information</h2>
					<p>
						Member Since:{" "}
						{user.createdAt && new Date(user.createdAt).toLocaleDateString()}
					</p>
					<div>
						<h3 className="text-lg font-medium mb-4">Connected Accounts</h3>
						<div className="flex flex-wrap gap-4">
							{user.externalAccounts.some(
								(account) => account.provider === "google",
							) ? (
								<Button
									variant="outline"
									className="flex items-center gap-2"
									onClick={() => handleDisconnectAccount("google")}
								>
									<GoogleIcon />
									<span>Disconnect Google</span>
								</Button>
							) : (
								<Button
									variant="outline"
									className="flex items-center gap-2"
									onClick={() => handleConnectAccount("oauth_google")}
								>
									<GoogleIcon />
									<span>Connect Google</span>
								</Button>
							)}
							{user.externalAccounts.some(
								(account) => account.provider === "github",
							) ? (
								<Button
									variant="outline"
									className="flex items-center gap-2"
									onClick={() => handleDisconnectAccount("github")}
								>
									<Github className="w-4 h-4" />
									<span>Disconnect GitHub</span>
								</Button>
							) : (
								<Button
									variant="outline"
									className="flex items-center gap-2"
									onClick={() => handleConnectAccount("oauth_github")}
								>
									<Github className="w-4 h-4" />
									<span>Connect GitHub</span>
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
