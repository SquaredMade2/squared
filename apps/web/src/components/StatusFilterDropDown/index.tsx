import { Fragment, useState, useRef, useEffect } from "react";
import { setCurrentFilter } from "@/store/filterPage/actions";
import { Combobox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { filterInProgress } from "@/components/Svg";
import type { clearFilterType } from "@/app/interfaces/Filter.interfaces";
import { useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import type { StatusFilterDropDownProps } from "./StatusFilterDropDown.interfaces";
import { Circle, CircleCheckBig, CircleDashed, CircleX } from "lucide-react";

const groupStatus = [
  {
    id: 0,
    name: "Backlog",
    border: false,
    svg: <CircleDashed className="size-4" />,
    group: "status",
  },
  {
    id: 1,
    name: "Todo",
    border: false,
    svg: <Circle className="size-4" />,
    group: "status",
  },
  {
    id: 2,
    name: "In Progress",
    border: false,
    svg: filterInProgress(),
    group: "status",
  },
  {
    id: 3,
    name: "Done",
    border: false,
    svg: <CircleCheckBig className="size-4 text-[#7394FF]" />,
    group: "status",
  },
  {
    id: 4,
    name: "Cancelled",
    border: false,
    svg: <CircleX className="size-4" />,
    group: "status",
  },
  {
    id: 5,
    name: "Duplicate",
    border: false,
    svg: <CircleX className="size-4" />,
    group: "status",
  },
];

const StatusFilterDropDown = ({
  showStatusFilterDropDown,
  setShowStatusFilterDropDown,
  handleFilter,
}: StatusFilterDropDownProps) => {
  const [query, setQuery] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [showFilterDropDown, setShowFilterDropDown] = useState(false);
  const filterDropDownRef = useRef<HTMLButtonElement | null>(null);
  const dispatch = useAppDispatch();

  const filteredGroup =
    query === ""
      ? groupStatus
      : groupStatus.filter((item) =>
          item.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  const clearFilter: clearFilterType = () => {
    if (filterOption) {
      setFilterOption("");
    }
  };

  useEffect(() => {
    if (showStatusFilterDropDown) {
      setShowFilterDropDown(true);
      if (filterDropDownRef.current) {
        filterDropDownRef.current.click();
      }
    } else {
      setShowFilterDropDown(false);
    }
  }, [showStatusFilterDropDown]);

  useEffect(() => {
    if (filterOption === null) {
      return;
    }
    if (typeof filterOption === "object") {
      handleFilter(filterOption); // future todo: move entirely to redux
      setShowFilterDropDown(false);
      setShowStatusFilterDropDown(false);

      dispatch(setCurrentFilter(filterOption));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterOption]);

  return (
    <>
      <div
        className={`absolute z-50 top-full left-0 w-72 ${
          showFilterDropDown ? "h-10" : "h-0 hidden"
        } transition-all duration-300 ${
          showFilterDropDown ? "opacity-100" : "opacity-0"
        }`}
      >
        <Combobox
          value={filterOption}
          onChange={setFilterOption}
          nullable={true}
        >
          <div
            className={`relative mt-1 transition-all duration-300 ${
              showFilterDropDown ? "h-full" : "h-0"
            }`}
          >
            <div
              className={`relative w-full transition-all duration-300 border border-border cursor-default overflow-hidden rounded-tr rounded-tl bg-background text-left shadow-md focus:outline-none focus-visible:outline-none sm:text-sm ${
                showFilterDropDown ? "h-full border" : "h-0"
              }`}
            >
              <Combobox.Button
                onClick={clearFilter}
                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-foreground bg-seconday focus-visible:outline-none"
                ref={filterDropDownRef}
              >
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <Combobox.Input
                  className="absolute pl-1 h-full w-full z-50 bg-card inset-y-0 right-0 flex items-center pr-2 focus-visible:outline-none"
                  displayValue={() => filterOption}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options
                className={`absolute z-50 transition-all duration-300 border-border border-l border-b border-r w-full overflow-auto rounded-br-md rounded-bl-md bg-background text-foreground py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ${
                  showFilterDropDown ? "max-h-[600px]" : "h-0"
                }`}
              >
                {filteredGroup.length === 0 && query !== "" ? (
                  <Combobox.Option
                    className={({ active }) =>
                      `relative flex items-center cursor-default select-none py-2 px-4 text-foreground ${
                        active
                          ? "bg-[#1d3275] text-foreground"
                          : "text-muted-foreground"
                      }`
                    }
                    value={query}
                  >
                    <div className="relative flex items-center cursor-default select-none py-2 px-4 text-foreground">
                      {groupStatus[0].svg}
                      <div className="pl-2">
                        <p>AI Filter &nbsp;</p>
                      </div>
                      <div>{`"${query}"`}</div>
                    </div>
                  </Combobox.Option>
                ) : (
                  <>
                    <div>
                      {filteredGroup.map((item) => (
                        <Combobox.Option
                          key={item.id}
                          className={({ selected, active }) =>
                            `relative cursor-default select-none py-2 pl-2 pr-4 ${
                              active ? "bg-[#1d3275]" : "text-muted-foreground"
                            } ${item.border ? "border-t" : ""} ${
                              selected
                                ? "font-medium bg-[#1d3275]"
                                : "font-normal"
                            }`
                          }
                          value={item}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`block truncate flex items-center ${
                                  selected
                                    ? "font-medium text-foreground bg-[#1d3275]"
                                    : "font-normal"
                                }`}
                              >
                                <div className="pr-2">{item.svg}</div>
                                {item.name}
                              </span>
                              {selected ? (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                    active
                                      ? "text-foreground bg-[#1d3275]"
                                      : "text-[#1d3275]"
                                  }`}
                                />
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      ))}{" "}
                    </div>
                  </>
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>
    </>
  );
};

export default StatusFilterDropDown;
