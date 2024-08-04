"use client";
import SettingsTopNavBar from "@/components/SettingsTopNavBar";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { navBarToggle } from "@/store/userSettings";
import { GithubIcon } from "@/components/Svg";
import Link from "next/link";

const styles = {
  mainContainer:
    "flex mdsm:flex-col relative bg-card h-screen min-h-screen xs:p-0 w-full",
  pageContainer:
    "flex flex-col h-full w-full items-center bg-background pt-20 md:items-center sm:items-start sm:px-4 xs:pt-10 xs:px-4 ",
  integrationText: "text-xl text-foreground",
  TopNavbar: "lg:hidden mdsm:visible bg-background",
  navbarWrapper:
    "relative mdsm:absolute -left-0 transition-all duration-300 ease-in-out z-10",
  line: "block w-full border-t border-border",
  headerWrapper: "flex flex-row items-center h-36 hover:bg-secondary",
  headerText: "flex flex-col mx-5 h-20",
  githubLogoWrapper:
    "flex flex-row justify-center items-center w-20 h-16 bg-white rounded-lg ml-4",
  githubIcon: "w-[50px]",
  pageWrapper: " sm:w-full sm:p-0 xs:w-full xl:w-2/5 md:w-3/4 ",
  titleWrapper: "flex-col mb-8",
  title: "text-2xl text-foreground mb-3 font-medium",
  subtitle: "text-muted-foreground text-sm",
};

const IntegrationSettings: React.FC = () => {
  const dispatch = useAppDispatch();

  const showNavBar = useAppSelector((state) => state.userSettings.showNavBar);
  const currentWorkspace = useAppSelector(
    (state) => state.taskData.currentWorkspace
  );
  const currentWorkspaceUrl = currentWorkspace.url;

  const handleNavToggle = (): void => {
    const navBarValue = !showNavBar;
    dispatch(navBarToggle(navBarValue));
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.TopNavbar}>
        <SettingsTopNavBar setShowNavBar={handleNavToggle} />
      </div>
      <div className={styles.pageContainer}>
        <div className={styles.pageWrapper}>
          <div className={styles.titleWrapper}>
            <h3 className={styles.title}>Integrations</h3>
            <header className={styles.subtitle}>
              Enhance Squared experience by integrating add-ons
            </header>
          </div>
          <span className={styles.line} />

          <Link
            href={`/workspace/${currentWorkspaceUrl}/settings/integrations/github`}
          >
            <div className={styles.headerWrapper}>
              <div className={styles.githubLogoWrapper}>
                <div className={styles.githubIcon}>
                  <GithubIcon />
                </div>
              </div>
              <div className={styles.headerText}>
                <h3 className={styles.title}>Github</h3>
                <header className={styles.subtitle}>
                  Automate your pull request and commit workflows and keep
                  issues synced both ways
                </header>
              </div>
            </div>
          </Link>

          <span className={styles.line} />
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
