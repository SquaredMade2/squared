import type React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { motion, useAnimation } from 'framer-motion';
import type { getTeamInfoType, handleActiveParamsType } from '@/app/interfaces/Navbars.interfaces';

import type { Team as TaskDataTeam } from '@/store/taskData/taskData.interfaces';

import { DropdownTriangle, TeamIcon, IssuesIcon, ViewsStackIcon } from '@/components/Svg';
import { useRouter } from 'next/navigation';
import { getTeam } from '@/store/taskData/thunks';
import type { NavBarTeamProps } from './NavBarTeams.interfaces';

const styles = {
  wrapper: 'w-60 h-64',
  container: 'pl-8 w-full bg-accent overflow-hidden',
  row: 'w-full flex items-center my-1.5 hover:bg-secondary rounded-md pl-0.5',
  listSpan: 'flex items-center',
  innerDiv: 'w-full border-y-0 border-r-0 border-l border-l-slate-600 pl-2 ml-1.5 my-0.5',
  innerDivSpan: 'pl-2 cursor-pointer',
  button: 'flex items-center cursor-pointer',
  svg: 'mr-2 p-0.5 rounded',
  triangle: 'transition-all 0.2s ease-in-out ml-1',
  listWrapper: 'w-full bg-accent z-10',
  viewsButton: 'w-full',
};

const NavBarTeams = ({
  teamName,
  id,
  onDropdownClick,
  teamIdentifier,
}: NavBarTeamProps): React.ReactElement => {
  const dispatch = useAppDispatch();
  const controls = useAnimation();
  const [tasklistToggle, setTasklistToggle] = useState(false);
  const [isHovered, setIsHovered] = useState<string>('#858699');
  const theme = useAppSelector((state) => state.userSettings.theme);
  const currentWorkspace = useAppSelector((state) => state.taskData.currentWorkspace);
  const router = useRouter();

  const handleActiveParams: handleActiveParamsType = (param: string): void => {
    if (teamIdentifier) {
      router.push(`/workspace/${currentWorkspace.url}/team/${teamIdentifier}/${param}`);
    } else {
      console.error('Team identifier not found');
    }
  };

  const handleToggle = (): void => {
    if (tasklistToggle) {
      controls.start({ height: 0 });
    } else {
      controls.start({ height: 'auto' });
    }
    setTasklistToggle(!tasklistToggle);
  };

  const handleMouseEnter = () => {
    theme === 'light' ? setIsHovered('black') : setIsHovered('white');
  };

  const handleMouseLeave = () => {
    setIsHovered('#858699');
  };

  const getTeamInfo: getTeamInfoType = async (teamIdArray: TaskDataTeam[]): Promise<void> => {
    try {
      await axios({
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_SERVER}/team/getTeamInfo`,
        withCredentials: true,
        params: {
          teamIdArray,
        },
      });
    } catch (error) {}
  };

  const getTeamOnSelect: () => void = () => {
    dispatch(getTeam(teamIdentifier));
  };

  const handleViewsButtonClick: () => void = () => {
    handleActiveParams('views');
    getTeamOnSelect();
  };

  useEffect(() => {
    getTeamInfo(currentWorkspace.teams);
  }, []);

  return (
    <li key={id} className={styles.listWrapper}>
      <div className={styles.row} onClick={() => handleToggle()}>
        <div className={styles.row}>
          <div className={styles.svg}>{<TeamIcon />}</div>
          <span className={styles.button}>{teamName}</span>
          <DropdownTriangle
            className={tasklistToggle ? `rotate-90 ${styles.triangle}` : styles.triangle}
          />
        </div>
      </div>
      <motion.div
        className={styles.container}
        initial={{ height: 0 }}
        animate={controls}
        transition={{ duration: 0.2 }}
      >
        <div
          className={`${styles.row} group`}
          onClick={onDropdownClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className={styles.button} type="button">
            <div className={`${styles.svg}`}>{<IssuesIcon fill={isHovered} />}</div>
            <p>Issues</p>
          </button>
          {/* </Link> */}
        </div>

        {/* Commented out unused links until all bugs are fixed and app is launched. Implementing 
					these links will take a while. ---> Pinak */}
        <div className="ml-2">
          <div className={styles.innerDiv}>
            <div className={styles.row} onClick={() => handleActiveParams('active')}>
              <div>
                <span className={styles.innerDivSpan}>Active</span>
              </div>
            </div>
            <div className={styles.row} onClick={() => handleActiveParams('backlog')}>
              <div>
                <span className={styles.innerDivSpan}>Backlog</span>
              </div>
            </div>
          </div>
        </div>

        {/*
					Commented out broken links until all bugs are fixed and app is launched. Implementing 
					these links will take a while. ---> Pinak
					<div className={`${styles.row} group`}>
						<Link href={`/projects`}>
						<button className={styles.button}>
							<div className={styles.svg}>
								{<ProjectSquaresSub className={`group-hover:fill-white`} />}
							</div>
							<p>Projects</p>
						</button>
						</Link>
					</div> */}
        <button className={styles.viewsButton} onClick={handleViewsButtonClick} type="button">
          <div className={`${styles.row} group`}>
            <div className={styles.button}>
              <div className={styles.svg}>
                <ViewsStackIcon
                  className={`group-hover:${theme === 'light' ? 'fill-black' : 'fill-white'}`}
                />
              </div>
              <p>Views</p>
            </div>
          </div>
        </button>
      </motion.div>
    </li>
  );
};

export default NavBarTeams;
