import React from "react";
import type { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { styles } from "../SearchCommandStyle";
import { ArrowRight, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import SearchCommandButton from "../SearchCommandButton";
import { CommandItem, CommandShortcut } from "../ui/command";
import { setShowSearchModal } from "@/store/showSearchModal";

const SearchCommandDeleted = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const recentlyDeleted = useSelector(
    (state: RootState) => state.recentlyDeleted.recentlyDeleted
  );
  function handleRecentlyDeleted(): void {
    if (recentlyDeleted._id) {
      router.push(`/tasks/${recentlyDeleted?._id}`);
    }
    dispatch(setShowSearchModal(false));
  }
  return (
    <>
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
      >
        <ArrowRight className={styles.icon} />
        <span className={styles.cursorPointer}>Go to archive</span>
        <CommandShortcut className={styles.commandShortcut}>
          <SearchCommandButton firstButton="G" secondButton="X" />
        </CommandShortcut>
      </CommandItem>
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
        onClickCapture={handleRecentlyDeleted}
      >
        <Trash2 className={styles.icon} />
        <span className={styles.cursorPointer}>Go to recently deleted</span>
        <span className={styles.placeholder}>{recentlyDeleted?.title}</span>
      </CommandItem>
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
      >
        <Trash2 className={styles.icon} />
        <span className={styles.cursorPointer}>
          Go to recently deleted projects
        </span>
      </CommandItem>
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
      >
        <Trash2 className={styles.icon} />
        <span className={styles.cursorPointer}>
          Go to recently deleted documents
        </span>
      </CommandItem>
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
      >
        <Trash2 className={styles.icon} />
        <span className={styles.cursorPointer}>
          Open recently deleted teams
        </span>
      </CommandItem>
    </>
  );
};

export default SearchCommandDeleted;
