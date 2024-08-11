import React, { useState } from "react";
import HideTaskStatusDropdown from "@/components/HideTaskSectionDropdown";
import type { HideStatusProps } from "./HideStatusProps";
import { EllipsisVertical } from "lucide-react";

const HideStatus = ({ toggleShowTasks, showTasks }: HideStatusProps) => {
  const [showHideDropdown, setShowHideDropdown] = useState(false);

  const toggleHideDropdown = (): void => {
    setShowHideDropdown((prevState) => !prevState);
  };

  return (
    <>
      <div className="relative flex items-center">
        <button type="button" onClick={toggleHideDropdown} title="Title">
          <EllipsisVertical className="cursor-pointer size-5" />
        </button>
        {showHideDropdown && (
          <HideTaskStatusDropdown
            toggleHideDropdown={toggleHideDropdown}
            toggleShowTasks={toggleShowTasks}
            showTasks={showTasks}
          />
        )}
      </div>
    </>
  );
};

export default HideStatus;
