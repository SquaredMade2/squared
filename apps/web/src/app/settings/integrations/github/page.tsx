"use client";
import { useSession } from "next-auth/react";
import SettingsTopNavBar from "@/components/SettingsTopNavBar";
import { GithubIcon } from "@/components/Svg";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const GithubSettings: React.FC = () => {
	const { data: session } = useSession();
	const authUser = session?.user;

	const handleClick = (): void => {
		if (!authUser?.id) {
			console.error("No authenticated user ID found");
			return;
		}

		window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI}&scope=repo,user&state=${authUser.id}`;
	};

	return (
		<div className="flex mdsm:flex-col relative bg-card h-screen min-h-screen xs:p-0 w-full">
			<div className="lg:hidden mdsm:visible bg-background">
				<SettingsTopNavBar />
			</div>
			<div className="flex flex-col h-full w-full items-center bg-background pt-20 md:items-center sm:items-start sm:px-4 xs:pt-10 xs:px-4">
				<div className="w-full md:px-20 lg:px-40 xl:px-80">
					<div className="flex flex-row items-center mb-8 space-x-6">
						<div className="flex flex-row justify-center items-center w-16 h-16 bg-white rounded-lg">
							<div className="w-[50px]">
								<GithubIcon />
							</div>
						</div>
						<header className="text-2xl text-foreground font-medium">
							Github
						</header>
					</div>

					{/* {isConnected ? (
							<Card className="p-6">
							<CardHeader>
								<CardTitle>Connected to GitHub</CardTitle>
								<CardDescription>Your connected repositories:</CardDescription>
							</CardHeader>
							<ul className="p-6">
								{connectedRepos.length > 0 ? (
								connectedRepos.map((repo) => <li key={repo}>{repo}</li>)
								) : (
								<p>No repositories connected.</p>
								)}
							</ul>
							<span className="p-6">
								<Button onClick={handleClick}>
								Edit selected repositories
								</Button>
							</span>
							</Card>
						) : ( */}
					<Card className="flex justify-between items-center p-2">
						<CardHeader>
							<CardTitle>Connect Personal Account</CardTitle>
							<CardDescription>
								Connect your personal account to use the integration feature
							</CardDescription>
						</CardHeader>
						<div className="flex justify-center items-center p-6">
							<Button
								onClick={handleClick}
								className="w-24 h-16 rounded-lg bg-secondary hover:bg-primary hover:text-white"
								variant="outline"
							>
								Connect
							</Button>
						</div>
					</Card>
					{/* )} */}
				</div>
			</div>
		</div>
	);
};

export default GithubSettings;
