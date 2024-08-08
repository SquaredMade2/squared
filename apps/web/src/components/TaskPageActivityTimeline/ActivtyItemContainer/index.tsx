import React from "react";
import UpdatedByInformation from "../UpdatedByInformation";
import CreatedByInformation from "../CreatedByInformation";

const ActivityItemContainer = () => {
  return (
    <div className="flex flex-col bg-card rounded-md text-sm">
      <CreatedByInformation />
      <UpdatedByInformation />
    </div>
  );
};

export default ActivityItemContainer;
