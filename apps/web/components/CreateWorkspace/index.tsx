'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { addWorkspace, getAllWorkspaces } from '@/store/taskData/thunks';
import { toast } from 'react-toastify';
import { miniBackChevron } from '../Svg';
import 'react-toastify/dist/ReactToastify.css';
import { getUser } from '@/store/userSettings/thunks';
import type { CreateWorkspaceProps } from './CreateWorkspace.interfaces';
import type { AppDispatch, RootState } from '@/store';
// import { linkTo } from "@storybook/addon-links/*";

const styles = {
  page: 'h-screen w-full bg-card relative flex flex-col items-center justify-center',
  nav: 'w-screen absolute top-0 p-10 flex justify-between',
  user: 'flex flex-col text-sm',
  userLabel: 'text-xs text-muted-foreground',
  smallText: 'text-sm',
  textCenter: 'text-center',
  main: 'p-8 flex flex-col space-y-6',
  header: 'text-2xl text-foreground font-medium',
  description: 'text-muted-foreground text-md',
  form: 'flex flex-col space-y-6 text-foreground items-center',
  shadowBox: 'w-full shadow-[0_3px_15px_5px_rgb(0,0,0,0.1)] p-7 rounded-xl flex flex-col space-y-7',
  inputCont: 'flex flex-col space-y-1 text-foreground relative',
  inputWrapper:
    'h-12 rounded-md border border-border text-sm bg-card indent-2 focus:outline-none focus:ring-1 relative',
  input:
    'h-12 rounded-md border border-border text-sm pl-[192px] bg-card xs:pl-0 xs:indent-2 focus:outline-none focus:ring-1 relative',
  urlWrapper: 'absolute z-10 bottom-3 left-2 text-muted-foreground xs:hidden',
  submitButtonDark:
    'w-11/12 max-w-xs h-12 rounded-md text-white text-sm bg-purpleButton hover:bg-purpleButtonHover transition ease-out duration-100 mt-10',
  submitButtonLight:
    'w-11/12 max-w-xs h-12 rounded-md text-white text-sm bg-purpleButtonHover hover:bg-purpleButton transition ease-out duration-100 mt-10',
  backLink: 'flex items-center space-x-1 text-foreground',
  userEmail: 'text-foreground',
};

const CreateWorkspace = ({ onboarding, handleNextPage }: CreateWorkspaceProps) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [inputValue, setInputValue] = useState('');
  const [urlInputValue, setUrlInputValue] = useState('');
  const urlRegex = /^[a-z0-9-]*$/;
  const nameRegex = /^[a-zA-Z0-9-& ']+$/;
  const workspaceList = useSelector((state: RootState) => state.taskData.workspaces);
  const taskDataLoadingState = useSelector((state: RootState) => state.taskData.isLoading);
  const theme = useSelector((state: RootState) => state.userSettings.theme);
  const user = useSelector((state: RootState) => state.userSettings.user);

  const checkUrl = (str: string) => {
    const newStr = str.trim();
    if (newStr === '') {
      return false;
    }
    return urlRegex.test(newStr);
  };

  const checkName = (str: string) => {
    const newStr = str.trim();
    if (newStr === '') {
      return false;
    }
    return nameRegex.test(newStr);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!checkName(inputValue)) {
      toast.error('Invalid workspace name. Name must not be empty and follow the format.');
      return;
    }

    const finalWorkspaceUrl: string = (urlInputValue.length > 0 ? urlInputValue : inputValue)
      .trim()
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/'/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    if (!checkUrl(finalWorkspaceUrl)) {
      toast.error('Invalid workspace URL. URL must be in the format workspace-url-format.');
      return;
    }

    const workspaceData: { name: string; url: string } = {
      name: inputValue,
      url: finalWorkspaceUrl,
    };

    const createWorkspace = await dispatch(addWorkspace(workspaceData));

    if (!createWorkspace) {
      toast.error('Workspace Url already exists.');
    } else {
      dispatch(getUser());
      setInputValue('');
      setUrlInputValue('');
      toast.success('Workspace created successfully!');
      !onboarding || !handleNextPage
        ? router.push(`/workspace/${finalWorkspaceUrl}`)
        : handleNextPage();
    }
  };

  useEffect(() => {
    const formattedUrlInput = inputValue
      .trim()
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/'/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    setUrlInputValue(formattedUrlInput);
  }, [inputValue]);

  useEffect(() => {
    if (!taskDataLoadingState) {
      user && dispatch(getAllWorkspaces());
    }
  }, []);

  return (
    <div className={styles.page}>
      {!onboarding && workspaceList.length > 0 && (
        <div className={styles.nav}>
          <div className={styles.user}>
            <span className={styles.userLabel}>Logged in as:</span>
            <span className={styles.userEmail}>{user.email}</span>
          </div>
          <div className={styles.backLink}>
            <span>{miniBackChevron()}</span>
            <a href={`/workspace/${workspaceList[0].url}`}>Back to Squared</a>
          </div>
        </div>
      )}
      <div className={styles.main}>
        <div className={styles.textCenter}>
          <span className={styles.header}>Create a new workspace</span>
        </div>
        <div className={styles.textCenter}>
          <span className={styles.description}>
            Workspaces are shared environments where teams can work on projects, cycles and tasks.
          </span>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={`${styles.shadowBox} ${theme !== 'light' ? 'bg-accent' : ''}`}>
            <div className={styles.inputCont}>
              <label className={styles.smallText}>Workspace Name</label>
              <input
                type="text"
                id="workSpace"
                autoComplete="off"
                className={styles.inputWrapper}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <div className={styles.inputCont}>
              <label className={styles.smallText}>Workspace URL</label>
              <div className={styles.inputCont}>
                <span className={styles.urlWrapper}>app.squaredmade.com/</span>
                <input
                  className={styles.input}
                  id="workSpaceUrl"
                  autoComplete="off"
                  value={urlInputValue}
                  onChange={(e) => setUrlInputValue(e.target.value)}
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className={`${theme !== 'light' ? styles.submitButtonDark : styles.submitButtonLight}`}
          >
            Create workspace
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkspace;
