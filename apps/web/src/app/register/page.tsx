"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore, useWorkspaceStore } from "@/store";
import { Eye, EyeOff, Mail, User, Loader2 } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from "@/components/Svg";

function RegisterForm() {
	const [data, setData] = useState({ name: "", email: "", password: "" });
	const [hidePassword, setHidePassword] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const { toast } = useToast();
	const { register, login } = useAuthStore((state) => state);
	const { joinWorkspace, getWorkspace, getAllWorkspaces } = useWorkspaceStore(
		(state) => state,
	);
	const inviteToken = searchParams.get("token");

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			// First, register the user using your custom register function
			const response = await register({
				name: data.name,
				username: data.name.split(" ").join(".").toLowerCase(),
				email: data.email,
				password: data.password,
				type: "register",
				provider: "credentials",
			});

			if (response.user) {
				// If registration is successful, sign in the user using NextAuth
				const result = await signIn("credentials", {
					redirect: false,
					email: data.email,
					password: data.password,
				});

				if (result?.error) {
					throw new Error(result.error);
				}

				if (inviteToken) {
					const { workspace } = await joinWorkspace(inviteToken, response.user);
					if (workspace?.url) {
						router.push(`/${workspace.url}`);
					}
				} else {
					router.push("/");
				}

				toast({
					title: response.message,
					variant: response.variant,
				});
			} else {
				throw new Error(response.message || "Registration failed");
			}
		} catch (error) {
			console.error("Registration error:", error);
			toast({
				title: error instanceof Error ? error.message : "Registration failed",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleRegister = async () => {
		setIsLoading(true);
		try {
			await signIn("google", {
				callbackUrl: window.location.href,
			});
			const { data: session, status } = useSession();
			if (status === "authenticated" && session?.user) {
				const response = await login({
					provider: "oauth",
					type: "login",
					name: session.user.name ?? undefined,
					email: session.user.email,
					oauthId: session.user.id,
				});

				if (response?.user) {
					const user = response.user;
					toast({ title: "Login Successful, Welcome!" });

					if (inviteToken) {
						const { workspace, message, variant } = await joinWorkspace(
							inviteToken,
							user,
						);
						if (workspace?.url) {
							toast({ title: message, variant });
							router.push(`/${workspace.url}`);
						}
					} else if (user.defaultWorkspaceId) {
						const { workspace } = await getWorkspace(user.defaultWorkspaceId);
						if (workspace?.url) {
							router.push(`/${workspace.url}`);
						}
					} else {
						const workspaces = await getAllWorkspaces(user.id);
						if (workspaces?.length) {
							router.refresh();
							router.push(`/${workspaces[0].url}`);
						} else {
							router.refresh();
							router.push("/join");
						}
					}
				}
			} else {
				toast({
					title: "Login failed",
					variant: "destructive",
				});
			}
		} catch (error) {
			toast({ title: "Google registration failed", variant: "destructive" });
			console.error("Google registration error:", error);
			setIsLoading(false);
		}
	};

	const handleLoginPush = () => {
		router.push(inviteToken ? `/login?token=${inviteToken}` : "/login");
	};

	return (
		<div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-secondary/10 p-4">
			<Card className="w-full max-w-md shadow-lg dark:shadow-primary/5 bg-gradient-to-b from-primary/10 to-background">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-center">
						Create an account
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleRegister} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<div className="relative">
								<Input
									id="name"
									type="text"
									placeholder="Enter your name"
									value={data.name}
									onChange={(e) => setData({ ...data, name: e.target.value })}
									required
									className="pl-10"
								/>
								<User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
							</div>
						</div>
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
									placeholder="Create a password"
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
							{isLoading ? <Loader2 className="size-4 animate-spin" /> : null}
							Register
						</Button>
					</form>
					<div className="relative mt-4">
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
						onClick={handleGoogleRegister}
						className="w-full mt-4"
						variant="outline"
						disabled={isLoading}
					>
						{isLoading ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							<GoogleIcon />
						)}
						Sign up with Google
					</Button>
				</CardContent>
				<CardFooter className="flex justify-center">
					<p className="text-sm text-muted-foreground">
						Already have an account?{" "}
						<Button variant="link" className="p-0" onClick={handleLoginPush}>
							Sign in
						</Button>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}

export default function Register() {
	return (
		<div className="flex items-center justify-center min-h-screen p-4 min-w-full">
			<Suspense fallback={<div>Loading...</div>}>
				<RegisterForm />
			</Suspense>
		</div>
	);
}
