"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import ProfileImage from "@/components/ProfileImage";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthStore, useUserStore } from "@/storeZ";
import type { User } from "@repo/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/formatting";

const formSchema = z.object({
	fullName: z.string().min(1, "Full name is required"),
	username: z.string().min(1, "Username is required").nullable(),
});

export default function Profile() {
	const { toast } = useToast();
	const { user: authUser } = useAuthStore((state) => state);
	const [user, setUser] = useState<User | null>(authUser);
	const { updateUser } = useUserStore((state) => state);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fullName: user?.name || "",
			username: user?.username || "",
		},
	});

	useEffect(() => {
		if (user) {
			form.reset({
				fullName: user.name,
				username: user.username,
			});
		}
	}, [user, form]);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (!user) return;

		const { fullName, username } = values;
		if (fullName.trim() === user.name && username?.trim() === user.username) {
			return toast({
				title: "No changes detected",
				description: "Your profile information remains the same.",
			});
		}

		const data = {
			name: fullName.trim(),
			username: username?.trim(),
			id: user.id,
		};
		await updateUser(user.id, data);
		toast({
			title: "Profile updated",
			description: "Your profile information has been successfully updated.",
		});
	};

	if (!user) return null;

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
						<FormItem className="flex items-center w-full lg:w-1/2 justify-between">
							<FormLabel>Profile picture</FormLabel>
							<Avatar className="size-32">
								<AvatarImage src={user.avatarUrl ?? undefined} />
								<AvatarFallback className="text-3xl">
									{getInitials(user.name)}
								</AvatarFallback>
							</Avatar>
						</FormItem>
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormDescription>{user.email}</FormDescription>
						</FormItem>
						<FormField
							control={form.control}
							name="fullName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full name</FormLabel>
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
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input
											{...field}
											value={field.value ?? ""}
											onChange={(e) => field.onChange(e.target.value)}
										/>
									</FormControl>
									<FormDescription>
										Nickname or first name, however you want to be called in
										Squared
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Update</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
