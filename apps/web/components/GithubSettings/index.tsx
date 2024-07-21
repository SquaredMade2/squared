import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { githubSettingsLogo } from '../Svg';
import GithubIfAuthedDisplaySettings from '../GithubIfAuthedDisplaySettings';
import RepositoryDropdown from '../RepositoryDropdown';
import { createGhWebhook, getCommitsByRepo, setRepo } from '@/store/taskData/thunks';
import { setGithubAuthToken } from '@/store/userSettings/thunks';
import { clearCommits } from '@/store/taskData';

const GithubSettings = () => {
  const dispatch = useAppDispatch();
  const githubUser = useAppSelector((state) => state.userSettings.githubUser);
  const theme = useAppSelector((state) => state.userSettings.theme);
  const currentRepo = useAppSelector((state) => state.taskData.currentWorkspace.githubRepoInfo);
  const ghAuthToken = useAppSelector((state) => state.userSettings.ghAuthToken);
  const currentWorkspace = useAppSelector((state) => state.taskData.currentWorkspace);

  const styles = {
    line: 'block w-full border-t border-border my-8',
    headerWrapper: 'flex flex-row h-20',
    headerText: 'flex flex-col mx-5 h-20',
    githubLogoWrapper: 'flex flex-row justify-center items-center w-20 h-16 bg-white rounded-lg',
    pageWrapper: ' sm:w-full sm:p-0 xs:w-full xl:w-2/5 md:w-3/4 ',
    title: 'text-2xl text-foreground mb-3 font-medium',
    smTitle: 'text-xl text-foreground mb-2 font-medium',
    subtitle: 'text-muted-foreground text-sm',
    ButtonLight:
      'bg-blueGlowLight py-2 px-3 rounded text-blue shadow-lg active:shadow-lg hover:shadow-glow border border-blueGlow cursor-pointer',
    ButtonDark:
      'bg-blueGlow py-2 px-3 rounded text-blue shadow-lg active:shadow-lg hover:shadow-glow border border-blueGlow cursor-pointer',
    userInputsContainer:
      'flex gap-3 mt-6 items-center justify-between w-full sm:justify-between md:w-full lg:w-full',
    userInputSubContainer:
      'relative gap-2 flex items-center md:w-2/3 lg:w-3/5 bg-textField rounded',
    searchInput:
      'border border-border bg-transparent text-sm py-1.5 w-full rounded-md w-full text-foreground placeholder:text-[#999] px-8 xs:py-1 focus:outline-none focus:ring-1 focus:ring-indigo-400',
    searchIcon: 'absolute left-2 top-2.5',
    bodyWrapper: 'flex justify-between',
    textPrimary: 'text-foreground',
    about: 'flex flex-row justify-center',
    connectWrapper: 'flex flex-row',
    repoSelectWrapper: `flex flex-col justify-start h-20 ${githubUser ? '' : 'hidden'}`,
    repoSelector: 'flex flex-row',
    repoConnectButtonWrapper: 'flex flex-row mt-10',
    handleAuth: `${githubUser === null ? 'hidden' : ''}`,
  };

  useEffect(() => {
    const queryString = window.location.search;
    if (queryString.length > 0) {
      const urlParams = new URLSearchParams(queryString);
      const token = urlParams.get('code');
      if (!githubUser && token !== null) {
        dispatch(setGithubAuthToken(token));
      }
    }
  }, []);

  const [selectedRepo, setSelectedRepo] = useState(currentRepo.repoName);

  const addWebhook: (ghToken: string, ghUser: string, ghRepo: string, workspaceId: string) => void =
    (ghToken, ghUser, ghRepo, workspaceId) => {
      dispatch(setRepo({ workspaceId: workspaceId, repoName: ghRepo, owner: ghUser }));
      dispatch(createGhWebhook({ ghToken, ghUser, ghRepo, workspaceId }));
      dispatch(clearCommits());
      if (currentRepo) {
        dispatch(
          getCommitsByRepo({
            repoName: currentRepo.repoName,
            owner: currentRepo.owner,
          }),
        );
      }
    };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.headerWrapper}>
        <div className={styles.githubLogoWrapper}>{githubSettingsLogo()}</div>
        <div className={styles.headerText}>
          <h3 className={styles.title}>Github</h3>
          <header className={styles.subtitle}>
            Automate your pull request and commit workflows and keep issues synced both ways
          </header>
        </div>
      </div>
      <span className={styles.line} />

      <div className={styles.about} />

      <div className={styles.connectWrapper}>
        <GithubIfAuthedDisplaySettings githubUser={githubUser} />
      </div>

      <div className={styles.handleAuth}>
        <span className={styles.line} />

        <div className={styles.repoSelectWrapper}>
          <header className={`mx-1 mt-2 mb-5 ${styles.subtitle}`}>
            Select a Repository to connect to this workspace.
          </header>

          <div className={styles.repoSelector}>
            {githubUser && (
              <RepositoryDropdown
                githubUser={githubUser}
                selectedRepo={selectedRepo}
                setSelectedRepo={setSelectedRepo}
              />
            )}
          </div>
          <div className={styles.repoConnectButtonWrapper}>
            <button
              className={`h-12 ml-auto ${
                theme === 'light' ? styles.ButtonLight : styles.ButtonDark
              }`}
              onClick={() => {
                if (githubUser) {
                  addWebhook(ghAuthToken, githubUser.login, selectedRepo, currentWorkspace._id);
                }
              }}
              type="button"
            >
              {' '}
              Connect Repository{' '}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GithubSettings;
