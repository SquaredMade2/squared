"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";

export const NavBarInboxButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const inboxPageChecker = pathname.includes("/inbox");
  const workspace = useAppSelector((state) => state.taskData.currentWorkspace);
  return (
    <div
      className={`${"w-full flex  items-center my-1.5 rounded-md mr-3" + "p-1 w-full flex items-center h-9 hover:bg-secondary rounded-md cursor-pointer"} ${inboxPageChecker && "bg-secondary"} `}
      onClick={() => {
        router.push(`/workspace/${workspace.url}/inbox`);
      }}
    >
      <div className={`${"text-sm m-2 text-popover-foreground font-semibold"}`}>
        Inbox
      </div>
    </div>
  );
};
