"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@squaredmade/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@squaredmade/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";

import { Button } from "./button";

const formSchema = z.object({
	company: z.string().min(1, "Please enter your company's name"),
	email: z.email("Please enter valid email").min(1, "Please enter email"),
	message: z.string().min(1, "Please enter your message"),
	name: z.string().min(1, "Please enter email"),
});

type LoginUser = z.infer<typeof formSchema>;

export function ContactForm() {
	const form = useForm<LoginUser>({
		defaultValues: {
			company: "",
			email: "",
			message: "",
			name: "",
		},
		resolver: zodResolver(formSchema),
	});

	function onSubmit(values: LoginUser) {
		// todo submit to actual inbox?

		// biome-ignore lint/suspicious/noConsole: Debugging purposes only
		console.log("submitted form", values);
	}

	return (
		<Card className="relative mt-28 bg-background">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 mx-auto w-full max-w-xl transform">
						<div>
							<h1 className="mt-8 font-bold text-4xl text-foreground leading-9 tracking-tight">
								Contact Us
							</h1>
							<p className="mt-4 max-w-sm text-foreground text-sm">
								We'd love to hear from you! Send us a message, and we'll respond
								as soon as possible.
							</p>
						</div>

						<div className="py-10">
							<div className="space-y-6">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<label
												className="block font-medium text-foreground text-sm leading-6"
												htmlFor={field.name}
											>
												Full Name
											</label>
											<FormControl>
												<div className="mt-2">
													<input
														className="block w-full rounded-xl border-0 bg-card px-4 py-1.5 text-foreground shadow-aceternity placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring sm:text-sm sm:leading-6"
														id={field.name}
														placeholder="Full Name"
														type="name"
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
												className="block font-medium text-foreground text-sm leading-6"
												htmlFor={field.name}
											>
												Email address
											</label>
											<FormControl>
												<div className="mt-2">
													<input
														className="block w-full rounded-xl border-0 bg-card px-4 py-1.5 text-foreground shadow-aceternity placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring sm:text-sm sm:leading-6"
														id={field.name}
														placeholder="Email"
														type="email"
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
												className="block font-medium text-foreground text-sm leading-6"
												htmlFor={field.name}
											>
												Company
											</label>
											<FormControl>
												<div className="mt-2">
													<input
														className="block w-full rounded-xl border-0 bg-card px-4 py-1.5 text-foreground shadow-aceternity placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring sm:text-sm sm:leading-6"
														id={field.name}
														placeholder="Company"
														type="company"
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
												className="block font-medium text-foreground text-sm leading-6"
												htmlFor={field.name}
											>
												Message
											</label>
											<FormControl>
												<div className="mt-2">
													<textarea
														className="block w-full rounded-xl border-0 bg-card px-4 py-1.5 text-foreground shadow-aceternity placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring sm:text-sm sm:leading-6"
														id={field.name}
														placeholder="Enter your message here"
														rows={5}
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
							</div>
						</div>
					</div>
				</form>
			</Form>
		</Card>
	);
}
