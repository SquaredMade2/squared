"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore, useWorkspaceStore } from "@/storeZ/provider";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
	const [loading, setLoading] = useState<boolean>(true);
	const [data, setData] = useState({ email: "", password: "" });
	const router = useRouter();
	const { toast } = useToast();
	const { user, login } = useAuthStore().getState();
	const { getWorkspace, getAllWorkspaces, workspaces, currentWorkspace } =
		useWorkspaceStore().getState();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await login({
				provider: "credentials",
				type: "login",
				email: data.email,
				password: data.password,
			});
			console.log("Response:", response);

			if (response?.user) {
				toast({ title: "Login Successful, Welcome!" });

				if (response.user.defaultWorkspaceId) {
					const workspace = await getWorkspace(
						response.user.defaultWorkspaceId,
					);
					if (workspace?.url) {
						router.push(`/${workspace.url}`);
					}
				} else {
					const workspaces = await getAllWorkspaces(response.user.id);
					if (workspaces?.length) {
						router.push(`/${workspaces[0].url}`);
					} else {
						router.push("/join");
					}
				}
			} else {
				if (response) {
					toast({
						title: response.message,
						variant: response.variant,
					});
				} else {
					toast({ title: "Login failed", variant: "destructive" });
				}
			}
		} catch (error) {
			toast({ title: "Login failed", variant: "destructive" });
		}
	};

	const handleRegisterPush = () => {
		router.push("/register");
	};

	useEffect(() => {
		if (user) {
			const checkUserWorkspaces = async () => {
				setLoading(true);
				if (user.defaultWorkspaceId) {
					const workspace = await getWorkspace(user.defaultWorkspaceId);
					if (workspace?.url) {
						router.push(`/${workspace.url}`);
					}
				} else {
					const workspaces = await getAllWorkspaces(user.id);
					if (workspaces?.length) {
						router.push(`/${workspaces[0].url}`);
					} else {
						router.push("/join");
					}
				}
				setLoading(false);
			};

			checkUserWorkspaces();
		} else {
			setLoading(false);
		}
	}, []);

	return (
		<div className="top-0 w-full flex items-center justify-center h-[100vh]">
			{!loading && (
				<Card className="w-5/6 lg:w-1/3 bg-gradient-to-b from-primary/10 to-bg-card">
					<CardHeader>
						<CardTitle className="uppercase">Sign in to your account</CardTitle>
					</CardHeader>
					<CardContent>
						<form className="mt-10 space-y-6" onSubmit={handleLogin}>
							<div className="flex flex-col gap-3">
								<Label htmlFor="email">Email address</Label>
								<Input
									type="email"
									value={data.email}
									onChange={(e) => setData({ ...data, email: e.target.value })}
								/>
							</div>
							<div className="flex flex-col gap-3">
								<Label htmlFor="password">Password</Label>
								<Input
									type="password"
									value={data.password}
									onChange={(e) =>
										setData({ ...data, password: e.target.value })
									}
								/>
							</div>
							<Button type="submit" className="w-full">
								Sign in
							</Button>
						</form>
					</CardContent>
					<CardFooter className="text-center">
						Not a member?{" "}
						<Button onClick={handleRegisterPush} variant={"link"}>
							Sign up for free
						</Button>
					</CardFooter>
				</Card>
			)}
		</div>
	);
}
