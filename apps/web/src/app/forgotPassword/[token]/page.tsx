"use client";

import { useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
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
	const router = useRouter();
	const params = useParams();
	const token = params.token as string;
	const { toast } = useToast();

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
			const { data: responseData } = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/auth/reset-password/${token}`,
				{ newPassword: values.newPassword },
			);
			toast({ title: responseData.message });
			router.push("/login");
		} catch (error) {
			toast({
				title: "Failed to reset password. Please try again.",
				variant: "destructive",
			});
			console.error("Failed to reset password:", error);
		}
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
										{/* <Input placeholder="Password" {...field} /> */}
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
										{/* <Input placeholder="Confirm password" {...field} /> */}
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
