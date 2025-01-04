"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { client } from "@/lib/client";
import { passwordSchema } from "@/utils/formatting";
import { parseError } from "@/utils/parseError";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	newPassword: passwordSchema,
	confirmPassword: z.string({
		required_error: "Password is required",
		invalid_type_error: "Password must be a string",
	}),
});

function ResetPasswordForm() {
	const [hideNewPassword, setHideNewPassword] = useState(true);
	const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
	const router = useRouter();
	const params = useParams();
	const token = params.token as string;
	const { toast } = useToast();

	const { data: tokenData } = useQuery({
		queryKey: ["token", token],
		queryFn: async () => {
			const response = await client.authentication.checkValidToken.$get({
				token,
			});
			const { message, email, tokenExpired } = await response.json();
			toast({
				title: message,
				variant: tokenExpired ? "destructive" : "default",
			});
			return {
				email,
				tokenExpired,
			};
		},
		enabled: Boolean(token),
	});

	const { mutate: onSubmit } = useMutation({
		mutationKey: ["resetPassword", token],
		mutationFn: async (values: z.infer<typeof formSchema>) => {
			const res = await client.authentication.resetPassword.$post({
				token,
				...values,
			});

			toast(await res.json());
			router.push("/login");
		},
		onError: (error) => {
			toast({
				title: parseError(error, "Failed to reset password. Please try again."),
				variant: "destructive",
			});
		},
	});

	const { mutate: handleSendReset, data: success } = useMutation({
		mutationKey: ["resetPassword", token],
		mutationFn: async () => {
			if (!tokenData) return;
			const res = await client.authentication.resetPasswordEmail.$post({
				email: tokenData.email,
			});

			toast(await res.json());
			return true;
		},
		onError: (error) => {
			toast({ title: error.message, variant: "destructive" });
		},
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			newPassword: "",
			confirmPassword: "",
		},
	});

	if (tokenData?.tokenExpired) {
		return (
			<Card className="w-full max-w-md bg-gradient-to-b from-primary/10 to-background">
				<CardHeader className="text-center">
					<CardTitle className="mb-8">Password Reset Link Expired</CardTitle>
					<CardContent>
						{!success ? (
							<Button className="w-full" onClick={() => handleSendReset()}>
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
				<form onSubmit={form.handleSubmit((values) => onSubmit(values))}>
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
												aria-label="Toggle password visibility"
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
												placeholder="Confirm your password"
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
