import React from "react";
import { styles } from "../SearchCommandStyle";

const SearchCommandButton = ({
  firstButton,
  secondButton,
}: {
  firstButton: string;
  secondButton: string;
}) => {
  return (
    <>
      {" "}
      <button type="button" name="button" className={`mr-1 ${styles.button}`}>
        {firstButton}
      </button>
      <span className={styles.thenText}>then</span>
      <button type="button" name="button" className={styles.button}>
        {secondButton}
      </button>
    </>
  );
};

export default SearchCommandButton;
