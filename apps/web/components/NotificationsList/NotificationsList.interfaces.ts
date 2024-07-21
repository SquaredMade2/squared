export interface NotificationListProps {
  setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
  showNotification: boolean;
  notificationButtonRef: React.RefObject<HTMLButtonElement>;
}
