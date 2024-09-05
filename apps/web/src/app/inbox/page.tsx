"use client";
import "@/app/globals.css";
import InboxList from "@/components/InboxList";
import InboxTopMenu from "@/components/InboxTopMenu";
import { useState } from "react";
import InboxContents from "@/components/InboxContents";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import IconLeftMenu from "@/components/IconLeftMenu";

export default function Inbox(): React.JSX.Element {
	const [showInboxList, setShowInboxList] = useState(false);
	const closeBackdrop = () => {
		setShowInboxList(false);
	};
	const toggleInboxList = () => {
		setShowInboxList(!showInboxList);
	};
	const notifications = useAppSelector(
		(state) => state.notifications.notifications,
	);

	return (
		<div className="flex w-full">
			<div className="w-12 bg-muted dark:bg-accent hidden xl:block">
				<IconLeftMenu />
			</div>
			<div className="w-full h-screen flex  overflow-hidden p-0 sm:p-2">
				{showInboxList && (
					<div
						className="w-full h-full bg-gray-500 bg-opacity-40 absolute top-0 left-0 z-10 xl:hidden"
						onClick={closeBackdrop}
					/>
				)}

				<ScrollArea className="w-full flex border sm:rounded">
					<div className="flex flex-col w-full">
						<InboxTopMenu toggleInboxList={toggleInboxList} />
						<div className="w-full flex">
							<div className="h-screen">
								<InboxList
									showInboxList={showInboxList}
									closeBackdrop={closeBackdrop}
									notifications={notifications}
								/>
							</div>

							<div className="flex-grow bg-background h-screen overflow-auto scrollbar-thin-transparent">
								<InboxContents notifications={notifications} />
							</div>
						</div>
					</div>
				</ScrollArea>
			</div>
		</div>
	);
}
