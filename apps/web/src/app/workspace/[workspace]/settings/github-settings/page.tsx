'use client';
import { useEffect } from 'react';
import SettingsTopNavBar from '@/components/SettingsTopNavBar';
import { useAppDispatch, useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { getGithubUserData } from '@/store/userSettings/thunks';
import GithubSettings from '@/components/GithubSettings';
import { navBarToggle } from '@/store/userSettings';

const styles = {
  mainContainer: 'flex mdsm:flex-col relative bg-card h-screen min-h-screen xs:p-0 w-full',
  pageContainer:
    'flex flex-col h-full w-full items-center bg-background pt-20 md:items-center sm:items-start sm:px-4 xs:pt-10 xs:px-4 ',
  TopNavbar: 'lg:hidden mdsm:visible bg-background',
  navbarWrapper: 'relative mdsm:absolute -left-0 transition-all duration-300 ease-in-out z-10',
};

const GithubIntegrationSettings: React.FC = () => {
  const dispatch = useAppDispatch();

  const ghToken = useAppSelector((state) => state.userSettings.ghAuthToken);

  const showNavBar = useAppSelector((state) => state.userSettings.showNavBar);

  useEffect(() => {
    dispatch(getGithubUserData(ghToken));
  }, []);

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
        <GithubSettings />
      </div>
    </div>
  );
};

export default GithubIntegrationSettings;
