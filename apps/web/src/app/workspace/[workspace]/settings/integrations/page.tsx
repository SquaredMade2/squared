"use client";
import SettingsTopNavBar from "@/components/StatusDropdown/SettingsTopNavBar";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { navBarToggle } from "@/store/userSettings";
import { GithubIcon } from "@/components/Svg";
import Link from "next/link";

const IntegrationSettings: React.FC = () => {
	const dispatch = useAppDispatch();

	const showNavBar = useAppSelector((state) => state.userSettings.showNavBar);
	const currentWorkspace = useAppSelector(
		(state) => state.taskData.currentWorkspace,
	);
	const currentWorkspaceUrl = currentWorkspace.url;

	const handleNavToggle = (): void => {
		const navBarValue = !showNavBar;
		dispatch(navBarToggle(navBarValue));
	};

	return (
		<div className="flex mdsm:flex-col relative bg-card h-screen min-h-screen xs:p-0 w-full">
			<div className="lg:hidden mdsm:visible bg-background">
				<SettingsTopNavBar setShowNavBar={handleNavToggle} />
			</div>
			<div className="flex flex-col h-full w-full items-center bg-background pt-20 md:items-center sm:items-start sm:px-4 xs:pt-10 xs:px-4">
				<div className="sm:w-full sm:p-0 xs:w-full xl:w-2/5 md:w-3/4">
					<div className="flex-col mb-8">
						<h3 className="text-2xl text-foreground mb-3 font-medium">
							Integrations
						</h3>
						<header className="text-muted-foreground text-sm">
							Enhance Squared experience by integrating add-ons
						</header>
					</div>
					<span className="block w-full border-t border-border" />

					<Link
						href={`/workspace/${currentWorkspaceUrl}/settings/integrations/github`}
					>
						<div className="flex flex-row items-center h-36 hover:bg-secondary">
							<div className="flex flex-row justify-center items-center w-20 h-16 bg-white rounded-lg ml-4">
								<div className="w-[50px]">
									<GithubIcon />
								</div>
							</div>
							<div className="flex flex-col mx-5 h-20">
								<h3 className="text-2xl text-foreground mb-3 font-medium">
									Github
								</h3>
								<header className="text-muted-foreground text-sm">
									Automate your pull request and commit workflows and keep
									issues synced both ways
								</header>
							</div>
						</div>
					</Link>

					<span className="block w-full border-t border-border" />
					{/* Use format below for additional integration options */}
					{/* <div className={styles.headerWrapper}>
            <div className={styles.githubLogoWrapper}>
              <div className={styles.githubIcon}>
                <GithubIcon />
              </div>
            </div>
            <div className={styles.headerText}>
              <h3 className={styles.title}>Other Integrations</h3>
              <header className={styles.subtitle}>
                For other integrations
              </header>
            </div>
          </div> */}
				</div>
			</div>
		</div>
	);
};

export default IntegrationSettings;
