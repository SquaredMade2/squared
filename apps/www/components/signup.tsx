"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";

import { cn } from "@/lib/utils";
import { IconBrandGithub } from "@tabler/icons-react";
import Link from "next/link";
import { Logo } from "./Logo";
import { Button } from "./button";
import Password from "./password";

const formSchema = z.object({
	name: z
		.string({
			required_error: "Please enter password",
		})
		.min(1, "Please enter your name"),
	email: z
		.string({
			required_error: "Please enter email",
		})
		.email("Please enter valid email")
		.min(1, "Please enter email"),
	password: z
		.string({
			required_error: "Please enter password",
		})
		.min(1, "Please enter password"),
});

type LoginUser = z.infer<typeof formSchema>;

export function SignupForm() {
	const form = useForm<LoginUser>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: LoginUser) {
		try {
			console.log("submitted form", values);
		} catch {}
	}

	return (
		<Form {...form}>
			<div className="flex w-full items-center justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
				<div className="mx-auto w-full max-w-md">
					<div>
						<div className="flex">
							<Logo />
						</div>
						<h2 className="mt-8 font-bold text-2xl text-black leading-9 tracking-tight dark:text-white">
							Sign up for an account
						</h2>
					</div>

					<div className="mt-10">
						<div>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6"
							>
								<div>
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<label
													htmlFor="name"
													className="block font-medium text-neutral-700 text-sm leading-6 dark:text-muted-dark"
												>
													Full name
												</label>
												<FormControl>
													<div className="mt-2">
														<input
															id="name"
															type="name"
															placeholder="Manu Arora"
															className="block w-full rounded-md border-0 bg-white px-4 py-1.5 text-black shadow-aceternity placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 sm:text-sm sm:leading-6 dark:bg-neutral-900 dark:text-white"
															{...field}
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<label
													htmlFor="email"
													className="block font-medium text-neutral-700 text-sm leading-6 dark:text-muted-dark"
												>
													Email address
												</label>
												<FormControl>
													<div className="mt-2">
														<input
															id="email"
															type="email"
															placeholder="hello@johndoe.com"
															className="block w-full rounded-md border-0 bg-white px-4 py-1.5 text-black shadow-aceternity placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 sm:text-sm sm:leading-6 dark:bg-neutral-900 dark:text-white"
															{...field}
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div>
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<label
													htmlFor="password"
													className="block font-medium text-neutral-700 text-sm leading-6 dark:text-muted-dark"
												>
													Password
												</label>
												<FormControl>
													<div className="mt-2">
														<Password
															id="password"
															type="password"
															placeholder="••••••••"
															className="block w-full rounded-md border-0 bg-white px-4 py-1.5 text-black shadow-aceternity placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 sm:text-sm sm:leading-6 dark:bg-neutral-900 dark:text-white"
															{...field}
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div>
									<Button className="w-full">Sign Up</Button>
									<p
										className={cn(
											"mt-4 text-center text-muted text-neutral-500 text-sm dark:text-muted-dark",
										)}
									>
										Already have an account?{" "}
										<Link href="/login" className="text-black dark:text-white">
											Sign in
										</Link>
									</p>
								</div>
							</form>
						</div>

						<div className="mt-10">
							<div className="relative">
								<div
									className="absolute inset-0 flex items-center"
									aria-hidden="true"
								>
									<div className="w-full border-neutral-300 border-t dark:border-neutral-700" />
								</div>
								<div className="relative flex justify-center font-medium text-sm leading-6">
									<span className="bg-white px-6 text-neutral-400 dark:bg-black dark:text-neutral-500">
										Or continue with
									</span>
								</div>
							</div>

							<div className="mt-6 flex w-full items-center justify-center">
								<Button onClick={() => {}} className="w-full py-1.5">
									<IconBrandGithub className="h-5 w-5" />
									<span className="font-semibold text-sm leading-6">
										Github
									</span>
								</Button>
							</div>

							<p className="mt-8 text-center text-neutral-600 text-sm dark:text-neutral-400">
								By clicking on sign up, you agree to our{" "}
								<Link
									href="#"
									className="text-neutral-500 dark:text-neutral-300"
								>
									Terms of Service
								</Link>{" "}
								and{" "}
								<Link
									href="#"
									className="text-neutral-500 dark:text-neutral-300"
								>
									Privacy Policy
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</Form>
	);
}
