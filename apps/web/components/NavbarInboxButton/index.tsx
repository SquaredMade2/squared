'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';

const styles = {
  row: 'w-full flex  items-center my-1.5 rounded-md mr-3',
  innerDivSpan: 'text-sm m-2 text-popover-foreground font-semibold',
  searchButtonDiv: 'ml-3.5',
  inboxButton: 'p-1 w-full flex items-center h-9 hover:bg-secondary rounded-md cursor-pointer',
  hover: 'bg-secondary',
};

export const NavBarInboxButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const inboxPageChecker = pathname.includes('/inbox');
  const workspace = useAppSelector((state) => state.taskData.currentWorkspace);
  return (
    <div
      className={`${styles.row + styles.inboxButton} ${inboxPageChecker && styles.hover} `}
      onClick={() => {
        router.push(`/workspace/${workspace.url}/inbox`);
      }}
    >
      <div className={`${styles.innerDivSpan}`}>Inbox</div>
    </div>
  );
};
