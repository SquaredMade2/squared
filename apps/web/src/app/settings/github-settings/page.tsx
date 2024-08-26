"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { getGithubUserData } from "@/store/userSettings/thunks";

const GithubIntegrationSettings: React.FC = () => {
	const dispatch = useAppDispatch();

	const ghToken = useAppSelector((state) => state.userSettings.ghAuthToken);

	useEffect(() => {
		dispatch(getGithubUserData(ghToken));
	}, [ghToken, dispatch]);

	return (
		<div className="flex mdsm:flex-col relative bg-card h-screen min-h-screen xs:p-0 w-full">
			{/* <div className="flex flex-col h-full w-full items-center bg-background pt-20 md:items-center sm:items-start sm:px-4 xs:pt-10 xs:px-4 ">
				<GithubSettings />
			</div> */}
		</div>
	);
};

export default GithubIntegrationSettings;
