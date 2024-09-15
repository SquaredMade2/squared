"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore, useWorkspaceStore } from "@/store";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
import { setCookie } from "nookies";

function LoginForm() {
	const [data, setData] = useState({ email: "", password: "" });
	const [hidePassword, setHidePassword] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { toast } = useToast();
	const { login } = useAuthStore((state) => state);
	const { getWorkspace, getAllWorkspaces, joinWorkspace } = useWorkspaceStore(
		(state) => state,
	);
	const searchParams = useSearchParams();
	const inviteToken = searchParams.get("token");

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const response = await login({
				provider: "credentials",
				type: "login",
				email: data.email,
				password: data.password,
			});

			if (response?.user) {
				toast({ title: "Login Successful, Welcome!" });
				setCookie(null, "auth-store", JSON.stringify(response.user), {
					maxAge: 30 * 24 * 60 * 60,
					path: "/",
				});

				if (inviteToken) {
					const { workspace, message, variant } = await joinWorkspace(
						inviteToken,
						response.user,
					);
					if (workspace?.url) {
						toast({ title: message, variant });
						router.push(`/${workspace.url}`);
					}
				} else if (response.user.defaultWorkspaceId) {
					const { workspace } = await getWorkspace(
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
				toast({
					title: response?.message || "Login failed",
					variant: response?.variant || "destructive",
				});
			}
		} catch (error) {
			toast({ title: "Login failed", variant: "destructive" });
		} finally {
			setIsLoading(false);
		}
	};

	const handleRegisterPush = () => {
		router.push(inviteToken ? `/register?token=${inviteToken}` : "/register");
	};

	return (
		<Card className="w-full max-w-md bg-gradient-to-b from-primary/10 to-background">
			<CardHeader>
				<CardTitle className="text-2xl font-bold text-center">
					Sign in to your account
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleLogin} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email address</Label>
						<Input
							id="email"
							type="email"
							placeholder="Enter your email"
							value={data.email}
							onChange={(e) => setData({ ...data, email: e.target.value })}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<div className="relative">
							<Input
								id="password"
								type={hidePassword ? "password" : "text"}
								placeholder="Enter your password"
								value={data.password}
								onChange={(e) => setData({ ...data, password: e.target.value })}
								required
							/>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="absolute right-0 top-0 h-full"
								onClick={() => setHidePassword(!hidePassword)}
							>
								{hidePassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</Button>
						</div>
					</div>
					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : null}
						Sign in
					</Button>
				</form>
			</CardContent>
			<CardFooter className="flex justify-center">
				<p className="text-sm text-muted-foreground">
					Not a member?{" "}
					<Button variant="link" className="p-0" onClick={handleRegisterPush}>
						Sign up for free
					</Button>
				</p>
			</CardFooter>
		</Card>
	);
}

export default function Login() {
	return (
		<div className="flex items-center justify-center min-h-screen min-w-full p-4">
			<Suspense fallback={<div>Loading...</div>}>
				<LoginForm />
			</Suspense>
		</div>
	);
}
