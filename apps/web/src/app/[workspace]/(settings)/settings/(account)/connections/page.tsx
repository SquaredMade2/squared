"use client";

import { GoogleIcon } from "@/components/Svg";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { parseError } from "@/utils/parseError";
import { useUser } from "@clerk/nextjs";
import { Github } from "@squaredmade/icons";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Page = () => {
	const { user, isLoaded } = useUser();
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

			toast.success(
				`Successfully connected your ${
					strategy === "oauth_google" ? "Google" : "GitHub"
				} account.`,
			);
		} catch (error) {
			toast.error(
				`Failed to connect ${
					strategy === "oauth_google" ? "Google" : "GitHub"
				} account. ${parseError(error, "Please try again.")}`,
			);
		}
	};

	const handleDisconnectAccount = async (strategy: "google" | "github") => {
		if (!user) return;

		const externalAccount = user.externalAccounts.find(
			(account) => account.provider === strategy,
		);

		if (!externalAccount) {
			toast.error(
				`No ${strategy === "google" ? "Google" : "GitHub"} account found.`,
			);
			return;
		}

		try {
			await externalAccount.destroy();
			toast.success(
				`Successfully disconnected your ${
					strategy === "google" ? "Google" : "GitHub"
				} account.`,
			);
		} catch {
			toast.error(
				`Failed to disconnect ${
					strategy === "google" ? "Google" : "GitHub"
				} account. Please try again.`,
			);
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
			<div className="mx-auto max-w-4xl space-y-8">
				<div>
					<h1 className="font-bold text-3xl">Connected Accounts</h1>
					<p className="text-muted-foreground">
						Manage your connected accounts and integrations
					</p>
				</div>
				<Separator />
				<div className="space-y-6">
					<h2 className="font-semibold text-xl">Account Connections</h2>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-4">
								<GoogleIcon className="size-8" />
								<div>
									<h3 className="font-medium text-lg">Google</h3>
									<p className="text-muted-foreground text-sm">
										Connect your Google account for easier sign-in and access to
										Google services
									</p>
									{hasGoogle && (
										<p className="mt-1 font-medium text-foreground/80 text-sm">
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
								<Github className="mr-2 size-8" />
								<div>
									<h3 className="font-medium text-lg">GitHub</h3>
									<p className="text-muted-foreground text-sm">
										Connect your GitHub account to access repositories and
										collaborate on projects
									</p>
									{hasGithub && (
										<p className="mt-1 font-medium text-foreground/80 text-sm">
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
