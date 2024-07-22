import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Jest throws error if absolute imports are used here:
import { useAppSelector } from '../../../../hooks/typeScriptReduxHooks';
import { handleWorkspaceNameOverflow } from '../../../../utils/formatting';
import WorkspaceInitials from '@/components/WorkspaceImage';
import { WorkspaceNotFoundSVG, menuCheckMark } from '@/components/Svg';

const styles = {
  errorPage:
    'w-full h-screen text-3xl flex flex-col items-center justify-center text-foreground bg-background',
  errorH1: 'text-5xl font-semibold',
  header: 'text-gray-400',
  errorContainer: 'w-full h-1/2 flex flex-col items-center justify-around mb-20',
  homeButton:
    'w-1/7 h-20  duration-200 shadow-lg rounded focus:outline-none focus:shadow-sm active:shadow-3xl cursor-pointer hover:shadow-glow text-2xl px-5',
  email: 'mb-3 text-muted-foreground text-sm',
  workspacesWrapper: 'py-3 px-3.5',
  workspaces:
    'px-3 py-1.5 flex items-center hover:bg-popoverHover rounded text-sm font-medium cursor-default justify-between',
  dropDownWrapper:
    'w-64 mt-3 border border-border bg-popover z-40 rounded-lg pb-1 absolute transition-all duration-100',
  menuOpen: 'transform translate-y-0 scale-100 opacity-100 pointer-events-auto',
  menuClosed: 'transform -translate-y-6 scale-95 opacity-0 pointer-events-none',
  menuItemsWrapper: 'px-1.5',
  menuItems:
    'px-2 py-1.5 hover:bg-popoverHover rounded text-sm text-popover-foreground cursor-default',
  span: 'w-full border-t border-border block pb-1',
  flex: 'flex',
};

const WorkspaceNotFoundPage = (): React.ReactElement => {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  const user = useAppSelector((state) => state.userSettings.user);
  const allWorkspaces = useAppSelector((state) => state.taskData.workspaces);
  const { theme } = useAppSelector((state) => state.userSettings);
  const currentWorkspace = useAppSelector((state) => state.taskData.currentWorkspace);
  // This is used as a callback, it has to remain as () => void
  const handleOffClick: () => void = () => {
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  return (
    <div className={styles.errorPage} onClick={handleOffClick}>
      <div className={styles.errorContainer}>
        {WorkspaceNotFoundSVG()}
        <h1 className={styles.errorH1}>Workspace Not Found</h1>
        <h2 className={styles.header}> The workspace you are looking for can&apos;t be found. </h2>
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className={`${styles.homeButton} ${
            theme === 'dark' ? 'bg-blueButton' : 'bg-blueGlowLight border border-blueGlow'
          }`}
        >
          {' '}
          Select Another Workspace{' '}
        </button>
        {user && (
          <div
            className={`
                    ${styles.dropDownWrapper} 
                    ${menuOpen ? styles.menuOpen : styles.menuClosed}
                `}
          >
            <div className={styles.workspacesWrapper}>
              <p className={styles.email}>{user.email}</p>
              <ul>
                {allWorkspaces.map((workspace, index) => (
                  <Link
                    legacyBehavior
                    href={`workspace/${workspace.url}`}
                    className={styles.workspaces}
                    key={workspace._id}
                  >
                    <div className={styles.flex}>
                      <WorkspaceInitials
                        workspaceName={workspace.name}
                        backgroundColor={index}
                        location="workspaceList"
                      />
                      <li>{handleWorkspaceNameOverflow(workspace.name)}</li>
                    </div>
                    {workspace.name === currentWorkspace.name && (
                      <div>
                        <span>{menuCheckMark('#575BC7')}</span>
                      </div>
                    )}
                  </Link>
                ))}
              </ul>
            </div>
            <span className={styles.span} />
            <ul className={styles.menuItemsWrapper}>
              <li onClick={() => router.push('/join')} className={styles.menuItems}>
                Create or join a workspace
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceNotFoundPage;
