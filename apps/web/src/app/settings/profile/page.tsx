"use client";

import { useState, type ReactElement } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { InputChangeEvent } from "types";
import ProfileImage from "@/components/ProfileImage";
import BlueButton from "@/components/BlueButton";
import { useAuthStore, useUserStore } from "@/storeZ";

export default function Profile(): ReactElement {
	const { toast } = useToast();
	const user = useAuthStore((state) => state.user);
	const updateUser = useUserStore((state) => state.updateUser);
	const getUser = useUserStore((state) => state.getUser);
	const [fullName, setFullName] = useState<string>(user?.name as string);
	const [username, setUsername] = useState<string>(user?.username as string);
	const prevFullname = user?.name;
	const prevUsername = user?.username;
	const valueChanged = fullName !== prevFullname || username !== prevUsername;

	const handleUpdate = async () => {
		if (username.trim().length <= 0 || fullName.trim().length <= 0) {
			return toast({
				title: "One or more fields can not be empty.",
				variant: "destructive",
			});
		}
		if (user) {
			if (valueChanged) {
				const data = { name: fullName, username, id: user?.id };
				await updateUser(user.id, data);
				getUser(user.id);
			}
		}
	};

	const handlefullNameChange = (e: InputChangeEvent): void => {
		const newValue = e.target.value;
		setFullName(newValue);
	};

	const handleUsernameChange = (e: InputChangeEvent): void => {
		const newValue = e.target.value;
		setUsername(newValue);
	};

	return (
		<div className="flex mdsm:flex-col bg-card h-screen min-h-screen w-full">
			<div className="flex flex-col h-full w-full items-center bg-background pt-20">
				<div className="w-1/3 mdsm:w-3/4">
					<div>
						<h1 className="text-2xl text-foreground mb-1 font-medium">
							Profile
						</h1>
						<p className="text-muted-foreground text-sm">
							Manage your Squared profile
						</p>
					</div>
					<span className="block w-full border-t border-border my-6" />
					<p className="text-foreground text-sm mb-1.5">Profile picture</p>
					<ProfileImage profileName={fullName} location="settings" />
					<div className="mb-6">
						<p className="text-foreground text-sm">Email</p>
						<p className="text-muted-foreground text-sm">{user?.email}</p>
					</div>
					<div className="mb-6">
						<p className="text-foreground text-sm">Full name</p>
						<input
							type="text"
							className="w-full border border-border rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-foreground py-1.5 px-3 text-sm mt-1.5 bg-background"
							value={fullName}
							onChange={handlefullNameChange}
						/>
					</div>
					<div className="mb-6">
						<div className="flex items-center">
							<p className="text-foreground text-sm">Username</p>
							<p className="text-muted-foreground font-normal text-xs ml-1">
								- Nickname or first name, however you want to be called in
								Squared
							</p>
						</div>
						<input
							type="text"
							className="w-full border border-border rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-foreground py-1.5 px-3 text-sm mt-1.5 bg-background"
							value={username}
							onChange={handleUsernameChange}
						/>
					</div>
					<div
						className={
							valueChanged
								? "opacity-100 transition-all duration-300 ease-in-out"
								: "opacity-0 transition-all duration-300 ease-in-out"
						}
					>
						<BlueButton description="Update" handleAction={handleUpdate} />
					</div>
				</div>
			</div>
		</div>
	);
}
