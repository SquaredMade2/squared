"use client";

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
import { useAuth, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [code, setCode] = useState("");
	const [secondFactorCode, setSecondFactorCode] = useState("");
	const [successfulCreation, setSuccessfulCreation] = useState(false);
	const [secondFactor, setSecondFactor] = useState(false);
	const [error, setError] = useState("");

	const router = useRouter();
	const { isSignedIn } = useAuth();
	const { isLoaded, signIn, setActive } = useSignIn();

	if (!isLoaded) {
		return null;
	}

	if (isSignedIn) {
		router.push("/");
		return null;
	}

	async function create(e: FormEvent) {
		e.preventDefault();
		await signIn
			?.create({
				strategy: "reset_password_email_code",
				identifier: email,
			})
			.then((_) => {
				setSuccessfulCreation(true);
				setError("");
			})
			.catch((err) => {
				console.error("error", err.errors[0].longMessage);
				setError(err.errors[0].longMessage);
			});
	}

	async function reset(e: FormEvent) {
		e.preventDefault();
		await signIn
			?.attemptFirstFactor({
				strategy: "reset_password_email_code",
				code,
				password,
			})
			.then((result) => {
				if (result.status === "needs_second_factor") {
					setSecondFactor(true);
					setError("");
				} else if (result.status === "complete") {
					setActive({ session: result.createdSessionId });
					setError("");
					router.push("/");
				} else {
					console.log(result);
				}
			})
			.catch((err) => {
				console.error("error", err.errors[0].longMessage);
				setError(err.errors[0].longMessage);
			});
	}

	async function completeReset(e: FormEvent) {
		e.preventDefault();
		await signIn
			?.attemptSecondFactor({
				strategy: "totp",
				code: secondFactorCode,
			})
			.then((result) => {
				if (result.status === "complete") {
					setActive({ session: result.createdSessionId });
					setError("");
					router.push("/");
				} else {
					console.log(result);
				}
			})
			.catch((err) => {
				console.error("error", err.errors[0].longMessage);
				setError(err.errors[0].longMessage);
			});
	}

	return (
		<div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-secondary/10 p-4">
			<Card className="w-full max-w-md shadow-lg dark:shadow-primary/5 bg-gradient-to-b from-primary/10 to-background">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						{!successfulCreation
							? "Forgot Password"
							: secondFactor
								? "Two-Factor Authentication"
								: "Reset Your Password"}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{!successfulCreation ? (
						<form onSubmit={create} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
							<Button type="submit" className="w-full">
								Send Reset Email
							</Button>
						</form>
					) : secondFactor ? (
						<form onSubmit={completeReset} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="secondFactorCode">Two-Factor Code</Label>
								<Input
									id="secondFactorCode"
									type="text"
									placeholder="Enter your 2FA code"
									value={secondFactorCode}
									onChange={(e) => setSecondFactorCode(e.target.value)}
									required
								/>
							</div>
							<Button type="submit" className="w-full">
								Verify 2FA Code
							</Button>
						</form>
					) : (
						<form onSubmit={reset} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="code">Reset Code</Label>
								<Input
									id="code"
									type="text"
									placeholder="Enter the reset code"
									value={code}
									onChange={(e) => setCode(e.target.value)}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="password">New Password</Label>
								<Input
									id="password"
									type="password"
									placeholder="Enter your new password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>
							<Button type="submit" className="w-full">
								Reset Password
							</Button>
						</form>
					)}
					{error && <p className="text-destructive text-sm mt-2">{error}</p>}
				</CardContent>
				<CardFooter className="flex flex-col justify-center gap-2">
					<p className="text-sm text-muted-foreground">
						Remember your password?{" "}
						<Button
							variant="link"
							className="p-0"
							onClick={() => router.push("/login")}
						>
							Back to login
						</Button>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
};

export default ForgotPasswordPage;
