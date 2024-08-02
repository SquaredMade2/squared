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
  headerWrapper:
    "flex flex-row items-center justify-center h-36 hover:bg-secondary",
  headerText: "flex flex-col justify-center  h-24",
  githubLogoWrapper:
    "flex flex-row justify-center items-center w-16 h-16 bg-white rounded-lg",
  githubIcon: "w-[50px]",
  pageWrapper: " sm:w-full sm:p-0 xs:w-full xl:w-2/5 md:w-3/4 ",
  titleWrapper: "flex flex-row items-center mb-8 space-x-6",
  title: "text-2xl text-foreground font-medium",
  subtitle: "text-muted-foreground text-sm",
  sectionWrapper: "flex items-center justify-between",
  button: "w-24 h-16 rounded-lg bg-secondary hover:bg-primary"
};

const GithubSettings: React.FC = () => {
  const dispatch = useAppDispatch();

  const showNavBar = useAppSelector((state) => state.userSettings.showNavBar);

  const handleNavToggle = (): void => {
    const navBarValue = !showNavBar;
    dispatch(navBarToggle(navBarValue));
  };

  const handleClick = (): void => {}

  return (
    <div className={styles.mainContainer}>
      <div className={styles.TopNavbar}>
        <SettingsTopNavBar setShowNavBar={handleNavToggle} />
      </div>
      <div className={styles.pageContainer}>
        <div className={styles.pageWrapper}>
          <div className={styles.titleWrapper}>
            <div className={styles.githubLogoWrapper}>
              <div className={styles.githubIcon}>
                <GithubIcon />
              </div>
            </div>
            <header className={styles.title}>Github</header>
          </div>
          <span className={styles.line} />

          <div className={styles.sectionWrapper}>
			<div className={styles.headerText}>
				<h3 className={styles.title}>Connect Personal Account</h3>
				<header className={styles.subtitle}>
				Connect your personal account to use the integration feature
				</header>
			</div>

			<button onClick={handleClick} className={styles.button}>
				Connect
			</button>
		  </div>

          <span className={styles.line} />
        </div>
      </div>
    </div>
  );
};

export default GithubSettings;
