import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteView } from "@/store/filterPage/actions";
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
import type { FilterListDropDownProps } from "./FilterListDropDown.interfaces";
import type { AppDispatch, RootState } from "@/store";
import { useTheme } from "next-themes";

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
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const handleThemeSVG = () => {
    theme === "light"
      ? setFillColor({
          hover: "group-hover:fill-black",
          color: "fill-gray-500",
        })
      : setFillColor({
          ...fillColor,
          hover: "group-hover:fill-white",
        });
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
    <div className="relative w-10 text-right mr-5">
      <Menu as="div" className="relative inline-block w-10 text-left">
        <div>
          <Menu.Button className="inline-flex z-0 w-10 justify-center rounded-md bg-card text-sm font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <Ellipsis
              className={`size-4 cursor-pointer ${
                theme === "light" ? "text-[black]" : "text-[white]"
              }`}
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
          <Menu.Items className="fixed mr-[2.5%] z-10 text-foreground right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    className={`${
                      active
                        ? "bg-violet-500 text-foreground"
                        : "text-foreground"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <Pencil className="size-4" />
                    <p className="pl-3">Edit</p>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    className={`${
                      active
                        ? "bg-violet-500 text-foreground"
                        : "text-foreground"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <Copy className="size-4" />
                    <p className="pl-3">Duplicate</p>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    className={`${
                      active
                        ? "bg-violet-500 text-foreground"
                        : "text-foreground"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <CircleUser className="size-4" />
                    <p className="pl-3">Change View Owner</p>
                    <div className="pl-[21px]">
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
                      active
                        ? "bg-violet-500 text-foreground"
                        : "text-foreground"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <BookUser className="size-4" />
                    <p className="pl-3">Change View Visibility </p>
                    <div className="pl-3">
                      <ChevronRight className="size-3" />
                    </div>
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    className={`${
                      active
                        ? "bg-violet-500 text-foreground"
                        : "text-foreground"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <Star className="size-4" />
                    <p className="pl-3">Favorite View</p>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    className={`${
                      active
                        ? "bg-violet-500 text-foreground"
                        : "text-foreground"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={handleCopyShareLink}
                  >
                    <Link className="size-4" />
                    <p className="pl-3">Copy share link</p>
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    className={`${
                      active
                        ? "bg-violet-500 text-foreground"
                        : "text-foreground"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={() => {
                      dispatch(deleteView(filterId, teamId));
                    }}
                  >
                    <div>
                      <Trash2 className="size-4" />
                    </div>
                    <p className="pl-3">Delete</p>
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <div
        className={`fixed bottom-5 right-5 w-auto bg-accent border border-border rounded px-4 py-4 transition-all delay-100 duration-1000 ${
          isLinkCopied ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-foreground text-xs font-bold leading-6 mb-2">
          Share link to {filterTitle} copied to clipboard!
        </p>
        <p className="text-muted-foreground text-xs font-bold">
          Paste it wherever you like
        </p>
      </div>
    </div>
  );
};

export default FilterListDropDown;
