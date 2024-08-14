import React from "react";
import Expand from "../Expand";
import DeleteNotification from "../DeleteNotification";
import FavNotification from "../FavNotification";
import SnoozeNotification from "../SnoozeNotification";
import UnsubscribeNotification from "../UnsubscribeNotification";

const Notificationcontrols = () => {
  return (
    <div className="flex-grow sm:pr-2 flex gap-2 sm:gap-3 items-center justify-end">
      <Expand />
      <DeleteNotification />
      <FavNotification />
      <SnoozeNotification />
      <UnsubscribeNotification />
    </div>
  );
};

export default Notificationcontrols;
