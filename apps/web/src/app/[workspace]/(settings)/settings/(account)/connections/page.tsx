"use client";

import { GoogleIcon } from "@/components/Svg";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { parseError } from "@/utils/parseError";
import { useUser } from "@clerk/nextjs";
import { Github } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
	const { user, isLoaded } = useUser();
	const { toast } = useToast();
	const router = useRouter();

	if (!isLoaded || !user) return null;

	const handleConnectAccount = async (
		strategy: "oauth_google" | "oauth_github",
	) => {
		if (!user) return;
		try {
			const externalAccount = await user.createExternalAccount({
				strategy,
				redirectUrl: window.location.href,
			});
			const externalVerificationUrl =
				externalAccount.verification?.externalVerificationRedirectURL;
			if (externalVerificationUrl) {
				router.push(externalVerificationUrl.href);
			} else {
				throw new Error("External verification URL not found");
			}

			toast({
				title: "Account connected",
				description: `Successfully connected your ${
					strategy === "oauth_google" ? "Google" : "GitHub"
				} account.`,
			});
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: `Failed to connect ${
					strategy === "oauth_google" ? "Google" : "GitHub"
				} account. ${parseError(error, "Please try again.")}`,
			});
		}
	};

	const handleDisconnectAccount = async (strategy: "google" | "github") => {
		if (!user) return;

		const externalAccount = user.externalAccounts.find(
			(account) => account.provider === strategy,
		);

		if (!externalAccount) {
			toast({
				variant: "destructive",
				title: "Error",
				description: `No ${
					strategy === "google" ? "Google" : "GitHub"
				} account found.`,
			});
			return;
		}

		try {
			await externalAccount.destroy();
			toast({
				title: "Account disconnected",
				description: `Successfully disconnected your ${
					strategy === "google" ? "Google" : "GitHub"
				} account.`,
			});
		} catch {
			toast({
				variant: "destructive",
				title: "Error",
				description: `Failed to disconnect ${
					strategy === "google" ? "Google" : "GitHub"
				} account. Please try again.`,
			});
		}
	};

	const getAccountDetails = (provider: "google" | "github"): string => {
		const account = user.externalAccounts.find(
			(account) => account.provider === provider,
		);
		let returnValue: string | undefined = "";
		if (account) {
			returnValue =
				provider === "google" ? account.emailAddress : account.username;
		}
		return returnValue ?? "";
	};

	const hasGoogle = user.externalAccounts.some(
		(account) => account.provider === "google",
	);
	const hasGithub = user.externalAccounts.some(
		(account) => account.provider === "github",
	);

	return (
		<div className="container py-10">
			<div className="max-w-4xl mx-auto space-y-8">
				<div>
					<h1 className="text-3xl font-bold">Connected Accounts</h1>
					<p className="text-muted-foreground">
						Manage your connected accounts and integrations
					</p>
				</div>
				<Separator />
				<div className="space-y-6">
					<h2 className="text-xl font-semibold">Account Connections</h2>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-4">
								<GoogleIcon className="size-8" />
								<div>
									<h3 className="text-lg font-medium">Google</h3>
									<p className="text-sm text-muted-foreground">
										Connect your Google account for easier sign-in and access to
										Google services
									</p>
									{hasGoogle && (
										<p className="text-sm font-medium mt-1 text-foreground/80">
											Connected: {getAccountDetails("google")}
										</p>
									)}
								</div>
							</div>
							{hasGoogle ? (
								<Button
									variant="outline"
									onClick={() => handleDisconnectAccount("google")}
								>
									Disconnect
								</Button>
							) : (
								<Button
									variant="outline"
									onClick={() => handleConnectAccount("oauth_google")}
								>
									Connect
								</Button>
							)}
						</div>
						<Separator />
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-4">
								<Github className="size-8 mr-2" />
								<div>
									<h3 className="text-lg font-medium">GitHub</h3>
									<p className="text-sm text-muted-foreground">
										Connect your GitHub account to access repositories and
										collaborate on projects
									</p>
									{hasGithub && (
										<p className="text-sm font-medium mt-1 text-foreground/80">
											Connected: {getAccountDetails("github")}
										</p>
									)}
								</div>
							</div>
							{hasGithub ? (
								<Button
									variant="outline"
									onClick={() => handleDisconnectAccount("github")}
								>
									Disconnect
								</Button>
							) : (
								<Button
									variant="outline"
									onClick={() => handleConnectAccount("oauth_github")}
								>
									Connect
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
