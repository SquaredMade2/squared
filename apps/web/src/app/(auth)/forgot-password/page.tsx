"use client";

import { useAuth, useSignIn } from "@clerk/nextjs";
import { Eye, EyeOff } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@squaredmade/ui/card";
import { Input } from "@squaredmade/ui/input";
import { Label } from "@squaredmade/ui/label";
import { useRouter } from "next/navigation";
import { type FormEvent, useId, useState } from "react";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [code, setCode] = useState("");
	const [secondFactorCode, setSecondFactorCode] = useState("");
	const [successfulCreation, setSuccessfulCreation] = useState(false);
	const [secondFactor, setSecondFactor] = useState(false);
	const [error, setError] = useState("");
	const [hidePassword, setHidePassword] = useState(true);
	const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

	const router = useRouter();
	const { isSignedIn } = useAuth();
	const { isLoaded, signIn, setActive } = useSignIn();
	const id = useId();
	const getFormId = (el: string) => `${id}-${el}`;

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
		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}
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
				}
			})
			.catch((err) => {
				console.error("error", err.errors[0].longMessage);
				setError(err.errors[0].longMessage);
			});
	}

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-linear-to-b from-background to-secondary/20 p-4 dark:from-background dark:to-secondary/10">
			<Card className="w-full max-w-md bg-linear-to-b from-primary/10 to-background shadow-lg dark:shadow-primary/5">
				<CardHeader className="space-y-1">
					<CardTitle className="text-center font-bold text-2xl">
						{successfulCreation
							? secondFactor
								? "Two-Factor Authentication"
								: "Reset Your Password"
							: "Forgot Password"}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{successfulCreation ? (
						secondFactor ? (
							<form onSubmit={completeReset} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor={getFormId("secondFactorCode")}>
										Two-Factor Code
									</Label>
									<Input
										id={getFormId("secondFactorCode")}
										type="text"
										placeholder="Enter your 2FA code"
										value={secondFactorCode}
										onChange={(e) => setSecondFactorCode(e.target.value)}
										required={true}
									/>
								</div>
								<Button type="submit" className="w-full">
									Verify 2FA Code
								</Button>
							</form>
						) : (
							<form onSubmit={reset} className="space-y-4">
								<div className="space-y-2">
									<div className="mt-2 flex w-full justify-between">
										<Label htmlFor={getFormId("code")}>Reset Code</Label>
										<Button
											variant="link"
											className="m-0 h-fit p-0"
											type="button"
											onClick={() => setSuccessfulCreation(false)}
										>
											Resend code
										</Button>
									</div>
									<div className="relative">
										<Input
											id={getFormId("code")}
											type="text"
											placeholder="Enter the reset code"
											value={code}
											onChange={(e) => setCode(e.target.value)}
											required={true}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor={getFormId("password")}>New Password</Label>
									<div className="relative">
										<Input
											id={getFormId("password")}
											type={hidePassword ? "password" : "text"}
											placeholder="Enter your new password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required={true}
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											aria-label="Toggle Password"
											className="absolute top-0 right-0 text-muted-foreground"
											onClick={() => setHidePassword(!hidePassword)}
										>
											{hidePassword ? (
												<Eye className="h-6 w-6" />
											) : (
												<EyeOff className="h-6 w-6" />
											)}
										</Button>
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor={getFormId("confirm-password")}>
										Confirm Password
									</Label>
									<div className="relative">
										<Input
											id={getFormId("confirm-password")}
											type={hideConfirmPassword ? "password" : "text"}
											placeholder="Password confirmation"
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											required={true}
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											aria-label="Toggle Password"
											className="absolute top-0 right-0 text-muted-foreground"
											onClick={() =>
												setHideConfirmPassword(!hideConfirmPassword)
											}
										>
											{hideConfirmPassword ? (
												<Eye className="h-6 w-6" />
											) : (
												<EyeOff className="h-6 w-6" />
											)}
										</Button>
									</div>
								</div>
								<Button type="submit" className="w-full">
									Reset Password
								</Button>
							</form>
						)
					) : (
						<form onSubmit={create} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor={getFormId("email")}>Email</Label>
								<Input
									id={getFormId("email")}
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required={true}
								/>
							</div>
							<Button type="submit" className="w-full">
								Send Reset Email
							</Button>
						</form>
					)}
					{error && <p className="mt-2 text-destructive text-sm">{error}</p>}
				</CardContent>
				<CardFooter className="flex flex-col justify-center gap-2">
					<p className="text-muted-foreground text-sm">
						Remember your password?{" "}
						<Button
							variant="link"
							className="p-0"
							onClick={() => router.push("/sign-in")}
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
