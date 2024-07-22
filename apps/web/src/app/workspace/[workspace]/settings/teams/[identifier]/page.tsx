'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useAppSelector, useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import { deleteTeam, getTeam, getWorkspace } from '@/store/taskData/thunks';
import SettingsTopNavBar from '@/components/SettingsTopNavBar';
import type { TeamData } from '@/app/workspace/[workspace]/settings/teams/[identifier]/teams.interfaces';
import type { FormSubmitEvent } from '@/types';
import { closeButton } from '@/components/Svg';
import BlueButton from '@/components/BlueButton';
import DeleteButton from '@/components/DeleteButton';
import { navBarToggle } from '@/store/userSettings';

const styles = {
  container: 'flex bg-background text-foreground mdsm:flex-col min-h-screen w-full',
  mainContainer: 'flex flex-col h-screen xs:h-full w-full items-center pt-20',
  NavbarWrapper: 'relative mdsm:absolute -left-0 transition-all duration-300 ease-in-out',
  pageWrapper: 'w-1/3 mdsm:w-3/4',
  dialog: 'w-84 bg-background text-foreground rounded-lg cursor-default border border-border',
  dialogTextWrapper: 'h-full w-full flex flex-col items-center mt-5 py-2 px-8',
  dialogButtonsWrapper: 'flex mb-5',
  dialogDeleteButton:
    'mt-3 bg-destructive hover:bg-destructive/80 w-full px-8 py-2 rounded text-destructive-foreground',
  dialogVerify: 'w-full flex items-center justify-between py-4 px-8 border-b border-border',
  line: 'block w-full border-t border-border my-6',
  inputLabel: 'text-sm mb-1.5',
  dialogCancelButton: 'mr-5 cursor-pointer',
  description: 'text-muted-foreground text-sm',
  cursorPointer: 'cursor-pointer',
  identifierDescription: 'text-muted-foreground',
  form: 'flex flex-col',
  title: 'text-2xl text-foreground mb-1 font-medium',
  MarginTop: 'mt-6',
  input:
    'border border-border pl-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-400 rounded pl-0.5 xs:w-3/4 bg-textField',
  errorContainer: 'flex bg-card text-foreground',
  errorMessageWrapper: 'flex flex-col h-screen w-full items-center justify-center',
  text3xl: 'text-3xl',
  TopNavbar: 'lg:hidden mdsm:visible',
  visible: 'opacity-0 transition-all duration-300 ease-in-out',
  notVisible: 'opacity-100 transition-all duration-300 ease-in-out',
  deleteTitle: 'text-lg font-medium mb-3',
  warningWrapper: 'text-muted-foreground text-sm mb-3',
  warning: 'font-medium',
  titleLoading: 'h-9 w-36 bg-popover rounded-lg',
};

export default function TeamsSetting() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { currentTeam, access, error } = useAppSelector((state) => state.taskData);
  const workspace = useAppSelector((state) => state.taskData.currentWorkspace);
  const [teamName, setTeamName] = useState<string>(currentTeam.name);
  const [teamIdentifier, setTeamIdentifier] = useState<string>(currentTeam.identifier);
  const [loading, setLoading] = useState<boolean>(false);
  const showNavBar = useAppSelector((state) => state.userSettings.showNavBar);
  const [fillColor, setFillColor] = useState<string>('#9c9eac');
  const { user, theme } = useAppSelector((state) => state.userSettings);

  const workspaceUrl = params.workspace as string;
  const identifier = params.identifier as string;
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const prevName = currentTeam.name;
  const prevIdentifier = currentTeam.identifier;
  const valueChanged = (prevName !== teamName || prevIdentifier !== teamIdentifier) && !loading;
  const userHasAccess =
    typeof access === 'object' &&
    access &&
    'id' in access &&
    access.id === user?._id &&
    workspaceUrl === workspace?.url;

  const identifierInputFilter = (value: string): void => {
    const regex = /^[A-Za-z0-9]*$/g;
    const test = regex.test(value);
    if (test) {
      setTeamIdentifier(value.toUpperCase());
    }
  };

  const handleOpen = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const handleClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const handleDelete = (): void => {
    if (workspace.teams.length === 1) {
      toast.error('this is your only team, it cannot be deleted.');
    } else {
      dispatch(deleteTeam(currentTeam._id));
      handleClose();
      router.push(`/workspace/${workspaceUrl}`);
      toast.success('team deleted');
    }
  };

  const handleNavToggle = (): void => {
    const navBarValue = !showNavBar;
    dispatch(navBarToggle(navBarValue));
  };

  const handleSubmit = async (e: FormSubmitEvent) => {
    e.preventDefault();
    if (!teamName && !teamIdentifier) {
      toast.error('Both Name and Identifier required');
    } else if (!teamIdentifier) {
      toast.error('Identifier is required');
    } else if (!teamName) {
      toast.error('Name is required');
    } else if (valueChanged) {
      try {
        const update = await updateTeam({
          name: teamName,
          identifier: teamIdentifier,
          id: currentTeam._id,
          workspaceId: workspace._id,
        });
        if (update) {
          dispatch(getWorkspace({ url: workspaceUrl, id: workspace._id }));
          await dispatch(getTeam(teamIdentifier));
          const url = `/workspace/${workspace.url}/settings/teams/${teamIdentifier}`;
          router.push(url);
        }
      } catch (err) {}
    }
  };

  const updateTeam = async (teamData: TeamData): Promise<boolean> => {
    try {
      const update = await axios({
        method: 'PUT',
        url: `${process.env.NEXT_PUBLIC_SERVER}/team/update`,
        withCredentials: true,
        data: {
          name: teamData.name.trim(),
          identifier: teamData.identifier,
          id: teamData.id,
          workspaceId: workspace._id,
        },
      });
      const response = update.data?.message;
      toast.success(`${response}`);
      dispatch(getTeam(teamData.identifier));
      return true;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const response = error.response?.data.message;
        toast.error(`${response}`);
      }
      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userHasAccess) {
        setLoading(false);
      } else {
        router.push(`/workspace/${workspaceUrl}`);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {!error && (
        <div className={styles.container}>
          <div className={styles.TopNavbar}>
            <SettingsTopNavBar setShowNavBar={handleNavToggle} />
          </div>
          <div className={styles.mainContainer}>
            <div className={styles.pageWrapper}>
              <dialog className={styles.dialog} ref={dialogRef}>
                <div className={styles.dialogVerify}>
                  <h1>Verify team deletion</h1>
                  <div
                    onClick={handleClose}
                    onMouseEnter={() => setFillColor('#BDBFC5')}
                    onMouseLeave={() => setFillColor('#9c9eac')}
                  >
                    {closeButton(fillColor)}
                  </div>
                </div>
                <div className={styles.dialogTextWrapper}>
                  <h1>Are you sure you want to delete this team?</h1>
                  <div className={styles.dialogButtonsWrapper}>
                    <DeleteButton description="Delete my team" handleAction={handleDelete} />
                  </div>
                </div>
              </dialog>
              <form className={styles.form} onSubmit={handleSubmit}>
                <div>
                  <div>
                    <h1 className={styles.title}>{teamName}</h1>
                    <p className={styles.description}>Manage team settings</p>
                  </div>
                  <span className={styles.line} />
                  <div className={styles.MarginTop}>
                    <p className={styles.inputLabel}>Name</p>
                    <input
                      type="text"
                      className={`${styles.input} ${
                        theme === 'dark' ? 'bg-background' : 'bg-card'
                      }`}
                      onChange={(e) => setTeamName(e.target.value)}
                      value={teamName}
                    />
                  </div>
                  <div className={styles.MarginTop}>
                    <p className={styles.inputLabel}>
                      Identifier
                      <span className={styles.identifierDescription}> - Used in issue IDs</span>
                    </p>
                    <input
                      type="text"
                      maxLength={5}
                      className={`${styles.input} ${
                        theme === 'dark' ? 'bg-background' : 'bg-card'
                      }`}
                      onChange={(e) => identifierInputFilter(e.target.value)}
                      value={teamIdentifier}
                    />
                  </div>
                  <div className={`${valueChanged ? styles.notVisible : styles.visible}`}>
                    <BlueButton description="Save" />
                  </div>
                </div>
              </form>
              <div>
                <h3 className={styles.deleteTitle}>Delete team</h3>
                <p className={styles.warningWrapper}>
                  <span className={styles.warning}>Warning: </span>Deleting the team will also
                  permanently delete any issues associated with it. This can&apos;t be undone and
                  your data cannot be recovered by Squared.
                </p>
                <DeleteButton description="Delete Team" handleAction={handleOpen} />
              </div>
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className={styles.errorContainer}>
          <div>{/* <SettingsNavBar /> */}</div>
          <div className={styles.errorMessageWrapper}>
            <div>
              <div>
                <h1
                  className={styles.text3xl}
                >{`Could not find Team with identifier "${identifier}"`}</h1>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
