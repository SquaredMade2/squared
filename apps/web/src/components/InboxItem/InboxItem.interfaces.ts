export interface InboxItemProps {
	taskId: string;
	date: string;
	title: string | null;
	read: boolean;
	notificationId: string;
	closeBackdrop: () => void;
}
