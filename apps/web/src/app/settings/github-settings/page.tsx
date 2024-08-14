"use client";

import { useEffect } from "react";
import SettingsTopNavBar from "@/components/SettingsTopNavBar";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { getGithubUserData } from "@/store/userSettings/thunks";
import GithubSettings from "@/components/GithubSettings";
import { navBarToggle } from "@/store/userSettings";

const GithubIntegrationSettings: React.FC = () => {
  const dispatch = useAppDispatch();

  const ghToken = useAppSelector((state) => state.userSettings.ghAuthToken);
  const showNavBar = useAppSelector((state) => state.userSettings.showNavBar);

  useEffect(() => {
    dispatch(getGithubUserData(ghToken));
  }, [ghToken, dispatch]);

  const handleNavToggle = (): void => {
    const navBarValue = !showNavBar;
    dispatch(navBarToggle(navBarValue));
  };

  return (
    <div className="flex mdsm:flex-col relative bg-card h-screen min-h-screen xs:p-0 w-full">
      <div className="lg:hidden mdsm:visible bg-background">
        <SettingsTopNavBar setShowNavBar={handleNavToggle} />
      </div>

      {/* <div className="flex flex-col h-full w-full items-center bg-background pt-20 md:items-center sm:items-start sm:px-4 xs:pt-10 xs:px-4 ">
				<GithubSettings />
			</div> */}
    </div>
  );
};

export default GithubIntegrationSettings;
