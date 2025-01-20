"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { Button } from "@squared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@squared/ui/card";
import { useToast } from "@squared/ui/hooks";
import { client } from "@/lib/client"; // Assuming this is where your API client is exported
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WelcomePage() {
	const { user, isLoaded: isUserLoaded } = useUser();
	const router = useRouter();
	const { toast } = useToast();

	const mutation = useMutation({
		mutationFn: (userData: {
			name: string;
			email: string;
			externalId: string;
			username: string | null;
		}) =>
			client.authentication.register.$post(userData).then((res) => res.json()),
		onSuccess: ({ message }) => {
			toast({ title: message });
			router.push("/");
		},
		onError: (error) => {
			console.error("Error registering user", error);
			toast({ title: "Error registering user", variant: "destructive" });
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
				console.error("Missing required user information");
				// You might want to handle this case, perhaps by redirecting to a profile completion page
			}
		}
	}, [isUserLoaded, user]);

	if (!isUserLoaded || mutation.isPending) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<SquaredLoader />
			</div>
		);
	}

	if (mutation.isError) {
		return (
			<div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-secondary/10 p-4">
				<Card className="w-full max-w-md shadow-lg dark:shadow-primary/5 bg-gradient-to-b from-primary/10 to-background">
					<CardHeader>
						<CardTitle className="text-2xl font-bold text-center">
							Oops! Something went wrong
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-center text-muted-foreground mb-4">
							We couldn't complete your registration. Please try again or
							contact support.
						</p>
						<p className="text-destructive text-sm text-center">
							{mutation.error instanceof Error
								? mutation.error.message
								: "An unknown error occurred"}
						</p>
						<Button onClick={() => mutation.reset()} className="w-full mt-4">
							Try Again
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-secondary/10 p-4">
			<Card className="w-full max-w-md shadow-lg dark:shadow-primary/5 bg-gradient-to-b from-primary/10 to-background">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-center">
						Welcome to Squared!
					</CardTitle>
				</CardHeader>
				<CardContent className="justify-center flex flex-col items-center">
					<p className="text-center text-muted-foreground mb-8">
						We're setting up your account. You'll be redirected to your
						dashboard shortly.
					</p>
					<SquaredLoader />
				</CardContent>
			</Card>
		</div>
	);
}
