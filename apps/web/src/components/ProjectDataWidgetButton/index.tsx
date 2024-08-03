import type { ProjectDataWidgetButtonProps } from "./ProjectDataWidgetButton.interfaces";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";

const styles = {
  mainButton: "flex items-center ml-5 cursor-pointer",
};

export const ProjectDataWidgetButton = ({
  isWidgetOpen,
  handleToggle,
}: ProjectDataWidgetButtonProps): React.ReactElement => {
  return (
    <button
      title="title"
      className={styles.mainButton}
      onClick={handleToggle}
      type="button"
    >
      {isWidgetOpen ? (
        <PanelRightOpen className="size-5 text-[#858699]" />
      ) : (
        <PanelLeftOpen className="size-5 text-[#858699]" />
      )}
    </button>
  );
};
