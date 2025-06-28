"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { client } from "@/lib/client"; // Assuming this is where your API client is exported
import { useUser } from "@clerk/nextjs";
import { Button } from "@squaredmade/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@squaredmade/ui/card";
import { toast } from "@squaredmade/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WelcomePage() {
	const { user, isLoaded: isUserLoaded } = useUser();
	const router = useRouter();

	const mutation = useMutation({
		mutationFn: (userData: {
			name: string;
			email: string;
			externalId: string;
			username: string | null;
		}) => client.auth.register.$post(userData).then((res) => res.json()),
		onSuccess: ({ message }) => {
			toast.success(message);
			router.push("/");
		},
		onError: (error) => {
			toast.error("Error registering user");
		},
	});

	useEffect(() => {
		if (isUserLoaded && user) {
			// Ensure we have all required fields before calling the API
			if (user.fullName && user.emailAddresses.length > 0) {
				mutation.mutate({
					name: user.fullName,
					email: user.emailAddresses[0].emailAddress,
					externalId: user.id,
					username: user.username,
				});
			} else {
				// You might want to handle this case, perhaps by redirecting to a profile completion page
			}
		}
	}, [isUserLoaded, user]);

	if (!isUserLoaded || mutation.isPending) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<SquaredLoader />
			</div>
		);
	}

	if (mutation.isError) {
		return (
			<div className="flex min-h-screen w-full items-center justify-center bg-linear-to-b from-background to-secondary/20 p-4 dark:from-background dark:to-secondary/10">
				<Card className="w-full max-w-md bg-linear-to-b from-primary/10 to-background shadow-lg dark:shadow-primary/5">
					<CardHeader>
						<CardTitle className="text-center font-bold text-2xl">
							Oops! Something went wrong
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="mb-4 text-center text-muted-foreground">
							We couldn't complete your registration. Please try again or
							contact support.
						</p>
						<p className="text-center text-destructive text-sm">
							{mutation.error instanceof Error
								? mutation.error.message
								: "An unknown error occurred"}
						</p>
						<Button onClick={() => mutation.reset()} className="mt-4 w-full">
							Try Again
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-linear-to-b from-background to-secondary/20 p-4 dark:from-background dark:to-secondary/10">
			<Card className="w-full max-w-md bg-linear-to-b from-primary/10 to-background shadow-lg dark:shadow-primary/5">
				<CardHeader>
					<CardTitle className="text-center font-bold text-2xl">
						Welcome to Squared!
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col items-center justify-center">
					<p className="mb-8 text-center text-muted-foreground">
						We're setting up your account. You'll be redirected to your
						dashboard shortly.
					</p>
					<SquaredLoader />
				</CardContent>
			</Card>
		</div>
	);
}
