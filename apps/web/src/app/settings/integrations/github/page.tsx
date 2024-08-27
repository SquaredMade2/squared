"use client";
import { useEffect } from "react";
import SettingsTopNavBar from "@/components/SettingsTopNavBar";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { navBarToggle } from "@/store/userSettings";
import { GithubIcon } from "@/components/Svg";

const GithubSettings: React.FC = () => {
	const dispatch = useAppDispatch();

	const showNavBar = useAppSelector((state) => state.userSettings.showNavBar);

	const handleNavToggle = (): void => {
		const navBarValue = !showNavBar;
		dispatch(navBarToggle(navBarValue));
	};

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const token = params.get("token");
		if (token) {
			console.log("Token received:", token);
			// Handle the token here, such as storing it in local storage or using it in your application
		}
	}, []);

	const handleClick = (): void => {
		window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI}&scope=repo,user`;
	};

	return (
		<div className="flex mdsm:flex-col relative bg-card h-screen min-h-screen xs:p-0 w-full">
			<div className="lg:hidden mdsm:visible bg-background">
				<SettingsTopNavBar setShowNavBar={handleNavToggle} />
			</div>
			<div className="flex flex-col h-full w-full items-center bg-background pt-20 md:items-center sm:items-start sm:px-4 xs:pt-10 xs:px-4">
				<div className="w-full md:px-20 lg:px-80">
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
					<span className="block w-full border-t border-border" />
					<div className="flex items-center justify-between space-x-60">
						<div className="flex flex-col justify-center h-24">
							<h3 className="text-2xl text-foreground font-medium">
								Connect Personal Account
							</h3>
							<header className="text-muted-foreground text-sm">
								Connect your personal account to use the integration feature
							</header>
						</div>
						<button
							type="button"
							onClick={handleClick}
							className="w-24 h-16 rounded-lg bg-secondary hover:bg-primary"
						>
							Connect
						</button>
					</div>
					<span className="block w-full border-t border-border" />
				</div>
			</div>
		</div>
	);
};

export default GithubSettings;
