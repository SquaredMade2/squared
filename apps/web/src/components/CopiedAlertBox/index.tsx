import React from "react";

const styles = {
  paste: "text-muted-foreground text-xs font-bold",
  urlClipboard: "text-muted-foreground text-xs font-bold leading-6 ",
  copiedAlertBox:
    "absolute right-10 top-[85vh] bg-popover  p-2 rounded border border-border transition-all delay-100 duration-1000 ",
};

const CopiedAlertBox = ({ isUrlClicked }: { isUrlClicked: boolean }) => {
  return (
    <div
      className={`${styles.copiedAlertBox} ${isUrlClicked ? "opacity-100" : "opacity-0"}`}
    >
      <p className={styles.urlClipboard}>URL copied to clipboard</p>
      <p className={styles.paste}>Paste it wherever you like</p>
    </div>
  );
};

export default CopiedAlertBox;
