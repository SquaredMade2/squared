import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAllCurrentFilters } from '@/store/filterPage/actions';
import { navBarToggle } from '@/store/userSettings';
import type { RootState } from '@/store';
import { magnifyingGlass } from '@/components/Svg';
import { toggleNavBar, plusIcon, rightChevron } from '@/components/Svg';
import TopNavBarDisplay from '@/components/TopNavBarDisplay';
import WorkspaceInitials from '@/components/WorkspaceImage';
import type { handleNavbarType, handleSearchType } from '@/app/interfaces/Navbars.interfaces';
import { handleWorkspaceNameOverflow } from '@/utils/formatting';
import type { ViewTopNavBarProps } from './ViewTopNavBar.interfaces';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';

const styles = {
  nav: 'w-full items-center h-full flex',
  toggleNavBar: 'lg:hidden cursor-pointer z-50 ml-5',
  leftSide: 'flex items-center w-3/12 h-full',
  viewsText: 'ml-1 bg-card rounded text-foreground',
  starButton: 'ml-2 p-1 bg-card rounded hover:bg-background',
  rightSide: 'flex items-center w-9/12 justify-end h-[7vh] space-x-3',
  inputMain: 'flex items-center border border-solid border-border rounded ml-24',
  magnifyingGlassIcon: 'm-1',
  searchInput: 'bg-background text-muted-foreground rounded focus-visible:outline-none py-[7px]',
  displayButton: 'items-center border md:flex md:text-sm  hidden rounded m-1 p-0.5 text-foreground',
  newViewButton:
    'bg-card flex items-center border border-solid border-border md:flex md:text-sm hidden hidden rounded m-1 px-3 h-10 py-0.5 text-foreground space-x-2 cursor-pointer hover:bg-accent',
  header: 'max-w-screen',
  container: 'bg-background mt-5 flex flex-row w-full items-center space-x-4',
  workspace: 'flex flex-row items-center rounded-lg text-foreground',
  viewText: 'text-foreground',
  breadCrumb: 'space-x-4 flex items-center',
};

const ViewTopNavBar = ({ setSearchInput }: ViewTopNavBarProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const showNavBar = useSelector((state: RootState) => state.userSettings.showNavBar);
  const allWorkspaces = useSelector((state: RootState) => state.taskData.workspaces);
  const currentWorkspace = useSelector((state: RootState) => state.taskData.currentWorkspace);

  const currentTeam = useAppSelector((state) => state.taskData.currentTeam);

  const index: number = allWorkspaces.findIndex((item) => item._id === currentWorkspace._id);

  const handleNavBar: handleNavbarType = () => {
    const navBarValue = !showNavBar;
    dispatch(navBarToggle(navBarValue));
  };

  const handleSearch: handleSearchType = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement; // Type assertion
    setSearchInput(target.value);
  };

  const handleNewView = (): void => {
    dispatch(deleteAllCurrentFilters());
    router.push(`/workspace/${currentWorkspace.url}/${currentTeam.identifier}/views/new`);
  };

  return (
    <header>
      <nav className={styles.nav}>
        <div className={styles.leftSide}>
          <div
            onClick={() => {
              handleNavBar();
            }}
            className={styles.toggleNavBar}
          >
            {toggleNavBar({})}
          </div>
          <div className={styles.breadCrumb}>
            <div className={styles.workspace}>
              <WorkspaceInitials
                workspaceName={currentTeam.name}
                backgroundColor={index}
                location="workspaceMenu"
              />
              {handleWorkspaceNameOverflow(currentTeam.name)}
            </div>
            <div>{rightChevron()}</div>
            <div className={styles.viewText}>Views</div>
          </div>
          {/* <button className={styles.starButton}>{Star()}</button> -- commented out until feature added -Pinak */}
        </div>
        <div className={styles.rightSide}>
          <div className={styles.inputMain}>
            <div className={styles.magnifyingGlassIcon}>{magnifyingGlass()}</div>
            <input
              className={styles.searchInput}
              placeholder="Find a view..."
              onChange={(e) => {
                handleSearch(e);
              }}
            />
          </div>
          <TopNavBarDisplay />
          <button className={styles.newViewButton} onClick={handleNewView} type="button">
            <div>{plusIcon()}</div>
            <p>New View</p>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default ViewTopNavBar;
