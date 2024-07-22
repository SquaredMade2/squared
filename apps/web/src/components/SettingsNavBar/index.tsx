'use client';
import type React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { handleTheme } from '@/store/userSettings';
import { backChevron, AddIcon, personIcon, teams, workSpaceLogo } from '@/components/Svg';
import { setCurrentTeam } from '@/store/taskData';
import type { RootState } from '@/store';
import type { handleTeamClickNavbar } from '@/app/interfaces/Navbars.interfaces';
import type { Team } from '@/store/taskData/taskData.interfaces';
import type { SettingsNavbarProps } from './SettingsNavBarProps';

const styles = {
  main: 'bg-accent border border-border min-w-[296px] min-h-screen h-full flex flex-col',
  inviteDiv: 'flex flex-col items-center pb-6 text-foreground',
  title: 'text-xl flex items-center py-6',
  backSvg: 'h-3 mr-3 hover:cursor-pointer',
  addTeam: 'flex items-center justify-center p-1 ml-3 rounded',
  teamSvg: 'mr-2 rounded p-1 cursor-pointer',
  settingText: 'text-foreground cursor-pointer',
  generalButton: 'flex w-24 ml-6 p-0.5 cursor-pointer',
  membersButton: 'flex w-24 ml-6 p-0.5 cursor-pointer',
  githubButton: 'flex w-32 ml-6 mb-4 p-0.5 cursor-pointer',
  myAccountDiv: 'mb-1 pl-0.5 flex items-center',
  myWorkspaceDiv: 'mb-1 pl-0.5 flex items-center',
  myAccountText: 'text-muted-foreground pl-2',
  profileButton: 'rounded flex w-24 ml-6  p-0.5',
  teamsDiv: 'pt-5 pb-1 flex items-center',
  teamsDivText: 'text-muted-foreground pl-2',
  teamsLi: 'rounded flex p-0.5 ml-6 cursor-pointer',
  lightButton: 'pt-10 flex w-full justify-center pr-5',
  darkButton: 'rounded p-1 cursor-pointer',
  pointer: 'cursor-pointer',
};

const SettingsNavBar = ({ setLoading }: SettingsNavbarProps): React.ReactElement => {
  const dispatch = useDispatch();
  const router = useRouter();

  const workspace = useSelector((state: RootState) => state.taskData.currentWorkspace);

  const baseUrl = `/workspace/${workspace.url}/settings`;
  const teamUrl = `${baseUrl}/teams`;
  const addTeamUrl = `${baseUrl}/new-team`;
  const profileUrl = `${baseUrl}/profile`;
  const generalUrl = `${baseUrl}/workspace`;
  const membersUrl = `${baseUrl}/members`;
  const githubUrl = `${baseUrl}/github-settings`;

  const handleTeamClick: handleTeamClickNavbar = (team: Team) => {
    if (setLoading) {
      setLoading(true);
    }
    dispatch(setCurrentTeam(team));
    router.push(`${teamUrl}/${team.identifier}`);
  };

  return (
    <div className={styles.main}>
      <div className={styles.inviteDiv}>
        <div>
          <div className={styles.title} onClick={() => router.push(`/workspace/${workspace.url}`)}>
            <span className={styles.backSvg}>{backChevron()}</span>
            <h1 className={styles.settingText}>Settings</h1>
          </div>
          <div className={styles.myAccountDiv}>
            <div>{workSpaceLogo()}</div>
            <p className={styles.myAccountText}>Workspace</p>
          </div>
          <button
            type="button"
            className={styles.generalButton}
            onClick={() => router.push(generalUrl)}
          >
            <p>General</p>
          </button>
          <button
            type="button"
            onClick={() => router.push(membersUrl)}
            className={styles.membersButton}
          >
            Members
          </button>
          <button
            type="button"
            onClick={() => router.push(githubUrl)}
            className={styles.githubButton}
          >
            Github Settings
          </button>
          <div className={styles.myAccountDiv}>
            <div>{personIcon({})}</div>
            <p className={styles.myAccountText}>My Account</p>
          </div>
          <div>
            <button
              type="button"
              className={styles.profileButton}
              onClick={() => router.push(profileUrl)}
            >
              <p className={styles.pointer}>Profile</p>
            </button>
          </div>
          <div className={styles.teamsDiv}>
            <div>{teams()}</div>
            <p className={styles.teamsDivText}>Teams</p>
          </div>
          {workspace && (
            <ul>
              {workspace?.teams?.map((team) => (
                <li key={team._id} onClick={() => handleTeamClick(team)} className={styles.teamsLi}>
                  {team.name}
                </li>
              ))}
            </ul>
          )}
          <div className={styles.addTeam} onClick={() => router.push(addTeamUrl)}>
            <span className={styles.teamSvg}>{AddIcon()}</span>
            <p className={styles.pointer}>Add team</p>
          </div>
          <div className={styles.lightButton}>
            <button
              type="button"
              onClick={() => dispatch(handleTheme('light'))}
              className={styles.teamSvg}
            >
              Light
            </button>
            <button
              type="button"
              className={styles.darkButton}
              onClick={() => dispatch(handleTheme('dark'))}
            >
              Dark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsNavBar;
