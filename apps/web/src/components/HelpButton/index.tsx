import type React from "react";
import type { HelpButtonProps } from "./HelpButton.interfaces";
import { CircleHelp } from "lucide-react";

const HelpButton: React.FC<HelpButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Help about effort estimation"
      type="button"
    >
      {" "}
      <span className="w-2 h-2 cursor-pointer">
        <CircleHelp className="size-4 fill-muted text-muted-foreground" />
      </span>
    </button>
  );
};

export default HelpButton;
