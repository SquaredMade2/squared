'use client';
import '@/app/globals.css';
import Task from '@/components/Task';
import { inboxSymbol2 } from '@/components/Svg';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import type { NotificationProps } from '@/store/notifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopesBulk } from '@fortawesome/free-solid-svg-icons';

export default function InboxContents(): React.JSX.Element {
  const theCurrentTask = useAppSelector((state) => state.currentTask.currentTaskId);
  const notifications: NotificationProps[] = useAppSelector(
    (state) => state.notifications.notifications,
  );

  const hasUnreadNotification = notifications.some((notification) => notification.read === false);

  return (
    <>
      {theCurrentTask !== null && (
        <div className="md:border-l md:ml-1 ">
          <Task mailTask={true} />
        </div>
      )}
      {theCurrentTask === null && (
        <div className=" h-full flex items-center justify-center md:border-l md:ml-1">
          <div className="flex flex-col gap-2 text-secondary items-center">
            <div className="text-muted-foreground">
              {hasUnreadNotification ? (
                <FontAwesomeIcon className="w-16 h-16" icon={faEnvelopesBulk} />
              ) : (
                inboxSymbol2('w-16 h-16')
              )}
            </div>
            <div className="text-foreground text-lg">Inbox</div>
            <div className="text-muted-foreground text-sm">
              {hasUnreadNotification ? 'You have unread notifications' : 'No unread notifications'}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
