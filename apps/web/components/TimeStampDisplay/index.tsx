import { useContext } from 'react';
import { EditorContext } from '@/components/EditorContext';

const styles = {
  dateContainer: 'flex',
  dateDisplay: 'self-start ml-6 pb-4 text-muted-foreground',
};

const TimestampDisplay = () => {
  const { display } = useContext(EditorContext);

  return <div className={styles.dateDisplay}>{display()}</div>;
};

export default TimestampDisplay;
