'use client';
import React from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import { usePathname, useRouter } from 'next/navigation';
import { motion, useAnimation } from 'framer-motion';
import { setCurrentTeam } from '@/store/taskData';
import NewIssueModal from '@/components/NewIssueModal';
import WorkSpaceDropDown from '@/components/WorkSpaceDropdown';
import NewIssueButton from '@/components/NewIssueButton';
import NavBarTeams from '@/components/NavBarTeams';
import { NavSearchIcon } from '@/components/Svg';
import type { Team } from '@/store/taskData/taskData.interfaces';
import Link from 'next/link';

const styles = {
  header: 'flex items-center justify-center w-full lg:justify-center',
  main: 'flex flex h-full justify-center bg-popover border-r   w-[296px]',
  second: 'flex flex-col gap-4 lg:pt-1.5 pt-6 items-center text-nav w-full',
  projectTasklist: 'flex flex-row items-center cursor-pointer relative w-full',
  newIssueDiv: 'flex flex-row w-full justify-around ml-2',
  newIssueModalContainer: 'absolute top-[100px] left-full',
  newTaskButton: 'pr-36 pl-2 border shadow-lg rounded-md focus:outline-none',
  newTaskText: 'text-nav',
  searchButton:
    'rounded-md border border-border w-10 align-center flex justify-center bg-secondary shadow-lg focus:outline-none flex flex-row items-center cursor-pointer hover:bg-popover h-10 items-center',
  searchIconSVG: 'stroke-current fill-transparent cursor-pointer h-5 w-5',
  createWorkSpaceDiv: 'items-center',
  inviteDiv: 'flex flex-col gap-4 items-center pb-6 text-foreground h-full justify-end',
  userImg: 'text-xs',
  dropdownPostion: 'relative',
  teamsWrapper: 'w-full h-full left-5 mt-10 cursor-default text-foreground',
  themeButton: 'mr-3',
  stackIconButton: 'flex items-center cursor-pointer hover:bg-background',
  stackIconSVG: 'mr-2',
  row: 'w-full flex items-center my-1.5 rounded-md mr-3',
  innerDivSpan: 'text-sm m-2 text-popover-foreground font-semibold',
  triangle: 'transition-all 0.2s ease-in-out ml-1 z-30',
  fullWidth: 'w-full ml-1.5',
  ul: 'overflow-hidden',
  searchButtonDiv: 'ml-3.5',
  mainContainer: 'w-11/12 flex flex-col',
  inboxButton: 'w-full flex items-center h-9 hover:bg-secondary rounded-md cursor-pointer',
  hover: 'bg-secondary',
};

const Navbar = () => {
  const controls = useAnimation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const inboxPageChecker = pathname.includes('/inbox');
  const { user, theme } = useAppSelector((state) => state.userSettings);

  const workspace = useAppSelector((state) => state.taskData.currentWorkspace);

  const handleClick = (): void => {
    router.push(`/workspace/${workspace.url}/search`);
  };

  const handleTeamClick = (team: Team): void => {
    dispatch(setCurrentTeam(team));
    router.push(`/workspace/${workspace.url}/team/${team.identifier}/all`);
  };

  return (
    <div className={styles.main}>
      <div className={styles.mainContainer}>
        <div className={styles.second}>
          <div className={styles.projectTasklist}>
            <div className={styles.fullWidth}>
              <span className={styles.dropdownPostion}>
                <WorkSpaceDropDown />
              </span>
            </div>
          </div>
          <span className={styles.innerDivSpan}>{user?.name}</span>
          <div className={styles.newIssueDiv}>
            <NewIssueButton />
            <div className={styles.searchButtonDiv}>
              <button onClick={handleClick} type="button">
                <span className={styles.searchButton}>
                  <span>{NavSearchIcon(styles.searchIconSVG, theme)}</span>
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className={styles.teamsWrapper}>
          <div
            className={`${styles.row + styles.inboxButton} ${inboxPageChecker && styles.hover} `}
            onClick={() => {
              router.push(`/workspace/${workspace.url}/inbox`);
            }}
          >
            <div className={`${styles.innerDivSpan}`}>Inbox</div>
          </div>

          <div className={styles.row}>
            <span className={styles.innerDivSpan}>Your teams</span>
          </div>
          <motion.ul
            className={styles.ul}
            initial={{ height: 'auto' }}
            animate={controls}
            transition={{ duration: 0.1 }}
          >
            {workspace?.teams.map((team: Team) => {
              return (
                <NavBarTeams
                  key={team._id}
                  id={team._id}
                  teamName={team.name}
                  onDropdownClick={() => handleTeamClick(team)}
                  teamIdentifier={team.identifier}
                />
              );
            })}
          </motion.ul>
        </div>
        <div className={styles.newIssueModalContainer}>
          <NewIssueModal />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
