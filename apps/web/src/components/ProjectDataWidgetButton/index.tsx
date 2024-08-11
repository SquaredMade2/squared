import type { ProjectDataWidgetButtonProps } from "./ProjectDataWidgetButton.interfaces";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";

export const ProjectDataWidgetButton = ({
  toggleWidget,
  setToggleWidget,
}: ProjectDataWidgetButtonProps): React.ReactElement => {
  return (
    <button
      title="title"
      className="flex items-center ml-5 cursor-pointer"
      onClick={() => setToggleWidget(!toggleWidget)}
      type="button"
    >
      {toggleWidget ? (
        <PanelRightOpen className="size-5 text-[#858699]" />
      ) : (
        <PanelLeftOpen className="size-5 text-[#858699]" />
      )}
    </button>
  );
};
