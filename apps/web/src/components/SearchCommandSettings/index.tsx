import React from "react";
import { Settings } from "lucide-react";
import type { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { styles } from "../SearchCommandStyle";
import { useDispatch, useSelector } from "react-redux";
import { CommandItem, CommandGroup } from "../ui/command";
import { setShowSearchModal } from "@/store/showSearchModal";

const SearchCommandSettings = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.userSettings.user);
  const currentWorkspace = useSelector(
    (state: RootState) => state.taskData.currentWorkspace
  );
  const currentTeam = useSelector(
    (state: RootState) => state.taskData.currentTeam
  );

  const handleWorkspaceSetting = (): void => {
    router.push(`/workspace/${currentWorkspace.url}/settings/workspace`);
    dispatch(setShowSearchModal(false));
  };

  const handleAccountSetting = (): void => {
    router.push(`/workspace/${currentWorkspace.url}/settings/profile`);
    dispatch(setShowSearchModal(false));
  };

  const handleTeamSetting = (): void => {
    router.push(
      `/workspace/${currentWorkspace.url}/settings/teams/${currentTeam.identifier}`
    );
    dispatch(setShowSearchModal(false));
  };

  const handleGithubSetting = (): void => {
    router.push(`/workspace/${currentWorkspace.url}/settings/github-settings`);
    dispatch(setShowSearchModal(false));
  };
  return (
    <CommandGroup
      heading="Settings"
      className={styles.commandGroup}
      style={{ pointerEvents: "auto" }}
    >
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
        onClickCapture={handleWorkspaceSetting}
      >
        <Settings className={styles.icon} />
        <span className={styles.cursorPointer}>Workspace Settings</span>
      </CommandItem>
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
        onClickCapture={handleAccountSetting}
      >
        <Settings className={styles.icon} />
        <span className={styles.cursorPointer}>Account Settings</span>
        <span className={styles.placeholder}>{user.name}</span>
      </CommandItem>
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
        onClickCapture={handleTeamSetting}
      >
        <Settings className={styles.icon} />
        <span className={styles.cursorPointer}>Team Settings</span>
        <span className={styles.placeholder}>{currentTeam.name}</span>
      </CommandItem>
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
        onClickCapture={handleGithubSetting}
      >
        <Settings className={styles.icon} />
        <span className={styles.cursorPointer}>Github Settings</span>
        <span className={styles.placeholder}>{user.name}</span>
      </CommandItem>
    </CommandGroup>
  );
};

export default SearchCommandSettings;
