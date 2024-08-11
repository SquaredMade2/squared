import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { authorizeGithubRedirect } from "@/store/userSettings/thunks";
import GithubUserInfo from "../GithubUserInfo";
import type { GithubIfAuthedDisplaySettingsProps } from "./GithubIfAuthedDisplaySettings";
import { useTheme } from "next-themes";

const GithubIfAuthedDisplaySettings = ({
	githubUser,
}: GithubIfAuthedDisplaySettingsProps) => {
	const { theme } = useTheme();
	return githubUser ? (
		<GithubUserInfo />
	) : (
		<div className="flex flex-row items-center w-full">
			<div className="flex flex-col">
				<label className="text-xl text-foreground font-medium">
					{" "}
					Connect personal account{" "}
				</label>
				<header className="text-muted-foreground text-sm mt-5">
					{" "}
					Connect Your Github Account to use the integration{" "}
				</header>
			</div>

			<button
				type="button"
				onClick={authorizeGithubRedirect}
				className={
					theme === "light"
						? "bg-blueGlowLight py-2 px-3 rounded text-blue shadow-lg active:shadow-lg hover:shadow-glow border border-blueGlow cursor-pointer ml-auto"
						: "bg-blueGlow py-2 px-3 rounded text-blue shadow-lg active:shadow-lg hover:shadow-glow border border-blueGlow cursor-pointer ml-auto"
				}
			>
				{" "}
				Connect{" "}
			</button>
		</div>
	);
};

export default GithubIfAuthedDisplaySettings;
