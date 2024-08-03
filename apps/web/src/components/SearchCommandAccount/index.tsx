import React from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { styles } from "../SearchCommandStyle";
import SearchCommandButton from "../SearchCommandButton";
import { setShowSearchModal } from "@/store/showSearchModal";
import { ArrowLeftRight, ArrowRight, LogOut } from "lucide-react";
import { CommandItem, CommandGroup, CommandShortcut } from "../ui/command";

const SearchCommandAccount = ({
  handleLogout,
  handleSwitchWorkspace,
}: {
  handleLogout: () => void;
  handleSwitchWorkspace: () => void;
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  function handleCreateJoinWorkspace(): void {
    router.push("/join");
    dispatch(setShowSearchModal(false));
  }
  return (
    <CommandGroup
      heading="Account"
      className={styles.commandGroup}
      style={{ pointerEvents: "auto" }}
    >
      <CommandItem
        onClickCapture={handleLogout}
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
      >
        <LogOut className={styles.icon} />
        <span className={styles.cursorPointer}>Log out</span>
        <CommandShortcut className={styles.commandShortcut}>
          <button
            type="button"
            name="button"
            className={`mr-1 ${styles.button}`}
          >
            Alt
          </button>

          <button
            type="button"
            name="button"
            className={`mr-1 ${styles.button}`}
          >
            ⇧
          </button>
          <button type="button" name="button" className={styles.button}>
            Q
          </button>
        </CommandShortcut>
      </CommandItem>
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
        onClickCapture={handleSwitchWorkspace}
      >
        <ArrowLeftRight className={styles.icon} />
        <span className={styles.cursorPointer}>Switch workspace...</span>
        <CommandShortcut className={styles.commandShortcut}>
          <SearchCommandButton firstButton="O" secondButton="W" />
        </CommandShortcut>
      </CommandItem>
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
        onClickCapture={handleCreateJoinWorkspace}
      >
        <ArrowRight className={styles.icon} />
        <span className={styles.cursorPointer}>Create or join a workspace</span>
      </CommandItem>
    </CommandGroup>
  );
};

export default SearchCommandAccount;
