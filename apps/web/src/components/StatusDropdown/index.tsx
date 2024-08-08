import { useState, useEffect } from "react";
import axios from "axios";
import { Combobox } from "@headlessui/react";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { statusOptions } from "@/constants/designations";
import { setStatus } from "@/store/taskData";
import { getSingleTask } from "@/store/task/thunks";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import type { StatusDropdownProps } from "./StatusDropdown.interfaces";
import useLogTaskEvent from "@/hooks/useLogTaskEvent";
import { EventType } from "@/interfaces/event.interfaces";
import { Check } from "lucide-react";

const StatusDropdown = ({
  handleButtonClick,
  handleClickAway,
  showIcon,
  location,
}: StatusDropdownProps) => {
  const dispatch = useAppDispatch();
  const taskId = useAppSelector((state) => state.singleTask?.data?._id);

  const newIssueStatus = useAppSelector((state) => state.taskData.status);
  const sidebarStatus = useAppSelector(
    (state) => state.singleTask?.data?.status
  );

  const [selectedStatus, setSelectedStatus] = useState("");
  const [query, setQuery] = useState("");

  const {
    author,
    storeCommonFields,
    storeType,
    storeTaskValue,
    updateTaskValue,
    taskEvent,
  } = useLogTaskEvent();

  const handleSelectStatus = (newStatus: string) => {
    if (location === "newIssue") dispatch(setStatus(newStatus));
    if (location === "issueSidebar") {
      if (newStatus === sidebarStatus) return;
      if (taskId !== undefined) storeCommonFields(author, taskId);
      logEvent(newStatus);
      updateItem(newStatus);
    }
  };

  const filteredStatusOptions =
    query === ""
      ? statusOptions
      : statusOptions.filter((name) => {
          return name.toLowerCase().includes(query.toLowerCase());
        });

  const updateItem = async (newStatus: string) => {
    if (taskId !== undefined) {
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER}/task/update/${taskId}`,
          {
            status: newStatus,
          }
        );
        dispatch(getSingleTask(taskId as string));
      } catch (err) {}
    }
  };

  const logEvent = (newStatus: string) => {
    storeType(EventType.StatusUpdated);
    if (sidebarStatus) {
      storeTaskValue(sidebarStatus);
      updateTaskValue(newStatus);
    }
  };

  const closeDropdown = () => {
    handleButtonClick();
  };

  useEffect(() => {
    if (taskEvent.updatedValue) {
      closeDropdown();
    }
  }, [taskEvent.updatedValue]);

  return (
    <ClickAwayListener onClickAway={() => handleClickAway()}>
      <Combobox value={selectedStatus} onChange={setSelectedStatus}>
        <div
          className={
            location === "newIssue"
              ? "absolute top-8"
              : "absolute top-0 -left-[220px] "
          }
        >
          <div className="relative z-[1] max-w-[220px] border border-border bg-popover p-1.5 font-medium text-foreground text-sm shadow-lg rounded-md">
            <Combobox.Input
              placeholder={"Change status..."}
              onChange={(event) => setQuery(event.target.value)}
              className="p-2 mb-3 border-b border-border focus:outline-none bg-popover"
            />

            <Combobox.Options static>
              {filteredStatusOptions.map((name) => {
                let isChecked = false;
                if (location === "newIssue")
                  isChecked = newIssueStatus === name;
                if (location === "issueSidebar")
                  isChecked = sidebarStatus === name;
                return (
                  <Combobox.Option
                    onClick={() => handleSelectStatus(name)}
                    key={name}
                    value={name}
                    className="flex flex-row text-center justify-between hover:bg-popoverHover rounded-md py-1 px-2"
                  >
                    <div className="flex flex-row items-center">
                      <div className="w-4 h-4 mx-2">{showIcon(name)}</div>
                      <span>{name}</span>
                    </div>
                    <div>
                      {isChecked && <Check className="cursor-pointer size-5" />}
                    </div>
                  </Combobox.Option>
                );
              })}
            </Combobox.Options>
          </div>
        </div>
      </Combobox>
    </ClickAwayListener>
  );
};

export default StatusDropdown;
