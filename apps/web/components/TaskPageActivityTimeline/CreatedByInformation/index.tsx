import React from 'react';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import ProfileImage from '@/components/ProfileImage';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

const styles = {
  container: 'flex items-center px-8',
  authorName: 'text-foreground ml-2 mr-4',
  date: 'mr-4 text-muted-foreground',
  text: 'text-sm text-muted-foreground',
};

const CreatedByInformation = () => {
  const { author, createdAt } = useAppSelector((state) => state.events.taskEventLog);
  const displayDate = () => {
    if (createdAt) {
      const date = parseISO(createdAt as string);
      const formattedDate = format(date, 'dd MMM yyyy');
      return formattedDate;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.date}>{displayDate()}</div>
      <ProfileImage profileName={author.name} location={'activityItem'} />
      <p className={styles.authorName}>{author.name}</p>
      <p className={styles.text}>created the issue</p>
    </div>
  );
};

export default CreatedByInformation;
