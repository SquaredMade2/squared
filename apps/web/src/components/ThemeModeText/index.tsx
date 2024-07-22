import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { lightMode, darkMode } from '@/components/Svg';
import { handleTheme } from '@/store/userSettings';
import type { ThemeModeTextProps } from './ThemeModeText.interfaces';
import type { RootState } from '@/store';

const styles = {
  container: 'bg-card h-screen w-full flex flex-col items-center justify-center text-center',
  title: 'text-foreground text-2xl font-medium mb-3',
  subTitle: 'text-muted-foreground text-base mb-8',
  themeContainer:
    'flex w-[600px] xs:w-11/12 h-48 border border-border text-foreground rounded-lg font-medium',
  buttonLight: 'w-1/2 box-border border-border border-r flex items-center justify-center flex-col',
  buttonDark: 'w-1/2 rounded-r-lg flex flex-col items-center justify-center',
  selected: 'bg-taskHeader',
  svgWrapper: 'w-3/5 h-auto my-3 flex items-center justify-center',
  continueButtonDark:
    'w-11/12 max-w-xs h-12 bg-purpleButton hover:bg-purpleButtonHover rounded text-white font-medium mt-12 transition ease-out duration-100 box-content',
  continueButtonLight:
    'w-11/12 max-w-xs h-12 bg-purpleButtonHover hover:bg-purpleButton rounded text-white font-medium mt-12 transition ease-out duration-100 box-content',
};

const ThemeModeText = ({ handleNextPage }: ThemeModeTextProps) => {
  const dispatch = useDispatch();

  const theme = useSelector((state: RootState) => state.userSettings.theme);
  const selected = 'border-solid border-2 border-onboardingTheme rounded';

  return (
    <div className={styles.container}>
      <span className={styles.title}>Choose your style </span>
      <span className={styles.subTitle}>
        You can change the UI style at any time through the command menu or in the settings.
      </span>
      <div className={styles.themeContainer}>
        {theme === 'light' && (
          <>
            <div
              className={`${styles.buttonLight} ${styles.selected}`}
              onClick={() => dispatch(handleTheme('light'))}
            >
              <div className={styles.svgWrapper}>{lightMode(selected)}</div>
              <p>Light</p>
            </div>
            <div className={styles.buttonDark} onClick={() => dispatch(handleTheme('dark'))}>
              <div className={styles.svgWrapper}>{darkMode('')}</div>
              <p>Dark</p>
            </div>
          </>
        )}
        {theme === 'dark' && (
          <>
            <div className={styles.buttonLight} onClick={() => dispatch(handleTheme('light'))}>
              <div className={styles.svgWrapper}>{lightMode('')}</div>
              <p>Light</p>
            </div>
            <div
              className={`${styles.buttonDark} ${styles.selected}`}
              onClick={() => dispatch(handleTheme('dark'))}
            >
              <div className={styles.svgWrapper}>{darkMode(selected)}</div>
              <p>Dark</p>
            </div>
          </>
        )}
      </div>
      <button
        type="button"
        className={`${theme === 'light' ? styles.continueButtonLight : styles.continueButtonDark}`}
        onClick={handleNextPage}
      >
        Continue
      </button>
    </div>
  );
};

export default ThemeModeText;
