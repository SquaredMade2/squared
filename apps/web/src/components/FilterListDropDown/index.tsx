import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteView } from "@/store/filterPage/actions";
import type { FilterListDropDownProps } from "./FilterListDropDown.interfaces";
import type { AppDispatch, RootState } from "@/store";
import {
  BookUser,
  ChevronRight,
  CircleUser,
  Copy,
  Ellipsis,
  Link,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";

const styles = {
  main: "relative w-10 text-right mr-5",
  menu: "relative inline-block w-10 text-left",
  menuButton:
    "inline-flex z-0 w-10 justify-center rounded-md bg-card text-sm font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75",
  menuItems:
    "fixed mr-[2.5%] z-10 text-foreground right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
  div: "px-1 py-1 ",
  menuItem: "group flex w-full items-center rounded-md px-2 py-2 text-sm",
  paddingLeft: "pl-3",
  rightArrow: "pl-[21px]",
  copiedAlertBox:
    "fixed bottom-5 right-5 w-auto bg-accent border border-border rounded px-4 py-4 transition-all delay-100 duration-1000",
  urlClipboard: "text-foreground text-xs font-bold leading-6 mb-2",
  paste: "text-muted-foreground text-xs font-bold",
};

const FilterListDropDown = ({
  filterId,
  filterTitle,
}: FilterListDropDownProps) => {
  const teamId = useSelector(
    (state: RootState) => state.taskData.currentTeam._id
  );
  const [fillColor, setFillColor] = useState({
    hover: "",
    color: "",
  });
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const theme = useSelector((state: RootState) => state.userSettings.theme);
  const dispatch = useDispatch<AppDispatch>();

  const handleThemeSVG = () => {
    theme === "light"
      ? setFillColor({
          hover: "group-hover:fill-black",
          color: "fill-gray-500",
        })
      : setFillColor({ ...fillColor, hover: "group-hover:fill-white" });
  };

  const handleCopyShareLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/filter/${filterId}`;
      await navigator.clipboard.writeText(shareUrl);
      setIsLinkCopied(true);
      setTimeout(() => {
        setIsLinkCopied(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to copy the link: ", error);
    }
  };

  useEffect(() => {
    handleThemeSVG();
  }, [theme]);

  return (
    <div className={styles.main}>
      <Menu as="div" className={styles.menu}>
        <div>
          <Menu.Button className={styles.menuButton}>
            <Ellipsis
              className={`size-4 cursor-pointer ${theme === "light" ? "text-[black]" : "text-[white]"} `}
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className={styles.menuItems}>
            <div className={styles.div}>
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    className={`${
                      active ? "bg-violet-500 text-white" : "text-foreground"
                    } ${styles.menuItem}`}
                  >
                    <Pencil className="size-4" />
                    <p className={styles.paddingLeft}>Edit</p>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    className={`${
                      active ? "bg-violet-500 text-white" : "text-foreground"
                    } ${styles.menuItem}`}
                  >
                    <Copy className="size-4" />
                    <p className={styles.paddingLeft}>Duplicate</p>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    className={`${
                      active ? "bg-violet-500 text-white" : "text-foreground"
                    } ${styles.menuItem}`}
                  >
                    <CircleUser className="size-4" />
                    <p className={styles.paddingLeft}>Change View Owner</p>
                    <div className={styles.rightArrow}>
                      <ChevronRight className="size-3" />
                    </div>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    className={`${
                      active ? "bg-violet-500 text-white" : "text-foreground"
                    } ${styles.menuItem}`}
                  >
                    <BookUser className="size-4" />
                    <p className={styles.paddingLeft}>
                      Change View Visibility{" "}
                    </p>
                    <div className={styles.paddingLeft}>
                      <ChevronRight className="size-3" />
                    </div>
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className={styles.div}>
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    className={`${
                      active ? "bg-violet-500 text-white" : "text-foreground"
                    } ${styles.menuItem}`}
                  >
                    <Star className="size-4" />
                    <p className={styles.paddingLeft}>Favorite View</p>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    className={`${
                      active ? "bg-violet-500 text-white" : "text-foreground"
                    } ${styles.menuItem}`}
                    onClick={handleCopyShareLink}
                  >
                    <Link className="size-4" />
                    <p className={styles.paddingLeft}>Copy share link</p>
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className={styles.div}>
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    className={`${
                      active ? "bg-violet-500 text-white" : "text-foreground"
                    } ${styles.menuItem}`}
                    onClick={() => {
                      dispatch(deleteView(filterId, teamId));
                    }}
                  >
                    <Trash2 className="size-4" />
                    <p className={styles.paddingLeft}>Delete</p>
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <div
        className={`${styles.copiedAlertBox} ${isLinkCopied ? "opacity-100" : "opacity-0"}`}
      >
        <p className={styles.urlClipboard}>
          Share link to {filterTitle} copied to clipboard!
        </p>
        <p className={styles.paste}>Paste it wherever you like</p>
      </div>
    </div>
  );
};

export default FilterListDropDown;
