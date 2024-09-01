"use client";
import "@/app/globals.css";
import Task from "@/components/Task";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import type { NotificationProps } from "@/store/notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox, faEnvelopesBulk } from "@fortawesome/free-solid-svg-icons";

export default function InboxContents({
	notifications,
}: { notifications: NotificationProps[] }): React.JSX.Element {
	const theCurrentTask = useAppSelector(
		(state) => state.currentTask.currentTaskId,
	);

	const hasUnreadNotification = notifications.some(
		(notification) => notification.read === false,
	);

	return (
		<>
			{theCurrentTask !== null && (
				<div>
					<Task mailTask={true} />
				</div>
			)}
			{theCurrentTask === null && (
				<div className=" h-full flex items-center justify-center ">
					<div className="flex flex-col gap-2 text-secondary items-center">
						<div className="text-muted-foreground">
							<FontAwesomeIcon
								className="text-4xl"
								icon={hasUnreadNotification ? faEnvelopesBulk : faInbox}
							/>
						</div>
						<div className="text-foreground text-lg">Inbox</div>
						<div className="text-muted-foreground text-sm">
							{hasUnreadNotification
								? "You have unread notifications"
								: "No unread notifications"}
						</div>
					</div>
				</div>
			)}
		</>
	);
}
