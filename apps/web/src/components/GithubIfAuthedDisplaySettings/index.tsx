import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { authorizeGithubRedirect } from '@/store/userSettings/thunks';
import GithubUserInfo from '../GithubUserInfo';
import type { GithubIfAuthedDisplaySettingsProps } from './GithubIfAuthedDisplaySettings';

const styles = {
  ghUserImage: 'w-10 h-10',
  smTitle: 'text-xl text-foreground font-medium',
  username: 'text-xl text-foreground mx-3 font-medium',
  subtitle: 'text-muted-foreground text-sm mt-5',
  userExists: 'flex flex-row items-center w-full',
  ButtonLight:
    'bg-blueGlowLight py-2 px-3 rounded text-blue shadow-lg active:shadow-lg hover:shadow-glow border border-blueGlow cursor-pointer ml-auto',
  ButtonDark:
    'bg-blueGlow py-2 px-3 rounded text-blue shadow-lg active:shadow-lg hover:shadow-glow border border-blueGlow cursor-pointer ml-auto',
  userNotExists: 'flex flex-row items-center w-full',
  col: 'flex flex-col',
};

const GithubIfAuthedDisplaySettings = ({ githubUser }: GithubIfAuthedDisplaySettingsProps) => {
  const theme = useAppSelector((state) => state.userSettings.theme);
  return githubUser ? (
    <GithubUserInfo />
  ) : (
    <div className={styles.userNotExists}>
      <div className={styles.col}>
        <label className={styles.smTitle}> Connect personal account </label>
        <header className={styles.subtitle}>
          {' '}
          Connect Your Github Account to use the integration{' '}
        </header>
      </div>

      <button
        type="button"
        onClick={authorizeGithubRedirect}
        className={theme === 'light' ? styles.ButtonLight : styles.ButtonDark}
      >
        {' '}
        Connect{' '}
      </button>
    </div>
  );
};

export default GithubIfAuthedDisplaySettings;
