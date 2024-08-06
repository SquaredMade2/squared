import { ArrowRight } from "lucide-react";
import { styles } from "../SearchCommandStyle";
import { CommandItem, CommandGroup, CommandShortcut } from "../ui/command";

const SearchCommandMiscellaneous = ({
  handleOpenNavigation,
}: {
  handleOpenNavigation: (
    e: React.MouseEvent<HTMLDivElement> | KeyboardEvent
  ) => void;
}) => {
  return (
    <CommandGroup
      heading="Miscellaneous"
      className={styles.commandGroup}
      style={{ pointerEvents: "auto" }}
    >
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
        onClickCapture={handleOpenNavigation}
      >
        <ArrowRight className={styles.icon} />
        <span className={styles.cursorPointer}>Open navigation sidebar</span>
        <CommandShortcut className={styles.commandShortcut}>
          <button
            type="button"
            name="button"
            className={`mr-1 ${styles.button}`}
          >
            Ctrl
          </button>
          <button type="button" name="button" className={styles.button}>
            /
          </button>
        </CommandShortcut>
      </CommandItem>
    </CommandGroup>
  );
};

export default SearchCommandMiscellaneous;
