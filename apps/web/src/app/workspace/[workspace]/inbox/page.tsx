"use client";
import "@/app/globals.css";
import InboxList from "@/components/InboxList";
import InboxTopMenu from "@/components/InboxTopMenu";
import { useState } from "react";
import InboxContents from "@/components/InboxContents";
import { ScrollArea } from "@/components/ui/scroll-area";

const styles = {
  wraper: "w-full flex  border  sm:rounded",
  backdrop:
    "w-full h-full bg-gray-500 bg-opacity-40 absolute top-0 left-0 z-10 xl:hidden",
  inboxContent:
    "flex-grow bg-background h-screen overflow-auto scrollbar-thin-transparent",
};

export default function Inbox(): React.JSX.Element {
  const [showInboxList, setShowInboxList] = useState(false);
  const closeBackdrop = () => {
    setShowInboxList(false);
  };
  const toggleInboxList = () => {
    setShowInboxList(!showInboxList);
  };

  return (
    <div className="w-full h-screen flex  overflow-hidden p-0 sm:p-2">
      {showInboxList && (
        <div className={styles.backdrop} onClick={closeBackdrop} />
      )}
      <ScrollArea className={styles.wraper}>
        <div className="flex flex-col w-full">
          <InboxTopMenu toggleInboxList={toggleInboxList} />
          <div className="w-full flex">
            <div className="h-screen">
              <InboxList
                showInboxList={showInboxList}
                closeBackdrop={closeBackdrop}
              />
            </div>

            <div className={styles.inboxContent}>
              <InboxContents />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
