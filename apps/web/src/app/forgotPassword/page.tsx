"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
	Form,
	FormControl,
	FormDescription,
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
// import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail } from "lucide-react";

const formSchema = z.object({
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
});

export default function ForgotPassword() {
	const [isSuccess, setIsSuccess] = useState(false);
	const router = useRouter();
	const { toast } = useToast();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// In a real application, you would handle the password reset logic here
		console.log(`Password reset requested for email: ${values.email}`);

		setIsSuccess(true);
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Forgot Password</CardTitle>
					<CardDescription>
						Enter your email to reset your password
					</CardDescription>
				</CardHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent>
							{isSuccess ? (
								// <Alert>
								// 	<Mail className="h-4 w-4" />
								// 	<AlertDescription>
								// 		If an account exists for {form.getValues("email")}, you will
								// 		receive password reset instructions.
								// 	</AlertDescription>
								// </Alert>
								<p>success</p>
							) : (
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input placeholder="name@example.com" {...field} />
											</FormControl>
											<FormDescription>
												Enter the email address associated with your account.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
						</CardContent>
						{!isSuccess && (
							<CardFooter>
								<Button
									className="w-full"
									type="submit"
									disabled={form.formState.isSubmitting}
								>
									{form.formState.isSubmitting
										? "Sending..."
										: "Send Reset Link"}
								</Button>
							</CardFooter>
						)}
					</form>
				</Form>
			</Card>
		</div>
	);
}
