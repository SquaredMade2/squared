import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Combobox } from "@headlessui/react";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { LabelColor } from "@/components/LabelButton";
import { setLabels } from "@/store/taskData";
import { getSingleTask } from "@/store/task/thunks";
import useLogTaskEvent from "@/hooks/useLogTaskEvent";
import type { RootState } from "@/store";
import type { LabelDropdownProps } from "./LabelDropdown.interfaces";
import { useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import {
  EventType,
  type Labels,
} from "@/interfaces/event.interfaces";
import { Check } from "lucide-react";
import { useToast } from "../ui/use-toast";

export default function LabelDropdown({
  labelOptions,
  location,
  handleButtonClick,
  handleClickAway,
}: LabelDropdownProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const newIssueLabels = useSelector(
    (state: RootState) => state.taskData.labels
  );
  const sidebarLabels = useSelector(
    (state: RootState) => state.singleTask.data?.labels
  );
  const taskId = useSelector(
    (state: RootState) => state.singleTask?.data?._id
  );

  const {
    author,
    storeCommonFields,
    storeType,
    storeTaskLabels,
    updateTaskLabels,
  } = useLogTaskEvent();

  const [query, setQuery] = useState("");

  const filteredLabelOptions =
    query === ""
      ? labelOptions
      : labelOptions.filter((name) => {
          return name.toLowerCase().includes(query.toLowerCase());
        });

  const newLabelSelection = (
    currentLabels: string[],
    labelName: string
  ) => {
    let newSelection = [];
    if (currentLabels.length === 0) {
      newSelection = [labelName];
    } else {
      const nameFound = currentLabels.find(
        (current) => current === labelName
      );
      if (nameFound) {
        newSelection = currentLabels.filter(
          (current) => current !== labelName
        );
      } else {
        newSelection = [...currentLabels, labelName];
      }
    }
    return newSelection;
  };

  const handleSelectLabels = (labelName: string) => {
    let newLabelsSelected = [];
    if (location === "newIssue") {
      newLabelsSelected = newLabelSelection(
        newIssueLabels,
        labelName
      );
      dispatch(setLabels(newLabelsSelected));
    }
    if (location === "issueSidebar" && sidebarLabels) {
      newLabelsSelected = newLabelSelection(sidebarLabels, labelName);
      if (taskId !== undefined) storeCommonFields(author, taskId);
      logEvent(newLabelsSelected);
      updateItem(newLabelsSelected);
    }
  };

  const updateItem = async (newLabelSelection: string[]) => {
    if (taskId !== undefined) {
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER}/task/update/${taskId}`,
          {
            labels: newLabelSelection,
          }
        );
        dispatch(getSingleTask(taskId));
      } catch (err) {
        toast({
          title: "Error updating labels",
          variant: "destructive",
        });
      }
    }
  };

  const logEvent = (newLabels: string[]) => {
    storeType(EventType.LabelsUpdated);
    if (sidebarLabels) {
      updateTaskLabels(newLabels as Labels[]);
    }
  };

  const handleCloseDropdown = () => {
    handleClickAway();
  };

  useEffect(() => {
    if (sidebarLabels) {
      storeTaskLabels(sidebarLabels as Labels[]);
    }
  }, []);

  return (
    <ClickAwayListener onClickAway={() => handleCloseDropdown()}>
      <Combobox>
        <div
          className={
            location === "newIssue"
              ? "absolute top-8"
              : "absolute top-0 -left-[220px]"
          }
        >
          <div className="relative z-[1] max-w-[220px] bg-popover border-border border p-1.5 font-medium text-sm text-popover-foreground shadow-lg rounded-md">
            <Combobox.Input
              placeholder={"Add labels..."}
              onChange={(event) => setQuery(event.target.value)}
              className="p-2 mb-2 border-b border-border focus:outline-none text-secondary-foreground bg-popover"
            />
            <Combobox.Options static>
              {filteredLabelOptions.map((labelName) => {
                let isChecked = false;
                if (location === "newIssue")
                  isChecked = !!newIssueLabels?.find(
                    (current) => current === labelName
                  );
                if (location === "issueSidebar")
                  isChecked = !!sidebarLabels?.find(
                    (current) => current === labelName
                  );
                return (
                  <Combobox.Option
                    onClick={() => {
                      handleSelectLabels(labelName);
                      handleButtonClick();
                    }}
                    key={labelName}
                    className="flex flex-row items-center hover:bg-popoverHover rounded-md py-1.5 px-2"
                    value={labelName} // Add the value property with the value of labelName
                  >
                    <div className="relative border-[0.5px] border-border rounded-sm mr-2 w-5 h-5" />
                    {isChecked && (
                      <span className="absolute hover:bg-accent w-5 h-5">
                        <Check className="cursor-pointer size-5" />
                      </span>
                    )}
                    <LabelColor name={labelName} />
                    <span className="pl-3">{labelName}</span>
                  </Combobox.Option>
                );
              })}
            </Combobox.Options>
          </div>
        </div>
      </Combobox>
    </ClickAwayListener>
  );
}
