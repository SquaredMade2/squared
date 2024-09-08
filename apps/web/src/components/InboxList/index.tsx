"use client";
import "@/app/globals.css";
import { SocketContext } from "@/app/SocketProvider";
import { InboxItem } from "@/components/InboxItem";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { useContext, useEffect } from "react";
import { getNotifications, newNotification } from "@/store/notifications";
import type { NotificationProps } from "@/store/notifications";
import { ScrollArea } from "../ui/scroll-area";
import IconLeftMenu from "../IconLeftMenu";
type Props = {
	showInboxList: boolean;
	closeBackdrop: () => void;
	notifications: NotificationProps[];
};
const InboxList: React.FC<Props> = ({
	showInboxList,
	closeBackdrop,
	notifications,
}) => {
	const socket = useContext(SocketContext);
	const user = useAppSelector((state) => state.userSettings.user);
	const dispatch = useAppDispatch();

	useEffect(() => {
		socket.emit("socketId", user._id);
		socket.emit("getUser", user._id);
		socket.on("send_notification", (data: unknown) => {
			const notificationData =
				typeof data === "string" ? JSON.parse(data) : data;
			dispatch(getNotifications(notificationData));
		});
		socket.on("new_notification", (data: unknown) => {
			const notificationData =
				typeof data === "string" ? JSON.parse(data) : data;
			dispatch(newNotification(notificationData));
		});
		socket.on("notification_removed", (data) => {
			dispatch(getNotifications(data));
		});
		return () => {
			socket.off("send_notification");
			socket.off("new_notification");
			socket.off("notification_removed");
		};
	}, [socket.id, dispatch]);

	useEffect(() => {
		// return () => {
		// 	dispatch(clearCurrentTaskId());
		// }; //uncomment if you decide to flush inbox view when component unmounts, the current logic continues from where left off
	}, []);

	return (
		<div
			className={`$w-auto h-full flex absolute z-10 bg-background xl:static transition-all duration-300 ease-in-out
        ${showInboxList ? "left-0 top-0" : "-left-[100%]"}`}
		>
			<div className="w-14 bg-muted dark:bg-accent h-full border-r md:hidden">
				<IconLeftMenu />
			</div>

			{notifications.length > 0 && (
				<ScrollArea className="h-full w-full p-2 border-r transition-all duration-500 ease-in-out">
					<div className="flex flex-col gap-2 justify-center">
						{notifications.map((obj: NotificationProps) => (
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
				</ScrollArea>
			)}
		</div>
	);
};
export default InboxList;
