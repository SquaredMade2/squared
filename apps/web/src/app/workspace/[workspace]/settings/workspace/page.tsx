'use client';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { getWorkspace, deleteWorkspace } from '@/store/taskData/thunks';
import SettingsTopNavBar from '@/components/SettingsTopNavBar';
import WorkspaceInitials from '@/components/WorkspaceImage';
import { closeButton } from '@/components/Svg';
import DeleteButton from '@/components/DeleteButton';
import BlueButton from '@/components/BlueButton';
import { navBarToggle } from '@/store/userSettings';
import type { RootState } from '@/store';
import { useAppDispatch } from '@/hooks/typeScriptReduxHooks';

const styles = {
  flex: 'flex mdsm:flex-col relative bg-background min-h-screen xs:h-full xs:pb-10 w-full',
  NavbarWrapper: 'relative mdsm:absolute -left-0 transition-all duration-300 ease-in-out z-10',
  container: 'h-full w-full flex flex-col items-center bg-background text-foreground pt-20',
  dialog: 'w-84 bg-background text-foreground rounded-lg cursor-default border border-border',
  dialogTextWrapper: 'h-full w-full flex flex-col items-center mt-5 py-2 px-8',
  dialogButtonsWrapper: 'flex mb-5',
  marginRight: 'mr-5',
  line: 'block w-full border-t border-border my-6',
  mainContainer: 'w-1/3 mdsm:w-3/4 xs:w-full',
  text2xl: 'text-2xl font-medium',
  textSmall: 'text-sm mb-4 mt-1 text-muted-foreground',
  logoWrapper: 'flex items-center justify-center w-16 h-16 bg-green-500 my-10 text-xl',
  workspaceInputWrapper: 'mb-4 mt-5 text-sm',
  input:
    'flex border border-border py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-400 rounded w-3/4 xs:w-full pl-1.5 text-foreground text-sm bg-textField',
  urlInputWrapper: 'flex relative items-center',
  url: 'text-sm text-muted-foreground absolute left-1.5',
  urlInput:
    'flex border border-border py-1.5 pl-[102px] focus:outline-none focus:ring-1 focus:ring-indigo-400 text-sm rounded w-3/4 xs:w-full bg-textField',
  deleteWorkspaceTitle: 'mt-10',
  logoDiv: 'border-b border-border',
  form: 'border-b border-border mt-8',
  workspaceURLText: 'text-foreground text-sm mb-1.5',
  dialogVerify: 'w-full flex items-center justify-between py-4 px-8 border-b border-border',
  TopNavbar: 'lg:hidden mdsm:visible',
};

export default function WorkspaceSettings() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();

  const workspace = useSelector((state: RootState) => state.taskData.currentWorkspace);
  const workspaceList = useSelector((state: RootState) => state.taskData.workspaces);
  const access = useSelector((state: RootState) => state.taskData.access);
  const { user } = useSelector((state: RootState) => state.userSettings);
  const [workspaceName, setWorkspaceName] = useState(workspace.name);
  const [workspaceURL, setWorkspaceURL] = useState(workspace.url);
  const [deletingWorkspace, setDeletingWorkspace] = useState(false);
  const { showNavBar } = useSelector((state: RootState) => state.userSettings);
  const [fillColor, setFillColor] = useState('#9c9eac');
  const urlRegex = /^[a-z0-9-]*$/;
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const index = workspaceList.findIndex((item) => item._id === workspace._id);
  const workspaceUrl = params.workspace;
  const userHasAccess = access && access.id === user?._id && workspaceUrl === workspace.url;

  const currentUserRole = workspace.users.find((u) => u.user === user._id)?.role;

  const deleteOrLeaveBtnLabel = currentUserRole === 'owner' ? 'Delete this workspace' : 'Leave';

  const checkURL = (str: string) => {
    const trimmedStr = str.trim();
    if (trimmedStr === '') {
      return false;
    }
    return urlRegex.test(trimmedStr);
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

  const handleDelete = async () => {
    try {
      const actionResult = await dispatch(deleteWorkspace(workspace._id));
      unwrapResult(actionResult);

      setDeletingWorkspace(true);
      handleClose();
      toast.success('Workspace deleted, redirecting...');
    } catch (error) {
      console.error('Error deleting workspace:', error);
      toast.error('Failed to delete workspace. Please try again.');
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const urlCheck: boolean = checkURL(workspaceURL.trim());
    const name: string = workspaceName.trim();
    const url: string = workspaceURL.trim();
    if (!urlCheck) {
      toast.error('Invalid workspace URL. URL must be in the format hello-world.');
    } else if (!name) {
      toast.error('Workspace name is required.');
    } else {
      await updateWorkspace(name, url);
      await dispatch(getWorkspace({ url: workspace.url, id: workspace._id }));
      router.push(`workspace/${url}/settings/workspace`);
      toast.success('Workspace Updated');
    }
  };

  const updateWorkspace = async (name: string, url: string) => {
    try {
      await axios({
        method: 'PUT',
        url: `${process.env.NEXT_PUBLIC_SERVER}/workspace/update`,
        withCredentials: true,
        params: {
          name: name,
          url: url,
          id: workspace._id,
        },
      });
    } catch (error) {
      toast.error('An error occured trying to update workspace');
    }
  };

  const handleNavToggle = () => {
    const navBarValue = !showNavBar;
    dispatch(navBarToggle(navBarValue));
  };

  useEffect(() => {
    if (deletingWorkspace) {
      setTimeout(() => {
        if (!workspaceList.length) {
          router.push('/join');
        } else {
          router.push(`workspace/${workspaceList[0].url}`);
        }
        setDeletingWorkspace(false);
      }, 2000);
    }
  }, [workspaceList, deletingWorkspace, index]);

  useEffect(() => {
    if (!userHasAccess) {
      router.push(`workspace/${workspaceUrl}`); //fix check if this function works correctly. Why is this pushing workspace if !userHasAccess?
    }
  }, []);

  return (
    <div className={styles.flex}>
      <div className={styles.TopNavbar}>
        <SettingsTopNavBar setShowNavBar={handleNavToggle} />
      </div>
      <div className={styles.container}>
        <div>
          <dialog className={styles.dialog} ref={dialogRef}>
            <div className={styles.dialogVerify}>
              <h1>Verify workspace deletion</h1>
              <div
                onClick={handleClose}
                onMouseEnter={() => setFillColor('#BDBFC5')}
                onMouseLeave={() => setFillColor('#9c9eac')}
              >
                {closeButton(fillColor)}
              </div>
            </div>
            <div className={styles.dialogTextWrapper}>
              <h1>
                Are you sure you want to {deleteOrLeaveBtnLabel.toUpperCase()}
                {'?'}
              </h1>
              <div className={styles.dialogButtonsWrapper}>
                <DeleteButton description={deleteOrLeaveBtnLabel} handleAction={handleDelete} />
              </div>
            </div>
          </dialog>
        </div>
        <div className={styles.mainContainer}>
          <div>
            <h1 className={styles.text2xl}>Workspace</h1>
            <p className={styles.textSmall}>Manage your workspace settings</p>
          </div>
          <span className={styles.line} />
          <div className={styles.logoDiv}>
            <h2>Logo</h2>
            <WorkspaceInitials
              workspaceName={workspace.name}
              backgroundColor={index}
              location="workspaceSettings"
            />
          </div>
          <form onSubmit={handleUpdate} className={styles.form}>
            <h2>General</h2>
            <div className={styles.workspaceInputWrapper}>
              <p className={styles.workspaceURLText}>Workspace name</p>
              <input
                type="text"
                className={styles.input}
                onChange={(e) => setWorkspaceName(e.target.value)}
                value={workspaceName}
              />
            </div>
            <div>
              <p className={styles.workspaceURLText}>Workspace URL</p>
              <div className={styles.urlInputWrapper}>
                <span className={styles.url}>Squared.com/</span>
                <input
                  type="text"
                  className={styles.urlInput}
                  onChange={(e) => setWorkspaceURL(e.target.value)}
                  value={workspaceURL}
                />
              </div>
            </div>
            <BlueButton description="Update" />
          </form>
          <div>
            <h2 className={styles.deleteWorkspaceTitle}>Delete workspace</h2>
            <p className={styles.textSmall}>
              if you want to permanently delete this workspace and all of its data, including but
              not limited to users, issues, and comments, you can do so below.
            </p>
            <DeleteButton description={deleteOrLeaveBtnLabel} handleAction={handleOpen} />
          </div>
        </div>
      </div>
    </div>
  );
}
