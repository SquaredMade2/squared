"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const LoginPage = () => {
	const router = useRouter();

	return (
		<div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-secondary/10 p-4">
			<Card className="w-full max-w-md shadow-lg dark:shadow-primary/5 bg-gradient-to-b from-primary/10 to-background">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						Sign in to your account
					</CardTitle>
				</CardHeader>
				<CardContent>
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
							},
						}}
						signUpForceRedirectUrl={"/welcome"}
					/>
				</CardContent>
				<CardFooter className="flex flex-col justify-center gap-2">
					<p className="text-sm text-muted-foreground">
						<Button
							variant="link"
							className="p-0"
							onClick={() => router.push("/forgot-password")}
						>
							Forgot password?
						</Button>
					</p>
					<p className="text-sm text-muted-foreground">
						Not a member?{" "}
						<Button
							variant="link"
							className="p-0 ml-2"
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
