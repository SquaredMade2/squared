"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { SignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const RegisterPage = () => {
	const router = useRouter();
	const { user, isLoaded } = useUser();

	useEffect(() => {
		if (isLoaded && user) {
			router.push("/");
		}
	}, [isLoaded, user, router]);

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4 dark:from-background dark:to-secondary/10">
			<Card className="w-full max-w-md bg-gradient-to-b from-primary/10 to-background shadow-lg dark:shadow-primary/5">
				<CardHeader className="space-y-1">
					<CardTitle className="text-center font-bold text-2xl">
						Sign up for an account
					</CardTitle>
				</CardHeader>
				<CardContent>
					<SignUp
						appearance={{
							elements: {
								formButtonPrimary:
									"bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full",
								card: "bg-transparent shadow-none",
								header: "hidden",
								footer: "hidden",
								formFieldLabel: "text-muted-foreground",
								formResendCodeLink: "text-muted-foreground",
								socialButtonsBlockButton: "bg-primary/20",
								socialButtonsBlockButtonText: "text-foreground/80",
								otpCodeFieldInput:
									"flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground/80",
							},
						}}
						signInForceRedirectUrl={"/"}
						fallbackRedirectUrl={"/welcome"}
					/>
				</CardContent>
				<CardFooter className="flex flex-col justify-center gap-2">
					<p className="text-muted-foreground text-sm">
						Already a member?{" "}
						<Button
							variant="link"
							className="ml-2 p-0"
							onClick={() => router.push("/sign-in")}
						>
							Log in
						</Button>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
};

export default RegisterPage;
