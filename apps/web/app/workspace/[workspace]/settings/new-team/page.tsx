'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { createTeam, teamExists } from '@/store/taskData/thunks';
import { useParams, useRouter } from 'next/navigation';
import type { InputChangeEvent, FormSubmitEvent } from '@/types';
import SettingsTopNavBar from '@/components/SettingsTopNavBar';
import BlueButton from '@/components/BlueButton';
import { navBarToggle } from '@/store/userSettings';

const styles = {
  mainContainer: 'flex bg-background text-foreground min-h-screen mdsm:flex-col w-full',
  pageContainer: 'w-full pt-20 flex justify-center',
  pageWrapper: 'flex flex-col w-1/3 mdsm:w-3/4',
  form: 'flex flex-col',
  title: 'text-2xl text-foreground mb-1 font-medium',
  line: 'block w-full border-t border-border mt-6',
  input:
    'w-full border border-border rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-foreground py-1.5 px-3 text-sm mt-1.5 bg-textField',
  identifierInput:
    'w-20 border border-border max-h-8 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-foreground py-1.5 px-3 text-sm mt-1.5 bg-textField',
  inputWrapper: 'my-6',
  TopNavbar: 'lg:hidden mdsm:visible',
  navbarWrapper: 'relative mdsm:absolute -left-0 transition-all duration-300 ease-in-out',
  titleDescription: 'text-sm text-muted-foreground',
  inputLabel: 'text-sm',
  identifierDescription: 'text-sm text-muted-foreground pl-5',
  identifierinputWrapper: 'flex',
};

export default function CreateTeam() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const router = useRouter();

  const [teamName, setTeamName] = useState<string>('');
  const [teamIdentifier, setTeamIdentifier] = useState<string>('');
  const workspace = useAppSelector((state) => state.taskData.currentWorkspace);
  const { user, theme } = useAppSelector((state) => state.userSettings);
  const access = useAppSelector((state) => state.taskData.access);
  const showNavBar = useAppSelector((state) => state.userSettings.showNavBar);

  const workspaceUrl = params.workspace;
  const userHasAccess =
    typeof access === 'object' &&
    access &&
    'id' in access &&
    access.id === user?._id &&
    workspaceUrl === workspace?.url;

  const identifierInputFilter = (e: InputChangeEvent): void => {
    const identifierFormat = /^[A-Za-z0-9]*$/g;
    if (identifierFormat.test(e.target.value)) {
      setTeamIdentifier(e.target.value.toUpperCase());
    }
  };

  const handleSubmit = async (e: FormSubmitEvent): Promise<void> => {
    e.preventDefault();
    if (!teamName && !teamIdentifier) {
      toast.error('Both Name and Identifier required');
    } else if (!teamIdentifier) {
      toast.error('Identifier is required');
    } else if (!teamName) {
      toast.error('Name is required');
    } else {
      const doesTeamExist = await dispatch(
        teamExists({
          workspace: workspace._id,
          identifier: teamIdentifier,
          name: teamName.trim(),
        }),
      );

      if (!doesTeamExist.payload) {
        dispatch(
          createTeam({
            name: teamName.trim(),
            identifier: teamIdentifier,
            workspaceId: workspace._id,
          }),
        );
        router.push(`/workspace/${workspaceUrl}/team/${teamIdentifier}/all`);
        toast.success('Team created');
      }
    }
  };

  const handleNavToggle = (): void => {
    const navBarValue = !showNavBar;
    dispatch(navBarToggle(navBarValue));
  };

  useEffect(() => {
    if (!userHasAccess) {
      router.push(`/workspace/${workspaceUrl}`);
    }
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.TopNavbar}>
        <SettingsTopNavBar setShowNavBar={handleNavToggle} />
      </div>
      <div className={styles.pageContainer}>
        <div className={styles.pageWrapper}>
          <div>
            <h1 className={styles.title}>Create Team</h1>
            <p className={styles.titleDescription}>
              Create a new team to manage separate cycles and workflows
            </p>
          </div>
          <span className={styles.line} />
          <form className={styles.form} onSubmit={handleSubmit}>
            <div>
              <div className={styles.inputWrapper}>
                <p className={styles.inputLabel}>Team Name</p>
                <input
                  type="text"
                  value={teamName}
                  placeholder="e.g. Engineering"
                  onChange={(e) => setTeamName(e.target.value)}
                  className={`${styles.input} ${theme === 'dark' ? 'bg-background' : 'bg-card'}`}
                />
              </div>
              <div className={styles.inputWrapper}>
                <p className={styles.inputLabel}>Team identifier</p>
                <div className={styles.identifierinputWrapper}>
                  <input
                    type="text"
                    value={teamIdentifier}
                    placeholder="e.g. ENG"
                    maxLength={5}
                    onChange={identifierInputFilter}
                    className={`${styles.identifierInput} ${
                      theme === 'dark' ? 'bg-background' : 'bg-card'
                    }`}
                  />
                  <p className={styles.identifierDescription}>
                    {
                      'This is used as the identifier (e.g. ENG-123) for all issues of the team. Keep it short and simple.'
                    }
                  </p>
                </div>
              </div>
              <BlueButton description="Create Team" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
