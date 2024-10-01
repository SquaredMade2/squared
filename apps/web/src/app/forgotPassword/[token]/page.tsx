"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
	newPassword: z.string({
		required_error: "Password is required",
		invalid_type_error: "Password must be a string",
	}),
	confirmPassword: z.string({
		required_error: "Password is required",
		invalid_type_error: "Password must be a string",
	}),
});

function ResetPasswordForm() {
	const [hideNewPassword, setHideNewPassword] = useState(true);
	const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
	const [isTokenExpired, setIsTokenExpired] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [userEmail, setUserEmail] = useState("");
	const { resetPassword, resetPasswordEmail, checkTokenValid } = useAuthStore(
		(state) => state,
	);
	const router = useRouter();
	const params = useParams();
	const token = params.token as string;
	const { toast } = useToast();

	useEffect(() => {
		const checkingTokenValid = async (): Promise<void> => {
			try {
				const response = await checkTokenValid(token);
				if (response.message === "Token is expired or invalid") {
					setUserEmail(() => {
						return response.data !== null ? response.data.email : "";
					});
					setIsTokenExpired(() => true);
					toast({
						title: response.message,
						variant: response.variant,
					});
				}
			} catch (error) {
				console.error(error);
				toast({
					title: "Could not verify token",
					variant: "destructive",
				});
				throw error;
			}
		};
		checkingTokenValid();
	}, []);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			newPassword: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (values.newPassword !== values.confirmPassword) {
			toast({
				title: "Passwords don't match.",
				variant: "destructive",
			});
			return;
		}

		try {
			const response = await resetPassword(token, values.newPassword);
			toast({ title: response.message });
			router.push("/login");
		} catch (error) {
			toast({
				title: "Failed to reset password. Please try again.",
				variant: "destructive",
			});
			console.error("Failed to reset password:", error);
		}
	}

	async function handleSendReset() {
		try {
			const response = await resetPasswordEmail(userEmail);
			toast({ title: response.message, variant: response.variant });
			setIsSuccess(true);
		} catch (error) {
			if (error instanceof Error)
				toast({ title: error.message, variant: "destructive" });
		}
	}

	if (isTokenExpired) {
		return (
			<Card className="w-full max-w-md bg-gradient-to-b from-primary/10 to-background">
				<CardHeader className="text-center">
					<CardTitle className="mb-8">Password Reset Link Expired</CardTitle>
					<CardContent>
						{!isSuccess ? (
							<Button className="w-full" onClick={handleSendReset}>
								Resend Reset Link
							</Button>
						) : (
							<p>Reset link sent. Please check your email.</p>
						)}
					</CardContent>
					<CardFooter className="w-full text-center">
						<Button
							variant="link"
							className="w-full text-center"
							onClick={() => {
								router.push("/login");
							}}
						>
							Sign in
						</Button>
					</CardFooter>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card className="w-full max-w-md bg-gradient-to-b from-primary/10 to-background">
			<CardHeader>
				<CardTitle>Reset Password</CardTitle>
				<CardDescription>Enter your new password</CardDescription>
			</CardHeader>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent>
						<FormField
							control={form.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem className="mb-4">
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												id="password"
												type={hideNewPassword ? "password" : "text"}
												placeholder="Enter your password"
												required
												{...field}
											/>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="absolute right-0 top-0 h-full"
												onClick={() => setHideNewPassword(!hideNewPassword)}
											>
												{hideNewPassword ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												id="password"
												type={hideConfirmPassword ? "password" : "text"}
												placeholder="Enter your password"
												required
												{...field}
											/>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="absolute right-0 top-0 h-full"
												onClick={() =>
													setHideConfirmPassword(!hideConfirmPassword)
												}
											>
												{hideConfirmPassword ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter className="flex flex-col justify-center gap-2">
						<Button
							className="w-full"
							type="submit"
							disabled={form.formState.isSubmitting}
						>
							{form.formState.isSubmitting ? "Updating..." : "Reset Password"}
						</Button>
						<Button
							variant="link"
							className="p-0"
							onClick={() => {
								router.push("/login");
							}}
						>
							Sign in
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
}

export default function ResetPassword() {
	return (
		<div className="flex items-center justify-center min-h-screen min-w-full p-4">
			<Suspense fallback={<div>Loading...</div>}>
				<ResetPasswordForm />
			</Suspense>
		</div>
	);
}
