import React from "react";
import { inProgress } from "../Svg";
import type { RootState } from "@/store";
import ProfileImage from "../ProfileImage";
import { useRouter } from "next/navigation";
import { styles } from "../SearchCommandStyle";
import { useDispatch, useSelector } from "react-redux";
import SearchCommandButton from "../SearchCommandButton";
import { setShowSearchModal } from "@/store/showSearchModal";
import type { Task } from "../../store/taskData/taskData.interfaces";
import { CommandGroup, CommandItem, CommandShortcut } from "../ui/command";
import {
  Circle,
  Clock3,
  CircleX,
  UserSearch,
  ChevronRight,
  CircleDashed,
  CircleCheckBig,
} from "lucide-react";

const getStatusLogo = (status: string) => {
  switch (status) {
    case "Todo":
      return <Circle className="size-4" />;
    case "In Progress":
      return inProgress();
    case "Backlog":
      return <CircleDashed className="size-4" />;
    case "Done":
      return <CircleCheckBig className="size-4 text-[#7394FF]" />;
    case "Canceled":
      return <CircleX className="size-4" />;
    default:
  }
};

const SearchCommandNavigation = ({
  isIssueOpen,
  setIsIssueOpen,
}: {
  isIssueOpen: boolean;
  setIsIssueOpen: (open: boolean) => void;
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const taskList = useSelector((state: RootState) => state.taskData.taskList);
  const lastViewIssue = useSelector(
    (state: RootState) => state.taskData.taskPage
  );

  const taskClick = (id: string): void => {
    router.push(`/tasks/${id}`);
    dispatch(setShowSearchModal(false));
  };
  const handleLastViewIssue = (): void => {
    if (lastViewIssue._id) {
      router.push(`/tasks/${lastViewIssue._id}`);
      dispatch(setShowSearchModal(false));
    }
  };
  return (
    <CommandGroup
      heading="Navigation"
      className={styles.commandGroup}
      style={{ pointerEvents: "auto" }}
    >
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
        onClickCapture={() => setIsIssueOpen(!isIssueOpen)}
      >
        <Circle className={styles.icon} />
        <span className={styles.cursorPointer}>Open issue...</span>

        <ChevronRight
          className={`mr-4 ease-in-out duration-300 h-4 w-4 ${isIssueOpen ? "rotate-90 mt-1 " : ""}`}
        />

        <CommandShortcut className={styles.commandShortcut}>
          <SearchCommandButton firstButton="O" secondButton="I" />
        </CommandShortcut>
      </CommandItem>
      {isIssueOpen &&
        taskList?.map((task: Task) => {
          return (
            <CommandItem
              key={task._id}
              style={{ pointerEvents: "auto" }}
              className={`ml-6  ${styles.commandItem}`}
              onClickCapture={() => taskClick(task._id)}
            >
              <span className={`mr-2 ${styles.cursorPointer}`}>
                {getStatusLogo(task.status)}
              </span>
              <span className={styles.cursorPointer}>{task.title}</span>
              <CommandShortcut className={styles.commandShortcut}>
                {!task?.assignee?.name ? (
                  <UserSearch className={`text-[#9597AD] ${styles.icon}`} />
                ) : (
                  <ProfileImage
                    location={"searchCommand"}
                    profileName={task.assignee.name}
                  />
                )}
              </CommandShortcut>
            </CommandItem>
          );
        })}
      <CommandItem
        className={styles.commandItem}
        style={{ pointerEvents: "auto" }}
        onClickCapture={handleLastViewIssue}
      >
        <Clock3 className={styles.icon} />
        <span className={styles.cursorPointer}>Open last viewed issue</span>
        <span className={styles.placeholder}>{lastViewIssue.title}</span>
      </CommandItem>
    </CommandGroup>
  );
};

export default SearchCommandNavigation;
