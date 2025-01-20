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
} from "@squaredmade/ui/form";

import { Button } from "./button";

const formSchema = z.object({
	name: z
		.string({
			required_error: "Please enter your name",
		})
		.min(1, "Please enter email"),
	email: z
		.string({
			required_error: "Please enter email",
		})
		.email("Please enter valid email")
		.min(1, "Please enter email"),
	company: z
		.string({
			required_error: "Please enter your company's name",
		})
		.min(1, "Please enter your company's name"),
	message: z
		.string({
			required_error: "Please enter your message",
		})
		.min(1, "Please enter your message"),
});

type LoginUser = z.infer<typeof formSchema>;

export function ContactForm() {
	const form = useForm<LoginUser>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			company: "",
			message: "",
		},
	});

	async function onSubmit(values: LoginUser) {
		// todo submit to actual inbox?
		try {
			console.log("submitted form", values);
		} catch {}
	}

	return (
		<Form {...form}>
			<div className="mx-auto w-full max-w-xl z-20 mt-28 mr-8">
				<div>
					<h1 className="mt-8 text-4xl font-bold leading-9 tracking-tight text-black dark:text-white">
						Contact Us
					</h1>
					<p className="mt-4 text-muted-foreground text-sm max-w-sm">
						We'd love to hear from you! Send us a message, and we'll respond as
						soon as possible.
					</p>
				</div>

				<div className="py-10">
					<div>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<label
											htmlFor="name"
											className="block text-sm font-medium leading-6 text-neutral-700 dark:text-muted-dark"
										>
											Full Name
										</label>
										<FormControl>
											<div className="mt-2">
												<input
													id="name"
													type="name"
													placeholder="Full Name"
													className="block w-full px-4 rounded-xl border-0 py-1.5  shadow-aceternity text-black placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm sm:leading-6 dark:text-white dark:bg-background-darkAccent bg-neutral-100"
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<label
											htmlFor="email"
											className="block text-sm font-medium leading-6 text-neutral-700 dark:text-muted-dark"
										>
											Email address
										</label>
										<FormControl>
											<div className="mt-2">
												<input
													id="email"
													type="email"
													placeholder="Email"
													className="block w-full bg-neutral-100 dark:bg-background-darkAccent px-4 rounded-xl border-0 py-1.5  shadow-aceternity text-black placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm sm:leading-6 dark:text-white \"
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="company"
								render={({ field }) => (
									<FormItem>
										<label
											htmlFor="company"
											className="block text-sm font-medium leading-6 text-neutral-700 dark:text-muted-dark"
										>
											Company
										</label>
										<FormControl>
											<div className="mt-2">
												<input
													id="company"
													type="company"
													placeholder="Company"
													className="block w-full bg-neutral-100 dark:bg-background-darkAccent px-4 rounded-xl border-0 py-1.5  shadow-aceternity text-black placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm sm:leading-6 dark:text-white"
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="message"
								render={({ field }) => (
									<FormItem>
										<label
											htmlFor="message"
											className="block text-sm font-medium leading-6 text-neutral-700 dark:text-muted-dark"
										>
											Message
										</label>
										<FormControl>
											<div className="mt-2">
												<textarea
													rows={5}
													id="message"
													placeholder="Enter your message here"
													className="block w-full bg-neutral-100 dark:bg-background-darkAccent px-4 rounded-xl border-0 py-1.5  shadow-aceternity text-black placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm sm:leading-6 dark:text-white"
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div>
								<Button className="w-full rounded-xl">Submit</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</Form>
	);
}
