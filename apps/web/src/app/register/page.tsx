"use client";

import RegistrationModal from "@/components/Modals/RegistrationModal";
import { GoogleIcon } from "@/components/Svg";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/lib/services";
import { passwordSchema } from "@/utils/formatting";
import { zodResolver } from "@hookform/resolvers/zod";
import { TODO } from "@squared/context";
import { Eye, EyeOff, Loader2, Mail, User } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(50, "Name must not exceed 50 characters"),
	email: z.string().email("Invalid email address"),
	password: passwordSchema,
});

function RegisterForm() {
	const [hidePassword, setHidePassword] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [isShowRegisteredModal, setIsShowRegisteredModal] = useState(false);
	const [isGoogleLoading, setIsGoogleLoading] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const { toast } = useToast();
	const inviteToken = searchParams.get("token");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const handleRegister = async (values: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		try {
			// First, register the user using your custom register function
			const user = await authService.register(TODO, {
				name: values.name,
				username: values.name.split(" ").join(".").toLowerCase(),
				email: values.email,
				password: values.password,
			});

			setIsShowRegisteredModal(true);

			if (user?.verified && inviteToken) {
				await signIn("credentials", {
					redirect: false,
					email: values.email,
					password: values.password,
				});
				router.refresh();
				router.prefetch("/");
			}
		} catch (error) {
			console.error("Registration error:", error);
			toast({
				title: error instanceof Error ? error.message : "Registration failed",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleRegister = async () => {
		setIsGoogleLoading(true);
		try {
			await signIn("google", {
				callbackUrl: window.location.href,
			});
		} catch (error) {
			toast({ title: "Google registration failed", variant: "destructive" });
			console.error("Google registration error:", error);
			setIsGoogleLoading(false);
		}
	};

	const handleLoginPush = () => {
		router.push(inviteToken ? `/login?token=${inviteToken}` : "/login");
	};

	return (
		<div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-secondary/10 p-4">
			{isShowRegisteredModal && (
				<RegistrationModal
					setIsShowRegisteredModal={setIsShowRegisteredModal}
				/>
			)}
			<Card
				className={`w-full max-w-md shadow-lg dark:shadow-primary/5 bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-secondary/10 ${
					isShowRegisteredModal ? "blur-lg" : ""
				}`}
			>
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-center">
						Create an account
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleRegister)}
							className="space-y-4"
						>
							<div className="space-y-2">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<div className="relative">
												<FormControl>
													<Input
														id="name"
														type="text"
														placeholder="Enter your name"
														required
														className="pl-10"
														{...field}
													/>
												</FormControl>
												<User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="space-y-2">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email address</FormLabel>
											<div className="relative">
												<FormControl>
													<Input
														id="email"
														type="email"
														placeholder="Enter your email"
														required
														className="pl-10"
														{...field}
													/>
												</FormControl>
												<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="space-y-2">
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="password">Password</FormLabel>
											<div className="relative">
												<FormControl>
													<Input
														id="password"
														type={hidePassword ? "password" : "text"}
														placeholder="Create a password"
														required
														className="pr-10"
														{...field}
													/>
												</FormControl>
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
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<Button
								type="submit"
								className="w-full"
								disabled={isLoading || isGoogleLoading}
							>
								{isLoading ? (
									<Loader2 className="mr-2 size-4 animate-spin" />
								) : null}
								Register
							</Button>
						</form>
					</Form>
					<div className="relative mt-4">
						<div className="absolute inset-0 flex items-center">
							<Separator />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-card px-2 text-muted-foreground">
								Or continue with
							</span>
						</div>
					</div>
					<Button
						onClick={handleGoogleRegister}
						className="w-full mt-4"
						variant="outline"
						disabled={isGoogleLoading || isLoading}
					>
						{isGoogleLoading ? (
							<Loader2 className="mr-2 size-4 animate-spin" />
						) : (
							<GoogleIcon />
						)}
						Sign up with Google
					</Button>
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
		</div>
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
