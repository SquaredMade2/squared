"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore, useWorkspaceStore } from "@/store";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
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
import type { User } from "next-auth";
import type { AuthReturn } from "@/store/auth";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from "@/components/Svg";

export default function LoginForm() {
	const [data, setData] = useState({ email: "", password: "" });
	const [hidePassword, setHidePassword] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const { toast } = useToast();
	const { login } = useAuthStore((state) => state);
	const { getWorkspace, getAllWorkspaces, joinWorkspace } = useWorkspaceStore(
		(state) => state,
	);
	const inviteToken = searchParams.get("token");
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === "authenticated" && session?.user) {
			handleOAuthLogin(session.user);
		}
	}, [status, session]);

	const handleCredentialsLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const result = await signIn("credentials", {
				redirect: false,
				email: data.email,
				password: data.password,
			});

			if (result?.error) {
				toast({ title: result.error, variant: "destructive" });
			} else if (result?.ok) {
				// If login is successful, fetch the updated session
				const updatedSession = await fetch("/api/auth/session").then((res) =>
					res.json(),
				);
				if (updatedSession?.user) {
					await handleOAuthLogin(updatedSession.user);
				} else {
					throw new Error("Failed to get user information after login");
				}
			}
		} catch (error) {
			console.error("Login error:", error);
			toast({ title: "Login failed", variant: "destructive" });
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleLogin = async () => {
		setIsLoading(true);
		try {
			await signIn("google", { callbackUrl: window.location.href });
		} catch (error) {
			toast({ title: "Google login failed", variant: "destructive" });
			console.error("Google login error:", error);
			setIsLoading(false);
		}
	};

	const handleOAuthLogin = async (user: User) => {
		try {
			const response = await login({
				provider: "oauth",
				type: "login",
				name: user.name ?? undefined,
				email: user.email,
				oauthId: user.id,
			});

			await handleLoginResponse(response);
		} catch (error) {
			toast({ title: "OAuth login failed", variant: "destructive" });
			console.error("OAuth login error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleLoginResponse = async (response: AuthReturn) => {
		if (response?.user) {
			toast({ title: "Login Successful, Welcome!" });

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
					router.refresh();
					router.push(`/${workspaces[0].url}`);
				} else {
					router.refresh();
					router.push("/join");
				}
			}
		} else {
			toast({
				title: response?.message || "Login failed",
				variant: response?.variant || "destructive",
			});
		}
	};

	const handleRegisterPush = () => {
		router.push(inviteToken ? `/register?token=${inviteToken}` : "/register");
	};

	return (
		<div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-secondary/10 p-4">
			<Card className="w-full max-w-md shadow-lg dark:shadow-primary/5 bg-gradient-to-b from-primary/10 to-background">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						Sign in to your account
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<form onSubmit={handleCredentialsLogin} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email address</Label>
							<div className="relative">
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									value={data.email}
									onChange={(e) => setData({ ...data, email: e.target.value })}
									required
									className="pl-10"
								/>
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Input
									id="password"
									type={hidePassword ? "password" : "text"}
									placeholder="Enter your password"
									value={data.password}
									onChange={(e) =>
										setData({ ...data, password: e.target.value })
									}
									required
									className="pr-10"
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
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<Separator />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-card px-2 text-muted-foreground">
								Or continue with
							</span>
						</div>
					</div>
					<Button
						onClick={handleGoogleLogin}
						className="w-full"
						variant="outline"
						disabled={isLoading}
					>
						{isLoading ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<GoogleIcon />
						)}
						Sign in with Google
					</Button>
				</CardContent>
				<CardFooter className="flex flex-col items-center justify-center space-y-2">
					<p className="text-sm text-muted-foreground">
						Not a member?{" "}
						<Button variant="link" className="p-0" onClick={handleRegisterPush}>
							Sign up for free
						</Button>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
