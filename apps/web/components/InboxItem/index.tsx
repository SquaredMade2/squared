'use client';
import { useEffect, useRef, useContext } from 'react';
import type { InboxItemProps } from './InboxItem.interfaces';
import { useAppSelector, useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import { useRouter } from 'next/navigation';
import { setCurrentTaskId } from '@/store/currentTask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons';
import { SocketContext } from '@/app/SocketProvider';
import { getNotifications } from '@/store/notifications';

export const InboxItem: React.FC<InboxItemProps> = ({
  id,
  date,
  title,
  read,
  notificationId,
  closeBackdrop,
}) => {
  const route = useRouter();
  const isoDateString = Date.parse(date);
  const toDayString = Date.now();
  const timeSinceCreation = toDayString - isoDateString;
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const days = Math.floor(timeSinceCreation / millisecondsPerDay);
  const dispatch = useAppDispatch();
  const currentTaskId = useAppSelector((state) => state.currentTask.currentTaskId);
  const socket = useContext(SocketContext);
  const user = useAppSelector((state) => state.userSettings.user);
  const isActive = currentTaskId === id;
  const activeDivRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useAppSelector((state) => state.userSettings);
  const inactiveNotread =
    theme === 'dark'
      ? 'bg-[#171B26] text-muted-foreground'
      : 'bg-white shadow-sm text-muted-foreground';
  const inactiveRead =
    theme === 'dark'
      ? 'bg-popover text-muted-foreground'
      : 'bg-transparen border text-muted-foreground';

  const active =
    theme === 'dark'
      ? 'text-foreground bg-[#282E43] border-indigo-400 shadow shadow-indigo-400'
      : 'bg-popover border border-indigo-400 shadow shadow-indigo-400';
  const hover = isActive
    ? ''
    : theme === 'dark'
      ? 'hover:text-foreground hover:bg-[#282E43]'
      : 'hover:border hover:border-indigo-300 hover:shadow hover:text-foreground';

  const handleMarkRead = (id: string) => {
    socket.emit('sending_notificationId', id, user._id);
  };

  const handleClick = (taskId: string, notificationId: string): void => {
    dispatch(setCurrentTaskId(taskId));
    handleMarkRead(notificationId);
    closeBackdrop();
  };
  useEffect(() => {
    if (activeDivRef.current) {
      activeDivRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [route, theme]);

  useEffect(() => {
    socket.on('receiving_updatedMarkedNotification', (data: unknown) => {
      const updatedNotificationData = typeof data === 'string' ? JSON.parse(data) : data;
      dispatch(getNotifications(updatedNotificationData));
    });
  }, [socket.id, dispatch]);

  return (
    <div
      onClick={() => handleClick(id, notificationId)}
      className={`p-2 mx-1 rounded-md cursor-pointer  ${
        isActive ? active : read ? inactiveRead : inactiveNotread
      } ${hover}`}
    >
      <div ref={isActive ? activeDivRef : null}>
        <div className="flex justify-between">
          <p className="text-foreground truncate ">{title}</p>
          <div className="text-xs">
            {read ? (
              <FontAwesomeIcon icon={faEnvelopeOpen} />
            ) : (
              <FontAwesomeIcon icon={faEnvelope} />
            )}
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <p className="">summary</p>
          <p>{days}d</p>
        </div>
      </div>
    </div>
  );
};
