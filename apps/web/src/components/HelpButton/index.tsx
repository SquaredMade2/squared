import type React from "react";
import type { HelpButtonProps } from "./HelpButton.interfaces";
import { styles } from "./HelpButton.styles";
import { CircleHelp } from "lucide-react";

const HelpButton: React.FC<HelpButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Help about effort estimation"
      type="button"
    >
      {" "}
      <span className={styles.svg}>
        <CircleHelp className="size-5 fill-[#808080] text-[#ffffff]" />
      </span>
    </button>
  );
};

export default HelpButton;
