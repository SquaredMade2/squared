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
				identifier: email,
				strategy: "reset_password_email_code",
			})
			.then((_) => {
				setSuccessfulCreation(true);
				setError("");
			})
			.catch((err) => {
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
				code,
				password,
				strategy: "reset_password_email_code",
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
				setError(err.errors[0].longMessage);
			});
	}

	async function completeReset(e: FormEvent) {
		e.preventDefault();
		await signIn
			?.attemptSecondFactor({
				code: secondFactorCode,
				strategy: "totp",
			})
			.then((result) => {
				if (result.status === "complete") {
					setActive({ session: result.createdSessionId });
					setError("");
					router.push("/");
				}
			})
			.catch((err) => {
				setError(err.errors[0].longMessage);
			});
	}

	const getCardTitle = () => {
		if (successfulCreation) {
			return secondFactor ? "Two-Factor Authentication" : "Reset Your Password";
		}
		return "Forgot Password";
	};

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-linear-to-b from-background to-secondary/20 p-4 dark:from-background dark:to-secondary/10">
			<Card className="w-full max-w-md bg-linear-to-b from-primary/10 to-background shadow-lg dark:shadow-primary/5">
				<CardHeader className="space-y-1">
					<CardTitle className="text-center font-bold text-2xl">
						{getCardTitle()}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{successfulCreation ? (
						secondFactor ? (
							<form className="space-y-4" onSubmit={completeReset}>
								<div className="space-y-2">
									<Label htmlFor={getFormId("secondFactorCode")}>
										Two-Factor Code
									</Label>
									<Input
										id={getFormId("secondFactorCode")}
										onChange={(e) => setSecondFactorCode(e.target.value)}
										placeholder="Enter your 2FA code"
										required={true}
										type="text"
										value={secondFactorCode}
									/>
								</div>
								<Button className="w-full" type="submit">
									Verify 2FA Code
								</Button>
							</form>
						) : (
							<form className="space-y-4" onSubmit={reset}>
								<div className="space-y-2">
									<div className="mt-2 flex w-full justify-between">
										<Label htmlFor={getFormId("code")}>Reset Code</Label>
										<Button
											className="m-0 h-fit p-0"
											onClick={() => setSuccessfulCreation(false)}
											type="button"
											variant="link"
										>
											Resend code
										</Button>
									</div>
									<div className="relative">
										<Input
											id={getFormId("code")}
											onChange={(e) => setCode(e.target.value)}
											placeholder="Enter the reset code"
											required={true}
											type="text"
											value={code}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor={getFormId("password")}>New Password</Label>
									<div className="relative">
										<Input
											id={getFormId("password")}
											onChange={(e) => setPassword(e.target.value)}
											placeholder="Enter your new password"
											required={true}
											type={hidePassword ? "password" : "text"}
											value={password}
										/>
										<Button
											aria-label="Toggle Password"
											className="absolute top-0 right-0 text-muted-foreground"
											onClick={() => setHidePassword(!hidePassword)}
											size="icon"
											type="button"
											variant="ghost"
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
											onChange={(e) => setConfirmPassword(e.target.value)}
											placeholder="Password confirmation"
											required={true}
											type={hideConfirmPassword ? "password" : "text"}
											value={confirmPassword}
										/>
										<Button
											aria-label="Toggle Password"
											className="absolute top-0 right-0 text-muted-foreground"
											onClick={() =>
												setHideConfirmPassword(!hideConfirmPassword)
											}
											size="icon"
											type="button"
											variant="ghost"
										>
											{hideConfirmPassword ? (
												<Eye className="h-6 w-6" />
											) : (
												<EyeOff className="h-6 w-6" />
											)}
										</Button>
									</div>
								</div>
								<Button className="w-full" type="submit">
									Reset Password
								</Button>
							</form>
						)
					) : (
						<form className="space-y-4" onSubmit={create}>
							<div className="space-y-2">
								<Label htmlFor={getFormId("email")}>Email</Label>
								<Input
									id={getFormId("email")}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Enter your email"
									required={true}
									type="email"
									value={email}
								/>
							</div>
							<Button className="w-full" type="submit">
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
							className="p-0"
							onClick={() => router.push("/sign-in")}
							variant="link"
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
