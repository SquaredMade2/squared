import { useContext, useEffect, useRef } from 'react';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { BellIcon, checkMark, TrashCan } from '@/components/Svg';
import { format } from 'date-fns';
import Link from 'next/link';
import { SocketContext } from '@/app/SocketProvider';
import { getNotifications } from '@/store/notifications';
import { useDispatch } from 'react-redux';
import type { NotificationProps } from '@/store/notifications';
import { motion } from 'framer-motion';
import type { NotificationListProps } from './NotificationsList.interfaces';

const styles = {
  container:
    'flex flex-col gap-2 p-4 rounded-xl absolute top-4 right-2 z-10 w-[466px] overflow-y-auto',
  markAllBtnContainer: 'flex items-center gap-1',
  notificationContainer: 'flex flex-col p-2 gap-2 rounded-xl w-full',
  title: 'flex justify-between items-center',
  headerContainer: 'flex justify-between items-center',
  notificationTextContainer: 'flex items-center gap-2',
  notiCreatedDate: 'text-[#555776]',
  description: 'text-[#ACAFCE]',
  notiBottomLabelContainer: 'flex justify-between items-center text-[#9CA6C9]',
  noNotificationText: 'text-center text-2xl my-auto',
  markReadContainer: 'flex items-center gap-1',
};

function NotificationsList({
  setShowNotification,
  showNotification,
  notificationButtonRef,
}: NotificationListProps) {
  const notifications = useAppSelector((state) => state.notifications.notifications);
  const notificationRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector((state) => state.userSettings.user);
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const { theme } = useAppSelector((state) => state.userSettings);

  const summarizeInputText = (text: string, maxWords: number): string => {
    if (!text) {
      return '';
    }
    const word = text.split(' ');
    if (word.length > maxWords) {
      return `${word.slice(0, maxWords).join(' ')}...`;
    }
    return text;
  };
  useEffect(() => {
    const handler = (event: MouseEvent): void => {
      if (
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(event.target as HTMLElement) &&
        notificationRef.current != null &&
        !notificationRef.current.contains(event.target as HTMLElement)
      ) {
        event.stopPropagation();
        setShowNotification(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, [showNotification]);

  const handleConfirmedNotificationColor = (read: boolean, theme: string) => {
    if (theme === 'light') {
      return read ? 'bg-[#f1eeee] bg-opacity-20' : 'bg-[#e1e1e1] border shadow-sm';
    }
    if (theme === 'dark') {
      return read ? 'bg-[#161c2c]' : 'bg-[#394565]';
    }
  };
  const handleRemoveNotification = (id: string) => {
    socket.emit('remove_notification', id);
  };

  const handleMarkAllRead = () => {
    const getNotificationIds = notifications.map((noti: { _id: string }) => noti._id);
    socket.emit('sending_notificationId', getNotificationIds, user._id);
  };
  const handleMarkRead = (id: string) => {
    socket.emit('sending_notificationId', id, user._id);
  };

  const formattedDate = (notification: string) => {
    return format(new Date(notification), 'MMMM d, yyyy').toString();
  };
  useEffect(() => {
    socket.on('receiving_updatedMarkedNotification', (data: unknown) => {
      const updatedNotificationData = typeof data === 'string' ? JSON.parse(data) : data;
      dispatch(getNotifications(updatedNotificationData));
    });
  }, [socket.id, dispatch]);
  const allNotificationRead = notifications.every((noti: { read: boolean }): boolean => noti.read);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      ref={notificationRef}
      className={`${styles.container} ${
        theme === 'light' ? 'bg-[#FFFFFF] shadow-lg ' : 'bg-[#0d1220ee]'
      }    ${notifications.length > 0 ? 'h-[500px]' : 'h-[250px]'} `}
    >
      <div className={styles.headerContainer}>
        <div className={styles.notificationTextContainer}>
          <span>{BellIcon(theme)}</span>
          <span
            className={`${theme === 'light' ? 'text-black' : 'text-white'}
						}`}
          >
            Notifications
          </span>
        </div>
        <div className={styles.markAllBtnContainer}>
          <button
            type="button"
            onClick={handleMarkAllRead}
            className={`${theme === 'light' ? 'text-black' : 'text-[#9CA6C9]'}  cursor-pointer`}
          >
            Mark all as read
          </button>
          <span>{allNotificationRead ? checkMark('limegreen') : ''}</span>
        </div>
      </div>
      {notifications.length > 0 ? (
        notifications.map((noti: NotificationProps) =>
          noti.task.map((t: { title: string; description: string; _id: string }) => (
            <div
              key={`${noti._id}`}
              className={` ${handleConfirmedNotificationColor(
                noti.read,
                theme,
              )} ${styles.notificationContainer} `}
            >
              <div className={styles.title}>
                <p className={`${theme === 'light' ? 'text-black' : 'text-[#ffffff]'}  `}>
                  {summarizeInputText(t.title, 5)}
                </p>
                <p className={styles.notiCreatedDate}>{formattedDate(noti.createdAt)}</p>
              </div>
              <p className={styles.description}>{summarizeInputText(t.description, 8)}</p>
              <div className={styles.notiBottomLabelContainer}>
                <div className={styles.markReadContainer}>
                  <button
                    type="button"
                    onClick={() => handleMarkRead(noti._id)}
                    className="cursor-pointer "
                  >
                    Mark as read
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => handleRemoveNotification(t._id)}
                  >
                    <TrashCan className="fill-[#9CA6C9]" />
                  </button>
                </div>
                <Link
                  onClick={() => handleMarkRead(noti._id)}
                  href={`${process.env.NEXT_PUBLIC_URL}/tasks/${t._id}`}
                >
                  Details &rarr;
                </Link>
              </div>
            </div>
          )),
        )
      ) : (
        <p
          className={`${styles.noNotificationText} ${
            theme === 'light' ? 'text-black' : 'text-white'
          }`}
        >
          No Notifications
        </p>
      )}
    </motion.div>
  );
}

export default NotificationsList;
