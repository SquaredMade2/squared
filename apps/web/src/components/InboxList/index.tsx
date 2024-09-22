"use client";
import "@/app/globals.css";
import { InboxItem } from "@/components/InboxItem";
import { ScrollArea } from "../ui/scroll-area";
import IconLeftMenu from "../IconLeftMenu";
import type { Notification } from "@repo/db";

type Props = {
	showInboxList: boolean;
	closeBackdrop: () => void;
	notifications: Notification[];
};
const InboxList: React.FC<Props> = ({
	showInboxList,
	closeBackdrop,
	notifications,
}) => {
	return (
		<div
			className={`$w-auto h-full flex absolute z-10 bg-background xl:static transition-all duration-300 ease-in-out
        ${showInboxList ? "left-0 top-0" : "-left-[100%]"}`}
		>
			<div className="md:hidden">
				<IconLeftMenu />
			</div>

			{notifications.length > 0 && (
				<ScrollArea className="h-full w-full p-2 border-r transition-all duration-500 ease-in-out">
					<div className="flex flex-col gap-2 justify-center">
						{notifications.map((obj: Notification) => (
							<InboxItem
								key={obj.id}
								notificationId={obj.id}
								taskId={obj.taskIds[0]}
								title={obj.description}
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
