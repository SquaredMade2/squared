import { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import { setCurrentFilter } from '@/store/filterPage/actions';
import { leftBracket, rightBracket } from '@/components/Svg';
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
import type { DueDateFilterDropDownProps, FilterOption } from '@/app/interfaces/Filter.interfaces';
import { DAYS_OF_WEEK } from '@/constants/app_constants';

const styles = {
  main: 'absolute z-50 top-5 -left-1 w-72',
  container: 'border border-border bg-popover p-3.5 text-sm shadow-lg rounded-md w-72',
  header: 'flex justify-between items-center text-foreground mb-4',
  grid: 'grid grid-cols-7 gap-1',
  day: 'cursor-pointer rounded-md p-2 hover:bg-blueGlow border border-transparent hover:border-blueGlow text-center focus:outline-none focus:shadow-sm active:shadow-lg',
  dayNotCurrentMonth: 'text-muted-foreground',
  dayNameContainer: 'grid grid-cols-7 gap-1 rounded-md py-3 my-3 bg-accent',
  dayName: 'font-semibold text-muted-foreground text-center',
  selectedDay:
    'text-[#174EFF] hover:bg-blueGlow border border-transparent hover:border-blueGlow focus:outline-none focus:shadow-sm active:shadow-lg',
  disabledDay: 'cursor-not-allowed pointer-events-none text-muted-foreground',
  svg: 'cursor-pointer',
  dateContainer: 'mt-4 flex flex-col text-foreground',
  inputRow: 'flex items-center justify-between gap-3 w-full',
  input: 'flex items-center bg-accent p-3 rounded-lg flex-1 mt-2 h-10',
  buttonContainer: 'mt-10 flex justify-end gap-3',
  button: 'cursor-pointer p-2.5 rounded-md text-foreground',
  toggleContainer: 'flex gap-2 mb-4',
  toggleButton: 'flex-1 p-2 rounded-md text-center cursor-pointer',
  selectedToggleButton: 'bg-[#123abc] text-white',
  unselectedToggleButton: 'bg-gray-400 text-black',
};

const DueDateFilterDropDown = ({
  showDueDateFilterDropDown,
  setShowDueDateFilterDropDown,
  handleFilter,
}: DueDateFilterDropDownProps) => {
  const dispatch = useAppDispatch();
  const [showFilterDropDown, setShowFilterDropDown] = useState(false);
  const filterDropDownRef = useRef<HTMLButtonElement | null>(null);
  const initialDate = new Date();
  const initialTime = initialDate ? format(new Date(initialDate), 'HH:mm') : '12:00';
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [selectedDate, setSelectedDate] = useState(
    initialDate ? new Date(initialDate) : new Date(),
  );
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));
  const [selectedToggle, setSelectedToggle] = useState<'before' | 'after' | null>(null);

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

  const handleClick = () => {
    if (selectedDate) {
      const filterOption: FilterOption = {
        id: 4,
        name: selectedDate.toISOString(),
        border: false,
        svg: {},
        group: 'dueDate',
        comparison: selectedToggle,
      };
      handleFilter(filterOption);
      setShowFilterDropDown(false);
      setShowDueDateFilterDropDown(false);

      dispatch(setCurrentFilter(filterOption));
    }
  };

  const handleToggleClick = (type: 'before' | 'after') => {
    if (selectedToggle === type) {
      setSelectedToggle(null);
    } else {
      setSelectedToggle(type);
    }
  };

  const handleClickAway = () => {
    setShowFilterDropDown(false);
  };

  useEffect(() => {
    if (showDueDateFilterDropDown) {
      setShowFilterDropDown(true);
      if (filterDropDownRef.current) {
        filterDropDownRef.current.click();
      }
    } else {
      setShowFilterDropDown(false);
    }
  }, [showDueDateFilterDropDown]);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const toggleButtonClass = (type: 'before' | 'after') =>
    `${styles.toggleButton} ${
      selectedToggle === type ? styles.selectedToggleButton : styles.unselectedToggleButton
    }`;

  return (
    <div
      className={` ${styles.main} ${showFilterDropDown ? 'h-10 mt-[20%]' : 'h-0 hidden'} transition-all duration-300 opacity-100' 
			}`}
      // Please do not move styles to styles object. The props cannot be read in styles object.
    >
      <div className={styles.container}>
        <div className={styles.toggleContainer}>
          <div className={toggleButtonClass('before')} onClick={() => handleToggleClick('before')}>
            Before Date
          </div>
          <div className={toggleButtonClass('after')} onClick={() => handleToggleClick('after')}>
            After Date
          </div>
        </div>
        <div className={styles.header}>
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} type="button">
            <span className={styles.svg}>{leftBracket()}</span>
          </button>
          <span>{format(currentMonth, 'MMMM yyyy')}</span>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} type="button">
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
                key={day.toString()}
                className={`${styles.day} ${
                  !isSameMonth(day, currentMonth) && styles.dayNotCurrentMonth
                } ${isSelected ? styles.selectedDay : 'text-foreground'} ${
                  isPast && styles.disabledDay
                }`}
                onClick={() => handleSelectDate(day)}
                disabled={isPast}
                type="button"
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
            className={`${styles.button} border-2 border-border bg-popover`}
            onClick={handleClickAway}
            type="button"
          >
            Cancel
          </button>
          <button
            className={`${styles.button} bg-[#123abc] text-white`}
            onClick={handleClick}
            type="button"
          >
            Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default DueDateFilterDropDown;
