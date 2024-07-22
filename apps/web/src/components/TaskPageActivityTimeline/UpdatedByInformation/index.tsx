import React from 'react';
import ProfileImage from '@/components/ProfileImage';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import {
  type Assignee,
  type Author,
  EventType,
  type TaskEvent,
  type Labels,
} from '@/interfaces/event.interfaces';

const UpdatedByInformation = () => {
  const styles = {
    listWrapper: 'w-full',
    listItemsContainer: 'list-none px-8',
    listItem: 'flex items-center text-foreground border-t border-border py-1 list-none',
    date: 'mr-4 text-muted-foreground',
    authorContainer: 'flex items-center mr-4',
    authorName: 'ml-2',
    eventUpdatedText: 'text-muted-foreground text-ellipses',
    primaryText: 'text-foreground',
  };

  const eventLogs = useAppSelector((state) => state.events.taskEventLog.eventsLog) as TaskEvent[];

  const findLabelAdded = (originalLabels: Labels[], updatedLabels: Labels[]) => {
    const labelName = updatedLabels.filter((label) => !originalLabels.includes(label));
    return labelName;
  };

  const findLabelRemoved = (originalLabels: Labels[], updatedLabels: Labels[]) => {
    const labelName = originalLabels.filter((label) => !updatedLabels.includes(label));

    return labelName;
  };

  const displayLabelNames = (labels: Labels[]) => {
    return labels.join(', ');
  };

  const displayLabelUpdate = (log: TaskEvent) => {
    const originalLabels = log.originalLabels || [];
    const updatedLabels = log.updatedLabels || [];

    if (updatedLabels.length > originalLabels.length) {
      const labelNamesAdded = findLabelAdded(originalLabels, updatedLabels);
      return (
        <p>
          added {labelNamesAdded.length === 1 ? ' label ' : ' labels '}
          <span className={styles.primaryText}>{displayLabelNames(labelNamesAdded)}</span>
        </p>
      );
    }
    if (originalLabels.length > updatedLabels.length) {
      const labelNamesRemoved = findLabelRemoved(originalLabels, updatedLabels);
      return (
        <p>
          removed {labelNamesRemoved.length === 1 ? ' label ' : ' labels '}
          <span className={styles.primaryText}>{displayLabelNames(labelNamesRemoved)}</span>
        </p>
      );
    }
  };

  const displayDescriptionUpdate = (log: TaskEvent) => {
    const noDescription = log.originalValue?.length === 0;
    const descriptionUpdated =
      log.originalValue &&
      log.originalValue?.length > 0 &&
      log.updatedValue &&
      log.updatedValue?.length > 0;
    if (noDescription) {
      return (
        <p>
          added description <span className={styles.primaryText}>{log.updatedValue}</span>
        </p>
      );
    }
    if (descriptionUpdated) {
      return (
        <p>
          updated description from <span className={styles.primaryText}>{log.originalValue}</span>{' '}
          to <span className={styles.primaryText}>{log.updatedValue}</span>
        </p>
      );
    }
    return (
      <p>
        removed description <span className={styles.primaryText}>{log.originalValue}</span>
      </p>
    );
  };
  const getAssigneeActions = (originalAssignee: Assignee, updatedAssignee: Assignee) => {
    const noPreviousAssignee =
      originalAssignee?.name === 'not Assigned' && updatedAssignee?.name !== 'not Assigned';

    const assigneeRemoved = updatedAssignee?.name === 'not Assigned';

    return {
      noPreviousAssignee,
      assigneeRemoved,
    };
  };

  const displayAssigneeUpdate = (log: TaskEvent) => {
    const { originalAssignee, updatedAssignee, author } = log;
    const { noPreviousAssignee, assigneeRemoved } = getAssigneeActions(
      originalAssignee as Assignee,
      updatedAssignee as Assignee,
    );
    const selfAssigned = author.name === updatedAssignee?.name;
    if (noPreviousAssignee && selfAssigned) {
      return <p>self assigned task</p>;
    }
    if (noPreviousAssignee && !selfAssigned) {
      return (
        <p>
          assigned task to <span className={styles.primaryText}>{updatedAssignee?.name}</span>
        </p>
      );
    }
    if (assigneeRemoved) {
      return <p>unassigned task</p>;
    }
    return (
      <p>
        changed assignee from <span className={styles.primaryText}>{originalAssignee?.name}</span>{' '}
        to <span className={styles.primaryText}>{updatedAssignee?.name}</span>
      </p>
    );
  };

  const displayUpdate = (log: TaskEvent) => {
    switch (log.type) {
      case EventType.TitleUpdated:
        return (
          <p>
            updated title from <span className={styles.primaryText}>{log.originalValue}</span> to{' '}
            <span className={styles.primaryText}>{log.updatedValue}</span>
          </p>
        );

      case EventType.DescriptionUpdated:
        return displayDescriptionUpdate(log);
      case EventType.StatusUpdated:
        return (
          <p>
            updated status from <span className={styles.primaryText}>{log.originalValue}</span> to{' '}
            <span className={styles.primaryText}>{log.updatedValue}</span>
          </p>
        );
      case EventType.PriorityUpdated:
        return (
          <p>
            updated priority from <span className={styles.primaryText}>{log.originalValue}</span> to{' '}
            <span className={styles.primaryText}>{log.updatedValue}</span>
          </p>
        );
      case EventType.LabelsUpdated:
        return displayLabelUpdate(log);
      case EventType.AssigneeUpdated:
        return displayAssigneeUpdate(log);
      default:
        return '';
    }
  };

  const displayDate = (date: string) => {
    if (date) {
      const parsedDate = parseISO(date);
      const formattedDate = format(parsedDate, 'dd MMM yyyy');
      return formattedDate;
    }
  };

  const displayAuthorProfile = (author: Author) => {
    return (
      <>
        <ProfileImage profileName={author.name} location={'activityItem'} />
        <p className={styles.authorName}>{author.name}</p>
      </>
    );
  };
  return (
    <div className={styles.listWrapper}>
      <ul className={styles.listItemsContainer}>
        {eventLogs?.map((log: TaskEvent) => {
          const { updatedAt, author } = log;
          return (
            <li className={styles.listItem} key={updatedAt as string}>
              <div className={styles.date}>{`${displayDate(updatedAt as string)}`}</div>
              <div className={styles.authorContainer}>{displayAuthorProfile(author)}</div>
              <div className={styles.eventUpdatedText}>{displayUpdate(log)}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UpdatedByInformation;
