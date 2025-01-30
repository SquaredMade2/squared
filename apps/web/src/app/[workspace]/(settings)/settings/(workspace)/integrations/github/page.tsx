"use client";
import SettingsTopNavBar from "@/components/Settings/SettingsTopNavBar";
import { GithubIcon } from "@/components/Svg";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { userService } from "@/lib/services";
import { useUserStore } from "@/store";
import { TODO } from "@squared/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const GithubSettings: React.FC = () => {
	const { connectedRepos, user, setConnectedRepos } = useUserStore(
		(state) => state,
	);
	const router = useRouter();

	useEffect(() => {
		const getUserRepositories = async () => {
			if (user) {
				setConnectedRepos(
					await userService.getUserRepositories(TODO, {
						userId: user.externalId,
					}),
				);
			}
		};
		getUserRepositories();
	}, [user]);

	const handleClick = (): void => {
		if (!user?.id) return;

		router.push(
			`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_SERVER}/api/integration/github/oauth&scope=repo,user&state=${user.id}`,
		);
	};

	return (
		<div className="relative flex h-screen min-h-screen w-full bg-card xs:p-0 mdsm:flex-col">
			<div className="bg-background mdsm:visible lg:hidden">
				<SettingsTopNavBar />
			</div>
			<div className="flex h-full w-full flex-col items-center bg-background xs:px-4 pt-20 xs:pt-10 sm:items-start sm:px-4 md:items-center">
				<div className="w-full md:px-20 lg:px-40 xl:px-80">
					<div className="mb-8 flex flex-row items-center space-x-6">
						<div className="flex h-16 w-16 flex-row items-center justify-center rounded-lg bg-white">
							<div className="w-[50px]">
								<GithubIcon />
							</div>
						</div>
						<header className="font-medium text-2xl text-foreground">
							Github
						</header>
					</div>

					{/* Display Connected Repositories */}
					{connectedRepos.length > 0 ? (
						<Card className="p-6">
							<CardHeader>
								<CardTitle>Connected to GitHub</CardTitle>
								<CardDescription>Your connected repositories:</CardDescription>
							</CardHeader>
							<ul className="p-6">
								{connectedRepos.map((repo) => (
									<li key={repo}>{repo}</li>
								))}
							</ul>
							<span className="p-6">
								<Button onClick={handleClick}>
									Edit selected repositories
								</Button>
							</span>
						</Card>
					) : (
						<Card className="flex items-center justify-between p-2">
							<CardHeader>
								<CardTitle>Connect Personal Account</CardTitle>
								<CardDescription>
									Connect your personal account to use the integration feature
								</CardDescription>
							</CardHeader>
							<div className="flex items-center justify-center p-6">
								<Button
									onClick={handleClick}
									className="h-16 w-24 rounded-lg bg-secondary hover:bg-primary hover:text-foreground"
									variant="outline"
								>
									Connect
								</Button>
							</div>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
};

export default GithubSettings;
