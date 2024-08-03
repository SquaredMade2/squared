import React from "react";
import { Copy } from "lucide-react";
import { styles } from "../SearchCommandStyle";
import { CommandGroup, CommandItem } from "../ui/command";

const SearchCommandTemplates = () => {
  return (
    <CommandGroup
      heading="Templates"
      className={styles.commandGroup}
      style={{ pointerEvents: "auto" }}
    >
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
      >
        <Copy className={styles.icon} />

        <span className={styles.cursorPointer}>
          Create new issue template...
        </span>
      </CommandItem>
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
      >
        <Copy className={styles.icon} />
        <span className={styles.cursorPointer}>
          Create new document template...
        </span>
      </CommandItem>
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
      >
        <Copy className={styles.icon} />
        <span className={styles.cursorPointer}>
          Create new project template...
        </span>
      </CommandItem>
    </CommandGroup>
  );
};

export default SearchCommandTemplates;
