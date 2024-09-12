"use client";
import { useEffect, useRef, useContext } from "react";
import type { InboxItemProps } from "./InboxItem.interfaces";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeOpen, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { SocketContext } from "@/app/SocketProvider";
import {
	useAuthStore,
	useNotificationStore,
	useTaskStore,
	useWorkspaceStore,
} from "@/storeZ";

export const InboxItem: React.FC<InboxItemProps> = ({
	taskId,
	date,
	title,
	read,
	notificationId,
	closeBackdrop,
}) => {
	const route = useRouter();
	const isoDateString = Date.parse(date.toString());
	const toDayString = Date.now();
	const timeSinceCreation = toDayString - isoDateString;
	const millisecondsPerDay = 1000 * 60 * 60 * 24;
	const days = Math.floor(timeSinceCreation / millisecondsPerDay);

	const { currentTask, setCurrentTask, tasks } = useTaskStore((state) => state);
	const { getAllNotifications, updateNotification } = useNotificationStore(
		(state) => state,
	);
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	if (!currentWorkspace) return null;
	const { user } = useAuthStore((state) => state);
	const socket = useContext(SocketContext);

	const isActive = currentTask?.id === taskId;
	const activeDivRef = useRef<HTMLDivElement | null>(null);

	const handleMarkRead = (notificationId: string) => {
		user && socket.emit("sending_notificationId", notificationId, user.id);
		updateNotification(notificationId, { read: true });
	};

	const handleClick = async (taskId: string, notificationId: string) => {
		const task = tasks.find((task) => task.id === taskId);
		task && setCurrentTask(task);
		handleMarkRead(notificationId);
		closeBackdrop();
	};
	useEffect(() => {
		if (activeDivRef.current) {
			activeDivRef.current.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}
	}, [route]);

	useEffect(() => {
		socket.on("receiving_updatedMarkedNotification", (data: unknown) => {
			const updatedNotificationData =
				typeof data === "string" ? JSON.parse(data) : data;
			getAllNotifications(updatedNotificationData);
		});
	}, [socket.id]);

	return (
		<div
			onClick={() => handleClick(taskId, notificationId)}
			className={`p-2 w-80 rounded-md text-muted-foreground bg-popover border cursor-pointer  ${
				isActive
					? "border-indigo-400 shadow shadow-indigo-400 dark:bg-[#282E43] text-foreground"
					: read
						? "dark:border-none"
						: "bg-muted dark:bg-accent"
			} ${!isActive ? "hover:text-foreground hover:border hover:shadow dark:hover:bg-[#282E43] hover:border-gray-500" : ""}`}
		>
			<div ref={isActive ? activeDivRef : null}>
				<div className="flex justify-between">
					<p className="text-foreground truncate ">{title}</p>
					<div className="text-xs">
						<FontAwesomeIcon icon={read ? faEnvelopeOpen : faEnvelope} />
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
