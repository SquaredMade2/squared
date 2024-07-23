import React from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import { setView } from "@/store/userSettings";
import { LayoutPanelLeft, List } from "lucide-react";

const style = {
  viewButton:
    " h-10 w-16 bg-background bg-background cursor-pointer flex justify-center items-center rounded-sm box-border hover:bg-card",
  viewButtonActive:
    " h-10 w-16 bg-card cursor-pointer flex justify-center items-center rounded-sm border border-border box-border hover:bg-card",
};

const setFillColorList = (view: string, theme: string) => {
  switch (true) {
    case view === "list" && theme === "dark":
      return "text-[#EEEFFC]";
    case view !== "list" && theme === "dark":
      return "text-[#858699]";
    case view === "list" && theme === "light":
      return "text-[#282A30]";
    case view !== "list" && theme === "light":
      return "text-[#858699]";
    default:
      return;
  }
};

const setFillColorLayoutPanelLeft = (view: string, theme: string) => {
  switch (true) {
    case view === "grid" && theme === "dark":
      return "text-[#EEEFFC]";
    case view !== "grid" && theme === "dark":
      return "text-[#858699]";
    case view === "grid" && theme === "light":
      return "text-[#282A30]";
    case view !== "grid" && theme === "light":
      return "text-[#858699]";
    default:
      return;
  }
};

const ViewButton = () => {
  const dispatch = useAppDispatch();
  const { theme, view } = useAppSelector((state) => state.userSettings);

  return (
    <>
      <button
        type="button"
        className={view === "list" ? style.viewButtonActive : style.viewButton}
        id="list-view"
        onClick={() => dispatch(setView("list"))}
        title="Title"
      >
        <List className={`${setFillColorList(view, theme)} size-5`} />
      </button>
      <button
        type="button"
        className={view === "grid" ? style.viewButtonActive : style.viewButton}
        id="grid-view"
        onClick={() => dispatch(setView("grid"))}
        title="Title"
      >
        <LayoutPanelLeft
          className={`${setFillColorLayoutPanelLeft(view, theme)} size-5`}
        />
      </button>
    </>
  );
};

export default ViewButton;
