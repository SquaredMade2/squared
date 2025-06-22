"use client";

import { SignUp, useUser } from "@clerk/nextjs";
import { Button } from "@squaredmade/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@squaredmade/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authStyles } from "../../authStyles";

const RegisterPage = () => {
	const router = useRouter();
	const { user, isLoaded } = useUser();

	useEffect(() => {
		if (isLoaded && user) {
			router.push("/");
		}
	}, [isLoaded, user, router]);

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-linear-to-b from-background to-secondary/20 p-4 dark:from-background dark:to-secondary/10">
			<Card className="w-full max-w-md bg-linear-to-b from-primary/10 to-background shadow-lg dark:shadow-primary/5">
				<CardHeader className="space-y-1">
					<CardTitle className="text-center font-bold text-2xl">
						Sign up for an account
					</CardTitle>
				</CardHeader>
				<CardContent>
					<SignUp
						appearance={{
							elements: authStyles,
						}}
						fallbackRedirectUrl="/welcome"
						signInForceRedirectUrl="/"
					/>
				</CardContent>
				<CardFooter className="flex flex-col justify-center gap-2">
					<p className="text-muted-foreground text-sm">
						Already a member?{" "}
						<Button
							className="ml-2 p-0"
							onClick={() => router.push("/sign-in")}
							variant="link"
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
