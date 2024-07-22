import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ClickAwayListener } from '@mui/base';
import Navbar from '../NavBar';
import SettingsNavBar from '../SettingsNavBar';
import { useAppDispatch, useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { navBarToggle } from '@/store/userSettings';
import { useWindowSize } from '@/hooks/useWindowSize';

const CurrentNavbar = () => {
  const dispatch = useAppDispatch();

  const url = usePathname();

  const navbarRef = useRef<HTMLDivElement | null>(null);
  const [showNavBar, setShowNavBar] = useState<boolean>(true);
  const windowSize = useWindowSize();

  const navbarToggled = useAppSelector((state) => state.userSettings.showNavBar);

  useEffect(() => {
    setShowNavBar(navbarToggled);
  }, [navbarToggled]);

  const styles = {
    navbarWrapper: 'h-full mdsm:absolute -left-0 transition-all duration-300 ease-in-out z-20',
    toggleNav: 'lg:hidden mdsm:visible absolute top-6 left-2 border border-white',
    closedNavbar: 'h-full',
  };

  const renderNavbar: () => React.ReactElement = () => {
    return (
      <div
        ref={navbarRef}
        className={`${styles.navbarWrapper} ${showNavBar ? 'mdsm:-left-0' : 'mdsm:-left-[500px]'}`}
      >
        {url.includes('login') ||
        url.includes('password') ||
        url.includes('register') ||
        url.includes('confirmation') ||
        url === '/' ? (
          ''
        ) : (
          <Navbar />
        )}
      </div>
    );
  };

  const renderSettingsNavbar: () => React.ReactElement = () => {
    return (
      <div
        ref={navbarRef}
        className={`${styles.navbarWrapper} ${showNavBar ? 'mdsm:-left-0' : 'mdsm:-left-[500px]'}`}
      >
        <SettingsNavBar />
      </div>
    );
  };

  const renderNavbars: () => React.ReactElement = () => {
    return url.includes('settings') ? renderSettingsNavbar() : renderNavbar();
  };

  const handleClickOffDropdown: () => void = () => {
    if (navbarToggled) {
      dispatch(navBarToggle(false));
    }
  };

  useEffect(() => {
    if (windowSize[0] > 1024 && navbarToggled === true) {
      dispatch(navBarToggle(false));
    }
  }, [windowSize[0]]);

  const openedNavbar: () => React.ReactElement = () => {
    return (
      <ClickAwayListener onClickAway={handleClickOffDropdown}>
        <div className={styles.closedNavbar}>{renderNavbars()}</div>
      </ClickAwayListener>
    );
  };

  const closedNavbar: () => React.ReactElement = () => {
    return <div className={styles.closedNavbar}>{renderNavbars()}</div>;
  };

  return <div className="h-screen">{navbarToggled ? openedNavbar() : closedNavbar()}</div>;
};

export default CurrentNavbar;
