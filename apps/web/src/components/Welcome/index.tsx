import React from 'react';
import { useSelector } from 'react-redux';
import type { UserSettingsState } from '@/store/userSettings/userSettings.interfaces';
import type { WelcomeProps } from './Welcome.interfaces';

const styles = {
  mainContainer: 'h-screen w-full flex items-center justify-center bg-card',
  mainWrapper: 'w-11/12 flex flex-col items-center justify-center text-center',
  title: 'text-foreground text-6xl xs:text-4xl font-bold mb-4',
  description: 'text-muted-foreground font-medium mb-8 xs:text-sm',
  continueButtonDark:
    'w-11/12 max-w-xs h-12 bg-purpleButton hover:bg-purpleButtonHover rounded text-white font-medium transition ease-out duration-100 box-content xs:w-full',
  continueButtonLight:
    'w-11/12 max-w-xs h-12 bg-purpleButtonHover hover:bg-purpleButton rounded text-white font-medium transition ease-out duration-100 box-content xs:w-full',
};

const Welcome = ({ handleNextPage }: WelcomeProps) => {
  const theme = useSelector((state: UserSettingsState) => state.theme);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.mainWrapper}>
        <h1 className={styles.title}>Welcome to Squared</h1>
        <p className={styles.description}>
          Squared optimizes software development, iterations, and bug fixes.
        </p>
        <button
          type="button"
          className={`${
            theme === 'light' ? styles.continueButtonLight : styles.continueButtonDark
          }`}
          onClick={handleNextPage}
        >
          Get started
        </button>
      </div>
    </div>
  );
};

export default Welcome;
