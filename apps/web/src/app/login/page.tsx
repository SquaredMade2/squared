"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore, useWorkspaceStore } from "@/storeZ/provider";
import axios from "axios";

export default function Login() {
	const [loading, setLoading] = useState<boolean>(true);
	const [data, setData] = useState({ email: "", password: "" });
	const router = useRouter();
	const { toast } = useToast();
	const { user, login } = useAuthStore();
	const { getWorkspace, getAllWorkspaces, workspaces, currentWorkspace } =
		useWorkspaceStore();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await login({
				provider: "credentials",
				type: "login",
				email: data.email,
				password: data.password,
			});

			if (response?.user) {
				toast({ title: "Login Successful, Welcome!" });

				if (response.user.defaultWorkspaceId) {
					const workspace = await getWorkspace(
						response.user.defaultWorkspaceId,
					)({ workspaces, currentWorkspace });
					if (workspace?.url) {
						router.push(`/${workspace.url}`);
					}
				} else {
					const workspaces = await getAllWorkspaces(response.user.id);
					if (workspaces?.length) {
						router.push(`/${workspaces[0].url}`);
					} else {
						toast({
							title: "No workspace found for redirection.",
							variant: "destructive",
						});
					}
				}
			} else {
				toast({ title: "Login failed", variant: "destructive" });
			}
		} catch (error) {
			console.error(error);
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
					const workspace = await getWorkspace(user.defaultWorkspaceId)({
						workspaces,
						currentWorkspace,
					});
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
	}, [user, router, getWorkspace, getAllWorkspaces]);

	return (
		<div className="top-0 w-full flex items-center h-[100vh] bg-[#141414]">
			{!loading && (
				<div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-14 max-w-fit mx-auto bg-gradient-to-b from-[#17181c] to-[#23293b] align-middle rounded-lg">
					<h2 className="uppercase text-[#D8D8D8] mt-8 text-center text-4xl xs:text-2xl font-bold leading-9 tracking-tight">
						Sign in to your account
					</h2>
					<form className="mt-10 space-y-6" onSubmit={handleLogin}>
						<div>
							<label
								htmlFor="email"
								className="text-[#D8D8D8] block text-sm font-medium"
							>
								Email address
							</label>
							<input
								type="email"
								value={data.email}
								onChange={(e) => setData({ ...data, email: e.target.value })}
								className="bg-[#282E43] text-[#D8D8D8] block w-full rounded-md border-0 pl-3 py-3"
							/>
						</div>
						<div>
							<label
								htmlFor="password"
								className="text-[#D8D8D8] block text-sm font-medium"
							>
								Password
							</label>
							<input
								type="password"
								value={data.password}
								onChange={(e) => setData({ ...data, password: e.target.value })}
								className="bg-[#282E43] text-[#D8D8D8] block w-full rounded-md border-0 pl-3 py-3"
							/>
						</div>
						<div>
							<button
								type="submit"
								className="flex w-full justify-center rounded-md bg-[#174EFF] px-3 py-2 text-sm font-semibold text-foreground"
							>
								Sign in
							</button>
						</div>
					</form>
					<p className="mt-10 text-center text-sm text-gray-500">
						Not a member?{" "}
						<button
							type="button"
							onClick={handleRegisterPush}
							className="font-semibold text-[#5d76c9] hover:text-indigo-500"
						>
							Sign up for free
						</button>
					</p>
				</div>
			)}
		</div>
	);
}
