import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { Github } from "lucide-react";
import GithubIfAuthedDisplaySettings from "../GithubIfAuthedDisplaySettings";
import RepositoryDropdown from "../RepositoryDropdown";
import {
  createGhWebhook,
  getCommitsByRepo,
  setRepo,
} from "@/store/taskData/thunks";
import { setGithubAuthToken } from "@/store/userSettings/thunks";
import { clearCommits } from "@/store/taskData";
import { useTheme } from "next-themes";

const GithubSettings = () => {
  const dispatch = useAppDispatch();
  const githubUser = useAppSelector((state) => state.userSettings.githubUser);
  const { theme } = useTheme();
  const currentRepo = useAppSelector(
    (state) => state.taskData.currentWorkspace.githubRepoInfo
  );
  const ghAuthToken = useAppSelector((state) => state.userSettings.ghAuthToken);
  const currentWorkspace = useAppSelector(
    (state) => state.taskData.currentWorkspace
  );

  useEffect(() => {
    const queryString = window.location.search;
    if (queryString.length > 0) {
      const urlParams = new URLSearchParams(queryString);
      const token = urlParams.get("code");
      if (!githubUser && token !== null) {
        dispatch(setGithubAuthToken(token));
      }
    }
  }, []);

  const [selectedRepo, setSelectedRepo] = useState(currentRepo.repoName);

  const addWebhook: (
    ghToken: string,
    ghUser: string,
    ghRepo: string,
    workspaceId: string
  ) => void = (ghToken, ghUser, ghRepo, workspaceId) => {
    dispatch(
      setRepo({
        workspaceId: workspaceId,
        repoName: ghRepo,
        owner: ghUser,
      })
    );
    dispatch(createGhWebhook({ ghToken, ghUser, ghRepo, workspaceId }));
    dispatch(clearCommits());
    if (currentRepo) {
      dispatch(
        getCommitsByRepo({
          repoName: currentRepo.repoName,
          owner: currentRepo.owner,
        })
      );
    }
  };

  return (
    <div className="sm:w-full sm:p-0 xs:w-full xl:w-2/5 md:w-3/4">
      <div className="flex flex-row h-20">
        <div className="flex flex-row justify-center items-center w-20 h-16 bg-white rounded-lg">
          <Github className="size-8" />
        </div>
        <div className="flex flex-col mx-5 h-20">
          <h3 className="text-2xl text-foreground mb-3 font-medium">Github</h3>
          <header className="text-muted-foreground text-sm">
            Automate your pull request and commit workflows and keep issues
            synced both ways
          </header>
        </div>
      </div>
      <span className="block w-full border-t border-border my-8" />

      <div className="flex flex-row justify-center" />

      <div className="flex flex-row">
        <GithubIfAuthedDisplaySettings githubUser={githubUser} />
      </div>

      <div className={`${githubUser === null ? "hidden" : ""}`}>
        <span className="block w-full border-t border-border my-8" />

        <div
          className={`flex flex-col justify-start h-20 ${
            githubUser ? "" : "hidden"
          }`}
        >
          <header className="mx-1 mt-2 mb-5 text-muted-foreground text-sm">
            Select a Repository to connect to this workspace.
          </header>

          <div className="flex flex-row">
            {githubUser && (
              <RepositoryDropdown
                githubUser={githubUser}
                selectedRepo={selectedRepo}
                setSelectedRepo={setSelectedRepo}
              />
            )}
          </div>
          <div className="flex flex-row mt-10">
            <button
              className={`h-12 ml-auto ${
                theme === "light"
                  ? "bg-blueGlowLight py-2 px-3 rounded text-blue shadow-lg active:shadow-lg hover:shadow-glow border border-blueGlow cursor-pointer"
                  : "bg-blueGlow py-2 px-3 rounded text-blue shadow-lg active:shadow-lg hover:shadow-glow border border-blueGlow cursor-pointer"
              }`}
              onClick={() => {
                if (githubUser) {
                  addWebhook(
                    ghAuthToken,
                    githubUser.login,
                    selectedRepo,
                    currentWorkspace._id
                  );
                }
              }}
              type="button"
            >
              {" "}
              Connect Repository{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GithubSettings;
