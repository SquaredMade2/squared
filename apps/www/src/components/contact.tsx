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
import { z } from "zod";

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
												htmlFor={field.name}
												className="block font-medium text-foreground text-sm leading-6"
											>
												Full Name
											</label>
											<FormControl>
												<div className="mt-2">
													<input
														id={field.name}
														type="name"
														placeholder="Full Name"
														className="block w-full rounded-xl border-0 bg-card px-4 py-1.5 text-foreground shadow-aceternity placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring sm:text-sm sm:leading-6"
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
												htmlFor={field.name}
												className="block font-medium text-foreground text-sm leading-6"
											>
												Email address
											</label>
											<FormControl>
												<div className="mt-2">
													<input
														id={field.name}
														type="email"
														placeholder="Email"
														className="block w-full rounded-xl border-0 bg-card px-4 py-1.5 text-foreground shadow-aceternity placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring sm:text-sm sm:leading-6"
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
												htmlFor={field.name}
												className="block font-medium text-foreground text-sm leading-6"
											>
												Company
											</label>
											<FormControl>
												<div className="mt-2">
													<input
														id={field.name}
														type="company"
														placeholder="Company"
														className="block w-full rounded-xl border-0 bg-card px-4 py-1.5 text-foreground shadow-aceternity placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring sm:text-sm sm:leading-6"
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
												htmlFor={field.name}
												className="block font-medium text-foreground text-sm leading-6"
											>
												Message
											</label>
											<FormControl>
												<div className="mt-2">
													<textarea
														rows={5}
														id={field.name}
														placeholder="Enter your message here"
														className="block w-full rounded-xl border-0 bg-card px-4 py-1.5 text-foreground shadow-aceternity placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring sm:text-sm sm:leading-6"
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
