import React from "react";
import { Search } from "lucide-react";
import { styles } from "../SearchCommandStyle";
import { CommandItem, CommandGroup } from "../ui/command";

const SearchCommandSearch = () => {
  return (
    <CommandGroup
      heading="Search"
      className={styles.commandGroup}
      style={{ pointerEvents: "auto" }}
    >
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto", cursor: "pointer" }}
      >
        <Search className={styles.icon} />
        <span className={styles.cursorPointer}>Search workspace...</span>
      </CommandItem>
    </CommandGroup>
  );
};

export default SearchCommandSearch;
