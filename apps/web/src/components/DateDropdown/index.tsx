import { useState } from 'react';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { getSingleTask } from '@/store/task/thunks';
import { setDueDate } from '@/store/taskData';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { leftBracket, rightBracket } from '@/components/Svg';
import type { DateDropdownProps } from '@/components/DateDropdown/DateDropdown.interfaces';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  startOfDay,
  isBefore,
  endOfDay,
} from 'date-fns';
import { DAYS_OF_WEEK } from '@/constants/app_constants';

const styles = {
  container: 'border border-border bg-popover p-3.5 text-sm shadow-lg rounded-md w-72',
  header: 'flex justify-between items-center text-popover-foreground mb-4',
  grid: 'grid grid-cols-7 gap-1',
  day: 'cursor-pointer rounded-md p-2 hover:bg-blueGlow border border-transparent hover:border-blueGlow text-center focus:outline-none focus:shadow-sm active:shadow-lg',
  dayNotCurrentMonth: 'text-muted-foreground',
  dayNameContainer: 'grid grid-cols-7 gap-1 rounded-md py-3 my-3 bg-accent',
  dayName: 'font-semibold text-muted-foreground text-center',
  selectedDay:
    'text-secondary-foreground bg-secondary hover:bg-blueGlow border border-transparent hover:border-blueGlow focus:outline-none focus:shadow-sm active:shadow-lg',
  disabledDay: 'cursor-not-allowed pointer-events-none text-muted-foreground',
  svg: 'cursor-pointer',
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
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));
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

  const handleSelectDate = (selectedDay: Date) => {
    if (isDateInPast(selectedDay)) return;
    updateDateTime(selectedDay, selectedTime);
  };

  const handleSelectTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    updateDateTime(selectedDate, time);
  };

  const handleSave = () => {
    if (location === 'issueSidebar') updateItem(selectedDate);
    if (location === 'newIssue') dispatch(setDueDate(selectedDate));
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

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className={containerClass}>
        <div className={styles.header}>
          <button type="button" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <span className={styles.svg}>{leftBracket()}</span>
          </button>
          <span>{format(currentMonth, 'MMMM yyyy')}</span>
          <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <span className={styles.svg}>{rightBracket()}</span>
          </button>
        </div>
        <div className={styles.dayNameContainer}>
          {DAYS_OF_WEEK.map((dayName) => (
            <div key={dayName} className={styles.dayName}>
              {dayName.charAt(0)}
            </div>
          ))}
        </div>
        <div className={styles.grid}>
          {days.map((day) => {
            const isPast = isDateInPast(day);
            const isSelected = selectedDate && isSameDay(day, startOfDay(new Date(selectedDate)));
            return (
              <button
                type="button"
                key={day.toString()}
                className={`${styles.day} ${
                  !isSameMonth(day, currentMonth) && styles.dayNotCurrentMonth
                } ${
                  isSelected ? styles.selectedDay : 'text-popover-foreground'
                } ${isPast && styles.disabledDay}`}
                onClick={() => handleSelectDate(day)}
                disabled={isPast}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
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
