'use client';
import '@/app/globals.css';
import { SocketContext } from '@/app/SocketProvider';
import { InboxItem } from '@/components/InboxItem';
import { useAppDispatch, useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { useContext, useEffect } from 'react';
import { getNotifications, newNotification } from '@/store/notifications';
import type { NotificationProps } from '@/store/notifications';
type Props = {
  showInboxList: boolean;
  closeBackdrop: () => void;
};

const styles = {
  notificationsList: 'flex flex-col gap-2 scrollbar-thin-transparent h-full overflow-y-auto py-2',

  mailList:
    'w-72 h-full absolute z-10 bg-background md:static xl:w-80 transition-all duration-300 ease-in-out',
};

const InboxList: React.FC<Props> = ({ showInboxList, closeBackdrop }) => {
  const socket = useContext(SocketContext);
  const user = useAppSelector((state) => state.userSettings.user);
  const notifications: NotificationProps[] = useAppSelector(
    (state) => state.notifications.notifications,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.emit('socketId', user._id);
    socket.emit('getUser', user._id);
    socket.on('send_notification', (data: unknown) => {
      const notificationData = typeof data === 'string' ? JSON.parse(data) : data;
      dispatch(getNotifications(notificationData));
    });
    socket.on('new_notification', (data: unknown) => {
      const notificationData = typeof data === 'string' ? JSON.parse(data) : data;
      dispatch(newNotification(notificationData));
    });
    socket.on('notification_removed', (data) => {
      dispatch(getNotifications(data));
    });
    return () => {
      socket.off('send_notification');
      socket.off('new_notification');
      socket.off('notification_removed');
    };
  }, [socket.id, dispatch]);

  useEffect(() => {
    // return () => {
    // 	dispatch(clearCurrentTaskId());
    // }; //uncomment if you decide to flush inbox view when component unmounts, the current logic continues from where left off
  }, []);

  return (
    <div className={`${styles.mailList} ${showInboxList ? 'left-0 top-0' : '-left-72'}`}>
      <div className={styles.notificationsList}>
        {notifications?.map((obj: NotificationProps) => (
          <InboxItem
            key={obj._id}
            notificationId={obj._id}
            id={obj.task[0]._id}
            title={obj.task[0].title}
            date={obj.createdAt}
            read={obj.read}
            closeBackdrop={closeBackdrop}
          />
        ))}
      </div>
    </div>
  );
};
export default InboxList;
