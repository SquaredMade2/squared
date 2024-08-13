import { Search } from "lucide-react";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";

const styles = {
  searchButtonDiv: "ml-3.5",
  searchButton:
    "rounded-md border border-border w-10 align-center flex justify-center bg-secondary shadow-lg focus:outline-none flex flex-row items-center cursor-pointer hover:bg-popover h-10 items-center",
  searchIconSVG: "stroke-current fill-transparent cursor-pointer h-5 w-5",
};
const SearchButton = ({
  setIsSearchCommand,
}: {
  setIsSearchCommand: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { theme } = useAppSelector((state) => state.userSettings);

  const handleClick = (): void => {
    setIsSearchCommand((open: boolean) => !open);
  };
  return (
    <div className={styles.searchButtonDiv}>
      <button onClick={handleClick} type="button" title="Title">
        <span className={styles.searchButton}>
          <Search
            className={`${styles.searchIconSVG} ${theme === "light" ? "text-[#797A8C] " : "text-[white]"}`}
          />
        </span>
      </button>
    </div>
  );
};

export default SearchButton;
