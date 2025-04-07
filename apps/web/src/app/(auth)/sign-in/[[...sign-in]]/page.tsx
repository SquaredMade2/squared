"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import { Button } from "@squaredmade/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@squaredmade/ui/card";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { authStyles } from "../../authStyles";

const LoginPage = () => {
	const router = useRouter();
	const { user, isLoaded } = useUser();
	const pathname = usePathname();
	const incorrectPassword = pathname.includes("factor-one");

	useEffect(() => {
		if (isLoaded && user) {
			return router.push("/");
		}
	}, [isLoaded, user, router]);

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-linear-to-b from-background to-secondary/20 p-4 dark:from-background dark:to-secondary/10">
			<Card className="w-full max-w-md bg-linear-to-b from-primary/10 to-background shadow-lg dark:shadow-primary/5">
				<CardHeader className="space-y-1">
					<CardTitle className="text-center font-bold text-2xl">
						Sign in to your account
					</CardTitle>
				</CardHeader>
				<CardContent>
					{incorrectPassword && (
						<CardDescription className="text-center text-destructive/60">
							Incorrect Password, please try again or choose another
							authentication method
						</CardDescription>
					)}
					<SignIn
						appearance={{
							elements: authStyles,
						}}
						signUpForceRedirectUrl={"/welcome"}
					/>
				</CardContent>
				<CardFooter className="flex flex-col justify-center gap-2">
					<p className="text-muted-foreground text-sm">
						<Button
							variant="link"
							className="p-0"
							onClick={() => router.push("/forgot-password")}
						>
							Forgot password?
						</Button>
					</p>
					<p className="text-muted-foreground text-sm">
						Not a member?{" "}
						<Button
							variant="link"
							className="ml-2 p-0"
							onClick={() => router.push("/sign-up")}
						>
							Sign up for free
						</Button>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
};

export default LoginPage;
