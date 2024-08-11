import { useDispatch, useSelector } from "react-redux";
import { setShowNewIssue } from "@/store/showNewIssue";
import { setStatus } from "@/store/taskData";
import type { RootState } from "@/store";
import { SquarePen } from "lucide-react";
import { Button } from "../ui/button";

const NewIssueButton = () => {
  const dispatch = useDispatch();

  const titleArr = { value: "Todo", id: 2 };

  const showNewIssue = useSelector(
    (state: RootState) => state.showNewIssue.isOpen
  );
  const resumeNewIssue = useSelector(
    (state: RootState) => state.resumeNewIssue.hasData
  );
  const { theme } = useSelector((state: RootState) => state.userSettings);

  const fillColor = () => (theme === "light" ? "#174EFF" : "white");
  const handleOpen = () => {
    dispatch(setShowNewIssue(true));
    dispatch(setStatus(titleArr.value));
  };

  return (
    <button
      type="button"
      className="flex flex-row w-9/12 h-10 items-center justify-center border border-blue-800 shadow-lg rounded focus:outline-none focus:shadow-sm active:shadow-lg cursor-pointer hover:shadow-glow text-blue-600 dark:text-foreground bg-blue-400/20 dark:bg-blue-800/60"
      onClick={() => handleOpen()}
    >
      <span>
        <SquarePen className={`size-5 cursor-pointer fill-[${fillColor()}]`} />
      </span>
      <span className="px-2 w-auto text-foreground, cursor-pointer">
        {resumeNewIssue && !showNewIssue ? "Resume editing" : "New Issue"}
      </span>
      {resumeNewIssue && !showNewIssue && (
        <div className="w-1.5 h-1.5 rounded-md bg-accent border-border ml-2" />
      )}
    </button>
  );
};

export const GridColumnNewIssueButton = ({ status }: { status: string }) => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.userSettings);
  const fillColor = () => (theme === "light" ? "#174EFF" : "white");
  const handleOpen = () => {
    dispatch(setShowNewIssue(true));
    dispatch(setStatus(status));
  };
  return (
    <Button onClick={() => handleOpen()} variant={"outline"}>
      <SquarePen className={`size-5 cursor-pointer fill-[${fillColor()}]`} />
    </Button>
  );
};

export default NewIssueButton;
