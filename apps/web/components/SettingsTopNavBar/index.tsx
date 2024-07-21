import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import type { SettingsTopNavbarProps } from '@/components/SettingsTopNavBar/SettingsTopNavbar.interfaces';
import { backChevron, toggleNavBar } from '@/components/Svg';

const styles = {
  main: 'flex items-center',
  settingsWrapper: 'flex text-foreground items-center py-4 cursor-pointer',
  backButton: 'mr-2 cursor-pointer',
  toggleButton: 'px-4',
  underline: 'border-t border-border block',
};

const SettingsTopNavBar = ({ setShowNavBar }: SettingsTopNavbarProps) => {
  const router = useRouter();
  const workspace = useAppSelector((state) => state.taskData.currentWorkspace);

  return (
    <div>
      <div className={styles.main}>
        <span onClick={setShowNavBar} className={styles.toggleButton}>
          {toggleNavBar({})}
        </span>
        <div
          className={styles.settingsWrapper}
          onClick={() => router.push(`/workspace/${workspace.url}`)}
        >
          <span className={styles.backButton}>{backChevron()}</span>
          <h2>Settings</h2>
        </div>
      </div>
      <div>
        <span className={styles.underline} />
      </div>
    </div>
  );
};

export default SettingsTopNavBar;
