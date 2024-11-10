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
import { useAuthStore, useUserStore } from "@/store";
import { getInitials } from "@/utils/formatting";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	fullName: z.string().min(1, "Full name is required"),
	username: z.string().min(1, "Username is required"),
});

export default function Profile() {
	const { toast } = useToast();
	const { user } = useAuthStore((state) => state);
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
				username: user.username ?? "",
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
						<div className="flex justify-start w-full lg:w-1/2">
							<FormItem className="flex flex-col items-start justify-center gap-2">
								<FormLabel>Profile picture</FormLabel>
								<Avatar className="size-32">
									<AvatarImage src={user.avatarUrl ?? undefined} />
									<AvatarFallback className="text-3xl">
										{getInitials(user.name)}
									</AvatarFallback>
								</Avatar>
							</FormItem>
						</div>
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormDescription>{user.email}</FormDescription>
						</FormItem>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<FormField
								control={form.control}
								name="fullName"
								render={({ field }) => (
									<FormItem className="col-span-1">
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
									<FormItem className="col-span-1">
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormDescription>
											Nickname or first name, however you want to be called in
											Squared
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<Button type="submit">Update</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
