import React from 'react';
import { useSelector } from 'react-redux';
import type { CommandMenuProps } from './CommandMenu.interfaces';
import type { RootState } from '@/store';
import { cmdIcon } from '../Svg';

const styles = {
  mainContainer: 'h-screen w-full flex flex-col items-center justify-center bg-card',
  title: 'text-nav text-3xl mb-3 font-medium',
  description: 'text-muted-foreground font-medium mb-8',
  commandContainer:
    ' flex flex-col border border-border min-w-[600px] px-6 py-8 rounded-lg items-center',
  commandDescription: 'text-nav font-medium mb-6',
  iconWrapper: 'flex flex-row items-center',
  kWrapper:
    'bg-accent rounded-lg px-6 py-2 shadow-custom-black flex items-center m-1.5 justify-center',
  kText: 'text-6xl text-nav font-medium',
  commandWrapper:
    'bg-accent h-14 w-14 py-2.5 shadow-custom-black px-4 rounded-lg m-1.5 items-center justify-center box-content',
  continueButton:
    'w-80 h-12 border border-border mt-12 text-nav rounded hover:bg-background font-medium transition ease-out duration-100',
};

const CommandMenu = ({ handleNextPage }: CommandMenuProps) => {
  const theme = useSelector((state: RootState) => state.userSettings.theme);

  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.title}>Command menu </h1>
      <p className={styles.description}>
        Use the contextual menu to mange one or more issues in any given view you are in.
      </p>

      <div className={styles.commandContainer}>
        <span className={styles.commandDescription}>Try opening command menu with :</span>
        <div className={styles.iconWrapper}>
          <div className={styles.commandWrapper}>
            <span>{cmdIcon(theme)}</span>
          </div>

          <div className={styles.kWrapper}>
            <p className={styles.kText}> K</p>
          </div>
        </div>
      </div>
      <button type="button" className={styles.continueButton} onClick={handleNextPage}>
        Continue
      </button>
    </div>
  );
};

export default CommandMenu;
