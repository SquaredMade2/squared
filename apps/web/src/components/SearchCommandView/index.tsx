import React from "react";
import { Layers3 } from "lucide-react";
import type { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { styles } from "../SearchCommandStyle";
import { useDispatch, useSelector } from "react-redux";
import { CommandGroup, CommandItem } from "../ui/command";
import { setShowSearchModal } from "@/store/showSearchModal";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { deleteAllCurrentFilters } from "@/store/filterPage/actions";

const SearchCommandView = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentWorkspace = useSelector(
    (state: RootState) => state.taskData.currentWorkspace
  );
  const currentTeam = useAppSelector(
    (state: RootState) => state.taskData.currentTeam
  );

  const handleNewView = (): void => {
    dispatch(deleteAllCurrentFilters());
    router.push(
      `/workspace/${currentWorkspace.url}/team/${currentTeam.identifier}/views/new`
    );
    dispatch(setShowSearchModal(false));
  };
  return (
    <CommandGroup
      heading="View"
      className={styles.commandGroup}
      style={{ pointerEvents: "auto" }}
    >
      <CommandItem
        className={styles.commandItem}
        onClickCapture={handleNewView}
        style={{ pointerEvents: "auto" }}
      >
        <Layers3 className={styles.icon} />
        <span className={styles.cursorPointer}>Create new view</span>
      </CommandItem>
    </CommandGroup>
  );
};

export default SearchCommandView;
