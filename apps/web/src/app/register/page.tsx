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
import { useMetaData } from "@/utils/useMetaData";

function RegisterForm() {
	const [data, setData] = useState({ name: "", email: "", password: "" });
	const [hidePassword, setHidePassword] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { toast } = useToast();
	const register = useAuthStore((state) => state.register);
	const joinWorkspace = useWorkspaceStore((state) => state.joinWorkspace);
	const searchParams = useSearchParams();
	const inviteToken = searchParams.get("token");

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const response = await register({
				name: data.name,
				username: data.name.split(" ").join(".").toLowerCase(),
				email: data.email,
				password: data.password,
				type: "register",
				provider: "credentials",
			});
			if (response.user && inviteToken) {
				const { workspace } = await joinWorkspace(inviteToken, response.user);
				if (workspace?.url) {
					router.push(`/${workspace.url}`);
				}
			}
			toast({ title: response.message, variant: response.variant });
		} catch (error) {
			if (error instanceof Error)
				toast({ title: error.message, variant: "destructive" });
		} finally {
			setIsLoading(false);
		}
	};

	const handleLoginPush = () => {
		router.push(inviteToken ? `/login?token=${inviteToken}` : "/login");
	};

	// Custom hook for metadata
	useMetaData(
		"Register",
		"Create an account to access exclusive features where your teams can work on projects, cycles and tasks.",
	);

	return (
		<Card className="w-full max-w-md bg-gradient-to-b from-primary/10 to-background">
			<CardHeader>
				<CardTitle className="text-2xl font-bold text-center">
					Create an account
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleRegister} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							type="text"
							placeholder="Enter your name"
							value={data.name}
							onChange={(e) => setData({ ...data, name: e.target.value })}
							required
						/>
					</div>
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
								placeholder="Create a password"
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
						Register
					</Button>
				</form>
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
