export interface InboxItemProps {
  id: string;
  date: string;
  title: string;
  read: boolean;
  notificationId: string;
  closeBackdrop: () => void;
}
