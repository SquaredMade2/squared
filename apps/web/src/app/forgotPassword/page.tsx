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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { client } from "@/lib/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
});

function ForgotPasswordForm() {
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	const { mutate: onSubmit, data: success } = useMutation({
		mutationKey: ["resetPassword", form.getValues("email")],
		mutationFn: async (values: z.infer<typeof formSchema>) => {
			if (!values.email) return;
			const res = await client.auth.resetPasswordEmail.$post({
				email: values.email,
			});

			toast(await res.json());
			return true;
		},
		onError: (error) => {
			toast({ title: error.message, variant: "destructive" });
		},
	});

	return (
		<Card className="w-full max-w-md bg-gradient-to-b from-primary/10 to-background">
			<CardHeader>
				<CardTitle>Forgot Password</CardTitle>
				{!success && (
					<CardDescription>
						Enter your email to reset your password
					</CardDescription>
				)}
			</CardHeader>
			<Form {...form}>
				<form onSubmit={form.handleSubmit((values) => onSubmit(values))}>
					<CardContent>
						{success ? (
							<div className="text-center">
								<h2 className="mb-4 text-3xl">Success!</h2>
								<p className="mb-2">
									You will receive an email with insturctions to reset your
									password.
								</p>
								<p>This email will expire in 15 minutes</p>
							</div>
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
											Enter the email you used to register with Squared
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
					</CardContent>
					{!success && (
						<CardFooter>
							<Button
								className="w-full"
								type="submit"
								disabled={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting ? "Sending..." : "Send Reset Link"}
							</Button>
						</CardFooter>
					)}
				</form>
			</Form>
			<CardFooter className="w-full flex justify-center">
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
		</Card>
	);
}

export default function ForgotPassword() {
	return (
		<div className="flex items-center justify-center min-h-screen min-w-full p-4">
			<Suspense fallback={<div>Loading...</div>}>
				<ForgotPasswordForm />
			</Suspense>
		</div>
	);
}
