export interface InboxItemProps {
	taskId: string;
	date: Date;
	title: string | null;
	read: boolean;
	notificationId: string;
	closeBackdrop: () => void;
}
