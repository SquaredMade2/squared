import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import Image from "next/image";

const GithubUserInfo = () => {
	const githubUser = useAppSelector((state) => state.userSettings.githubUser);
	if (githubUser) {
		return (
			<div className="flex flex-row items-center w-full">
				{/* Preferable to use standard html img than nextjs Image because it only allows for px measurements. */}
				<Image
					alt="Github User Avatar"
					className="w-10 h-10"
					src={githubUser.avatar_url}
				/>
				<header className="text-xl text-foreground mx-3 font-medium">
					{githubUser.login}
				</header>
			</div>
		);
	}
};

export default GithubUserInfo;
