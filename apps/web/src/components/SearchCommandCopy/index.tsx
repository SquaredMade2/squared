import React from "react";
import { styles } from "../SearchCommandStyle";
import { ClipboardCopy, MoveDiagonal } from "lucide-react";
import { CommandItem, CommandShortcut } from "../ui/command";

const SearchCommandCopy = ({
  handleCopyUrl,
}: {
  handleCopyUrl: () => void;
}) => {
  return (
    <>
      <CommandItem
        className={styles.commandItem}
        onClickCapture={handleCopyUrl}
        style={{ pointerEvents: "auto" }}
      >
        <ClipboardCopy className={styles.icon} />
        <span className={styles.cursorPointer}>Copy current page URL</span>
        <CommandShortcut className={styles.commandShortcut}>
          <button
            type="button"
            name="button"
            className={`mr-1 ${styles.button}`}
          >
            Ctrl
          </button>

          <button
            type="button"
            name="button"
            className={`mr-1 ${styles.button}`}
          >
            ⇧
          </button>
          <button type="button" name="button" className={styles.button}>
            C
          </button>
        </CommandShortcut>
      </CommandItem>
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
      >
        <MoveDiagonal className={styles.icon} />
        <span className={styles.cursorPointer}>Go to advanced search</span>
        <CommandShortcut className={styles.commandShortcut}>
          <button type="button" name="button" className={styles.button}>
            /
          </button>
        </CommandShortcut>
      </CommandItem>
    </>
  );
};

export default SearchCommandCopy;
