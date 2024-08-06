import React from "react";
import { ArrowRight } from "lucide-react";
import { styles } from "../SearchCommandStyle";
import SearchCommandButton from "../SearchCommandButton";
import { CommandItem, CommandShortcut } from "../ui/command";

const SearchCommandGoTo = ({
  handleGoToViews,
  handleGoToInbox,
  handleGoToBacklog,
  handleGoToAllIssues,
  handleGoToActiveIssues,
}: {
  handleGoToViews: () => void;
  handleGoToInbox: () => void;
  handleGoToBacklog: () => void;
  handleGoToAllIssues: () => void;
  handleGoToActiveIssues: () => void;
}) => {
  return (
    <>
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
        onClickCapture={handleGoToInbox}
      >
        <ArrowRight className={styles.icon} />
        <span className={styles.cursorPointer}>Go to inbox</span>
        <CommandShortcut className={styles.commandShortcut}>
          <SearchCommandButton firstButton="G" secondButton="I" />
        </CommandShortcut>
      </CommandItem>
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
      >
        <ArrowRight className={styles.icon} />
        <span className={styles.cursorPointer}>Go to my issues</span>
        <CommandShortcut className={styles.commandShortcut}>
          <SearchCommandButton firstButton="G" secondButton="M" />
        </CommandShortcut>
      </CommandItem>
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
        onClickCapture={handleGoToActiveIssues}
      >
        <ArrowRight className={styles.icon} />
        <span className={styles.cursorPointer}>Go to active issues</span>
        <CommandShortcut className={styles.commandShortcut}>
          <SearchCommandButton firstButton="G" secondButton="A" />
        </CommandShortcut>
      </CommandItem>
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
        onClickCapture={handleGoToBacklog}
      >
        <ArrowRight className={styles.icon} />
        <span className={styles.cursorPointer}>Go to backlog</span>
        <CommandShortcut className={styles.commandShortcut}>
          <SearchCommandButton firstButton="G" secondButton="B" />
        </CommandShortcut>
      </CommandItem>
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
        onClickCapture={handleGoToAllIssues}
      >
        <ArrowRight className={styles.icon} />
        <span className={styles.cursorPointer}>Go to all issues</span>
        <CommandShortcut className={styles.commandShortcut}>
          <SearchCommandButton firstButton="G" secondButton="E" />
        </CommandShortcut>
      </CommandItem>
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
      >
        <ArrowRight className={styles.icon} />
        <span className={styles.cursorPointer}>Go to projects</span>
        <CommandShortcut className={styles.commandShortcut}>
          <SearchCommandButton firstButton="G" secondButton="P" />
        </CommandShortcut>
      </CommandItem>
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
        onClickCapture={handleGoToViews}
      >
        <ArrowRight className={styles.icon} />
        <span className={styles.cursorPointer}>Go to views</span>
        <CommandShortcut className={styles.commandShortcut}>
          <SearchCommandButton firstButton="G" secondButton="U" />
        </CommandShortcut>
      </CommandItem>
    </>
  );
};

export default SearchCommandGoTo;
