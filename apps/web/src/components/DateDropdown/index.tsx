import { useState } from 'react';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { getSingleTask } from '@/store/task/thunks';
import { setDueDate } from '@/store/taskData';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import type { DateDropdownProps } from '@/components/DateDropdown/DateDropdown.interfaces';
import {
  format,
  isBefore,
  endOfDay,
} from 'date-fns';
import { Calendar } from '../ui/calendar';

const styles = {
  container: 'border border-border bg-popover p-3.5 text-sm shadow-lg rounded-md w-72',
  dateContainer: 'mt-4 flex flex-col text-popover-foreground',
  inputRow: 'flex items-center justify-between gap-3 w-full',
  input: 'flex items-center bg-accent p-3 rounded-lg flex-1 mt-2 h-10',
  buttonContainer: 'mt-10 flex justify-end gap-3',
  button: 'cursor-pointer p-2.5 rounded-md text-primary-foreground bg-primary',
};

const DateDropdown: React.FC<DateDropdownProps> = ({
	handleButtonClick,
	handleClickAway,
	location,
}) => {
  const dispatch = useAppDispatch();
  const taskId = useAppSelector((state) => state.singleTask?.data?._id);
  const newIssueDate = useAppSelector((state) => state.taskData.dueDate);
  const sidebarDate = useAppSelector((state) => state.singleTask.data?.dueDate);
  const initialDate = location === 'issueSidebar' ? sidebarDate : newIssueDate;
  const initialTime = initialDate ? format(new Date(initialDate), 'HH:mm') : '12:00';
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [selectedDate, setSelectedDate] = useState(
    initialDate ? new Date(initialDate) : new Date(),
  );

  const containerClass = `${styles.container} ${
    location === 'newIssue' ? 'absolute top-8' : 'absolute top-0 -left-[300px]'
  }`;

	const isDateInPast = (date: Date) => isBefore(endOfDay(date), new Date());

  const updateDateTime = (date: Date, time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const updatedDateTime = new Date(date);
    updatedDateTime.setHours(hours, minutes);
    setSelectedDate(updatedDateTime);
    setSelectedTime(time);
  };
// past dates are selectable - when DateButton clicked, calendar displays current month, not due month
// when selectedDate is the date clicked, span for due date disappears
  const handleSelectDate = (selectedDay: Date) => {
    if (isDateInPast(selectedDay)) return;
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

  const updateItem = async (newDate: Date) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_SERVER}/task/update/${taskId}`, {
        dueDate: newDate,
      });
      dispatch(getSingleTask(taskId as string));
    } catch (err) {}
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className={containerClass}>
        <Calendar mode='single' selected={selectedDate} onSelect={setSelectedDate}/>
        <div className={styles.dateContainer}>
          Due date
          <div className={styles.inputRow}>
            {selectedDate && (
              <span className={styles.input}>{format(new Date(selectedDate), 'M/dd/yy')}</span>
            )}
            <input
              type="time"
              className={styles.input}
              value={selectedTime}
              onChange={handleSelectTime}
            />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={`${styles.button} border-2 border-border bg-popover`}
            onClick={handleClickAway}
          >
            Cancel
          </button>
          <button type="button" className={styles.button} onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </ClickAwayListener>
  );
};

export default DateDropdown;
