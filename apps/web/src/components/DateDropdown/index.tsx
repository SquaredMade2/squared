import { useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { getSingleTask } from "@/store/task/thunks";
import { setDueDate } from "@/store/taskData";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import type { DateDropdownProps } from "@/components/DateDropdown/DateDropdown.interfaces";
import { format } from "date-fns";
import { useToast } from "../ui/use-toast";
import { Calendar } from "../ui/calendar";

const DateDropdown: React.FC<DateDropdownProps> = ({
  handleButtonClick,
  handleClickAway,
  location,
}) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const taskId = useAppSelector((state) => state.singleTask?.data?._id);
  const newIssueDate = useAppSelector((state) => state.taskData.dueDate);
  const sidebarDate = useAppSelector((state) => state.singleTask.data?.dueDate);
  const initialDate = location === "issueSidebar" ? sidebarDate : newIssueDate;
  const initialTime = initialDate
    ? format(new Date(initialDate), "HH:mm")
    : "12:00";
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [selectedDate, setSelectedDate] = useState(initialDate ?? undefined);

  const containerClass = `border border-border bg-popover p-3.5 text-sm shadow-lg rounded-md w-72 ${
    location === "newIssue" ? "absolute top-8" : "absolute top-0 -left-[300px]"
  }`;

  const updateDateTime = (date: Date | undefined, time: string) => {
    if (date === undefined) return;
    const [hours, minutes] = time.split(":").map(Number);
    const updatedDateTime = new Date(date);
    updatedDateTime.setHours(hours, minutes);
    setSelectedDate(updatedDateTime);
    setSelectedTime(time);
  };

  const handleSelectDate = (selectedDay: Date | undefined) => {
    if (selectedDay === undefined) return;
    updateDateTime(selectedDay, selectedTime);
  };

  const handleSelectTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    updateDateTime(selectedDate, time);
  };

  const handleSave = () => {
    if (location === "issueSidebar") updateItem(selectedDate);
    if (location === "newIssue") dispatch(setDueDate(selectedDate));
    handleButtonClick();
  };

  const updateItem = async (newDate: Date | undefined) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER}/task/update/${taskId}`,
        {
          dueDate: newDate,
        }
      );
      dispatch(getSingleTask(taskId as string));
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update due date",
        variant: "destructive",
      })
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className={containerClass}>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => handleSelectDate(date)}
          disabled={(date) => date < new Date()}
          defaultMonth={new Date(selectedDate ? selectedDate : "")}
        />
        <div className="mt-4 flex flex-col text-popover-foreground">
          Due date
          <div className="flex items-center justify-between gap-3 w-full">
            {selectedDate && (
              <span className="flex items-center bg-accent p-3 rounded-lg flex-1 mt-2 h-10">
                {format(new Date(selectedDate), "M/dd/yy")}
              </span>
            )}
            <input
              title="title"
              type="time"
              className="flex items-center bg-accent p-3 rounded-lg flex-1 mt-2 h-10"
              value={selectedTime}
              onChange={handleSelectTime}
            />
          </div>
        </div>
        <div className="mt-10 flex justify-end gap-3">
          <button
            type="button"
            className="cursor-pointer p-2.5 rounded-md text-primary-foreground bg-primary"
            onClick={handleClickAway}
          >
            Cancel
          </button>
          <button
            type="button"
            className="cursor-pointer p-2.5 rounded-md text-primary-foreground bg-primary"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </ClickAwayListener>
  );
};

export default DateDropdown;