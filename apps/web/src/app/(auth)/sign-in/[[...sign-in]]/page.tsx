"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { SignIn, useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
	const router = useRouter();
	const { user, isLoaded } = useUser();
	const { toast } = useToast();
	const pathname = usePathname();
	const incorrectPassword = pathname.includes("factor-one");

	useEffect(() => {
		if (isLoaded && user) {
			console.log("loaded user", user);
			return router.push("/");
		}
		if (incorrectPassword) {
			toast({
				title: "Error",
				description: "Incorrect Password",
				variant: "destructive",
			});
		}
	}, [isLoaded, user, router]);

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4 dark:from-background dark:to-secondary/10">
			<Card className="w-full max-w-md bg-gradient-to-b from-primary/10 to-background shadow-lg dark:shadow-primary/5">
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
							elements: {
								formButtonPrimary:
									"bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full",
								card: "bg-transparent shadow-none",
								header: "hidden",
								footer: "hidden",
								formFieldLabel: "text-muted-foreground",
								socialButtonsBlockButton: "bg-primary/20",
								socialButtonsBlockButtonText: "text-foreground/80",
								formFieldAction: "text-primary/60",
								footerActionLink: "text-muted-foreground",
								alternativeMethodsBlockButton:
									"bg-primary/20 text-foreground/80",
								backLink: "text-muted-foreground",
								otpCodeFieldInput:
									"border border-primary hover:border-primary/60 focus:border-primary/60 text-primary-foreground",
								formResendCodeLink: "text-muted-foreground",
							},
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
