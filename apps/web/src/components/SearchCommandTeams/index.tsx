import React from "react";
import type { RootState } from "@/store";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { styles } from "../SearchCommandStyle";
import { useDispatch, useSelector } from "react-redux";
import { CommandItem, CommandGroup } from "../ui/command";
import { setShowSearchModal } from "@/store/showSearchModal";

const SearchCommandTeams = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentWorkspace = useSelector(
    (state: RootState) => state.taskData.currentWorkspace
  );
  const handleCreateNewTeam = (): void => {
    router.push(`/workspace/${currentWorkspace.url}/settings/new-team`);
    dispatch(setShowSearchModal(false));
  };
  return (
    <CommandGroup
      heading="Teams"
      className={styles.commandGroup}
      style={{ pointerEvents: "auto" }}
    >
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
        onClickCapture={handleCreateNewTeam}
      >
        <ArrowRight className={styles.icon} />
        <span className={styles.cursorPointer}>Create new team...</span>
      </CommandItem>
    </CommandGroup>
  );
};

export default SearchCommandTeams;
