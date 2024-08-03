import React from "react";
import { Box } from "lucide-react";
import { styles } from "../SearchCommandStyle";
import SearchCommandButton from "../SearchCommandButton";
import { CommandGroup, CommandItem, CommandShortcut } from "../ui/command";

const SearchCommandProject = () => {
  return (
    <CommandGroup
      heading="Project"
      className={styles.commandGroup}
      style={{ pointerEvents: "auto" }}
    >
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
      >
        <Box className={styles.icon} />
        <span className={styles.cursorPointer}>Create new project... </span>
        <CommandShortcut className={styles.commandShortcut}>
          <SearchCommandButton firstButton="P" secondButton="C" />
        </CommandShortcut>
      </CommandItem>
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
      >
        <Box className={styles.icon} />
        <span className={styles.cursorPointer}>
          Create new project from template...
        </span>
      </CommandItem>
    </CommandGroup>
  );
};

export default SearchCommandProject;
