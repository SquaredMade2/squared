import { useContext } from "react";
import { EditorContext } from "@/components/EditorContext";

const TimestampDisplay = () => {
  const { display } = useContext(EditorContext);

  return (
    <div className="self-start ml-6 pb-4 text-muted-foreground">
      {display()}
    </div>
  );
};

export default TimestampDisplay;
