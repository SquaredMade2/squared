'use client';
import '@/app/globals.css';
import InboxList from '@/components/InboxList';
import InboxTopMenu from '@/components/InboxTopMenu';
import { useState } from 'react';
import InboxContents from '@/components/InboxContents';

const styles = {
  wraper:
    'w-full flex overflow-y-auto scrollbar-thin-transparent border rounded-none sm:rounded-md',
  backdrop: 'w-full h-full bg-gray-500 bg-opacity-40 absolute top-0 left-0 z-10 md:hidden',
  inboxContent: 'flex-grow bg-background h-screen overflow-auto scrollbar-thin-transparent',
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
    <div className="w-full h-screen flex bg-background overflow-hidden p-0 sm:p-1">
      {showInboxList && <div className={styles.backdrop} onClick={closeBackdrop} />}
      <div className={styles.wraper}>
        <div className="flex flex-col w-full">
          <InboxTopMenu toggleInboxList={toggleInboxList} />
          <div className="w-full flex">
            <div className="h-screen">
              <InboxList showInboxList={showInboxList} closeBackdrop={closeBackdrop} />
            </div>

            <div className={styles.inboxContent}>
              <InboxContents />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
