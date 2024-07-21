'use client';

import { useState, type ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import type { InputChangeEvent } from 'types';
import { updateProfile, getUser } from '@/store/userSettings/thunks';
import { useAppDispatch, useAppSelector } from '@/hooks/typeScriptReduxHooks';
import ProfileImage from '@/components/ProfileImage';
import SettingsTopNavBar from '@/components/SettingsTopNavBar';
import BlueButton from '@/components/BlueButton';
import { navBarToggle } from '@/store/userSettings';
import type { RootState } from '@/store';

const styles = {
  mainContainer: 'flex mdsm:flex-col bg-card h-screen min-h-screen w-full',
  pageContainer: 'flex flex-col h-full w-full items-center bg-background pt-20',
  pageWrapper: 'w-1/3 mdsm:w-3/4',
  title: 'text-2xl text-foreground mb-1 font-medium',
  profileSubTitle: 'text-muted-foreground text-sm',
  line: 'block w-full border-t border-border my-6',
  pictureTitle: 'text-foreground text-sm mb-1.5',
  emailTitle: 'text-foreground text-sm',
  email: 'text-muted-foreground text-sm',
  marginBottomSix: 'mb-6',
  fullNameTitle: 'text-foreground text-sm',
  input:
    'w-full border border-border rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-foreground py-1.5 px-3 text-sm mt-1.5 bg-textField',
  usernameTitleWrapper: 'flex items-center',
  usernameTitle: 'text-foreground text-sm',
  usernameSubTitle: 'text-muted-foreground font-normal text-xs ml-1',
  updateButtonLight:
    'mb-20 px-4 py-1 rounded text-white bg-purpleButtonHover hover:bg-purpleButton transition ease-out duration-100 box-content',
  updateButtonDark:
    'mb-20 px-4 py-1 rounded text-white bg-purpleButton hover:bg-purpleButtonHover transition ease-out duration-100 box-content',
  navbarWrapper: 'relative mdsm:absolute -left-0 transition-all duration-300 ease-in-out',
  TopNavbar: 'lg:hidden mdsm:visible bg-background',
  visible: 'opacity-0 transition-all duration-300 ease-in-out',
  notVisible: 'opacity-100 transition-all duration-300 ease-in-out',
};

export default function Profile(): ReactElement {
  const dispatch = useAppDispatch();

  const user = useSelector((state: RootState) => state.userSettings.user);
  const theme = useSelector((state: RootState) => state.userSettings.theme);

  const [fullName, setFullName] = useState<string>(user.name);
  const [username, setUsername] = useState<string>(user.username);
  const showNavBar = useAppSelector((state) => state.userSettings.showNavBar);

  const prevFullname = user.name;
  const prevUsername = user.username;
  const valueChanged = fullName !== prevFullname || username !== prevUsername;

  const handleUpdate = async () => {
    if (username.trim().length <= 0 || fullName.trim().length <= 0) {
      return toast.error('One or more fields can not be empty.');
    }
    if (valueChanged) {
      const data = { name: fullName, username, id: user._id };
      await dispatch(updateProfile(data));
      dispatch(getUser());
    }
  };

  const handlefullNameChange = (e: InputChangeEvent): void => {
    const newValue = e.target.value;
    setFullName(newValue);
  };

  const handleUsernameChange = (e: InputChangeEvent): void => {
    const newValue = e.target.value;
    setUsername(newValue);
  };

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
          <div>
            <h1 className={styles.title}>Profile</h1>
            <p className={styles.profileSubTitle}>Manage your Squared profile</p>
          </div>
          <span className={styles.line} />
          <p className={styles.pictureTitle}>Profile picture</p>
          <ProfileImage profileName={fullName} location="settings" />
          <div className={styles.marginBottomSix}>
            <p className={styles.emailTitle}>Email</p>
            <p className={styles.email}>{user.email}</p>
          </div>
          <div className={styles.marginBottomSix}>
            <p className={styles.fullNameTitle}>Full name</p>
            <input
              type="text"
              className={`${styles.input} ${theme === 'dark' ? 'bg-background' : 'bg-card'}`}
              value={fullName}
              onChange={handlefullNameChange}
            />
          </div>
          <div className={styles.marginBottomSix}>
            <div className={styles.usernameTitleWrapper}>
              <p className={styles.usernameTitle}>Username</p>
              <p className={styles.usernameSubTitle}>
                - Nickname or first name, however you want to be called in Squared
              </p>
            </div>
            <input
              type="text"
              className={`${styles.input} ${theme === 'dark' ? 'bg-background' : 'bg-card'}`}
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className={`${valueChanged ? styles.notVisible : styles.visible}`}>
            <BlueButton description="Update" handleAction={handleUpdate} />
          </div>
        </div>
      </div>
    </div>
  );
}
