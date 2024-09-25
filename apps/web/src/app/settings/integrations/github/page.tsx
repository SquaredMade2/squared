"use client";
import { useEffect } from "react";
import SettingsTopNavBar from "@/components/SettingsTopNavBar";
import { GithubIcon } from "@/components/Svg";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWorkspaceStore } from "@/store/workspaces/store";

const GithubSettings: React.FC = () => {
	const workspaceId = useWorkspaceStore((state) => state.currentWorkspace?.id);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const token = params.get("token");
		if (token) {
			console.log("Token received:", token);
		}
	}, []);

	const handleClick = (): void => {
		if (!workspaceId) {
			console.error("No workspace ID found");
			return;
		}

		window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI}&scope=repo,user&state=${workspaceId}`;
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
					<Card className="flex justify-center items-center p-2">
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
				</div>
			</div>
		</div>
	);
};

export default GithubSettings;
