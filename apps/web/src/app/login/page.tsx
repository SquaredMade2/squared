"use client";

import { GoogleIcon } from "@/components/Svg";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
	const [data, setData] = useState({ email: "", password: "" });
	const [hidePassword, setHidePassword] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [isGoogleLoading, setIsGoogleLoading] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const { toast } = useToast();

	const inviteToken = searchParams.get("token");

	const handleCredentialsLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			inviteToken && router.prefetch("/");
			const response = await signIn("credentials", {
				redirect: false,
				email: data.email,
				password: data.password,
				callbackUrl: inviteToken
					? `${process.env.NEXT_PUBLIC_URL}/join/${inviteToken}`
					: process.env.NEXT_PUBLIC_URL,
			});
			if (response?.status === 401) {
				toast({
					title: response.error || "Error logging in",
					variant: "destructive",
				});
			}
			router.refresh();
		} catch (error) {
			console.error("Login error:", error);
			toast({
				title: error instanceof Error ? error.message : "Login failed",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleLogin = async () => {
		setIsGoogleLoading(true);
		try {
			await signIn("google", {
				callbackUrl: inviteToken
					? `${process.env.NEXT_PUBLIC_URL}/join/${inviteToken}`
					: process.env.NEXT_PUBLIC_URL,
			});
			router.refresh();
			router.prefetch("/");
		} catch (error) {
			toast({ title: "Google login failed", variant: "destructive" });
			console.error("Google login error:", error);
			setIsGoogleLoading(false);
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
									aria-label="Toggle password visibility"
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
						<Button
							type="submit"
							className="w-full"
							disabled={isLoading || isGoogleLoading}
						>
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
					{process.env.NODE_ENV === "production" && (
						<Button
							onClick={handleGoogleLogin}
							className="w-full"
							variant="outline"
							disabled={isGoogleLoading || isLoading}
						>
							{isGoogleLoading ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<GoogleIcon />
							)}
							Sign in with Google
						</Button>
					)}
				</CardContent>
				<CardFooter className="flex flex-col justify-center gap-px">
					<p className="text-sm text-muted-foreground">
						<Button
							variant="link"
							className="p-0"
							onClick={() => {
								router.push("/forgotPassword");
							}}
						>
							Forgot password?
						</Button>
					</p>
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

export default function Login() {
	return (
		<div className="flex items-center justify-center min-h-screen p-4 min-w-full">
			<Suspense fallback={<div>Loading...</div>}>
				<LoginForm />
			</Suspense>
		</div>
	);
}
