import { useDispatch, useSelector } from 'react-redux';
import { setShowNewIssue } from '@/store/showNewIssue';
import { NewIssue } from '@/components/Svg';
import { setStatus } from '@/store/taskData';
import type { RootState } from '@/store';

const NewIssueButton = () => {
  const dispatch = useDispatch();

  const titleArr = { value: 'Todo', id: 2 };
  const styles = {
    button:
      'flex flex-row w-9/12 h-10 items-center justify-center border border-blue-800 shadow-lg rounded focus:outline-none focus:shadow-sm active:shadow-lg cursor-pointer hover:shadow-glow text-blue-600 dark:text-foreground bg-blue-400/20 dark:bg-blue-800/60',
    blueCircle: 'w-1.5 h-1.5 rounded-md bg-accent border-border ml-2',
    placeholder: 'px-2 w-auto text-foreground, cursor-pointer',
    svg: ' w-[20px] h-[20px] cursor-pointer',
  };

  const showNewIssue = useSelector((state: RootState) => state.showNewIssue.isOpen);
  const resumeNewIssue = useSelector((state: RootState) => state.resumeNewIssue.hasData);
  const { theme } = useSelector((state: RootState) => state.userSettings);

  const fillColor = () => (theme === 'light' ? '#174EFF' : 'white');
  const handleOpen = () => {
    dispatch(setShowNewIssue(true));
    dispatch(setStatus(titleArr.value));
  };

  return (
    <button type="button" className={styles.button} onClick={() => handleOpen()}>
      <span>{NewIssue(styles.svg, fillColor())}</span>
      <span className={styles.placeholder}>
        {resumeNewIssue && !showNewIssue ? 'Resume editing' : 'New Issue'}
      </span>
      {resumeNewIssue && !showNewIssue && <div className={styles.blueCircle} />}
    </button>
  );
};

export default NewIssueButton;
