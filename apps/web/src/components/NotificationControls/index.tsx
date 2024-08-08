import React from "react";
import Expand from "../Expand";
import DeleteNotification from "../DeleteNotification";
import FavNotification from "../FavNotification";
import SnoozeNotification from "../SnoozeNotification";
import UnsubscribeNotification from "../UnsubscribeNotification";

const styles = {
  buttons:
    "flex-grow mr:2 md:mr-5 xl:mr-10 flex gap-2 sm:gap-9 items-center justify-end",
};

const Notificationcontrols = () => {
  return (
    <div className={styles.buttons}>
      <Expand />
      <DeleteNotification />
      <FavNotification />
      <SnoozeNotification />
      <UnsubscribeNotification />
    </div>
  );
};

export default Notificationcontrols;
