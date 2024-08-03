import React from "react";
import { Plus } from "lucide-react";
import { styles } from "../SearchCommandStyle";
import { CommandGroup, CommandItem, CommandShortcut } from "../ui/command";

const SearchCommandIssue = ({
  handleNewIssue,
}: {
  handleNewIssue: () => void;
}) => {
  return (
    <CommandGroup
      heading="Issue"
      className={styles.commandGroup}
      style={{ pointerEvents: "auto" }}
    >
      <CommandItem
        className={styles.commandItem}
        onClickCapture={handleNewIssue}
        style={{ pointerEvents: "auto" }}
      >
        <Plus className={styles.icon} />
        <span className={styles.cursorPointer}>Create new issue...</span>
        <CommandShortcut className={styles.commandShortcut}>
          <button type="button" className={styles.button}>
            C
          </button>
        </CommandShortcut>
      </CommandItem>
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
      >
        <Plus className={styles.icon} />
        <span className={styles.cursorPointer}>
          {" "}
          Create new issue from template...
        </span>
        <CommandShortcut className={styles.commandShortcut}>
          <button
            type="button"
            name="button"
            className={`mr-1 ${styles.button}`}
          >
            Alt
          </button>
          <button type="button" name="button" className={styles.button}>
            C
          </button>
        </CommandShortcut>
      </CommandItem>
    </CommandGroup>
  );
};

export default SearchCommandIssue;
